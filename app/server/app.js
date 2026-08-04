import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWorker } from 'tesseract.js';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.OCR_MAX_FILE_SIZE || 8 * 1024 * 1024),
  },
});

const deepSeekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const deepSeekModel = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const ocrLanguages = process.env.OCR_LANGS || 'chi_sim+eng';

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
}));
app.use(express.json({ limit: '1mb' }));

function extractJson(content) {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error('DeepSeek 返回内容不是有效 JSON');
  }
}

function normalizeAnalysis(question, raw) {
  return {
    question: typeof raw.question === 'string' && raw.question.trim() ? raw.question : question,
    subject: typeof raw.subject === 'string' && raw.subject.trim() ? raw.subject : '综合',
    knowledgePoints: Array.isArray(raw.knowledgePoints)
      ? raw.knowledgePoints.map(String).filter(Boolean).slice(0, 8)
      : ['知识点分析'],
    answer: typeof raw.answer === 'string' && raw.answer.trim() ? raw.answer : '请参考详细解析',
    detailedSolution: typeof raw.detailedSolution === 'string' && raw.detailedSolution.trim()
      ? raw.detailedSolution
      : '暂未生成详细解析，请补充题目信息后重试。',
    tips: Array.isArray(raw.tips)
      ? raw.tips.map(String).filter(Boolean).slice(0, 6)
      : ['检查 OCR 或语音识别结果是否完整。'],
    difficulty: ['easy', 'medium', 'hard'].includes(raw.difficulty) ? raw.difficulty : 'medium',
    estimatedTime: Number.isFinite(Number(raw.estimatedTime))
      ? Math.max(1, Math.min(60, Number(raw.estimatedTime)))
      : 8,
  };
}

async function solveQuestion(question) {
  if (!process.env.DEEPSEEK_API_KEY) {
    const error = new Error('后端缺少 DEEPSEEK_API_KEY，请先在 .env 中配置 DeepSeek 密钥');
    error.status = 500;
    throw error;
  }

  let response;

  try {
    response = await fetch(`${deepSeekBaseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: deepSeekModel,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: [
              '你是一名严谨的中学全科解题老师。',
              '请只返回 JSON，不要输出 Markdown。',
              'JSON 字段必须包含 question, subject, knowledgePoints, answer, detailedSolution, tips, difficulty, estimatedTime。',
              'difficulty 只能是 easy、medium、hard。estimatedTime 是学生理解本题预计分钟数。',
              '详细解析要分步骤，公式和单位要清晰，发现题干缺失时要说明需要补充的信息。',
            ].join('\n'),
          },
          {
            role: 'user',
            content: `请解析这道题：\n${question}`,
          },
        ],
      }),
    });
  } catch (cause) {
    const error = new Error('无法连接 DeepSeek，请检查网络或代理设置后重试');
    error.status = 502;
    error.detail = cause?.cause?.message || cause?.message;
    throw error;
  }

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`DeepSeek 请求失败：${response.status}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('DeepSeek 未返回有效解析内容');
  }

  return normalizeAnalysis(question, extractJson(content));
}

async function recognizeImage(buffer) {
  const workerOptions = {
    cachePath: process.env.TESSERACT_CACHE_PATH || (
      process.env.VERCEL ? '/tmp/tesseract-cache' : path.join(appRoot, '.tesseract-cache')
    ),
  };

  if (process.env.TESSDATA_PATH) {
    workerOptions.langPath = process.env.TESSDATA_PATH;
  }

  const worker = await createWorker(ocrLanguages, 1, workerOptions);

  try {
    const result = await worker.recognize(buffer);
    return result.data.text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } finally {
    await worker.terminate();
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    deepseekConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    model: deepSeekModel,
    ocrLanguages,
  });
});

app.post('/api/solve/text', async (req, res, next) => {
  try {
    const question = String(req.body?.question || '').trim();

    if (!question) {
      return res.status(400).json({ error: '题目不能为空' });
    }

    const result = await solveQuestion(question);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

app.post('/api/ocr', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: '请上传题目图片' });
    }

    const text = await recognizeImage(req.file.buffer);

    if (!text) {
      return res.status(422).json({ error: '未识别到文字，请换一张更清晰的图片或手动输入' });
    }

    return res.json({ text, languages: ocrLanguages });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/solve/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: '请上传题目图片' });
    }

    const text = await recognizeImage(req.file.buffer);

    if (!text) {
      return res.status(422).json({ error: '未识别到文字，请换一张更清晰的图片或手动输入' });
    }

    const result = await solveQuestion(text);
    return res.json({ text, result });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  const payload = {
    error: error.message || '服务器处理失败',
  };

  if (process.env.NODE_ENV !== 'production' && error.detail) {
    payload.detail = error.detail;
  }

  res.status(status).json(payload);
});

export default app;
