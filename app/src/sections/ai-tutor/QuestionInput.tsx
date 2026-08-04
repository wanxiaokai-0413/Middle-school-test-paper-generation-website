import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, 
  Mic, 
  Keyboard, 
  Upload, 
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { recognizeQuestionFromImage } from '@/services/aiService';
import { toast } from 'sonner';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

type SpeechResultList = {
  length: number;
  [index: number]: {
    isFinal: boolean;
    [index: number]: {
      transcript: string;
    };
  };
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { resultIndex: number; results: SpeechResultList }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  }
}

export function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [inputMethod, setInputMethod] = useState<'text' | 'image' | 'voice'>('text');
  const [question, setQuestion] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setImagePreview(imageData);
      // 自动识别图片中的题目
      recognizeFromImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  // OCR识别
  const recognizeFromImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const recognizedText = await recognizeQuestionFromImage(imageData);
      setQuestion(recognizedText);
      toast.success('图片识别成功，请检查题干后提交');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '识别失败，请手动输入');
    } finally {
      setIsProcessing(false);
    }
  };

  // 语音录制
  const startVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('当前浏览器不支持语音识别，请使用 Chrome 或手动输入');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript.trim()) {
        setQuestion((prev) => `${prev}${prev.trim() ? '\n' : ''}${transcript.trim()}`);
        toast.success('语音识别成功，请检查题干后提交');
      }
    };

    recognition.onerror = () => {
      toast.error('语音识别失败，请重试或手动输入');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopVoiceRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // 提交
  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error('请输入题目');
      return;
    }
    onSubmit(question);
  };

  // 清空
  const handleClear = () => {
    setQuestion('');
    setImagePreview(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 输入方式切换 */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setInputMethod('text')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
            transition-colors
            ${inputMethod === 'text' 
              ? 'text-[#7c3aed] bg-purple-50 border-b-2 border-[#7c3aed]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <Keyboard className="w-4 h-4" />
          文字输入
        </button>
        <button
          onClick={() => setInputMethod('image')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
            transition-colors
            ${inputMethod === 'image' 
              ? 'text-[#7c3aed] bg-purple-50 border-b-2 border-[#7c3aed]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <Camera className="w-4 h-4" />
          拍照识题
        </button>
        <button
          onClick={() => setInputMethod('voice')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
            transition-colors
            ${inputMethod === 'voice' 
              ? 'text-[#7c3aed] bg-purple-50 border-b-2 border-[#7c3aed]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <Mic className="w-4 h-4" />
          语音输入
        </button>
      </div>

      {/* 输入区域 */}
      <div className="p-6">
        {inputMethod === 'text' && (
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="请输入题目内容，支持数学公式、化学方程式等..."
            className="min-h-[160px] resize-none text-base"
          />
        )}

        {inputMethod === 'image' && (
          <div className="space-y-4">
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[160px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#7c3aed] hover:bg-purple-50/50 transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-gray-500">点击上传图片或拖拽到此处</p>
                <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="题目图片"
                  className="w-full max-h-[200px] object-contain rounded-xl border border-gray-200"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="识别结果将显示在这里，您可以手动修改..."
              className="min-h-[80px] resize-none"
            />
          </div>
        )}

        {inputMethod === 'voice' && (
          <div className="space-y-4">
            <div className="min-h-[160px] flex flex-col items-center justify-center">
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isRecording 
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30' 
                    : 'bg-[#7c3aed] hover:bg-[#6d28d9] shadow-lg shadow-purple-500/30'
                  }
                `}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className="mt-4 text-gray-500">
                {isRecording ? '正在录音，点击停止' : '点击开始录音'}
              </p>
              {isRecording && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-red-500">录音中...</span>
                </div>
              )}
            </div>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="识别结果将显示在这里，您可以手动修改..."
              className="min-h-[80px] resize-none"
            />
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading || isProcessing || (!question && !imagePreview)}
          >
            <X className="w-4 h-4 mr-1" />
            清空
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isProcessing || !question.trim()}
            className="bg-[#7c3aed] hover:bg-[#6d28d9]"
          >
            {isLoading || isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                {isProcessing ? '识别中...' : '分析中...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                AI解题
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
