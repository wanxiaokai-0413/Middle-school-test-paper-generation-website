# Middle School Test Paper Generation Website

面向中学教师与学生的智能教学辅助 Web 应用，提供“自主组卷”和“AI 解题”两项核心能力，帮助教师提升备课与出卷效率，也为学生提供多模态题目讲解支持。

## 项目功能

### 1. 智能组卷系统

- 按年级、学科、题型和难度筛选题目
- 支持数学、语文、英语、物理、化学、生物、历史、地理、政治等学科
- 支持拖拽题目，自由编排试卷顺序
- 提供试卷标题、考试时长、总分等基础设置
- 实时统计题目数量、平均难度、题型分布和难度分布
- 支持 A4 试卷预览、打印及试卷数据导出

### 2. AI 解题助手

- 支持文字输入题目
- 支持上传题目图片并进行 OCR 文字识别
- 支持语音输入题目内容
- 后端安全调用 DeepSeek 大模型生成分步骤解析
- 适用于数学公式、化学方程式等常见中学题目讲解场景

## 技术栈

- 前端：React、TypeScript、Vite、Tailwind CSS
- UI 组件：Radix UI、Lucide React
- 拖拽交互：dnd-kit
- 后端：Node.js、Express
- AI 能力：DeepSeek API
- 图片文字识别：Tesseract OCR
- 部署平台：Vercel

## 本地运行

### 1. 进入项目目录

```bash
cd app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 并重命名为 `.env`，然后填写自己的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
OCR_LANGS=chi_sim+eng
```

注意：`.env` 中的真实密钥仅供本地或云平台环境变量使用，不应上传至 GitHub。

### 4. 启动后端服务

```bash
npm run dev:api
```

### 5. 启动前端服务

```bash
npm run dev
```

启动后，在浏览器中打开终端显示的本地访问地址即可使用。

## Vercel 部署

在 Vercel 导入本仓库时，建议使用以下配置：

```text
Root Directory: app
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

在 Vercel 的环境变量中添加：

```env
DEEPSEEK_API_KEY=你的真实DeepSeek密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
OCR_LANGS=chi_sim+eng
TESSERACT_CACHE_PATH=/tmp/tesseract-cache
```

## 项目结构

```text
app/
├── src/                    # React 前端页面与组件
│   ├── sections/            # 组卷与 AI 解题业务模块
│   ├── components/          # 通用组件
│   ├── data/                # 题库模拟数据
│   └── services/            # 前端接口调用
├── server/                  # Express 后端服务
├── api/                     # Vercel Serverless 接口
├── public/                  # 静态资源
├── .env.example             # 环境变量示例
└── package.json             # 项目依赖与运行命令
```

## 使用说明

1. 在首页选择“组卷系统”或“AI 解题”。
2. 组卷系统中可按条件筛选题目，并拖拽题目完成试卷编排。
3. AI 解题中可输入、拍照上传或语音输入题目。
4. 系统识别题目后，通过 AI 输出题目解析与解题思路。

## 注意事项

- OCR 对印刷体中文、英文、数字和简单符号有较好的识别效果。
- 复杂公式、几何图形、分式、根号及手写内容可能需要人工校正。
- 请勿上传真实 API Key、个人隐私数据或敏感教学资料。
- 本项目用于学习、教学辅助与产品实践展示。

