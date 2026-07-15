import { useState } from 'react';
import type { Avatar, AvatarConfig } from '@/types/app';
import { 
  presetAvatars, 
  hairStyles, 
  eyeStyles, 
  outfits, 
  animationStyles,
  voiceOptions,
  colorOptions,
  skinColors
} from '@/data/avatars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  RotateCcw, 
  Trash2, 
  Plus,
  Check,
  Volume2
} from 'lucide-react';
import { toast } from 'sonner';

export function AvatarEditorApp() {
  const [avatars, setAvatars] = useState<Avatar[]>(presetAvatars);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(presetAvatars[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState<AvatarConfig>(presetAvatars[0].config);
  const [editedName, setEditedName] = useState(presetAvatars[0].name);

  // 选择形象
  const handleSelectAvatar = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setEditedConfig(avatar.config);
    setEditedName(avatar.name);
    setIsEditing(false);
  };

  // 保存修改
  const handleSave = () => {
    const updatedAvatar: Avatar = {
      ...selectedAvatar,
      name: editedName,
      config: editedConfig,
      thumbnail: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar.id}&backgroundColor=b6e3f4&hairColor=${editedConfig.hairColor.replace('#', '')}&skinColor=${editedConfig.skinColor.replace('#', '')}`,
    };

    setAvatars(prev => prev.map(a => a.id === selectedAvatar.id ? updatedAvatar : a));
    setSelectedAvatar(updatedAvatar);
    setIsEditing(false);
    toast.success('形象保存成功！');
  };

  // 重置修改
  const handleReset = () => {
    setEditedConfig(selectedAvatar.config);
    setEditedName(selectedAvatar.name);
    toast.info('已重置为默认设置');
  };

  // 创建新形象
  const handleCreateNew = () => {
    const newAvatar: Avatar = {
      id: `custom-${Date.now()}`,
      name: '新形象',
      thumbnail: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}&backgroundColor=b6e3f4`,
      isDefault: false,
      config: { ...presetAvatars[0].config },
    };
    setAvatars(prev => [...prev, newAvatar]);
    setSelectedAvatar(newAvatar);
    setEditedConfig(newAvatar.config);
    setEditedName(newAvatar.name);
    setIsEditing(true);
    toast.success('新形象创建成功！');
  };

  // 删除形象
  const handleDelete = () => {
    if (selectedAvatar.isDefault) {
      toast.error('默认形象不能删除');
      return;
    }
    if (confirm('确定要删除这个形象吗？')) {
      setAvatars(prev => prev.filter(a => a.id !== selectedAvatar.id));
      setSelectedAvatar(avatars[0]);
      setEditedConfig(avatars[0].config);
      setEditedName(avatars[0].name);
      toast.info('形象已删除');
    }
  };

  // 预览语音
  const handlePreviewVoice = () => {
    const utterance = new SpeechSynthesisUtterance('你好，我是你的AI老师，让我来为你讲解这道题目。');
    utterance.rate = editedConfig.speechRate;
    speechSynthesis.speak(utterance);
  };

  // 更新配置
  const updateConfig = (key: keyof AvatarConfig, value: any) => {
    setEditedConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full flex">
      {/* 左侧形象列表 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">我的形象</h3>
          <p className="text-xs text-gray-500 mt-1">选择或创建虚拟老师形象</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleSelectAvatar(avatar)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all
                  ${selectedAvatar.id === avatar.id 
                    ? 'bg-pink-50 border-2 border-pink-500' 
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }
                `}
              >
                <img
                  src={avatar.thumbnail}
                  alt={avatar.name}
                  className="w-12 h-12 rounded-full bg-white"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-800 text-sm">{avatar.name}</p>
                  {avatar.isDefault && (
                    <span className="text-xs text-pink-500">默认</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-gray-100">
          <Button
            onClick={handleCreateNew}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            创建新形象
          </Button>
        </div>
      </div>

      {/* 中间预览区 */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="relative">
          {/* 预览卡片 */}
          <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* 背景 */}
            <div className="h-32 bg-gradient-to-br from-pink-400 to-purple-500" />
            
            {/* 形象 */}
            <div className="relative -mt-20 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar.id}&backgroundColor=b6e3f4&hairColor=${editedConfig.hairColor.replace('#', '')}&skinColor=${editedConfig.skinColor.replace('#', '')}&clothing=${editedConfig.outfit}&clothingColor=${editedConfig.outfitColor.replace('#', '')}&eyes=${editedConfig.eyeStyle}&top=${editedConfig.hairStyle}${editedConfig.glasses ? '&glasses=round' : ''}`}
                  alt={editedName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-gray-800">{editedName}</h2>
              <p className="text-sm text-gray-500">
                {animationStyles.find(s => s.value === editedConfig.animationStyle)?.label}风格
              </p>
              
              {/* 语音预览 */}
              <button
                onClick={handlePreviewVoice}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                试听语音
              </button>
            </div>
          </div>

          {/* 动画演示 */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">动画演示</h4>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-24 h-24">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar.id}&backgroundColor=b6e3f4&hairColor=${editedConfig.hairColor.replace('#', '')}&skinColor=${editedConfig.skinColor.replace('#', '')}&clothing=${editedConfig.outfit}&clothingColor=${editedConfig.outfitColor.replace('#', '')}&eyes=${editedConfig.eyeStyle}&top=${editedConfig.hairStyle}${editedConfig.glasses ? '&glasses=round' : ''}`}
                  alt="演示"
                  className={`
                    w-full h-full rounded-full
                    ${editedConfig.animationStyle === 'lively' ? 'animate-bounce' : ''}
                    ${editedConfig.animationStyle === 'calm' ? 'animate-pulse' : ''}
                  `}
                />
                {editedConfig.animationStyle === 'professional' && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {animationStyles.find(s => s.value === editedConfig.animationStyle)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧编辑区 */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">形象编辑</h3>
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                编辑
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSave} className="text-green-600">
                  <Save className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 名称 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">形象名称</label>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={!isEditing}
              placeholder="输入形象名称"
            />
          </div>

          {/* 肤色 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">肤色</label>
            <div className="flex flex-wrap gap-2">
              {skinColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => isEditing && updateConfig('skinColor', color.value)}
                  disabled={!isEditing}
                  className={`
                    w-8 h-8 rounded-full border-2
                    ${editedConfig.skinColor === color.value ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'}
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                    transition-all
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* 发型 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">发型</label>
            <div className="grid grid-cols-3 gap-2">
              {hairStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => isEditing && updateConfig('hairStyle', style.value)}
                  disabled={!isEditing}
                  className={`
                    p-2 rounded-lg border text-sm text-center
                    ${editedConfig.hairStyle === style.value 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="text-lg">{style.icon}</span>
                  <span className="block text-xs mt-1">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 发色 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">发色</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => isEditing && updateConfig('hairColor', color.value)}
                  disabled={!isEditing}
                  className={`
                    w-8 h-8 rounded-full border-2
                    ${editedConfig.hairColor === color.value ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'}
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                    transition-all
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* 眼睛 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">眼睛</label>
            <div className="grid grid-cols-2 gap-2">
              {eyeStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => isEditing && updateConfig('eyeStyle', style.value)}
                  disabled={!isEditing}
                  className={`
                    p-2 rounded-lg border text-sm flex items-center gap-2
                    ${editedConfig.eyeStyle === style.value 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 服装 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">服装</label>
            <div className="grid grid-cols-3 gap-2">
              {outfits.map((outfit) => (
                <button
                  key={outfit.value}
                  onClick={() => isEditing && updateConfig('outfit', outfit.value)}
                  disabled={!isEditing}
                  className={`
                    p-2 rounded-lg border text-sm text-center
                    ${editedConfig.outfit === outfit.value 
                      ? 'border-pink-500 bg-pink-50 text-pink-700' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="text-lg">{outfit.icon}</span>
                  <span className="block text-xs mt-1">{outfit.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 服装颜色 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">服装颜色</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => isEditing && updateConfig('outfitColor', color.value)}
                  disabled={!isEditing}
                  className={`
                    w-8 h-8 rounded-full border-2
                    ${editedConfig.outfitColor === color.value ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'}
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                    transition-all
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* 配饰 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">配饰</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editedConfig.glasses}
                  onChange={(e) => isEditing && updateConfig('glasses', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                />
                <span className={`text-sm ${!isEditing ? 'text-gray-400' : 'text-gray-700'}`}>眼镜</span>
              </label>
            </div>
          </div>

          {/* 动画风格 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">动画风格</label>
            <div className="space-y-2">
              {animationStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => isEditing && updateConfig('animationStyle', style.value)}
                  disabled={!isEditing}
                  className={`
                    w-full p-3 rounded-lg border text-left
                    ${editedConfig.animationStyle === style.value 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <p className={`font-medium ${editedConfig.animationStyle === style.value ? 'text-pink-700' : 'text-gray-700'}`}>
                    {style.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 语音 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">语音</label>
            <div className="space-y-2">
              {voiceOptions.map((voice) => (
                <button
                  key={voice.value}
                  onClick={() => isEditing && updateConfig('voice', voice.value)}
                  disabled={!isEditing}
                  className={`
                    w-full p-3 rounded-lg border flex items-center justify-between
                    ${editedConfig.voice === voice.value 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                    ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="text-left">
                    <p className={`font-medium ${editedConfig.voice === voice.value ? 'text-pink-700' : 'text-gray-700'}`}>
                      {voice.label}
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        {voice.gender === 'male' ? '男' : '女'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{voice.description}</p>
                  </div>
                  {editedConfig.voice === voice.value && (
                    <Check className="w-4 h-4 text-pink-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 语速 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              语速: {editedConfig.speechRate.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={editedConfig.speechRate}
              onChange={(e) => isEditing && updateConfig('speechRate', parseFloat(e.target.value))}
              disabled={!isEditing}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>慢</span>
              <span>正常</span>
              <span>快</span>
            </div>
          </div>
        </div>

        {/* 删除按钮 */}
        {!selectedAvatar.isDefault && (
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              删除形象
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
