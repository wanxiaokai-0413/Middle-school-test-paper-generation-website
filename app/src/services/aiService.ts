import type { AnalysisResult } from '@/types/app';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface ApiErrorBody {
  error?: string;
  detail?: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorBody: ApiErrorBody = {};
    try {
      errorBody = await response.json();
    } catch {
      // Keep the generic error below when the server response is not JSON.
    }
    throw new Error(errorBody.error || errorBody.detail || '请求失败');
  }

  return response.json();
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [metadata, base64Data] = dataUrl.split(',');
  const mimeMatch = metadata.match(/data:(.*);base64/);
  const mime = mimeMatch?.[1] ?? 'image/png';
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
}

export async function analyzeQuestion(question: string): Promise<AnalysisResult> {
  const result = await postJson<AnalysisResult>('/api/solve/text', { question });
  return result;
}

export async function recognizeQuestionFromImage(imageData: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', dataUrlToBlob(imageData), 'question-image.png');

  const response = await fetch(`${API_BASE_URL}/api/ocr`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorBody: ApiErrorBody = {};
    try {
      errorBody = await response.json();
    } catch {
      // Keep the generic error below when the server response is not JSON.
    }
    throw new Error(errorBody.error || errorBody.detail || '图片识别失败');
  }

  const data = await response.json() as { text?: string };
  return data.text?.trim() ?? '';
}
