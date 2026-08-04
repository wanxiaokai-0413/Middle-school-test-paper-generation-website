# 组卷精灵

中学智能教学辅助 Web 应用，包含两个入口：

- 组卷系统：题库筛选、拖拽组卷、A4 预览、打印和导出。
- AI 解题：文字输入、拍照识题、语音转写，并通过后端安全调用 DeepSeek 解题。

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 配置后端环境变量

复制 `.env.example` 为 `.env`，填入 `DEEPSEEK_API_KEY`。

3. 启动后端服务

```bash
npm run dev:api
```

4. 启动前端

```bash
npm run dev
```

前端会通过 Vite 代理把 `/api` 请求转发到 `http://localhost:3001`。

## GitHub 提交安全要求

不要提交 `.env`、`node_modules`、`dist` 或本地 OCR 缓存目录。真实 DeepSeek API Key 只能放在本地 `.env` 或 Vercel 环境变量中。

可以提交 `.env.example`，它只保留变量名和示例值，方便部署时参考。

## Vercel 部署

在 Vercel 导入 GitHub 仓库时，建议这样配置：

- Root Directory: `app`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

在 Vercel 项目的 `Settings -> Environment Variables` 中添加：

```bash
DEEPSEEK_API_KEY=你的真实 DeepSeek Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
OCR_LANGS=chi_sim+eng
TESSERACT_CACHE_PATH=/tmp/tesseract-cache
```

不要创建 `VITE_DEEPSEEK_API_KEY`。`VITE_` 开头的变量会进入前端包，不适合保存密钥。

## 拍照识题

轻量版拍照识题使用 Tesseract OCR，默认语言为 `chi_sim+eng`：

- `chi_sim` 用于简体中文印刷文字。
- `eng` 用于英文、数字和简单数学符号。

复杂公式、分式、根号、几何图形和手写题的识别效果会不稳定。前端会把 OCR 结果放在文本框中，用户可以先校正题干，再提交给 DeepSeek 解题。

如果已经准备好 `chi_sim.traineddata` 和 `eng.traineddata`，可以在环境变量中设置：

```bash
TESSDATA_PATH=./tessdata
OCR_LANGS=chi_sim+eng
```

## 生产运行

构建前端：

```bash
npm run build
```

本地生产模式启动：

```bash
npm start
```

本地后端会读取 `dist` 目录并提供静态页面，同时继续处理 `/api` 请求。
