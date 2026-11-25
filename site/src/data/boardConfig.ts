export type MasteryStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_review'

export type ColorKey = 'blue' | 'teal' | 'purple' | 'green' | 'amber' | 'slate'

export interface BoardCard {
  id: string
  col: 0 | 1 | 2 | 3
  title: string
  subtitle: string
  phase: string
  primaryDoc: string
  relatedDocs: { label: string; path: string; kind: 'curriculum' | 'derivation' | 'experiment' | 'graph' }[]
  kgIds: string[]
  contentReady: boolean
}

export interface Swimlane {
  id: string
  color: ColorKey
  title: string
  subtitle: string
  cards: [BoardCard, BoardCard, BoardCard, BoardCard]
}

export const STATUS_META: Record<MasteryStatus, { label: string; color: string; bg: string; border: string }> = {
  not_started: { label: '未开始', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
  in_progress: { label: '学习中', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd' },
  completed: { label: '已掌握', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
  needs_review: { label: '需复习', color: '#b45309', bg: '#fffbeb', border: '#fcd34d' },
}

export const SWIMLANE_COLORS: Record<ColorKey, { hdr: string; fill: string; bdr: string; cardBdr: string; softText: string }> = {
  blue: { hdr: '#2563eb', fill: '#eff6ff', bdr: '#3b82f6', cardBdr: '#2563eb', softText: '#1d4ed8' },
  teal: { hdr: '#1f7a7a', fill: '#f0fdfa', bdr: '#14b8a6', cardBdr: '#0d9488', softText: '#0f766e' },
  purple: { hdr: '#7c3aed', fill: '#f5f3ff', bdr: '#8b5cf6', cardBdr: '#7c3aed', softText: '#6d28d9' },
  green: { hdr: '#2e7d32', fill: '#f0fdf4', bdr: '#22c55e', cardBdr: '#16a34a', softText: '#15803d' },
  amber: { hdr: '#d97706', fill: '#fffbeb', bdr: '#f59e0b', cardBdr: '#d97706', softText: '#b45309' },
  slate: { hdr: '#64748b', fill: '#f8fafc', bdr: '#94a3b8', cardBdr: '#64748b', softText: '#475569' },
}

export const COLUMN_HEADERS = [
  { label: '1. 数学原理', color: '#2563eb', bg: '#eff6ff' },
  { label: '2. 物理机制与控制方程', color: '#7c3aed', bg: '#f5f3ff' },
  { label: '3. 数值与计算方法', color: '#1f7a7a', bg: '#f0fdfa' },
  { label: '4. 工程实践场景', color: '#2e7d32', bg: '#f0fdf4' },
]

export const SWIMLANES: Swimlane[] = [
  {
    id: 'la',
    color: 'blue',
    title: '线性代数与谱',
    subtitle: 'Linear Algebra',
    cards: [
      {
        id: 'la-math',
        col: 0,
        title: '特征值 · 谱定理 · SVD',
        subtitle: 'Ax = λx · A = UΣVᵀ',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/linear_algebra/eigenvalue_problems.md',
        relatedDocs: [
          { label: '线性代数课程大纲', path: '01_mathematics/linear_algebra/curriculum.md', kind: 'curriculum' },
          { label: '线性最小二乘推导', path: '01_mathematics/linear_algebra/linear_least_squares.md', kind: 'derivation' },
          { label: '实验 01：矩阵分解与条件数', path: '05_experiments/linear_algebra/01_matrix_decomposition/README.md', kind: 'experiment' },
          { label: '实验 02：SVD/PCA 低秩压缩', path: '05_experiments/linear_algebra/02_pca_svd_compression/README.md', kind: 'experiment' },
        ],
        kgIds: ['MATH-LA-01', 'MATH-LA-02', 'MATH-LA-03'],
        contentReady: true,
      },
      {
        id: 'la-phys',
        col: 1,
        title: '定态薛定谔 · 结构模态',
        subtitle: 'Ĥψ = Eψ · Kx = ω²Mx',
        phase: 'Phase III–IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [
          { label: '物理层知识图谱', path: '06_knowledge_graph/physics_graph.md', kind: 'graph' },
          { label: '特征值与谱定理（含物理映射）', path: '01_mathematics/linear_algebra/eigenvalue_problems.md', kind: 'derivation' },
        ],
        kgIds: ['PHYS-QM-01', 'PHYS-CM-02', 'PHYS-SS-01'],
        contentReady: false,
      },
      {
        id: 'la-comp',
        col: 2,
        title: 'Lanczos / LOBPCG · 截断 SVD',
        subtitle: '稀疏特征求解 · 低秩逼近',
        phase: 'Phase V',
        primaryDoc: '01_mathematics/numerical_analysis/curriculum.md',
        relatedDocs: [
          { label: '实验 01：矩阵分解', path: '05_experiments/linear_algebra/01_matrix_decomposition/README.md', kind: 'experiment' },
          { label: '实验 02：SVD 低秩压缩', path: '05_experiments/linear_algebra/02_pca_svd_compression/README.md', kind: 'experiment' },
          { label: '计算层知识图谱', path: '06_knowledge_graph/computational_graph.md', kind: 'graph' },
        ],
        kgIds: ['COMP-01', 'COMP-03'],
        contentReady: true,
      },
      {
        id: 'la-eng',
        col: 3,
        title: 'DFT 能带 · 结构振动 · PCA',
        subtitle: '材料 · 制造 · AI',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [
          { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
        ],
        kgIds: ['ENG-MAT-02', 'ENG-AI-02', 'ENG-MFG-02'],
        contentReady: false,
      },
    ],
  },
  {
    id: 'vc',
    color: 'teal',
    title: '向量微积分',
    subtitle: 'Vector Calculus',
    cards: [
      {
        id: 'vc-math',
        col: 0,
        title: '散度 · 旋度 · Gauss / Stokes',
        subtitle: '∇·F · ∇×F · 积分定理',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/calculus/curriculum.md',
        relatedDocs: [
          { label: '热传导方程（散度定理推导）', path: '01_mathematics/differential_equations/heat_equation.md', kind: 'derivation' },
          { label: '数学层知识图谱', path: '06_knowledge_graph/mathematics_graph.md', kind: 'graph' },
        ],
        kgIds: ['MATH-VC-01', 'MATH-VC-02'],
        contentReady: true,
      },
      {
        id: 'vc-phys',
        col: 1,
        title: 'Navier–Stokes · 传热 · 漂移-扩散',
        subtitle: '∂ₜu + ∇·F = s · Maxwell',
        phase: 'Phase II–IV',
        primaryDoc: '01_mathematics/differential_equations/heat_equation.md',
        relatedDocs: [
          { label: '波动方程（含 Maxwell 推导）', path: '01_mathematics/differential_equations/wave_equation.md', kind: 'derivation' },
          { label: '物理核心总览', path: '02_physics/README.md', kind: 'curriculum' },
        ],
        kgIds: ['PHYS-CL-01', 'PHYS-TR-01', 'PHYS-FL-01', 'PHYS-EM-01', 'PHYS-SS-03'],
        contentReady: true,
      },
      {
        id: 'vc-comp',
        col: 2,
        title: '有限差分 / 体积 · SG 通量',
        subtitle: '守恒离散 · 迎风 / 隐式格式',
        phase: 'Phase II / V',
        primaryDoc: '05_experiments/heat_transfer/06_2d_heat_equation/README.md',
        relatedDocs: [
          { label: '计算方法总览（FDM / FVM）', path: '03_computational_methods/README.md', kind: 'curriculum' },
          { label: '计算层知识图谱', path: '06_knowledge_graph/computational_graph.md', kind: 'graph' },
        ],
        kgIds: ['COMP-06', 'COMP-08'],
        contentReady: true,
      },
      {
        id: 'vc-eng',
        col: 3,
        title: 'TCAD 半导体器件 · CFD 仿真',
        subtitle: '半导体 · 先进制造 · HPC',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [
          { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
        ],
        kgIds: ['ENG-SEMI-02', 'ENG-HPC-02'],
        contentReady: false,
      },
    ],
  },
  {
    id: 'fourier',
    color: 'purple',
    title: '傅里叶与谱分析',
    subtitle: 'Fourier Analysis',
    cards: [
      {
        id: 'fa-math',
        col: 0,
        title: 'Fourier 变换 · 卷积 · 采样',
        subtitle: 'k 空间 · Parseval 定理',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/fourier_transform.md',
        relatedDocs: [
          { label: '微分方程与数学物理大纲', path: '01_mathematics/differential_equations/curriculum.md', kind: 'curriculum' },
          { label: '数学层知识图谱', path: '06_knowledge_graph/mathematics_graph.md', kind: 'graph' },
        ],
        kgIds: ['MATH-FA-01', 'MATH-FA-03'],
        contentReady: true,
      },
      {
        id: 'fa-phys',
        col: 1,
        title: '电磁波传播 · 晶体布洛赫波',
        subtitle: '色散关系 · 倒格子空间',
        phase: 'Phase III–IV',
        primaryDoc: '01_mathematics/differential_equations/wave_equation.md',
        relatedDocs: [
          { label: '物理核心总览', path: '02_physics/README.md', kind: 'curriculum' },
        ],
        kgIds: ['PHYS-EM-01', 'PHYS-SS-01'],
        contentReady: true,
      },
      {
        id: 'fa-comp',
        col: 2,
        title: 'FFT · 谱方法 · 神经算子 FNO',
        subtitle: 'O(N log N) · 频域算子',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [
          { label: '经典论文（Cooley-Tukey / FNO）', path: '07_references/research_papers.md', kind: 'curriculum' },
        ],
        kgIds: ['COMP-04', 'COMP-13'],
        contentReady: false,
      },
      {
        id: 'fa-eng',
        col: 3,
        title: 'MRI / CT 图像重建 · 光学光刻',
        subtitle: '医学成像 · 半导体 · 材料',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [
          { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
        ],
        kgIds: ['ENG-MED-02', 'ENG-SEMI-01'],
        contentReady: false,
      },
    ],
  },
  {
    id: 'ode',
    color: 'green',
    title: '微分方程与动力',
    subtitle: 'ODE / Dynamics',
    cards: [
      {
        id: 'ode-math',
        col: 0,
        title: 'ODE 线性组 · Lyapunov 稳定',
        subtitle: 'ẋ = Ax · 相平面 · 分岔',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/curriculum.md',
        relatedDocs: [
          { label: '实验 03：ODE 数值积分器', path: '05_experiments/dynamics/03_numerical_ode_solver/README.md', kind: 'experiment' },
        ],
        kgIds: ['MATH-DE-01', 'MATH-DE-02'],
        contentReady: true,
      },
      {
        id: 'ode-phys',
        col: 1,
        title: 'Lagrange / Hamilton 力学',
        subtitle: 'M(q)q̈ + Cq̇ + g = τ',
        phase: 'Phase III',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [
          { label: '物理层知识图谱', path: '06_knowledge_graph/physics_graph.md', kind: 'graph' },
        ],
        kgIds: ['PHYS-CM-01', 'PHYS-CM-02', 'PHYS-CM-03'],
        contentReady: false,
      },
      {
        id: 'ode-comp',
        col: 2,
        title: 'RK4 · 辛积分 · Kalman 滤波',
        subtitle: '保能量积分 · 状态估计',
        phase: 'Phase II / VI',
        primaryDoc: '05_experiments/dynamics/03_numerical_ode_solver/README.md',
        relatedDocs: [
          { label: '实验总目录', path: '05_experiments/README.md', kind: 'experiment' },
        ],
        kgIds: ['COMP-05', 'COMP-10'],
        contentReady: true,
      },
      {
        id: 'ode-eng',
        col: 3,
        title: '机械臂控制 · SLAM · 分子动力学',
        subtitle: '机器人 · 计算材料',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [
          { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
        ],
        kgIds: ['ENG-ROB-02', 'ENG-ROB-03', 'ENG-MAT-02'],
        contentReady: false,
      },
    ],
  },
  {
    id: 'var',
    color: 'amber',
    title: '变分原理与优化',
    subtitle: 'Variational & Opt.',
    cards: [
      {
        id: 'var-math',
        col: 0,
        title: '变分法 · 弱形式 · 凸优化',
        subtitle: 'δS = 0 · KKT · 对偶理论',
        phase: 'Phase II / VI',
        primaryDoc: '06_knowledge_graph/mathematics_graph.md',
        relatedDocs: [
          { label: '线性最小二乘（凸优化特例）', path: '01_mathematics/linear_algebra/linear_least_squares.md', kind: 'derivation' },
          { label: '先修瓶颈分析', path: '00_getting_started/prerequisite_map.md', kind: 'curriculum' },
        ],
        kgIds: ['MATH-VAR-01', 'MATH-FA-04', 'MATH-OPT-01', 'MATH-OPT-02'],
        contentReady: false,
      },
      {
        id: 'var-phys',
        col: 1,
        title: '最小势能 · 线弹性 · 能量泛函',
        subtitle: 'a(u,v) = ℓ(v) · E[n] → min',
        phase: 'Phase III–IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [
          { label: '物理层知识图谱', path: '06_knowledge_graph/physics_graph.md', kind: 'graph' },
        ],
        kgIds: ['PHYS-EL-01', 'PHYS-QM-02'],
        contentReady: false,
      },
      {
        id: 'var-comp',
        col: 2,
        title: '有限元 FEM · LQR/MPC · PINNs',
        subtitle: 'Galerkin 组装 · 自动微分',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [
          { label: '计算层知识图谱', path: '06_knowledge_graph/computational_graph.md', kind: 'graph' },
        ],
        kgIds: ['COMP-07', 'COMP-12', 'COMP-15'],
        contentReady: false,
      },
      {
        id: 'var-eng',
        col: 3,
        title: '热-力耦合制造 · 轨迹/拓扑优化',
        subtitle: '先进制造 · 机器人 · AI',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [
          { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
        ],
        kgIds: ['ENG-MFG-01', 'ENG-MFG-02', 'ENG-AI-01'],
        contentReady: false,
      },
    ],
  },
  {
    id: 'prob',
    color: 'slate',
    title: '概率统计与反演',
    subtitle: 'Probability & UQ',
    cards: [
      {
        id: 'pr-math',
        col: 0,
        title: '概率论 · 贝叶斯推断 · SDE',
        subtitle: '后验分布 · 马尔可夫过程',
        phase: 'Phase I / VI',
        primaryDoc: '01_mathematics/probability_statistics/curriculum.md',
        relatedDocs: [
          { label: '数学层知识图谱', path: '06_knowledge_graph/mathematics_graph.md', kind: 'graph' },
        ],
        kgIds: ['MATH-PR-01', 'MATH-PR-02', 'MATH-PR-03'],
        contentReady: true,
      },
      {
        id: 'pr-phys',
        col: 1,
        title: '玻尔兹曼 · 费米–狄拉克统计',
        subtitle: '配分函数 · 载流子与噪声',
        phase: 'Phase IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [
          { label: '物理层知识图谱', path: '06_knowledge_graph/physics_graph.md', kind: 'graph' },
        ],
        kgIds: ['PHYS-SM-01', 'PHYS-SM-02', 'PHYS-SS-02'],
        contentReady: false,
      },
      {
        id: 'pr-comp',
        col: 2,
        title: 'MCMC · Tikhonov 正则 · GPU 求解',
        subtitle: '采样 · 反演 · 预条件 CG',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [
          { label: '计算层知识图谱', path: '06_knowledge_graph/computational_graph.md', kind: 'graph' },
        ],
        kgIds: ['COMP-02', 'COMP-09', 'COMP-11', 'COMP-14'],
        contentReady: false,
      },
      {
        id: 'pr-eng',
        col: 3,
        title: '生成模型 · 医学反演 · 良率 UQ',
        subtitle: 'AI · 医学 · 半导体 · HPC',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [
          { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
        ],
        kgIds: ['ENG-AI-01', 'ENG-MED-02', 'ENG-HPC-01'],
        contentReady: false,
      },
    ],
  },
]

export const ALL_CARDS: BoardCard[] = SWIMLANES.flatMap((s) => s.cards)
