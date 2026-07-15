import type { Avatar, AvatarConfig } from '@/types/app';

// 默认虚拟形象配置
export const defaultAvatarConfig: AvatarConfig = {
  skinColor: '#F5D0C5',
  hairStyle: 'short',
  hairColor: '#2C2C2C',
  eyeStyle: 'round',
  eyeColor: '#4A4A4A',
  outfit: 'suit',
  outfitColor: '#00796b',
  glasses: false,
  hat: false,
  animationStyle: 'professional',
  voice: 'xiaoyan',
  speechRate: 1.0,
};

// 预设虚拟形象
export const presetAvatars: Avatar[] = [
  {
    id: 'teacher-male-1',
    name: '李老师',
    thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1&clothing=blazerAndShirt&clothingColor=teal&skinColor=light',
    isDefault: true,
    config: {
      ...defaultAvatarConfig,
      outfit: 'suit',
      outfitColor: '#00796b',
      animationStyle: 'professional',
      voice: 'xiaoyan',
    },
  },
  {
    id: 'teacher-female-1',
    name: '王老师',
    thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2&clothing=blazerAndShirt&clothingColor=blue&skinColor=light&style=female',
    isDefault: false,
    config: {
      ...defaultAvatarConfig,
      hairStyle: 'long',
      hairColor: '#3E2723',
      outfit: 'blazer',
      outfitColor: '#1976d2',
      animationStyle: 'calm',
      voice: 'xiaomei',
    },
  },
  {
    id: 'teacher-cute-1',
    name: '小助手',
    thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cute1&clothing=graphicShirt&clothingColor=yellow&skinColor=light&eyes=happy',
    isDefault: false,
    config: {
      ...defaultAvatarConfig,
      hairStyle: 'short',
      hairColor: '#FF6F00',
      outfit: 'hoodie',
      outfitColor: '#ffc107',
      eyeStyle: 'happy',
      animationStyle: 'cute',
      voice: 'xiaoxue',
    },
  },
  {
    id: 'teacher-prof-1',
    name: '张教授',
    thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prof1&clothing=collarAndSweater&clothingColor=gray&skinColor=light&facialHair=beardMedium&glasses=round',
    isDefault: false,
    config: {
      ...defaultAvatarConfig,
      hairStyle: 'short',
      hairColor: '#757575',
      outfit: 'sweater',
      outfitColor: '#616161',
      glasses: true,
      animationStyle: 'professional',
      voice: 'xiaoyan',
      speechRate: 0.9,
    },
  },
];

// 发型选项
export const hairStyles = [
  { value: 'short', label: '短发', icon: '✂️' },
  { value: 'long', label: '长发', icon: '💇' },
  { value: 'curly', label: '卷发', icon: '🌀' },
  { value: 'bald', label: '光头', icon: '👨‍🦲' },
  { value: 'ponytail', label: '马尾', icon: '🎀' },
];

// 眼睛样式
export const eyeStyles = [
  { value: 'round', label: '圆眼', icon: '👁️' },
  { value: 'almond', label: '杏眼', icon: '👀' },
  { value: 'happy', label: '笑眼', icon: '😊' },
  { value: 'serious', label: '严肃', icon: '😐' },
];

// 服装选项
export const outfits = [
  { value: 'suit', label: '西装', icon: '👔' },
  { value: 'blazer', label: '正装', icon: '🧥' },
  { value: 'hoodie', label: '卫衣', icon: '👕' },
  { value: 'sweater', label: '毛衣', icon: '🧶' },
  { value: 'shirt', label: '衬衫', icon: '👔' },
];

// 动画风格
export const animationStyles = [
  { value: 'lively', label: '活泼', description: '动作丰富，表情生动' },
  { value: 'calm', label: '沉稳', description: '温和舒缓，适合讲解' },
  { value: 'professional', label: '专业', description: '严谨规范，学术风格' },
  { value: 'cute', label: '可爱', description: '亲切友好，适合小学生' },
];

// 语音选项
export const voiceOptions = [
  { value: 'xiaoyan', label: '小燕', description: '标准女声', gender: 'female' },
  { value: 'xiaomei', label: '小美', description: '温柔女声', gender: 'female' },
  { value: 'xiaoxue', label: '小雪', description: '活泼女声', gender: 'female' },
  { value: 'xiaoming', label: '小明', description: '标准男声', gender: 'male' },
  { value: 'xiaogang', label: '小刚', description: '磁性男声', gender: 'male' },
];

// 颜色选项
export const colorOptions = [
  { value: '#2C2C2C', label: '黑色', class: 'bg-gray-800' },
  { value: '#3E2723', label: '深棕', class: 'bg-amber-900' },
  { value: '#FF6F00', label: '橙色', class: 'bg-orange-600' },
  { value: '#C62828', label: '红色', class: 'bg-red-700' },
  { value: '#1565C0', label: '蓝色', class: 'bg-blue-700' },
  { value: '#2E7D32', label: '绿色', class: 'bg-green-700' },
  { value: '#6A1B9A', label: '紫色', class: 'bg-purple-700' },
  { value: '#757575', label: '灰色', class: 'bg-gray-500' },
];

// 肤色选项
export const skinColors = [
  { value: '#F5D0C5', label: '白皙', class: 'bg-[#F5D0C5]' },
  { value: '#E8BEAC', label: '自然', class: 'bg-[#E8BEAC]' },
  { value: '#D4A574', label: '健康', class: 'bg-[#D4A574]' },
  { value: '#8D5524', label: '深色', class: 'bg-[#8D5524]' },
];

// 背景选项
export const backgroundOptions = [
  { value: 'classroom', label: '教室', preview: '🏫' },
  { value: 'library', label: '图书馆', preview: '📚' },
  { value: 'nature', label: '自然', preview: '🌳' },
  { value: 'space', label: '太空', preview: '🚀' },
  { value: 'minimal', label: '简约', preview: '⬜' },
  { value: 'gradient', label: '渐变', preview: '🌈' },
];
