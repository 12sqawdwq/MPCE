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
// 5 layers, top -> bottom  (4 / 8 / 7 / 8 / 7 = 34 cards)
// Every one of the 67 Knowledge Graph nodes in 06_knowledge_graph/*.md is
// claimed by at least one card; L1 cards name the foundational nodes of each
// macro field. `scripts/gen_panorama_svg.py` parses this file, so keep the
// `id / title / subtitle / kgNodes` fields on single lines.
// ---------------------------------------------------------------------------
export const LAYERS: BoardLayer[] = [
  {
    id: 'L1',
    index: 1,
    title: '宏观数学基础',
    subtitle: 'Macro Math',
    color: '#334155',
    tint: '#f1f5f9',
    border: '#94a3b8',
    cards: [
      {
        id: 'l1-algebra',
        layer: 'L1',
        title: '线性代数与算子结构',
        subtitle: '向量空间 · 内积 · 线性算子',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/linear_algebra/curriculum.md',
        relatedDocs: [D.eigen, D.lls, D.mathReadme, D.kgMath],
        kgNodes: ['MATH-LA-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l1-analysis',
        layer: 'L1',
        title: '微积分、场论与泛函分析',
        subtitle: '多元场论 · 微分方程 · Hilbert/Sobolev',
        phase: 'Phase I–II',
        primaryDoc: '01_mathematics/calculus/curriculum.md',
        relatedDocs: [D.deCurr, D.heat, D.mathReadme, D.kgMath],
        kgNodes: ['MATH-VC-01', 'MATH-FA-04'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l1-opt',
        layer: 'L1',
        title: '变分原理与最优化',
        subtitle: '泛函极值 · 凸分析 · 非凸优化',
        phase: 'Phase II / VI',
        primaryDoc: '06_knowledge_graph/mathematics_graph.md',
        relatedDocs: [{ ...D.lls, label: '线性最小二乘（凸优化特例）' }, D.prereq, D.mathReadme],
        kgNodes: ['MATH-VAR-01', 'MATH-OPT-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l1-prob-na',
        layer: 'L1',
        title: '概率统计与数值分析理论',
        subtitle: '随机建模 · 统计推断 · 误差与收敛理论',
        phase: 'Phase I / V',
        primaryDoc: '01_mathematics/probability_statistics/curriculum.md',
        relatedDocs: [D.naCurr, D.mathReadme, D.kgMath],
        kgNodes: ['MATH-PR-01', 'MATH-NA-01'],
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
        id: 'l2-la',
        layer: 'L2',
        title: '线性空间、矩阵分解与谱理论',
        subtitle: '特征值 · 谱定理 · LU / QR / SVD',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/linear_algebra/eigenvalue_problems.md',
        relatedDocs: [D.laCurr, D.lls, D.exp01, D.exp02],
        kgNodes: ['MATH-LA-01', 'MATH-LA-02', 'MATH-LA-03'],
        hasDerivation: true,
        hasExperiment: true,
      },
      {
        id: 'l2-vc',
        layer: 'L2',
        title: '向量微积分与积分定理',
        subtitle: '梯度 / 散度 / 旋度 · Gauss / Stokes / Green',
        phase: 'Phase I',
        primaryDoc: '01_mathematics/calculus/curriculum.md',
        relatedDocs: [{ ...D.heat, label: '热传导方程（散度定理应用）' }, D.kgMath],
        kgNodes: ['MATH-VC-01', 'MATH-VC-02'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l2-ode',
        layer: 'L2',
        title: 'ODE 与动力系统稳定性',
        subtitle: '线性系统 · 相平面 · Lyapunov 稳定与分岔',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/curriculum.md',
        relatedDocs: [D.exp03, D.kgMath],
        kgNodes: ['MATH-DE-01', 'MATH-DE-02'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l2-pde',
        layer: 'L2',
        title: '偏微分方程与格林函数',
        subtitle: '椭圆 / 抛物 / 双曲 · Sturm–Liouville · 格林函数',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/heat_equation.md',
        relatedDocs: [D.wave, D.deCurr, D.exp06, D.kgMath],
        kgNodes: ['MATH-DE-03', 'MATH-FA-02', 'MATH-FA-03'],
        hasDerivation: true,
        hasExperiment: true,
      },
      {
        id: 'l2-fa',
        layer: 'L2',
        title: '傅里叶分析与泛函弱形式',
        subtitle: 'Fourier 变换 · Hilbert / Sobolev · 弱形式',
        phase: 'Phase II',
        primaryDoc: '01_mathematics/differential_equations/fourier_transform.md',
        relatedDocs: [D.deCurr, D.kgMath],
        kgNodes: ['MATH-FA-01', 'MATH-FA-04'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l2-var-opt',
        layer: 'L2',
        title: '变分法与凸 / 非凸优化',
        subtitle: 'Euler–Lagrange · KKT / 对偶 · 随机梯度',
        phase: 'Phase II / VI',
        primaryDoc: '06_knowledge_graph/mathematics_graph.md',
        relatedDocs: [{ ...D.lls, label: '线性最小二乘（凸优化特例）' }, D.prereq],
        kgNodes: ['MATH-VAR-01', 'MATH-OPT-01', 'MATH-OPT-02'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l2-prob',
        layer: 'L2',
        title: '概率论、贝叶斯与随机过程',
        subtitle: '概率分布 · 贝叶斯推断 · 马尔可夫过程 / SDE',
        phase: 'Phase I / VI',
        primaryDoc: '01_mathematics/probability_statistics/curriculum.md',
        relatedDocs: [D.kgMath],
        kgNodes: ['MATH-PR-01', 'MATH-PR-02', 'MATH-PR-03'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l2-na',
        layer: 'L2',
        title: '数值分析基础理论',
        subtitle: '浮点与条件数 · 插值积分 · 相容/稳定/收敛',
        phase: 'Phase V',
        primaryDoc: '01_mathematics/numerical_analysis/curriculum.md',
        relatedDocs: [D.exp01, D.exp03, D.kgMath],
        kgNodes: ['MATH-NA-01', 'MATH-NA-02', 'MATH-NA-03'],
        hasDerivation: false,
        hasExperiment: true,
      },
    ],
  },
  {
    id: 'L3',
    index: 3,
    title: '物理方法与控制方程',
    subtitle: 'Physical Models',
    color: '#7C3AED',
    tint: '#f5f3ff',
    border: '#c4b5fd',
    cards: [
      {
        id: 'l3-cm',
        layer: 'L3',
        title: '经典与分析力学',
        subtitle: '牛顿 · Lagrange / Hamilton · 守恒律与 Noether',
        phase: 'Phase III',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys, D.exp03],
        kgNodes: ['PHYS-CM-01', 'PHYS-CM-02', 'PHYS-CM-03', 'PHYS-CL-01'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l3-em',
        layer: 'L3',
        title: '电磁场与波动理论',
        subtitle: 'Maxwell 方程组 · 电磁波色散与辐射',
        phase: 'Phase III',
        primaryDoc: '01_mathematics/differential_equations/wave_equation.md',
        relatedDocs: [D.physReadme, D.fourier, D.kgPhys],
        kgNodes: ['PHYS-EM-01'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l3-el',
        layer: 'L3',
        title: '连续介质与线弹性力学',
        subtitle: '应力–应变本构 · 平衡方程 · 结构振动模态',
        phase: 'Phase III–IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys, { ...D.eigen, label: '特征值与谱定理（振动模态）' }],
        kgNodes: ['PHYS-EL-01'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l3-fl-tr',
        layer: 'L3',
        title: '流体力学与传热传质',
        subtitle: 'Navier–Stokes · 守恒律 · 热传导与对流扩散',
        phase: 'Phase II–IV',
        primaryDoc: '01_mathematics/differential_equations/heat_equation.md',
        relatedDocs: [D.physReadme, D.exp06, D.kgPhys],
        kgNodes: ['PHYS-FL-01', 'PHYS-TR-01'],
        hasDerivation: true,
        hasExperiment: true,
      },
      {
        id: 'l3-td-sm',
        layer: 'L3',
        title: '热力学与统计物理',
        subtitle: '热力学势 · 配分函数 · 玻尔兹曼输运方程',
        phase: 'Phase IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys],
        kgNodes: ['PHYS-TD-01', 'PHYS-SM-01', 'PHYS-SM-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l3-qm',
        layer: 'L3',
        title: '量子力学与电子结构',
        subtitle: '薛定谔方程 · 密度泛函理论 DFT',
        phase: 'Phase III–IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys, { ...D.eigen, label: '特征值与谱定理（Ĥψ = Eψ）' }],
        kgNodes: ['PHYS-QM-01', 'PHYS-QM-02'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l3-ss',
        layer: 'L3',
        title: '固体物理与半导体器件物理',
        subtitle: '能带 / 布洛赫定理 · 费米–狄拉克 · Poisson–漂移–扩散',
        phase: 'Phase IV',
        primaryDoc: '02_physics/README.md',
        relatedDocs: [D.kgPhys, D.fourier],
        kgNodes: ['PHYS-SS-01', 'PHYS-SS-02', 'PHYS-SS-03'],
        hasDerivation: false,
        hasExperiment: false,
      },
    ],
  },
  {
    id: 'L4',
    index: 4,
    title: '物理驱动的数值计算与工程方法',
    subtitle: 'Computational & Engineering Methods',
    color: '#0F766E',
    tint: '#f0fdfa',
    border: '#5eead4',
    cards: [
      {
        id: 'l4-linsolve',
        layer: 'L4',
        title: '直接与迭代线性求解',
        subtitle: 'LU / Cholesky · Krylov CG / GMRES · 预条件 / 多重网格',
        phase: 'Phase V',
        primaryDoc: '05_experiments/linear_algebra/01_matrix_decomposition/README.md',
        relatedDocs: [D.naCurr, D.compReadme, D.kgComp],
        kgNodes: ['COMP-01', 'COMP-02'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l4-eigen',
        layer: 'L4',
        title: '数值特征值与低秩求解',
        subtitle: 'Lanczos / Arnoldi / LOBPCG · 截断 SVD',
        phase: 'Phase V',
        primaryDoc: '05_experiments/linear_algebra/02_pca_svd_compression/README.md',
        relatedDocs: [D.eigen, D.naCurr, D.kgComp],
        kgNodes: ['COMP-03'],
        hasDerivation: true,
        hasExperiment: true,
      },
      {
        id: 'l4-mesh',
        layer: 'L4',
        title: '网格离散 PDE 求解器',
        subtitle: '有限差分 FDM · 有限元 FEM · 有限体积 FVM',
        phase: 'Phase II / V',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [D.exp06, D.software, D.kgComp],
        kgNodes: ['COMP-06', 'COMP-07', 'COMP-08'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l4-spectral',
        layer: 'L4',
        title: 'FFT 与谱方法',
        subtitle: '快速傅里叶变换 · 伪谱法 · 频域展开',
        phase: 'Phase V',
        primaryDoc: '01_mathematics/differential_equations/fourier_transform.md',
        relatedDocs: [D.compReadme, D.papers, D.kgComp],
        kgNodes: ['COMP-04'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l4-ode-int',
        layer: 'L4',
        title: '常微分方程时间积分',
        subtitle: 'Runge–Kutta · 刚性隐式 BDF · 保能量辛积分',
        phase: 'Phase II / V',
        primaryDoc: '05_experiments/dynamics/03_numerical_ode_solver/README.md',
        relatedDocs: [D.naCurr, D.expReadme, D.kgComp],
        kgNodes: ['COMP-05'],
        hasDerivation: false,
        hasExperiment: true,
      },
      {
        id: 'l4-opt-ctrl',
        layer: 'L4',
        title: '非线性求解、优化与控制估计',
        subtitle: 'Newton / L-BFGS · LQR / MPC · Kalman 滤波',
        phase: 'Phase VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [D.kgComp, D.software],
        kgNodes: ['COMP-10', 'COMP-15'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l4-mc-inv',
        layer: 'L4',
        title: '蒙特卡洛与反问题正则化',
        subtitle: 'MC / MCMC 采样 · Tikhonov 正则 · 伴随反演',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [{ ...D.lls, label: '线性最小二乘（Tikhonov 正则基础）' }, D.prCurr, D.kgComp],
        kgNodes: ['COMP-09', 'COMP-11'],
        hasDerivation: true,
        hasExperiment: false,
      },
      {
        id: 'l4-sciml-hpc',
        layer: 'L4',
        title: '科学机器学习与 GPU 高性能计算',
        subtitle: 'PINNs · 神经算子 FNO · GPU 并行与 Roofline',
        phase: 'Phase V–VI',
        primaryDoc: '03_computational_methods/README.md',
        relatedDocs: [D.papers, D.software, D.kgComp],
        kgNodes: ['COMP-12', 'COMP-13', 'COMP-14'],
        hasDerivation: false,
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
        subtitle: 'TCAD 器件与工艺 · 光学光刻 · 良率 UQ',
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
        title: '人工智能与数据科学',
        subtitle: 'PCA / POD 低秩 · 神经算子 · 生成与统计建模',
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
        subtitle: '机械臂动力学与控制 · SLAM 状态估计 · 轨迹优化',
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
        subtitle: 'CFD 仿真 · 热–力耦合 · 结构拓扑优化',
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
        subtitle: 'DFT 能带计算 · 分子动力学 MD',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.eigen],
        kgNodes: ['ENG-MAT-01', 'ENG-MAT-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l5-hpc',
        layer: 'L5',
        title: '高性能计算与体系结构',
        subtitle: '大规模 PDE 仿真 · GPU 并行 · 代理模型',
        phase: 'Phase VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.software],
        kgNodes: ['ENG-HPC-01', 'ENG-HPC-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
      {
        id: 'l5-med',
        layer: 'L5',
        title: '医学成像与生物医学工程',
        subtitle: 'CT / MRI 图像重建 · 正则化反演',
        phase: 'Phase VI–VII',
        primaryDoc: '04_engineering_applications/README.md',
        relatedDocs: [D.kgEng, D.fourier],
        kgNodes: ['ENG-MED-01', 'ENG-MED-02'],
        hasDerivation: false,
        hasExperiment: false,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Cross-layer directed edges (upper layer -> next layer down).
// Each edge cites the KG relation that grounds it: "A ⊢ B" means A is listed in
// B's **Prerequisites**; "A ~ B" means the two nodes cross-reference each other
// in the Related Physics / Computational Methods / Engineering Applications
// fields. L1 -> L2 edges follow the macro field's own sub-nodes plus
// cross-field prerequisites.
// ---------------------------------------------------------------------------
export const EDGES: Array<[string, string]> = [
  // L1 -> L2
  ['l1-algebra', 'l2-la'], // LA-01 ⊢ LA-02, LA-03
  ['l1-algebra', 'l2-vc'], // LA-01 ⊢ VC-01
  ['l1-algebra', 'l2-ode'], // LA-02 ⊢ DE-01, DE-02
  ['l1-algebra', 'l2-fa'], // LA-01 ⊢ FA-01, FA-04
  ['l1-algebra', 'l2-var-opt'], // LA-01, LA-03 ⊢ OPT-01
  ['l1-algebra', 'l2-na'], // LA-01, LA-03 ⊢ NA-01, NA-02
  ['l1-analysis', 'l2-vc'], // VC-01 ⊢ VC-02
  ['l1-analysis', 'l2-ode'], // DE-01 ⊢ DE-02
  ['l1-analysis', 'l2-pde'], // VC-01, VC-02, DE-01 ⊢ DE-03; DE-03 ⊢ FA-02
  ['l1-analysis', 'l2-fa'], // VC-02 ⊢ FA-04
  ['l1-analysis', 'l2-var-opt'], // VC-02, DE-01 ⊢ VAR-01
  ['l1-opt', 'l2-var-opt'], // VAR-01, OPT-01 ⊢ OPT-02
  ['l1-prob-na', 'l2-prob'], // PR-01 ⊢ PR-02, PR-03
  ['l1-prob-na', 'l2-na'], // NA-01 ⊢ NA-03
  ['l1-prob-na', 'l2-var-opt'], // PR-01 ⊢ OPT-02
  // L2 -> L3
  ['l2-la', 'l3-cm'], // LA-02 ~ CM-02 (normal modes)
  ['l2-la', 'l3-el'], // LA-02 ⊢ EL-01
  ['l2-la', 'l3-qm'], // LA-02 ⊢ QM-01, QM-02
  ['l2-la', 'l3-ss'], // LA-02 ~ SS-01 (band energies)
  ['l2-vc', 'l3-cm'], // VC-01 ⊢ CM-01; VC-02 ⊢ CL-01
  ['l2-vc', 'l3-em'], // VC-01, VC-02 ⊢ EM-01
  ['l2-vc', 'l3-el'], // VC-01 ⊢ EL-01
  ['l2-vc', 'l3-fl-tr'], // VC-01 ⊢ FL-01; VC-02 ⊢ TR-01
  ['l2-vc', 'l3-td-sm'], // VC-01 ⊢ TD-01
  ['l2-ode', 'l3-cm'], // DE-01 ⊢ CM-01, CM-03
  ['l2-ode', 'l3-fl-tr'], // DE-02 ~ FL-01 (stability, transition)
  ['l2-pde', 'l3-em'], // DE-03, FA-02 ~ EM-01
  ['l2-pde', 'l3-el'], // DE-03, FA-03 ~ EL-01
  ['l2-pde', 'l3-fl-tr'], // DE-03 ⊢ FL-01, TR-01
  ['l2-pde', 'l3-td-sm'], // DE-03 ⊢ SM-02
  ['l2-pde', 'l3-qm'], // DE-03 ⊢ QM-01
  ['l2-fa', 'l3-qm'], // FA-01, FA-04 ~ QM-01 (Hilbert state space)
  ['l2-fa', 'l3-ss'], // FA-01 ⊢ SS-01
  ['l2-var-opt', 'l3-cm'], // VAR-01 ⊢ CM-02, CL-01
  ['l2-var-opt', 'l3-td-sm'], // VAR-01, OPT-01 ~ TD-01, SM-01 (extremum principles)
  ['l2-var-opt', 'l3-qm'], // VAR-01 ⊢ QM-02
  ['l2-prob', 'l3-td-sm'], // PR-01 ⊢ SM-01
  ['l2-prob', 'l3-ss'], // PR-01, PR-03 ~ SS-02, SS-03
  ['l2-na', 'l3-em'], // NA-03 ~ EM-01 (CFL / Yee stability)
  ['l2-na', 'l3-fl-tr'], // NA-03 ~ FL-01 (CFL / upwind stability)
  // L3 -> L4
  ['l3-cm', 'l4-eigen'], // CM-02 ~ COMP-03 (normal modes)
  ['l3-cm', 'l4-mesh'], // CL-01 ⊢ COMP-08
  ['l3-cm', 'l4-ode-int'], // CM-01..03 ~ COMP-05
  ['l3-em', 'l4-linsolve'], // EM-01 ~ COMP-02
  ['l3-em', 'l4-mesh'], // EM-01 ~ COMP-06, COMP-07
  ['l3-em', 'l4-spectral'], // EM-01 ~ COMP-04
  ['l3-el', 'l4-linsolve'], // EL-01 ~ COMP-01, COMP-02
  ['l3-el', 'l4-eigen'], // EL-01 ~ COMP-03
  ['l3-el', 'l4-mesh'], // EL-01 ~ COMP-07
  ['l3-fl-tr', 'l4-linsolve'], // FL-01 ~ COMP-02
  ['l3-fl-tr', 'l4-mesh'], // FL-01, TR-01 ~ COMP-06/07/08
  ['l3-fl-tr', 'l4-spectral'], // FL-01 ~ COMP-04
  ['l3-fl-tr', 'l4-sciml-hpc'], // FL-01, TR-01 ~ COMP-12, COMP-13
  ['l3-td-sm', 'l4-ode-int'], // SM-01 ~ COMP-05 (MD)
  ['l3-td-sm', 'l4-mc-inv'], // TD-01, SM-01, SM-02 ~ COMP-09
  ['l3-qm', 'l4-eigen'], // QM-01, QM-02 ~ COMP-03
  ['l3-qm', 'l4-mesh'], // QM-01 ~ COMP-06
  ['l3-qm', 'l4-spectral'], // QM-01, QM-02 ~ COMP-04
  ['l3-qm', 'l4-opt-ctrl'], // QM-02 ~ COMP-15 (SCF)
  ['l3-ss', 'l4-linsolve'], // SS-03 ~ COMP-01, COMP-02
  ['l3-ss', 'l4-eigen'], // SS-01 ~ COMP-03
  ['l3-ss', 'l4-mesh'], // SS-03 ~ COMP-08 (Scharfetter–Gummel)
  ['l3-ss', 'l4-spectral'], // SS-01 ~ COMP-04
  ['l3-ss', 'l4-opt-ctrl'], // SS-02, SS-03 ~ COMP-15 (Newton / Gummel)
  // L4 -> L5
  ['l4-linsolve', 'l5-semi'], // COMP-01 ~ SEMI-01, SEMI-02
  ['l4-linsolve', 'l5-mfg'], // COMP-01, COMP-02 ~ MFG-02
  ['l4-linsolve', 'l5-hpc'], // COMP-02 ⊢ HPC-02
  ['l4-linsolve', 'l5-med'], // COMP-02 ~ MED-02
  ['l4-eigen', 'l5-ai'], // COMP-03 ~ AI-02 (PCA)
  ['l4-eigen', 'l5-mfg'], // COMP-03 ~ MFG-02 (modal analysis)
  ['l4-eigen', 'l5-mat'], // COMP-03 ⊢ MAT-02
  ['l4-mesh', 'l5-semi'], // COMP-08 ⊢ SEMI-02
  ['l4-mesh', 'l5-mfg'], // COMP-07 ⊢ MFG-02
  ['l4-mesh', 'l5-hpc'], // COMP-07 ⊢ HPC-02
  ['l4-mesh', 'l5-med'], // COMP-07 ~ MED-01
  ['l4-spectral', 'l5-mat'], // COMP-04 ~ MAT-02 (plane waves)
  ['l4-spectral', 'l5-hpc'], // COMP-04 ~ HPC-01
  ['l4-spectral', 'l5-med'], // COMP-04 ⊢ MED-02
  ['l4-ode-int', 'l5-semi'], // COMP-05 ~ SEMI-01
  ['l4-ode-int', 'l5-robotics'], // COMP-05 ~ ROB-01, ROB-02
  ['l4-ode-int', 'l5-mat'], // COMP-05 ⊢ MAT-02
  ['l4-opt-ctrl', 'l5-semi'], // COMP-15 ⊢ SEMI-02
  ['l4-opt-ctrl', 'l5-ai'], // COMP-15 ~ AI-01
  ['l4-opt-ctrl', 'l5-robotics'], // COMP-10 ⊢ ROB-03
  ['l4-opt-ctrl', 'l5-mfg'], // COMP-10, COMP-15 ~ MFG-01
  ['l4-mc-inv', 'l5-semi'], // COMP-09 ~ SEMI-02; COMP-11 ~ SEMI-01
  ['l4-mc-inv', 'l5-ai'], // COMP-09 ~ AI-01
  ['l4-mc-inv', 'l5-mat'], // COMP-09 ~ MAT-01, MAT-02
  ['l4-mc-inv', 'l5-med'], // COMP-11 ⊢ MED-01, MED-02
  ['l4-sciml-hpc', 'l5-ai'], // COMP-12/13/14 ~ AI-01
  ['l4-sciml-hpc', 'l5-mfg'], // COMP-12, COMP-13 ~ MFG-01, MFG-02
  ['l4-sciml-hpc', 'l5-hpc'], // COMP-14 ⊢ HPC-01, HPC-02
]

// ---------------------------------------------------------------------------
// Derived lookups
// ---------------------------------------------------------------------------
export const ALL_CARDS: BoardCard[] = LAYERS.flatMap((l) => l.cards)
export const CARD_BY_ID: Record<string, BoardCard> = Object.fromEntries(ALL_CARDS.map((c) => [c.id, c]))
export const LAYER_BY_ID: Record<LayerId, BoardLayer> = Object.fromEntries(
  LAYERS.map((l) => [l.id, l])
) as Record<LayerId, BoardLayer>

export const DEFAULT_CARD_ID = 'l2-la'

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
