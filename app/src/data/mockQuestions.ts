import type { Question } from '@/types/question';

export const mockQuestions: Question[] = [
  // 数学题目
  {
    id: 'math-001',
    title: '一元二次方程求解',
    content: '解方程：x² - 5x + 6 = 0',
    type: 'calculation',
    difficulty: 'easy',
    subject: 'math',
    grade: 'grade9',
    defaultScore: 5,
    knowledgePoint: '一元二次方程',
    answer: 'x₁=2, x₂=3'
  },
  {
    id: 'math-002',
    title: '函数图像分析',
    content: '已知函数 f(x) = 2x² - 4x + 1，求其顶点坐标和对称轴方程。',
    type: 'calculation',
    difficulty: 'medium',
    subject: 'math',
    grade: 'grade9',
    defaultScore: 8,
    knowledgePoint: '二次函数',
    answer: '顶点(1,-1)，对称轴x=1'
  },
  {
    id: 'math-003',
    title: '几何证明题',
    content: '在△ABC中，AB=AC，D为BC中点。求证：AD⊥BC。',
    type: 'essay',
    difficulty: 'medium',
    subject: 'math',
    grade: 'grade8',
    defaultScore: 10,
    knowledgePoint: '等腰三角形性质',
  },
  {
    id: 'math-004',
    title: '概率计算',
    content: '一个袋中有3个红球和2个白球，随机摸出2个球，求两球都是红球的概率。',
    type: 'calculation',
    difficulty: 'medium',
    subject: 'math',
    grade: 'grade9',
    defaultScore: 6,
    knowledgePoint: '概率',
    answer: '3/10'
  },
  {
    id: 'math-005',
    title: '导数应用',
    content: '求函数 f(x) = x³ - 3x² + 2 的极值点和极值。',
    type: 'calculation',
    difficulty: 'hard',
    subject: 'math',
    grade: 'grade12',
    defaultScore: 12,
    knowledgePoint: '导数',
    answer: '极大值f(0)=2，极小值f(2)=-2'
  },
  {
    id: 'math-006',
    title: '三角函数化简',
    content: '化简：sin²x + cos²x + tanx·cotx',
    type: 'calculation',
    difficulty: 'easy',
    subject: 'math',
    grade: 'grade10',
    defaultScore: 4,
    knowledgePoint: '三角函数',
    answer: '2'
  },
  {
    id: 'math-007',
    title: '数列求和',
    content: '已知等差数列{aₙ}中，a₁=2，d=3，求S₁₀。',
    type: 'calculation',
    difficulty: 'easy',
    subject: 'math',
    grade: 'grade10',
    defaultScore: 5,
    knowledgePoint: '等差数列',
    answer: '155'
  },
  {
    id: 'math-008',
    title: '立体几何',
    content: '在正方体ABCD-A₁B₁C₁D₁中，求异面直线A₁B与B₁C所成角的余弦值。',
    type: 'calculation',
    difficulty: 'hard',
    subject: 'math',
    grade: 'grade11',
    defaultScore: 10,
    knowledgePoint: '空间向量',
  },
  // 语文题目
  {
    id: 'chinese-001',
    title: '古诗词默写',
    content: '补全诗句："床前明月光，________。"',
    type: 'fill',
    difficulty: 'easy',
    subject: 'chinese',
    grade: 'grade7',
    defaultScore: 2,
    knowledgePoint: '古诗词',
    answer: '疑是地上霜'
  },
  {
    id: 'chinese-002',
    title: '阅读理解',
    content: '阅读《背影》选段，分析文中"父亲"的形象特点。',
    type: 'essay',
    difficulty: 'medium',
    subject: 'chinese',
    grade: 'grade8',
    defaultScore: 15,
    knowledgePoint: '现代文阅读',
  },
  {
    id: 'chinese-003',
    title: '文言文翻译',
    content: '将"学而时习之，不亦说乎？"翻译成现代汉语。',
    type: 'essay',
    difficulty: 'medium',
    subject: 'chinese',
    grade: 'grade7',
    defaultScore: 4,
    knowledgePoint: '文言文',
    answer: '学习后按时温习，不是很愉快吗？'
  },
  {
    id: 'chinese-004',
    title: '作文',
    content: '以"我的梦想"为题，写一篇不少于600字的记叙文。',
    type: 'essay',
    difficulty: 'medium',
    subject: 'chinese',
    grade: 'grade9',
    defaultScore: 50,
    knowledgePoint: '写作',
  },
  {
    id: 'chinese-005',
    title: '成语辨析',
    content: '下列成语使用正确的一项是（  ）\nA. 他做事总是小心翼翼，如履薄冰。\nB. 这部电影情节跌宕起伏，引人入胜。',
    type: 'single',
    difficulty: 'medium',
    subject: 'chinese',
    grade: 'grade9',
    defaultScore: 3,
    options: ['A', 'B', 'C', 'D'],
    knowledgePoint: '成语',
    answer: 'B'
  },
  // 英语题目
  {
    id: 'english-001',
    title: '时态选择',
    content: 'By the time I arrived, they ______ for two hours.\nA. waited  B. have waited  C. had waited  D. have been waiting',
    type: 'single',
    difficulty: 'medium',
    subject: 'english',
    grade: 'grade10',
    defaultScore: 2,
    options: ['A', 'B', 'C', 'D'],
    knowledgePoint: '时态',
    answer: 'C'
  },
  {
    id: 'english-002',
    title: '完形填空',
    content: '阅读短文，从每题所给的四个选项中选择最佳答案。\n(短文内容略)',
    type: 'single',
    difficulty: 'medium',
    subject: 'english',
    grade: 'grade9',
    defaultScore: 20,
    knowledgePoint: '阅读理解',
  },
  {
    id: 'english-003',
    title: '书面表达',
    content: '假设你是李华，给你的英国笔友Tom写一封信，介绍你的学校生活。',
    type: 'essay',
    difficulty: 'medium',
    subject: 'english',
    grade: 'grade8',
    defaultScore: 15,
    knowledgePoint: '写作',
  },
  {
    id: 'english-004',
    title: '词汇拼写',
    content: '根据句意和首字母提示完成单词：\nThe s______ of the mountain is covered with snow.',
    type: 'fill',
    difficulty: 'easy',
    subject: 'english',
    grade: 'grade7',
    defaultScore: 1,
    knowledgePoint: '词汇',
    answer: 'summit'
  },
  // 物理题目
  {
    id: 'physics-001',
    title: '力学计算',
    content: '一物体质量为5kg，受到水平拉力20N的作用，在水平面上做匀加速直线运动，加速度为3m/s²。求物体受到的摩擦力大小。',
    type: 'calculation',
    difficulty: 'medium',
    subject: 'physics',
    grade: 'grade10',
    defaultScore: 8,
    knowledgePoint: '牛顿第二定律',
    answer: '5N'
  },
  {
    id: 'physics-002',
    title: '电路分析',
    content: '如图所示电路，R₁=10Ω，R₂=20Ω，电源电压为12V。求通过R₁的电流。',
    type: 'calculation',
    difficulty: 'easy',
    subject: 'physics',
    grade: 'grade9',
    defaultScore: 6,
    knowledgePoint: '欧姆定律',
    answer: '0.4A'
  },
  {
    id: 'physics-003',
    title: '光学实验',
    content: '在凸透镜成像实验中，当物距大于2倍焦距时，成像的性质是（  ）',
    type: 'single',
    difficulty: 'easy',
    subject: 'physics',
    grade: 'grade8',
    defaultScore: 3,
    options: ['倒立放大实像', '倒立缩小实像', '正立放大虚像', '正立缩小虚像'],
    knowledgePoint: '凸透镜成像',
    answer: 'B'
  },
  // 化学题目
  {
    id: 'chemistry-001',
    title: '化学方程式',
    content: '写出铁与稀硫酸反应的化学方程式，并注明反应类型。',
    type: 'essay',
    difficulty: 'easy',
    subject: 'chemistry',
    grade: 'grade9',
    defaultScore: 4,
    knowledgePoint: '化学反应',
    answer: 'Fe + H₂SO₄ = FeSO₄ + H₂↑，置换反应'
  },
  {
    id: 'chemistry-002',
    title: '物质的量计算',
    content: '计算2mol H₂O中含有的氢原子数目。',
    type: 'calculation',
    difficulty: 'medium',
    subject: 'chemistry',
    grade: 'grade10',
    defaultScore: 5,
    knowledgePoint: '物质的量',
    answer: '2.408×10²⁴'
  },
  // 生物题目
  {
    id: 'biology-001',
    title: '细胞结构',
    content: '植物细胞与动物细胞相比，特有的结构是（  ）',
    type: 'single',
    difficulty: 'easy',
    subject: 'biology',
    grade: 'grade7',
    defaultScore: 2,
    options: ['细胞膜', '细胞核', '细胞壁', '线粒体'],
    knowledgePoint: '细胞结构',
    answer: 'C'
  },
  {
    id: 'biology-002',
    title: '遗传规律',
    content: '豌豆的圆粒(R)对皱粒(r)为显性。用纯种圆粒与纯种皱粒杂交，F₁自交，F₂中圆粒与皱粒的比例为（  ）',
    type: 'single',
    difficulty: 'medium',
    subject: 'biology',
    grade: 'grade10',
    defaultScore: 3,
    options: ['3:1', '1:1', '9:3:3:1', '1:2:1'],
    knowledgePoint: '孟德尔遗传定律',
    answer: 'A'
  },
  // 历史题目
  {
    id: 'history-001',
    title: '朝代顺序',
    content: '下列朝代按时间先后顺序排列正确的是（  ）',
    type: 'single',
    difficulty: 'easy',
    subject: 'history',
    grade: 'grade7',
    defaultScore: 2,
    options: ['唐-宋-元-明-清', '宋-唐-元-明-清', '唐-元-宋-明-清', '唐-宋-明-元-清'],
    knowledgePoint: '中国古代史',
    answer: 'A'
  },
  {
    id: 'history-002',
    title: '辛亥革命',
    content: '简述辛亥革命的历史意义。',
    type: 'essay',
    difficulty: 'medium',
    subject: 'history',
    grade: 'grade8',
    defaultScore: 10,
    knowledgePoint: '近代中国',
  },
  // 地理题目
  {
    id: 'geography-001',
    title: '气候类型',
    content: '地中海气候的特点是（  ）',
    type: 'single',
    difficulty: 'medium',
    subject: 'geography',
    grade: 'grade9',
    defaultScore: 2,
    options: ['夏季炎热干燥，冬季温和多雨', '全年高温多雨', '夏季高温多雨，冬季寒冷干燥', '全年温和湿润'],
    knowledgePoint: '世界气候',
    answer: 'A'
  },
  {
    id: 'geography-002',
    title: '中国地形',
    content: '我国地势的特点是________，呈________分布。',
    type: 'fill',
    difficulty: 'easy',
    subject: 'geography',
    grade: 'grade8',
    defaultScore: 2,
    knowledgePoint: '中国地形',
    answer: '西高东低，三级阶梯状'
  },
  // 政治题目
  {
    id: 'politics-001',
    title: '宪法知识',
    content: '我国宪法规定，公民的基本权利包括（  ）\n①选举权和被选举权 ②言论自由 ③宗教信仰自由 ④劳动权',
    type: 'multiple',
    difficulty: 'easy',
    subject: 'politics',
    grade: 'grade8',
    defaultScore: 3,
    options: ['①②', '①②③', '①③④', '①②③④'],
    knowledgePoint: '宪法',
    answer: 'D'
  },
  {
    id: 'politics-002',
    title: '经济制度',
    content: '我国社会主义初级阶段的基本经济制度是________。',
    type: 'fill',
    difficulty: 'medium',
    subject: 'politics',
    grade: 'grade9',
    defaultScore: 2,
    knowledgePoint: '经济制度',
    answer: '公有制为主体、多种所有制经济共同发展'
  },
];

// 获取所有科目
export const subjects = [
  { value: 'math', label: '数学' },
  { value: 'chinese', label: '语文' },
  { value: 'english', label: '英语' },
  { value: 'physics', label: '物理' },
  { value: 'chemistry', label: '化学' },
  { value: 'biology', label: '生物' },
  { value: 'history', label: '历史' },
  { value: 'geography', label: '地理' },
  { value: 'politics', label: '政治' },
] as const;

// 获取所有年级
export const grades = [
  { value: 'grade7', label: '七年级' },
  { value: 'grade8', label: '八年级' },
  { value: 'grade9', label: '九年级' },
  { value: 'grade10', label: '高一' },
  { value: 'grade11', label: '高二' },
  { value: 'grade12', label: '高三' },
] as const;

// 获取所有难度
export const difficulties = [
  { value: 'easy', label: '简单', color: '#4caf50' },
  { value: 'medium', label: '中等', color: '#ff9800' },
  { value: 'hard', label: '困难', color: '#f44336' },
] as const;

// 获取所有题型
export const questionTypes = [
  { value: 'single', label: '单选题' },
  { value: 'multiple', label: '多选题' },
  { value: 'fill', label: '填空题' },
  { value: 'essay', label: '解答题' },
  { value: 'calculation', label: '计算题' },
] as const;
