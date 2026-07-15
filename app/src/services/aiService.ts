import type { AnalysisResult, VideoResult, VideoConfig } from '@/types/app';

// 模拟AI分析题目
export async function analyzeQuestion(
  question: string,
  _imageData?: string | null
): Promise<AnalysisResult> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 根据题目内容智能分析（模拟）
  const questionLower = question.toLowerCase();
  
  // 数学题目识别
  if (questionLower.includes('方程') || questionLower.includes('x²') || questionLower.includes('函数')) {
    return {
      question: question,
      subject: '数学',
      knowledgePoints: ['一元二次方程', '求根公式', '判别式'],
      answer: 'x₁ = 2, x₂ = 3',
      detailedSolution: `【解题步骤】

第一步：识别方程类型
这是一个标准的一元二次方程：ax² + bx + c = 0

第二步：确定系数
a = 1, b = -5, c = 6

第三步：计算判别式
Δ = b² - 4ac = (-5)² - 4×1×6 = 25 - 24 = 1 > 0

第四步：应用求根公式
x = (-b ± √Δ) / 2a = (5 ± 1) / 2

第五步：得出答案
x₁ = (5 + 1) / 2 = 3
x₂ = (5 - 1) / 2 = 2`,
      tips: [
        '记住求根公式：x = (-b ± √Δ) / 2a',
        '先计算判别式判断根的情况',
        '注意符号的处理，特别是负号'
      ],
      difficulty: 'easy',
      estimatedTime: 5,
    };
  }

  // 物理题目识别
  if (questionLower.includes('力') || questionLower.includes('速度') || questionLower.includes('加速度')) {
    return {
      question: question,
      subject: '物理',
      knowledgePoints: ['牛顿第二定律', '受力分析', '摩擦力'],
      answer: 'f = 5N',
      detailedSolution: `【解题步骤】

第一步：受力分析
物体受到三个力：
- 水平拉力 F = 20N
- 摩擦力 f（待求）
- 重力与支持力（竖直方向平衡）

第二步：应用牛顿第二定律
F合 = ma
F - f = ma

第三步：代入数据
20 - f = 5 × 3
20 - f = 15

第四步：求解
f = 20 - 15 = 5N`,
      tips: [
        '画受力分析图是关键',
        '注意力的方向',
        '牛顿第二定律 F=ma 是核心'
      ],
      difficulty: 'medium',
      estimatedTime: 8,
    };
  }

  // 语文题目识别
  if (questionLower.includes('诗') || questionLower.includes('文言文') || questionLower.includes('阅读')) {
    return {
      question: question,
      subject: '语文',
      knowledgePoints: ['古诗词鉴赏', '意象分析', '情感理解'],
      answer: '疑是地上霜',
      detailedSolution: `【解析】

这句诗出自李白的《静夜思》。

【诗句含义】
明亮的月光洒在床前，让人怀疑是地上结了一层白霜。

【意象分析】
- "明月"：思乡的象征
- "霜"：清冷、孤寂的氛围

【情感表达】
诗人通过描写秋夜月光，抒发了浓浓的思乡之情。

【写作手法】
运用比喻手法，将月光比作霜，形象生动。`,
      tips: [
        '注意诗句的出处和作者',
        '分析意象要联系情感',
        '记住常见的诗歌意象'
      ],
      difficulty: 'easy',
      estimatedTime: 3,
    };
  }

  // 英语题目识别
  if (questionLower.includes('english') || questionLower.includes('grammar') || question.includes('时态')) {
    return {
      question: question,
      subject: '英语',
      knowledgePoints: ['过去完成时', '时态辨析', '时间状语'],
      answer: 'C. had waited',
      detailedSolution: `【解析】

本题考查过去完成时的用法。

【关键信息】
"By the time I arrived" 表示"当我到达时"
"for two hours" 表示持续了一段时间

【时态分析】
- arrived 是过去时
- "等待"发生在"到达"之前
- 过去的过去，用过去完成时

【正确选项】
C. had waited

【句意】
当我到达时，他们已经等了两个小时了。`,
      tips: [
        'By the time 常搭配完成时',
        '注意动作发生的先后顺序',
        '过去完成时表示"过去的过去"'
      ],
      difficulty: 'medium',
      estimatedTime: 4,
    };
  }

  // 默认返回
  return {
    question: question,
    subject: '综合',
    knowledgePoints: ['知识点识别', '基础概念'],
    answer: '请参考详细解析',
    detailedSolution: `【解题思路】

第一步：理解题意
仔细阅读题目，明确已知条件和所求。

第二步：分析知识点
确定本题涉及的核心概念和公式。

第三步：建立关系
找出已知与未知之间的联系。

第四步：逐步求解
按照逻辑顺序进行计算或推导。

第五步：验证答案
检查结果的合理性。`,
    tips: [
      '仔细审题，不要遗漏条件',
      '画图辅助理解',
      '多做类似题目巩固'
    ],
    difficulty: 'medium',
    estimatedTime: 10,
  };
}

// 模拟生成讲解视频
export async function generateExplanationVideo(
  analysisResult: AnalysisResult,
  config: VideoConfig
): Promise<VideoResult> {
  // 模拟视频生成延迟
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 生成模拟视频结果
  const videoId = `video-${Date.now()}`;
  
  return {
    id: videoId,
    url: `/api/videos/${videoId}.mp4`, // 模拟URL
    thumbnail: `https://api.dicebear.com/7.x/avataaars/svg?seed=${config.avatarId}&backgroundColor=b6e3f4`,
    duration: analysisResult.estimatedTime * 60, // 秒
    avatarId: config.avatarId,
    createdAt: new Date(),
  };
}

// 模拟OCR识别图片中的题目
export async function recognizeQuestionFromImage(_imageData: string): Promise<string> {
  // 模拟OCR处理延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 返回模拟识别的题目
  return '解方程：x² - 5x + 6 = 0';
}

// 模拟语音转文字
export async function transcribeVoice(_audioData: Blob): Promise<string> {
  // 模拟语音识别延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  return '求函数 f(x) = 2x² - 4x + 1 的顶点坐标';
}
