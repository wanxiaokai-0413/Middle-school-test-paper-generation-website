import { useState, useEffect } from 'react';
import type { VideoResult, AnalysisResult } from '@/types/app';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Download,
  Share2,
  RotateCcw,
  ChevronLeft
} from 'lucide-react';
import { presetAvatars } from '@/data/avatars';

interface VideoPlayerProps {
  video: VideoResult;
  analysisResult: AnalysisResult;
  onBack: () => void;
  onRegenerate: () => void;
}

export function VideoPlayer({ video, analysisResult, onBack, onRegenerate }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(video.duration);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeoutRef, setControlsTimeoutRef] = useState<ReturnType<typeof setTimeout> | null>(null);

  const avatar = presetAvatars.find(a => a.id === video.avatarId) || presetAvatars[0];

  // 模拟视频播放（实际项目中使用真实视频）
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef) {
      clearTimeout(controlsTimeoutRef);
    }
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeoutRef(timeout);
  };

  // 模拟视频下载
  const handleDownload = () => {
    // 实际项目中这里会下载真实视频
    alert('视频下载功能（演示）');
  };

  // 模拟分享
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI解题讲解视频',
        text: `来看看这道${analysisResult.subject}题的讲解！`,
        url: window.location.href,
      });
    } else {
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
        <h3 className="font-semibold text-gray-800">AI讲解视频</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 视频播放区域 */}
      <div 
        className="relative bg-black aspect-video"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* 模拟视频画面 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800" />
          
          {/* 虚拟老师 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`
              w-32 h-32 rounded-full overflow-hidden border-4 border-white/30
              ${isPlaying ? 'animate-bounce' : ''}
            `}>
              <img
                src={avatar.thumbnail}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-white text-center">
              <p className="font-medium">{avatar.name}</p>
              <p className="text-sm text-white/70">正在讲解...</p>
            </div>
          </div>

          {/* 当前讲解内容 */}
          <div className="absolute bottom-20 left-0 right-0 px-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
              <p className="text-sm text-white/70 mb-1">当前讲解：</p>
              <p className="text-lg">
                {analysisResult.detailedSolution.split('\n')[Math.floor(currentTime / 5)] || '讲解结束'}
              </p>
            </div>
          </div>
        </div>

        {/* 播放控制遮罩 */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            {/* 中央播放按钮 */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Play className="w-10 h-10 text-white ml-1" />
              </button>
            )}

            {/* 底部控制栏 */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* 进度条 */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-gray-900" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                    )}
                  </button>
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* 音量控制 */}
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-200"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button className="text-white hover:text-gray-200">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 视频信息 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">{analysisResult.question.slice(0, 30)}...</h4>
            <p className="text-sm text-gray-500 mt-1">
              讲解老师：{avatar.name} · 时长：{formatTime(duration)}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RotateCcw className="w-4 h-4 mr-1" />
            重新生成
          </Button>
        </div>
      </div>
    </div>
  );
}
