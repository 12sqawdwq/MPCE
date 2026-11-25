export type MasteryStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_review'

export type LayerId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export interface RelatedDoc {
  label: string
  path: string
  kind: 'curriculum' | 'derivation' | 'experiment' | 'graph'
}

export interface BoardCard {
  id: string
  layer: LayerId
  title: string
  subtitle: string
  phase: string
  primaryDoc: string
  relatedDocs: RelatedDoc[]
  kgNodes: string[]
  /** Has at least one worked derivation in the repo. */
  hasDerivation: boolean
  /** Has at least one verified numerical experiment in the repo. */
  hasExperiment: boolean
}

export interface BoardLayer {
  id: LayerId
  index: number
  title: string
  subtitle: string
  color: string
  /** Light tinted band background. */
  tint: string
  /** Band border / card accent. */
  border: string
  cards: BoardCard[]
}

export const STATUS_META: Record<MasteryStatus, { label: string; color: string; bg: string; border: string }> = {
  not_started: { label: '未开始', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
  in_progress: { label: '学习中', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd' },
  completed: { label: '已掌握', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
  needs_review: { label: '需复习', color: '#b45309', bg: '#fffbeb', border: '#fcd34d' },
}

export const PILLAR_TEXT = '数学驱动物理与工程实践'

// ---------------------------------------------------------------------------
// Shared doc references
// ---------------------------------------------------------------------------
const D = {
  laCurr: { label: '线性代数课程大纲', path: '01_mathematics/linear_algebra/curriculum.md', kind: 'curriculum' },
  eigen: { label: '特征值与谱定理推导', path: '01_mathematics/linear_algebra/eigenvalue_problems.md', kind: 'derivation' },
  lls: { label: '线性最小二乘推导', path: '01_mathematics/linear_algebra/linear_least_squares.md', kind: 'derivation' },
  calcCurr: { label: '微积分与向量分析大纲', path: '01_mathematics/calculus/curriculum.md', kind: 'curriculum' },
  deCurr: { label: '微分方程与数学物理大纲', path: '01_mathematics/differential_equations/curriculum.md', kind: 'curriculum' },
  heat: { label: '热传导方程（散度定理推导）', path: '01_mathematics/differential_equations/heat_equation.md', kind: 'derivation' },
  wave: { label: '波动方程（含 Maxwell 推导）', path: '01_mathematics/differential_equations/wave_equation.md', kind: 'derivation' },
  fourier: { label: 'Fourier 变换推导', path: '01_mathematics/differential_equations/fourier_transform.md', kind: 'derivation' },
  naCurr: { label: '数值分析课程大纲', path: '01_mathematics/numerical_analysis/curriculum.md', kind: 'curriculum' },
  prCurr: { label: '概率统计课程大纲', path: '01_mathematics/probability_statistics/curriculum.md', kind: 'curriculum' },
  mathReadme: { label: '数学层总览', path: '01_mathematics/README.md', kind: 'curriculum' },
  physReadme: { label: '物理核心总览', path: '02_physics/README.md', kind: 'curriculum' },
  compReadme: { label: '计算方法总览（FDM / FVM / FEM）', path: '03_computational_methods/README.md', kind: 'curriculum' },
  engReadme: { label: '工程应用总览', path: '04_engineering_applications/README.md', kind: 'curriculum' },
  expReadme: { label: '实验总目录', path: '05_experiments/README.md', kind: 'experiment' },
  exp01: { label: '实验 01：矩阵分解与条件数', path: '05_experiments/linear_algebra/01_matrix_decomposition/README.md', kind: 'experiment' },
  exp02: { label: '实验 02：SVD/PCA 低秩压缩', path: '05_experiments/linear_algebra/02_pca_svd_compression/README.md', kind: 'experiment' },
  exp03: { label: '实验 03：ODE 数值积分器', path: '05_experiments/dynamics/03_numerical_ode_solver/README.md', kind: 'experiment' },
  exp06: { label: '实验 06：二维热传导方程', path: '05_experiments/heat_transfer/06_2d_heat_equation/README.md', kind: 'experiment' },
  kgMath: { label: '数学层知识图谱', path: '06_knowledge_graph/mathematics_graph.md', kind: 'graph' },
  kgPhys: { label: '物理层知识图谱', path: '06_knowledge_graph/physics_graph.md', kind: 'graph' },
  kgComp: { label: '计算层知识图谱', path: '06_knowledge_graph/computational_graph.md', kind: 'graph' },
  kgEng: { label: '工程层知识图谱', path: '06_knowledge_graph/engineering_graph.md', kind: 'graph' },
  prereq: { label: '先修瓶颈分析', path: '00_getting_started/prerequisite_map.md', kind: 'curriculum' },
  papers: { label: '经典论文（Cooley-Tukey / FNO）', path: '07_references/research_papers.md', kind: 'curriculum' },
  software: { label: '软件与求解器文档', path: '07_references/software_documentation.md', kind: 'curriculum' },
} satisfies Record<string, RelatedDoc>

// ---------------------------------------------------------------------------
// 5 layers, top -> bottom
// ---------------------------------------------------------------------------
export const LAYERS: BoardLayer[] = [
  {
    id: 'L1',
    index: 1,
    title: '宏观数学分类',
    subtitle: 'Macro Math',
    color: '#334155',
    tint: '#f1f5f9',
    border: '#94a3b8',
    cards: [
      {
        id: 'l1-algebra',
        layer: 'L1',
        title: '代数与线性结构',
        subtitle: '线性空间 · 算子 · 张量',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/linear_algebra/curriculum.md',
        relatedDocs: [D.eigen, D.lls, D.mathReadme, D.kgMath],
        kgNodes: ['MATH-LA-01', 'MATH-LA-02', 'MATH-LA-03'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l1-analysis',
        layer: 'L1',
        title: '分析与微分场论',
        subtitle: '微积分 · 矢量场 · 调和分析',
        phase: 'Phase I–II',
        primaryDoc: '01_mathematics/calculus/curriculum.md',
        relatedDocs: [D.fourier, D.heat, D.mathReadme, D.kgMath],
        kgNodes: ['MATH-VC-01', 'MATH-VC-02', 'MATH-FA-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l1-dynamics',
        layer: 'L1',
        title: '微分方程与变分优化',
        subtitle: 'ODE/PDE · 变分法 · 最优化',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/curriculum.md',
        relatedDocs: [D.heat, D.wave, D.naCurr, D.prereq, D.kgMath],
        kgNodes: ['MATH-DE-01', 'MATH-DE-03', 'MATH-VAR-01', 'MATH-OPT-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l1-prob',
        layer: 'L1',
        title: '概率与统计推断',
        subtitle: '随机过程 · 贝叶斯 · 信息论',
        phase: 'Phase I / VI',
        primaryDoc: '01_mathematics/probability_statistics/curriculum.md',
        relatedDocs: [D.mathReadme, D.kgMath],
        kgNodes: ['MATH-PR-01', 'MATH-PR-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
    ],
  },
  {
    id: 'L2',
    index: 2,
    title: '具体数学方法',
    subtitle: 'Math Methods',
    color: '#2563EB',
    tint: '#eff6ff',
    border: '#93c5fd',
    cards: [
      {
        id: 'l2-eigen',
        layer: 'L2',
        title: '特征值 · 谱定理 · SVD',
        subtitle: 'Ax = λx · A = UΣVᵀ',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/linear_algebra/eigenvalue_problems.md',
        relatedDocs: [D.laCurr, D.lls, D.exp01, D.exp02],
        kgNodes: ['MATH-LA-01', 'MATH-LA-02', 'MATH-LA-03'],
        hasDerivation: true,
        hasExperiment: true,
      },
      {
        id: 'l2-vec',
        layer: 'L2',
        title: '散度 · 旋度 · Gauss / Stokes',
        subtitle: '∇·F · ∇×F · 积分定理',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/calculus/curriculum.md',
        relatedDocs: [D.heat, D.kgMath],
        kgNodes: ['MATH-VC-01', 'MATH-VC-02'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l2-fourier',
        layer: 'L2',
        title: 'Fourier 变换 · 卷积 · 谱分析',
        subtitle: 'k 空间 · Parseval 定理',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/fourier_transform.md',
        relatedDocs: [D.deCurr, D.kgMath],
        kgNodes: ['MATH-FA-01', 'MATH-FA-03'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l2-ode',
        layer: 'L2',
        title: 'ODE 线性组 · Lyapunov 稳定',
        subtitle: 'ẋ = Ax · 相平面 · 分岔',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/curriculum.md',
        relatedDocs: [D.exp03],
        kgNodes: ['MATH-DE-01', 'MATH-DE-02'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l2-var',
        layer: 'L2',
        title: '变分法 · 弱形式 · 凸优化',
        subtitle: 'δS = 0 · KKT · 对偶',
        phase: 'Phase II / VI',
        primaryDoc: '06_knowledge_graph/mathematics_graph.md',
        relatedDocs: [{ ...D.lls, label: '线性最小二乘（凸优化特例）' }, D.prereq],
        kgNodes: ['MATH-VAR-01', 'MATH-FA-04', 'MATH-OPT-01', 'MATH-OPT-02'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l2-prob',
        layer: 'L2',
        title: '贝叶斯推断 · SDE · 逆问题',
        subtitle: '后验分布 · 马尔可夫过程',
        phase: 'Phase I / VI',
        primaryDoc: '01_mathematics/probability_statistics/curriculum.md',
        relatedDocs: [D.kgMath],
        kgNodes: ['MATH-PR-01', 'MATH-PR-02', 'MATH-PR-03'],
        hasDerivation: false,
        hasExperiment: false,
      },
    ],
  },
  {
    id: 'L3',
    index: 3,
    title: '对应物理方法与方程',
    subtitle: 'Physical Models',
    color: '#7C3AED',
    tint: '#f5f3ff',
    border: '#c4b5fd',
    cards: [
      {
        id: 'l3-quantum',
        layer: 'L3',
        title: '定态薛定谔 · 结构模态',
        subtitle: 'Ĥψ = Eψ · Kx = ω²Mx',
        phase: 'Phase III–IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys, { ...D.eigen, label: '特征值与谱定理（含物理映射）' }],
        kgNodes: ['PHYS-QM-01', 'PHYS-CM-02', 'PHYS-SS-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l3-transport',
        layer: 'L3',
        title: 'Navier-Stokes · 传热 · 漂移-扩散',
        subtitle: '∂ₜu + ∇·F = s · Maxwell',
        phase: 'Phase II–IV',
        primaryDoc: '01_mathematics/differential_equations/heat_equation.md',
        relatedDocs: [D.wave, D.physReadme, D.exp06],
        kgNodes: ['PHYS-CL-01', 'PHYS-TR-01', 'PHYS-FL-01', 'PHYS-EM-01', 'PHYS-SS-03'],
        hasDerivation: true,
        hasExperiment: true,
      },
      {
        id: 'l3-wave',
        layer: 'L3',
        title: '电磁波传播 · 晶体布洛赫波',
        subtitle: '色散关系 · 倒格子空间',
        phase: 'Phase III–IV',
        primaryDoc: '01_mathematics/differential_equations/wave_equation.md',
        relatedDocs: [D.physReadme, D.fourier, D.kgPhys],
        kgNodes: ['PHYS-EM-01', 'PHYS-SS-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l3-mech',
        layer: 'L3',
        title: 'Lagrange / Hamilton 力学',
        subtitle: 'M(q)q̈ + Cq̇ + g = τ',
        phase: 'Phase III',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys, D.exp03],
        kgNodes: ['PHYS-CM-01', 'PHYS-CM-02', 'PHYS-CM-03'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l3-energy',
        layer: 'L3',
        title: '最小势能 · 线弹性 · 能量泛函',
        subtitle: 'a(u,v) = ℓ(v) · E[n] → min',
        phase: 'Phase III–IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys],
        kgNodes: ['PHYS-EL-01', 'PHYS-QM-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l3-statphys',
        layer: 'L3',
        title: '玻尔兹曼 · 费米-狄拉克统计',
        subtitle: '配分函数 · 载流子与噪声',
        phase: 'Phase IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys],
        kgNodes: ['PHYS-SM-01', 'PHYS-SM-02', 'PHYS-SS-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
    ],
  },
  {
    id: 'L4',
    index: 4,
    title: '物理驱动的工程与计算方法',
    subtitle: 'Computational & Engineering Methods',
    color: '#0F766E',
    tint: '#f0fdfa',
    border: '#5eead4',
    cards: [
      {
        id: 'l4-eigensolve',
        layer: 'L4',
        title: 'Lanczos / LOBPCG · 截断 SVD',
        subtitle: '稀疏特征求解 · 低秩逼近',
        phase: 'Phase V',
        primaryDoc: '01_mathematics/numerical_analysis/curriculum.md',
        relatedDocs: [{ ...D.exp01, label: '实验 01：矩阵分解' }, { ...D.exp02, label: '实验 02：SVD 低秩压缩' }, D.kgComp],
        kgNodes: ['COMP-01', 'COMP-03'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l4-fvm',
        layer: 'L4',
        title: '有限差分 / 体积 · SG 通量',
        subtitle: '守恒离散 · 迎风 / 隐式格式',
        phase: 'Phase II / V',
        primaryDoc: '05_experiments/heat_transfer/06_2d_heat_equation/README.md',
        relatedDocs: [D.compReadme, D.kgComp],
        kgNodes: ['COMP-06', 'COMP-08'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l4-fft',
        layer: 'L4',
        title: 'FFT · 谱方法 · 神经算子 FNO',
        subtitle: 'O(N log N) · 频域算子',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [D.papers, D.fourier],
        kgNodes: ['COMP-04', 'COMP-13'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l4-integrator',
        layer: 'L4',
        title: 'RK4 · 辛积分 · Kalman 滤波',
        subtitle: '保能量积分 · 状态估计',
        phase: 'Phase II / VI',
        primaryDoc: '05_experiments/dynamics/03_numerical_ode_solver/README.md',
        relatedDocs: [D.expReadme],
        kgNodes: ['COMP-05', 'COMP-10'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l4-fem',
        layer: 'L4',
        title: '有限元 FEM · LQR/MPC · PINNs',
        subtitle: 'Galerkin 组装 · 自动微分',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [D.kgComp, D.software],
        kgNodes: ['COMP-07', 'COMP-12', 'COMP-15'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l4-uq',
        layer: 'L4',
        title: 'MCMC · Tikhonov 正则 · GPU 求解',
        subtitle: '采样 · 反演 · 预条件 CG',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [D.kgComp, { ...D.lls, label: '线性最小二乘（Tikhonov 正则基础）' }],
        kgNodes: ['COMP-02', 'COMP-09', 'COMP-11', 'COMP-14'],
        hasDerivation: true,
        hasExperiment: false,
      },
    ],
  },
  {
    id: 'L5',
    index: 5,
    title: '工程实践应用场景',
    subtitle: 'Application Scenarios',
    color: '#15803D',
    tint: '#f0fdf4',
    border: '#86efac',
    cards: [
      {
        id: 'l5-semi',
        layer: 'L5',
        title: '半导体与集成电路',
        subtitle: 'TCAD 器件 · 光学光刻 · 良率 UQ',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.heat],
        kgNodes: ['ENG-SEMI-01', 'ENG-SEMI-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l5-ai',
        layer: 'L5',
        title: '人工智能与科学计算',
        subtitle: 'PCA/低秩 · 神经算子 · 生成模型',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.exp02, D.papers],
        kgNodes: ['ENG-AI-01', 'ENG-AI-02'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l5-robotics',
        layer: 'L5',
        title: '机器人与具身智能',
        subtitle: '机械臂控制 · SLAM · 轨迹优化',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.exp03],
        kgNodes: ['ENG-ROB-01', 'ENG-ROB-02', 'ENG-ROB-03'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l5-mfg',
        layer: 'L5',
        title: '先进制造与多物理场',
        subtitle: 'CFD 仿真 · 热-力耦合 · 拓扑优化',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.exp06],
        kgNodes: ['ENG-MFG-01', 'ENG-MFG-02'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l5-mat',
        layer: 'L5',
        title: '计算物理与材料科学',
        subtitle: 'DFT 能带 · 分子动力学 MD',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.eigen],
        kgNodes: ['ENG-MAT-01', 'ENG-MAT-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l5-med',
        layer: 'L5',
        title: '医学成像与生物医学',
        subtitle: 'MRI/CT 重建 · 医学反演',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.fourier],
        kgNodes: ['ENG-MED-01', 'ENG-MED-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l5-hpc',
        layer: 'L5',
        title: '体系结构与高性能计算',
        subtitle: '稀疏求解 · GPU 并行 · 预条件',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.software],
        kgNodes: ['ENG-HPC-01', 'ENG-HPC-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Cross-layer directed edges (upper layer -> next layer down)
// ---------------------------------------------------------------------------
export const EDGES: Array<[string, string]> = [
  // L1 -> L2
  ['l1-algebra', 'l2-eigen'],
  ['l1-algebra', 'l2-var'],
  ['l1-analysis', 'l2-vec'],
  ['l1-analysis', 'l2-fourier'],
  ['l1-dynamics', 'l2-ode'],
  ['l1-dynamics', 'l2-var'],
  ['l1-prob', 'l2-prob'],
  // L2 -> L3
  ['l2-eigen', 'l3-quantum'],
  ['l2-eigen', 'l3-wave'],
  ['l2-vec', 'l3-transport'],
  ['l2-vec', 'l3-wave'],
  ['l2-fourier', 'l3-wave'],
  ['l2-fourier', 'l3-quantum'],
  ['l2-ode', 'l3-mech'],
  ['l2-ode', 'l3-transport'],
  ['l2-var', 'l3-energy'],
  ['l2-var', 'l3-mech'],
  ['l2-prob', 'l3-statphys'],
  // L3 -> L4
  ['l3-quantum', 'l4-eigensolve'],
  ['l3-quantum', 'l4-fft'],
  ['l3-transport', 'l4-fvm'],
  ['l3-transport', 'l4-fem'],
  ['l3-wave', 'l4-fft'],
  ['l3-wave', 'l4-fvm'],
  ['l3-mech', 'l4-integrator'],
  ['l3-mech', 'l4-fem'],
  ['l3-energy', 'l4-fem'],
  ['l3-energy', 'l4-eigensolve'],
  ['l3-statphys', 'l4-uq'],
  ['l3-statphys', 'l4-fvm'],
  // L4 -> L5
  ['l4-eigensolve', 'l5-mat'],
  ['l4-eigensolve', 'l5-ai'],
  ['l4-eigensolve', 'l5-mfg'],
  ['l4-eigensolve', 'l5-hpc'],
  ['l4-fvm', 'l5-semi'],
  ['l4-fvm', 'l5-mfg'],
  ['l4-fvm', 'l5-hpc'],
  ['l4-fft', 'l5-med'],
  ['l4-fft', 'l5-semi'],
  ['l4-fft', 'l5-ai'],
  ['l4-fft', 'l5-mat'],
  ['l4-integrator', 'l5-robotics'],
  ['l4-integrator', 'l5-mat'],
  ['l4-fem', 'l5-mfg'],
  ['l4-fem', 'l5-robotics'],
  ['l4-fem', 'l5-ai'],
  ['l4-uq', 'l5-ai'],
  ['l4-uq', 'l5-med'],
  ['l4-uq', 'l5-semi'],
  ['l4-uq', 'l5-hpc'],
]

// ---------------------------------------------------------------------------
// Derived lookups
// ---------------------------------------------------------------------------
export const ALL_CARDS: BoardCard[] = LAYERS.flatMap((l) => l.cards)
export const CARD_BY_ID: Record<string, BoardCard> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]))
export const LAYER_BY_ID: Record<LayerId, BoardLayer> = Object.fromEntries(
  LAYERS.map((l) => [l.id, l])
) as Record<LayerId, BoardLayer>

export const DEFAULT_CARD_ID = 'l2-eigen'

const buildAdj = (dir: 0 | 1) => {
  const m: Record<string, string[]> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, [] as string[]]))
  for (const e of EDGES) m[e[dir]].push(e[1 - dir])
  return m
}
/** Direct children (next layer down). */
export const DOWNSTREAM = buildAdj(0)
/** Direct parents (previous layer up). */
export const UPSTREAM = buildAdj(1)

const walk = (start: string, adj: Record<string, string[]>) => {
  const seen = new Set<string>()
  const stack = [...(adj[start] ?? [])]
  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    seen.add(id)
    stack.push(...adj[id])
  }
  return seen
}

export interface Lineage {
  upstream: Set<string>
  downstream: Set<string>
  /** All cards in the chain, including the seeds. */
  nodes: Set<string>
  /** Edge keys `from>to` on the upstream side. */
  upEdges: Set<string>
  downEdges: Set<string>
}

export const edgeKey = (from: string, to: string) => `${from}>${to}`

/** Full transitive upstream (to L1) + downstream (to L5) closure of a set of seed cards. */
export function computeLineage(seeds: Iterable<string>): Lineage {
  const seedSet = new Set(seeds)
  const upstream = new Set<string>()
  const downstream = new Set<string>()
  for (const s of seedSet) {
    walk(s, UPSTREAM).forEach((id) => upstream.add(id))
    walk(s, DOWNSTREAM).forEach((id) => downstream.add(id))
  }
  const upSide = new Set([...seedSet, ...upstream])
  const downSide = new Set([...seedSet, ...downstream])
  const upEdges = new Set<string>()
  const downEdges = new Set<string>()
  // An edge a->b whose head b is a seed-or-ancestor lies on a path into a seed
  // (a->b->...->seed); symmetrically for the descendant side.
  for (const [a, b] of EDGES) {
    const k = edgeKey(a, b)
    if (upSide.has(a) && upSide.has(b)) upEdges.add(k)
    else if (downSide.has(a) && downSide.has(b)) downEdges.add(k)
  }
  return {
    upstream,
    downstream,
    nodes: new Set([...seedSet, ...upstream, ...downstream]),
    upEdges,
    downEdges,
  }
}
