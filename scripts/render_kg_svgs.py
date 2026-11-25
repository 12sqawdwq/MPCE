"""Render the 5 MPCE Knowledge Graph SVGs in the unified layered-swimlane style.

Usage:
    python scripts/render_kg_svgs.py
"""
from __future__ import annotations

from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "diagrams"

PALETTE = {
    "slate": ("#64748b", "#f8fafc", "#94a3b8", "#475569"),
    "blue": ("#2563eb", "#eff6ff", "#3b82f6", "#2563eb"),
    "purple": ("#7c3aed", "#f5f3ff", "#8b5cf6", "#7c3aed"),
    "green": ("#2e7d32", "#f0fdf4", "#22c55e", "#16a34a"),
    "teal": ("#1f7a7a", "#f0fdfa", "#14b8a6", "#0d9488"),
    "amber": ("#d97706", "#fffbeb", "#f59e0b", "#d97706"),
    "crimson": ("#dc2626", "#fef2f2", "#ef4444", "#dc2626"),
}

FONT = "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"


def _svg_header(w: int, h: int, aria: str) -> list[str]:
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{escape(aria)}">',
        "  <defs>",
        '    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">',
        '      <path d="M0,0 L10,5 L0,10 z" fill="#475569"/>',
        "    </marker>",
        "    <style>",
        f"      text {{ font-family: {FONT}; }}",
        "      .ht { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: middle; }",
        "      .hs { font-size: 11px; fill: #ffffff; fill-opacity: 0.9; text-anchor: middle; }",
        "      .cid { font-size: 11px; font-weight: 700; text-anchor: middle; }",
        "      .ct { font-size: 13px; font-weight: 700; fill: #111827; text-anchor: middle; }",
        "      .cs { font-size: 11px; fill: #475569; text-anchor: middle; }",
        "      .lb { font-size: 11px; fill: #475569; text-anchor: middle; }",
        "      .card { fill: #ffffff; stroke-width: 1.3; }",
        "      .flow { stroke: #475569; stroke-width: 1.7; fill: none; marker-end: url(#arr); }",
        "    </style>",
        "  </defs>",
        f'  <rect width="{w}" height="{h}" fill="#ffffff"/>',
    ]


def render_bands(
    filename: str,
    aria: str,
    bands: list[tuple[str, str, str, list[tuple[str, str, str]]]],
    *,
    width: int = 1280,
    left_w: int = 155,
    band_h: int = 104,
    gap_y: int = 24,
    pillar_chars: list[str] | None = None,
    chain_arrows: bool = False,
) -> None:
    """Render horizontal layered bands with cards; optionally add vertical pillar or left-to-right chain arrows."""
    pad_x = 20
    pad_y = 22
    pillar_w = 56 if pillar_chars else 0
    band_w = width - 2 * pad_x - (pillar_w + 18 if pillar_chars else 0)
    total_h = pad_y * 2 + len(bands) * band_h + (len(bands) - 1) * gap_y

    lines = _svg_header(width, total_h, aria)

    for idx, (color_key, title, sub, cards) in enumerate(bands):
        hdr, fill, bdr, card_bdr = PALETTE[color_key]
        y = pad_y + idx * (band_h + gap_y)
        lines.append(f'  <rect x="{pad_x}" y="{y}" width="{band_w}" height="{band_h}" rx="12" fill="{fill}" stroke="{bdr}" stroke-width="1.5"/>')
        lines.append(f'  <rect x="{pad_x}" y="{y}" width="{left_w}" height="{band_h}" rx="10" fill="{hdr}"/>')
        lines.append(f'  <text class="ht" x="{pad_x + left_w / 2:.1f}" y="{y + band_h / 2 - 4:.1f}">{escape(title)}</text>')
        lines.append(f'  <text class="hs" x="{pad_x + left_w / 2:.1f}" y="{y + band_h / 2 + 16:.1f}">{escape(sub)}</text>')

        n = len(cards)
        inner_x = pad_x + left_w + 16
        inner_w = band_w - left_w - 32
        card_gap = 26 if chain_arrows else 14
        card_w = (inner_w - card_gap * (n - 1)) / n
        card_h = band_h - 24
        card_y = y + 12

        for j, (cid, ctitle, csub) in enumerate(cards):
            cx = inner_x + j * (card_w + card_gap)
            mx = cx + card_w / 2
            lines.append(f'  <rect class="card" x="{cx:.1f}" y="{card_y}" width="{card_w:.1f}" height="{card_h}" rx="8" stroke="{card_bdr}"/>')
            if cid:
                lines.append(f'  <text class="cid" x="{mx:.1f}" y="{card_y + 22}" fill="{hdr}">{escape(cid)}</text>')
                lines.append(f'  <text class="ct" x="{mx:.1f}" y="{card_y + 44}">{escape(ctitle)}</text>')
                lines.append(f'  <text class="cs" x="{mx:.1f}" y="{card_y + 64}">{escape(csub)}</text>')
            else:
                lines.append(f'  <text class="ct" x="{mx:.1f}" y="{card_y + 34}">{escape(ctitle)}</text>')
                lines.append(f'  <text class="cs" x="{mx:.1f}" y="{card_y + 56}">{escape(csub)}</text>')

            if chain_arrows and j < n - 1:
                ax1 = cx + card_w + 2
                ax2 = cx + card_w + card_gap - 3
                ay = card_y + card_h / 2
                lines.append(f'  <line class="flow" x1="{ax1:.1f}" y1="{ay:.1f}" x2="{ax2:.1f}" y2="{ay:.1f}"/>')

        if not chain_arrows and idx < len(bands) - 1:
            ax = pad_x + left_w + inner_w / 2
            lines.append(f'  <line class="flow" x1="{ax:.1f}" y1="{y + band_h}" x2="{ax:.1f}" y2="{y + band_h + gap_y - 2}"/>')

    if pillar_chars:
        px = width - pad_x - pillar_w
        ph = total_h - 2 * pad_y
        lines.append(f'  <rect x="{px}" y="{pad_y}" width="{pillar_w}" height="{ph}" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>')
        step = min(34, (ph - 40) / max(len(pillar_chars), 1))
        start_y = pad_y + (ph - step * (len(pillar_chars) - 1)) / 2 + 6
        for k, ch in enumerate(pillar_chars):
            lines.append(f'  <text x="{px + pillar_w / 2:.1f}" y="{start_y + k * step:.1f}" font-size="18" font-weight="700" fill="#b91c1c" text-anchor="middle">{escape(ch)}</text>')

    lines.append("</svg>")
    out_path = OUT_DIR / filename
    svg_text = "\n".join(lines) + "\n"
    ET.fromstring(svg_text)  # validate XML
    out_path.write_text(svg_text, encoding="utf-8")
    print(f"Wrote {filename} ({width}x{total_h}) OK")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Seven unifying threads
    render_bands(
        "kg_seven_threads.svg",
        "MPCE 七条跨学科统一主线",
        [
            ("blue", "主线 1 · 特征值", "Linear Algebra", [
                ("MATH-LA-02", "谱定理与特征值", "Spectral Theorem"),
                ("PHYS-QM-01 / CM-02", "薛定谔与简正模态", "Hψ=Eψ · Kx=λMx"),
                ("COMP-03", "数值特征值求解", "Lanczos / LOBPCG"),
                ("ENG-MAT-02 / AI-02", "DFT 与 PCA 降维", "前沿: 随机特征分解"),
            ]),
            ("teal", "主线 2 · 守恒律", "Vector Calculus", [
                ("MATH-VC-02", "散度与积分定理", "Gauss / Stokes"),
                ("PHYS-CL-01 / SS-03", "守恒律与输运", "∂ₜu + ∇·F = s"),
                ("COMP-08", "有限体积离散", "FVM / SG 通量"),
                ("ENG-SEMI-02 / HPC-02", "TCAD 与 CFD", "前沿: 保结构离散"),
            ]),
            ("purple", "主线 3 · 傅里叶", "Spectral Analysis", [
                ("MATH-FA-01", "傅里叶变换", "卷积与 Parseval"),
                ("PHYS-SS-01 / EM-01", "布洛赫波与电磁场", "k 空间采样模型"),
                ("COMP-04 / 13", "FFT 与神经算子", "FFT / FNO"),
                ("ENG-MED-02 / MAT-02", "MRI/CT 与平面波", "前沿: 频域算子学习"),
            ]),
            ("green", "主线 4 · 动力系统", "Differential Eq.", [
                ("MATH-DE-01 / 02", "ODE 与稳定性", "Lyapunov 理论"),
                ("PHYS-CM-02 / 03", "拉格朗日动力学", "Mq̈ + Cq̇ + g = τ"),
                ("COMP-05 / 10", "时间积分与滤波", "辛积分 / Kalman"),
                ("ENG-ROB-02 / 03", "机械臂控制与 SLAM", "前沿: 稳定证书学习控制"),
            ]),
            ("amber", "主线 5 · 变分优化", "Variational", [
                ("MATH-VAR-01 / FA-04", "变分法与弱形式", "Euler–Lagrange"),
                ("PHYS-EL-01 / QM-02", "最小势能与泛函", "a(u,v)=ℓ(v) · E[n]"),
                ("COMP-07 / 15", "有限元与优化器", "FEM / Newton / BFGS"),
                ("ENG-MFG-01 / 02", "热力耦合与拓扑优化", "前沿: 变分 SciML"),
            ]),
            ("slate", "主线 6 · 概率统计", "Stochastic", [
                ("MATH-PR-02 / 03", "贝叶斯与 SDE", "后验推断与随机过程"),
                ("PHYS-SM-01 / SS-02", "玻尔兹曼与费米统计", "p ∝ exp(-E/kT)"),
                ("COMP-09 / 11", "MCMC 与反问题", "采样与正则化"),
                ("ENG-AI-01 / MAT-02", "生成模型与分子模拟", "前沿: 扩散模型与 UQ"),
            ]),
            ("blue", "主线 7 · 科学计算", "Numerical LA", [
                ("MATH-NA-01 / 03", "条件数与 Lax 等价", "稳定性与收敛性"),
                ("PHYS-EL / FL 离散", "亿级稀疏线性系统", "Ku = f"),
                ("COMP-02 / 14", "多重网格与 GPU", "Krylov / CUDA"),
                ("ENG-HPC-01 / 02", "体系结构与超算", "前沿: 混合精度求解"),
            ]),
        ],
        width=1320,
        left_w=160,
        band_h=96,
        gap_y=16,
        chain_arrows=True,
        pillar_chars=list("原理到前沿的统一主线"),
    )

    # 2. Mathematics layer (21 nodes)
    render_bands(
        "kg_mathematics.svg",
        "数学层知识图谱（21 个节点）",
        [
            ("blue", "线性代数", "MATH-LA · 3 节点", [
                ("MATH-LA-01", "向量空间与内积", "Linear Maps & Inner Prod."),
                ("MATH-LA-02", "特征值与谱定理", "Eigen & Spectral Thm"),
                ("MATH-LA-03", "矩阵分解与 SVD", "LU · QR · SVD · 伪逆"),
            ]),
            ("teal", "向量微积分", "MATH-VC · 2 节点", [
                ("MATH-VC-01", "梯度、散度与旋度", "Grad · Div · Curl"),
                ("MATH-VC-02", "三大积分定理", "Gauss · Stokes · Green"),
            ]),
            ("purple", "微分方程", "MATH-DE · 3 节点", [
                ("MATH-DE-01", "常微分方程与线性组", "ODE & Matrix Exp."),
                ("MATH-DE-02", "动力系统与稳定性", "Phase Plane · Lyapunov"),
                ("MATH-DE-03", "偏微分方程", "Heat · Wave · Laplace"),
            ]),
            ("green", "谱分析与变分", "MATH-FA / VAR · 5 节点", [
                ("MATH-FA-01", "傅里叶分析与变换", "Fourier & Convolution"),
                ("MATH-FA-02", "格林函数", "Green's Functions"),
                ("MATH-FA-03", "Sturm–Liouville", "本征函数展开"),
                ("MATH-FA-04", "Hilbert / Sobolev 弱形式", "Weak Formulations"),
                ("MATH-VAR-01", "变分法", "Euler–Lagrange"),
            ]),
            ("amber", "概率与优化", "MATH-PR / OPT · 5 节点", [
                ("MATH-PR-01", "概率论与随机变量", "Distributions · CLT"),
                ("MATH-PR-02", "贝叶斯推断与估计", "MLE · Posterior"),
                ("MATH-PR-03", "随机过程与 SDE", "Markov · Diffusion"),
                ("MATH-OPT-01", "凸优化与对偶", "KKT · Duality"),
                ("MATH-OPT-02", "非凸与随机梯度", "SGD · Adam"),
            ]),
            ("slate", "数值分析", "MATH-NA · 3 节点", [
                ("MATH-NA-01", "浮点、条件数与稳定性", "IEEE 754 · Backward Err."),
                ("MATH-NA-02", "插值、逼近与积分", "Quadrature · Splines"),
                ("MATH-NA-03", "离散相容与收敛性", "Lax Equivalence"),
            ]),
        ],
        width=1320,
        left_w=165,
        band_h=96,
        gap_y=20,
    )

    # 3. Physics layer (16 nodes)
    render_bands(
        "kg_physics.svg",
        "物理层知识图谱（16 个节点）",
        [
            ("blue", "经典力学", "PHYS-CM / CL · 4 节点", [
                ("PHYS-CM-01", "牛顿力学", "Newtonian Mechanics"),
                ("PHYS-CM-02", "拉格朗日力学", "Lagrangian · Normal Modes"),
                ("PHYS-CM-03", "哈密顿力学", "Hamiltonian · Symplectic"),
                ("PHYS-CL-01", "守恒律与诺特定理", "Conservation & Noether"),
            ]),
            ("teal", "场论与连续介质", "EM / FL / TR / EL · 4 节点", [
                ("PHYS-EM-01", "麦克斯韦方程组", "Maxwell & EM Waves"),
                ("PHYS-FL-01", "Navier–Stokes 方程", "Fluid Mechanics"),
                ("PHYS-TR-01", "传热与传质", "Heat & Mass Transfer"),
                ("PHYS-EL-01", "线弹性力学", "Stress · Strain · Elasticity"),
            ]),
            ("amber", "热力学与统计", "TD / SM · 3 节点", [
                ("PHYS-TD-01", "热力学", "Laws · Potentials · Entropy"),
                ("PHYS-SM-01", "统计力学与玻尔兹曼", "Partition Function"),
                ("PHYS-SM-02", "玻尔兹曼输运方程", "Boltzmann Transport"),
            ]),
            ("purple", "量子与固体半导体", "QM / SS · 5 节点", [
                ("PHYS-QM-01", "薛定谔方程", "Schrödinger Eigenproblem"),
                ("PHYS-QM-02", "密度泛函理论", "Kohn–Sham DFT"),
                ("PHYS-SS-01", "能带理论与布洛赫", "Band Theory & Bloch"),
                ("PHYS-SS-02", "费米–狄拉克统计", "Carrier Statistics"),
                ("PHYS-SS-03", "泊松–漂移–扩散", "Poisson–Drift–Diffusion"),
            ]),
        ],
        width=1320,
        left_w=165,
        band_h=100,
        gap_y=22,
    )

    # 4. Computational layer (15 nodes)
    render_bands(
        "kg_computational.svg",
        "计算层知识图谱（15 个节点）",
        [
            ("blue", "线性与谱求解", "COMP-01..04 · 4 节点", [
                ("COMP-01", "直接线性求解器", "LU · Cholesky · QR"),
                ("COMP-02", "Krylov 迭代与多重网格", "CG · GMRES · AMG"),
                ("COMP-03", "数值特征值求解器", "QR Alg · Lanczos · LOBPCG"),
                ("COMP-04", "FFT 与谱方法", "Radix-2 FFT · Collocation"),
            ]),
            ("teal", "微分方程离散", "COMP-05..08 · 4 节点", [
                ("COMP-05", "ODE 时间积分器", "RK4 · Implicit · Symplectic"),
                ("COMP-06", "有限差分法 FDM", "Stencils · CFL · von Neumann"),
                ("COMP-07", "有限元法 FEM", "Weak Form · Galerkin"),
                ("COMP-08", "有限体积法 FVM", "Fluxes · Godunov · SG"),
            ]),
            ("amber", "随机、反演与优化", "COMP-09..11, 15 · 4 节点", [
                ("COMP-09", "蒙特卡洛与 MCMC", "Metropolis · Sampling"),
                ("COMP-10", "卡尔曼滤波与状态估计", "KF · EKF · UKF"),
                ("COMP-11", "反问题与正则化", "Tikhonov · Radon · UQ"),
                ("COMP-15", "非线性求解与优化器", "Newton · Gummel · BFGS"),
            ]),
            ("purple", "SciML 与并行计算", "COMP-12..14 · 3 节点", [
                ("COMP-12", "物理信息神经网络", "PINNs · PDE Residual"),
                ("COMP-13", "神经算子", "FNO · DeepONet"),
                ("COMP-14", "GPU 与并行计算", "CUDA · Roofline · MPI"),
            ]),
        ],
        width=1320,
        left_w=165,
        band_h=100,
        gap_y=22,
    )

    # 5. Engineering layer (15 nodes across 7 domains)
    render_bands(
        "kg_engineering.svg",
        "工程应用层知识图谱（7 大领域 · 15 个节点）",
        [
            ("blue", "AI 与数据科学", "ENG-AI · 2 节点", [
                ("ENG-AI-01", "人工智能与数据科学", "Probabilistic ML · SciML"),
                ("ENG-AI-02", "降维与低秩建模", "PCA · POD · ROM"),
            ]),
            ("purple", "半导体与集成电路", "ENG-SEMI · 2 节点", [
                ("ENG-SEMI-01", "半导体与集成电路", "Device Physics · IC"),
                ("ENG-SEMI-02", "TCAD 器件与工艺建模", "Drift-Diffusion · MOSFET"),
            ]),
            ("green", "机器人与具身智能", "ENG-ROB · 3 节点", [
                ("ENG-ROB-01", "机器人学", "Embodied Intelligence"),
                ("ENG-ROB-02", "机械臂动力学与控制", "Rigid Body · LQR / MPC"),
                ("ENG-ROB-03", "状态估计与 SLAM", "Kalman · Sensor Fusion"),
            ]),
            ("amber", "制造与计算材料", "ENG-MFG / MAT · 4 节点", [
                ("ENG-MFG-01", "先进制造", "Process & Topology Opt."),
                ("ENG-MFG-02", "多物理场热–力耦合", "Thermoelastic FEM"),
                ("ENG-MAT-01", "材料科学与计算物理", "Multiscale Materials"),
                ("ENG-MAT-02", "DFT 与分子动力学", "QE · LAMMPS"),
            ]),
            ("teal", "HPC 与医学成像", "ENG-HPC / MED · 4 节点", [
                ("ENG-HPC-01", "高性能计算与体系结构", "GPU · Memory Hierarchy"),
                ("ENG-HPC-02", "大规模 PDE 仿真与代理", "Exascale · Surrogates"),
                ("ENG-MED-01", "医学成像与生物医学", "Biomedical Modeling"),
                ("ENG-MED-02", "医学图像重建", "CT · MRI k-Space"),
            ]),
        ],
        width=1320,
        left_w=165,
        band_h=96,
        gap_y=18,
        pillar_chars=list("共享底层数学与物理"),
    )

    # 6. Main README panoramic math-driven chain diagram
    render_readme_panorama()


def render_readme_panorama() -> None:
    """Render the panoramic Math -> Physics -> Computation -> Engineering map for README.md."""
    width = 1380
    pad_x = 20
    top_y = 56
    left_w = 165
    pillar_w = 56
    band_w = width - 2 * pad_x - pillar_w - 18
    band_h = 98
    gap_y = 16

    chains = [
        ("blue", "线性代数与谱", "Linear Algebra", [
            ("特征值 · 谱定理 · SVD", "Ax = λx · A = UΣVᵀ"),
            ("定态薛定谔 · 结构模态", "Ĥψ = Eψ · Kx = ω²Mx"),
            ("Lanczos / LOBPCG · 截断 SVD", "稀疏特征求解 · 低秩逼近"),
            ("DFT 能带 · 结构振动 · PCA", "材料 · 制造 · AI"),
        ]),
        ("teal", "向量微积分", "Vector Calculus", [
            ("散度 · 旋度 · Gauss / Stokes", "∇·F · ∇×F · 积分定理"),
            ("Navier–Stokes · 传热 · 漂移-扩散", "∂ₜu + ∇·F = s · Maxwell"),
            ("有限体积 FVM · SG 通量", "守恒离散 · 迎风 / 隐式格式"),
            ("TCAD 半导体器件 · CFD 仿真", "半导体 · 先进制造 · HPC"),
        ]),
        ("purple", "傅里叶与谱分析", "Fourier Analysis", [
            ("Fourier 变换 · 卷积 · 采样", "k 空间 · Parseval 定理"),
            ("电磁波传播 · 晶体布洛赫波", "色散关系 · 倒格子空间"),
            ("FFT · 谱方法 · 神经算子 FNO", "O(N log N) · 频域算子"),
            ("MRI / CT 图像重建 · 光学光刻", "医学成像 · 半导体 · 材料"),
        ]),
        ("green", "微分方程与动力", "ODE / Dynamics", [
            ("ODE 线性组 · Lyapunov 稳定", "ẋ = Ax · 相平面 · 分岔"),
            ("Lagrange / Hamilton 力学", "M(q)q̈ + Cq̇ + g = τ"),
            ("RK4 · 辛积分 · Kalman 滤波", "保能量积分 · 状态估计"),
            ("机械臂控制 · SLAM · 分子动力学", "机器人 · 计算材料"),
        ]),
        ("amber", "变分原理与优化", "Variational & Opt.", [
            ("变分法 · 弱形式 · 凸优化", "δS = 0 · KKT · 对偶理论"),
            ("最小势能 · 线弹性 · 能量泛函", "a(u,v) = ℓ(v) · E[n] → min"),
            ("有限元 FEM · LQR/MPC · PINNs", "Galerkin 组装 · 自动微分"),
            ("热-力耦合制造 · 轨迹/拓扑优化", "先进制造 · 机器人 · AI"),
        ]),
        ("slate", "概率统计与反演", "Probability & UQ", [
            ("概率论 · 贝叶斯推断 · SDE", "后验分布 · 马尔可夫过程"),
            ("玻尔兹曼 · 费米–狄拉克统计", "配分函数 · 载流子与噪声"),
            ("MCMC · Tikhonov 正则 · GPU 求解", "采样 · 反演 · 预条件 CG"),
            ("生成模型 · 医学反演 · 良率 UQ", "AI · 医学 · 半导体 · HPC"),
        ]),
    ]

    total_h = top_y + len(chains) * band_h + (len(chains) - 1) * gap_y + 24
    lines = _svg_header(width, total_h, "MPCE 全景图：数学链路驱动的物理方法、计算求解与工程实践场景")

    # Top column headers aligned with the 4 cards
    inner_x = pad_x + left_w + 16
    inner_w = band_w - left_w - 32
    card_gap = 26
    card_w = (inner_w - card_gap * 3) / 4

    col_headers = [
        ("1. 数学原理", "#2563eb", "#eff6ff"),
        ("2. 物理机制与控制方程", "#7c3aed", "#f5f3ff"),
        ("3. 数值与计算方法", "#1f7a7a", "#f0fdfa"),
        ("4. 工程实践场景", "#2e7d32", "#f0fdf4"),
    ]
    # Left header tag
    lines.append(f'  <rect x="{pad_x}" y="14" width="{left_w}" height="30" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>')
    lines.append(f'  <text x="{pad_x + left_w / 2:.1f}" y="34" font-size="13" font-weight="700" fill="#334155" text-anchor="middle">核心数学主线</text>')
    for j, (label, fg, bg) in enumerate(col_headers):
        cx = inner_x + j * (card_w + card_gap)
        lines.append(f'  <rect x="{cx:.1f}" y="14" width="{card_w:.1f}" height="30" rx="6" fill="{bg}" stroke="{fg}" stroke-width="1.2"/>')
        lines.append(f'  <text x="{cx + card_w / 2:.1f}" y="34" font-size="13" font-weight="700" fill="{fg}" text-anchor="middle">{escape(label)}</text>')

    # Horizontal swimlane chains
    for idx, (color_key, title, sub, steps) in enumerate(chains):
        hdr, fill, bdr, card_bdr = PALETTE[color_key]
        y = top_y + idx * (band_h + gap_y)
        lines.append(f'  <rect x="{pad_x}" y="{y}" width="{band_w}" height="{band_h}" rx="12" fill="{fill}" stroke="{bdr}" stroke-width="1.5"/>')
        lines.append(f'  <rect x="{pad_x}" y="{y}" width="{left_w}" height="{band_h}" rx="10" fill="{hdr}"/>')
        lines.append(f'  <text class="ht" x="{pad_x + left_w / 2:.1f}" y="{y + band_h / 2 - 4:.1f}">{escape(title)}</text>')
        lines.append(f'  <text class="hs" x="{pad_x + left_w / 2:.1f}" y="{y + band_h / 2 + 16:.1f}">{escape(sub)}</text>')

        card_h = band_h - 24
        card_y = y + 12
        for j, (ctitle, csub) in enumerate(steps):
            cx = inner_x + j * (card_w + card_gap)
            mx = cx + card_w / 2
            lines.append(f'  <rect class="card" x="{cx:.1f}" y="{card_y}" width="{card_w:.1f}" height="{card_h}" rx="8" stroke="{card_bdr}"/>')
            lines.append(f'  <text class="ct" x="{mx:.1f}" y="{card_y + 32}">{escape(ctitle)}</text>')
            lines.append(f'  <text class="cs" x="{mx:.1f}" y="{card_y + 54}">{escape(csub)}</text>')
            if j < 3:
                ax1 = cx + card_w + 2
                ax2 = cx + card_w + card_gap - 3
                ay = card_y + card_h / 2
                lines.append(f'  <line class="flow" x1="{ax1:.1f}" y1="{ay:.1f}" x2="{ax2:.1f}" y2="{ay:.1f}"/>')

    # Right cross-cutting vertical pillar
    px = width - pad_x - pillar_w
    ph = total_h - top_y - 24
    pillar_chars = list("数学驱动物理与工程实践")
    lines.append(f'  <rect x="{px}" y="{top_y}" width="{pillar_w}" height="{ph}" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>')
    step = min(38, (ph - 44) / max(len(pillar_chars), 1))
    start_y = top_y + (ph - step * (len(pillar_chars) - 1)) / 2 + 6
    for k, ch in enumerate(pillar_chars):
        lines.append(f'  <text x="{px + pillar_w / 2:.1f}" y="{start_y + k * step:.1f}" font-size="18" font-weight="700" fill="#b91c1c" text-anchor="middle">{escape(ch)}</text>')

    lines.append("</svg>")
    out_path = OUT_DIR / "mpce_math_physics_engineering_map.svg"
    svg_text = "\n".join(lines) + "\n"
    ET.fromstring(svg_text)
    out_path.write_text(svg_text, encoding="utf-8")
    print(f"Wrote mpce_math_physics_engineering_map.svg ({width}x{total_h}) OK")


if __name__ == "__main__":
    main()
