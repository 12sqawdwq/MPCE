# 实验 06：二维热传导方程的显式 FTCS 有限差分——收敛阶与稳定性极限（2D Heat Equation with Explicit FTCS: Convergence & Stability Limit）

| 属性 | 内容 |
|---|---|
| 实验 ID | 06 |
| 阶段 Phase | IV（抛物型 PDE、扩散方程）→ V（有限差分：相容性、von Neumann 稳定性、Lax 等价定理） |
| 状态 Status | ✅ Implemented & Verified（2026-11-25，见 §8） |
| 运行时间 Runtime | 数秒量级（向量化 NumPy；最细网格 $N=128$ 共 4096 步） |
| 随机种子 Seed | `numpy.random.default_rng(42)`（仅用于稳定性实验的初始扰动） |

---

## 1. Experiment Objective | 实验目标

1. **从零实现**二维显式 FTCS（Forward-Time, Centred-Space）格式，求解单位正方形上带齐次 Dirichlet 边界的热方程。
2. 在 $N=16,32,64,128$ 四套网格上、固定网格比 $r=0.4$，用 $L^2$ 与 $L^\infty$ 误差的最小二乘拟合验证**空间二阶收敛**。
3. 用数值证据展示 FTCS 的**条件稳定性**：同一初值、同一扰动下，$r=0.40$（$\le\tfrac12$）稳定且满足离散极值原理；$r=0.60$（$>\tfrac12$）爆炸，并且测得的每步增长因子与 **von Neumann 分析**的预测一致（误差 < 1%）。
4. 展示不稳定的典型"指纹"：奇偶振荡的**棋盘格（checkerboard）模态**。

## 2. Physical Background | 物理背景

热方程 $u_t=\alpha\nabla^2u$ 描述无内热源、各向同性均匀介质中的热传导（Fourier 定律 + 能量守恒），也是一切扩散过程的原型：

- **电子散热**：芯片/PCB 平面内的温度场演化；
- **薄板淬火与焊接**：二维瞬态温度分布决定残余应力与相变；
- **物质扩散**：Fick 第二定律 $c_t=D\nabla^2c$ 形式完全相同（掺杂扩散、污染物输运）；
- **金融**：Black–Scholes 方程经变量代换后即为热方程。

物理上，扩散是**耗散**的：高频（短波长）温度起伏衰减最快（衰减率 $\propto k^2$），且无热源时最大值不会增加（**极值原理 maximum principle**）。一个合格的离散格式必须继承这两条性质——FTCS 只在 $r\le\tfrac12$ 时做到。

## 3. Mathematical Model | 数学模型

$$
\begin{aligned}
&u_t=\alpha\,(u_{xx}+u_{yy}), && (x,y)\in(0,1)^2,\ 0<t\le T,\\
&u=0 && \text{on } \partial\Omega,\\
&u(x,y,0)=\sin(\pi x)\sin(\pi y).
\end{aligned}
$$

**解析解**（基模指数衰减）：

$$
u(x,y,t)=e^{-2\pi^2\alpha t}\sin(\pi x)\sin(\pi y).
$$

参数：$\alpha=1$（无量纲），$T=0.05$（此时精确振幅 $e^{-2\pi^2\cdot0.05}\approx0.373$）。

## 4. Governing Equations | 控制方程

**FTCS 格式**（均匀网格 $h=\Delta x=\Delta y=1/N$）：

$$
u_{ij}^{n+1}=u_{ij}^n+\mu_x\bigl(u_{i+1,j}^n-2u_{ij}^n+u_{i-1,j}^n\bigr)+\mu_y\bigl(u_{i,j+1}^n-2u_{ij}^n+u_{i,j-1}^n\bigr),
$$

$$
\mu_x=\frac{\alpha\Delta t}{\Delta x^2},\quad \mu_y=\frac{\alpha\Delta t}{\Delta y^2},\quad
r=\mu_x+\mu_y=\alpha\Delta t\Bigl(\frac1{\Delta x^2}+\frac1{\Delta y^2}\Bigr)\ \ (\text{本实验 }\mu_x=\mu_y=r/2).
$$

**局部截断误差**：$\tau=O(\Delta t)+O(h^2)$。固定 $r$ 时 $\Delta t=rh^2/(2\alpha)$，故全局误差为 $O(h^2)$。

**von Neumann 稳定性**：代入 $u_{ij}^n=G^ne^{i(\theta_xi+\theta_yj)}$，

$$
G(\theta_x,\theta_y)=1-4\mu_x\sin^2\tfrac{\theta_x}{2}-4\mu_y\sin^2\tfrac{\theta_y}{2},
\qquad \min G=1-4r\ \Rightarrow\ \lvert G\rvert\le1\iff r\le\tfrac12 .
$$

在 $N\times N$ 网格的离散 Dirichlet 模态 $\sin(k\pi x)\sin(l\pi y)$ 上，最负的放大因子来自 $k=l=N-1$（棋盘格模态）：

$$
\lvert G_{\min}\rvert=\Bigl\lvert1-4r\cos^2\frac{\pi}{2N}\Bigr\rvert .
$$

**离散特征解**：初值 $\sin(\pi x)\sin(\pi y)$ 恰为离散 Laplace 的特征向量，因此 FTCS 精确给出 $u^n=G_1^n u^0$，$G_1=1-4r\sin^2(\pi h/2)$——这是比"与连续解比较"更严格的实现正确性检查。

**离散极值原理**：$u_{ij}^{n+1}=(1-2r)u_{ij}^n+\tfrac r2\sum_{\text{4 邻点}}u^n$；当 $r\le\tfrac12$ 时所有系数非负且和为 1，新值是旧值的凸组合，故 $\max\lvert u^{n+1}\rvert\le\max\lvert u^n\rvert$。

## 5. Numerical Method | 数值方法

**A. 符号验证**：SymPy 验证解析解满足 PDE（残差 0）、四条边界（值 0）、初值（残差 0）。

**B. 收敛研究**（$r=0.4$，$T=0.05$）：`time_step_for` 取满足 $2\alpha\Delta t/h^2\le r$ 且整除 $T$ 的最大 $\Delta t$；本实验中恰好整除，故 $r$ 精确等于 0.4：

| $N$ | $h$ | $\Delta t$ | 步数 |
|---|---|---|---|
| 16 | 0.0625 | $7.8125\times10^{-4}$ | 64 |
| 32 | 0.03125 | $1.9531\times10^{-4}$ | 256 |
| 64 | 0.015625 | $4.8828\times10^{-5}$ | 1024 |
| 128 | 0.0078125 | $1.2207\times10^{-5}$ | 4096 |

误差范数：$\lVert e\rVert_{L^2}=\bigl(h^2\sum e_{ij}^2\bigr)^{1/2}$，$\lVert e\rVert_{L^\infty}=\max\lvert e_{ij}\rvert$；对 $\log\lVert e\rVert$ 关于 $\log h$ 做四点最小二乘拟合得阶 $p$。

**C. 稳定性研究**（$N=32$，400 步）：在同一初值上叠加同一个 $10^{-10}\cdot\mathcal N(0,1)$ 内点扰动（seed 42），分别以 $r=0.40$ 与 $r=0.60$ 推进；记录每步 $\max\lvert u^n\rvert$，用最后 100 步 $\log\max\lvert u\rvert$ 的线性拟合斜率得到实测增长因子。

## 6. Implementation & How to Run | 实现与运行方式

**依赖（Dependencies）**：Python ≥ 3.10，`numpy`，`sympy`，`matplotlib`。安装见 [`../../README.md`](../../README.md#2-environment-setup--环境配置)。

```bash
cd 05_experiments/heat_transfer/06_2d_heat_equation
python experiment.py          # exit code 0 ⇔ 全部断言通过
```

代码结构（`experiment.py`）：

| 函数 | 作用 |
|---|---|
| `ftcs_step(u, mu_x, mu_y)` | 一步向量化 FTCS 更新（切片实现 5 点模板），边界保持 0 |
| `grid(n)` / `time_step_for(r, h, T)` | 网格生成；按目标 $r$ 选取整除 $T$ 的 $\Delta t$ |
| `solve(n, r, T)` | 推进到 $T$，返回 $L^2$/$L^\infty$ 误差与离散特征解偏差 |
| `symbolic_check()` | SymPy 验证解析解 |
| `convergence_study()` | 四网格收敛研究 + 阶数拟合 |
| `stability_study(rng)` | $r=0.4$ vs $r=0.6$ 稳定性对比 |
| `make_figures()` | 生成 3 张图到 `output/` |

参数：`SEED = 42`，`ALPHA = 1.0`，`T_FINAL = 0.05`，`R_STABLE = 0.4`，`R_UNSTABLE = 0.6`，`GRIDS = (16, 32, 64, 128)`，`STAB_N = 32`，`STAB_STEPS = 400`，`PERTURB = 1e-10`。

## 7. Visualization | 可视化说明

输出目录 `output/`（已被 `.gitignore` 忽略）：

| 文件 | 内容 | 读图要点 |
|---|---|---|
| `heat2d_solution_error.png` | 左：$N=64$、$r=0.4$ 时 $u(x,y,T=0.05)$ 等值线图；右：误差场 $u_h-u_{\text{exact}}$ | 解保持 $\sin\sin$ 形状、峰值 ≈ 0.373；误差场同样是光滑的单峰形状（误差主要是振幅误差，而非形状误差） |
| `heat2d_convergence.png` | $L^2$、$L^\infty$ 误差 vs $h$（双对数），附 $O(h^2)$ 参考线与 $N$ 标注 | 两条误差线与参考线平行，斜率 ≈ 2 |
| `heat2d_stability.png` | 左：$\max\lvert u^n\rvert$ vs 步数（半对数），$r=0.4$、$r=0.6$ 与 $10^{-10}\lvert G_{\min}\rvert^n$ 参考线；右：$r=0.6$ 第 400 步的解场 | $r=0.4$ 单调衰减；$r=0.6$ 在初期衰减后被指数增长的扰动接管，斜率与参考线一致；右图呈红蓝交替的棋盘格 |

## 8. Verification | 验证标准与结果

**判据（全部以 `assert` 实现，任一失败则非零退出）：**

| # | 判据 | 阈值 |
|---|---|---|
| V1 | SymPy：PDE 残差、4 条边界值、IC 残差 | 全部 $=0$ |
| V2 | 每个网格实际网格比 $\lvert r-0.4\rvert$ | $<10^{-12}$ |
| V3 | 离散特征解检查 $\max\lvert u^n-G_1^nu^0\rvert$（每个网格） | $<10^{-12}$ |
| V4 | $L^2$ 与 $L^\infty$ 拟合阶 $\lvert p-2\rvert$；最细网格 $L^2$ 误差 | $<0.05$；$<10^{-4}$ |
| V5 | $r=0.4$：$\max\lvert u\rvert$ 单调不增（极值原理），终值 $<1$，$\max\lvert u-u_{\text{exact}}\rvert<10^{-3}$ | — |
| V6 | $r=0.6$：$\lvert G_{\min}\rvert>1$，终值 $\max\lvert u\rvert>10^{6}$，$\lvert g_{\text{meas}}/g_{\text{pred}}-1\rvert<1\%$ | — |

**实测结果（2026-11-25，exit code 0）：**

V1 — SymPy 符号验证：**通过**（所有残差为 0）。

V2–V4 — 空间收敛（$N=16,32,64,128$，$r=0.4$，$T=0.05$，四网格最小二乘拟合）：

| 范数 | 拟合阶 $p$ | 理论阶 | $\lvert p-2\rvert$ | 状态 |
|---|---|---|---|---|
| $L^2$ | **2.0024** | 2 | 0.0024 | PASS |
| $L^\infty$ | **2.0024** | 2 | 0.0024 | PASS |

V5–V6 — 稳定性（$N=32$，400 步，初始扰动 $10^{-10}$，seed 42）：

| $r$ | von Neumann $\lvert G_{\min}\rvert$ | 实测增长因子 / 步 | 终值 $\max\lvert u\rvert$ | 极值原理 | 结论 |
|---|---|---|---|---|---|
| 0.40 | 0.5961（$<1$） | —（衰减） | $<1$；$\max\lvert u-u_{\text{exact}}\rvert=\mathbf{3.71\times10^{-4}}$ | **True** | 稳定 ✅ |
| 0.60 | **1.3942**（$>1$） | **1.3868** | $\mathbf{2.559\times10^{45}}$ | False | 爆炸 ❌（符合预期） |

$r=0.6$ 的增长因子相对偏差 $\lvert1.3868/1.3942-1\rvert\approx0.53\%<1\%$：**通过**。

## 9. Error Analysis | 误差分析

1. **$L^2$ 与 $L^\infty$ 阶相同（2.0024）**：解与误差都由单一光滑模态 $\sin(\pi x)\sin(\pi y)$ 主导，误差场与解同形，两种范数只差一个常数因子，因此拟合斜率一致。
2. **为什么固定 $r$ 时是二阶而不是一阶**：截断误差为 $O(\Delta t)+O(h^2)$，但 $\Delta t=rh^2/(2\alpha)\propto h^2$，时间误差被"锁"成 $O(h^2)$。代价是：网格加密一倍，步数增加 4 倍，总计算量增加 $2^2\cdot4=16$ 倍。对该模态，误差常数 $\propto(r-\tfrac16)$——时间误差与空间误差符号相反、部分相消；$r=0.4$ 时不相消，故呈干净的二阶。
3. **离散特征解检查的意义**：$\max\lvert u^n-G_1^nu^0\rvert<10^{-12}$ 说明代码**精确实现了所写的格式**（无下标错误、无边界泄漏）。剩余与连续解的偏差纯属离散化误差 $G_1^n-e^{-2\pi^2\alpha t_n}$，而非 bug。
4. **稳定性阈值的锐利性**：$r=0.4$ 与 $r=0.6$ 只差 50%，结果却从 $3.7\times10^{-4}$ 的误差跃变为 $2.6\times10^{45}$ 的发散。在 $r=0.6$ 下，平滑基模本身仍在衰减；是 $10^{-10}$ 的随机扰动在棋盘格模态上的分量以每步 $\times1.394$ 放大，400 步后增长约 $10^{57}$ 倍并淹没真解。**舍入误差本身就足以触发这一过程**——不稳定格式不需要"坏"初值。
5. **实测增长因子略低于预测（1.3868 vs 1.3942）**：随机扰动激发的是一簇高频模态，其 $\lvert G\rvert$ 都略小于 $\lvert G_{\min}\rvert$ 且彼此接近；400 步后最不稳定模态尚未完全占据主导，拟合斜率被邻近模态略微拉低（偏差 0.53%）。同理，终值 $2.6\times10^{45}$ 低于 $10^{-10}\lvert G_{\min}\rvert^{400}\approx5\times10^{47}$，因为扰动在该模态上的投影系数远小于 $10^{-10}$。
6. **容差选择依据**：阶数容差 0.05 远小于相邻阶的间距（1），足以区分一阶/二阶；增长因子容差 1% 足以排除任何不同的稳定性理论（例如若误把条件写成 $r\le\tfrac14$ 或 $r\le1$，预测值会截然不同）。

## 10. Engineering Interpretation | 工程意义

- **显式格式的时间步受 $\Delta t\le h^2/(4\alpha)$（2D）严格限制**：网格加密 10 倍，步长必须缩小 100 倍。对精细网格或高扩散率材料（如铜 $\alpha\approx1.1\times10^{-4}\,\mathrm{m^2/s}$、$h=0.1$ mm 时 $\Delta t\lesssim23\,\mu\mathrm s$），这会使长时间瞬态仿真代价极高。
- **工程软件通常用隐式格式**：Backward Euler 或 Crank–Nicolson 对热方程无条件稳定，步长只由精度决定；代价是每步求解一个稀疏 SPD 线性方程组（Cholesky、预条件共轭梯度或多重网格）。Crank–Nicolson 在大步长下可能出现非物理振荡，因此常用 BE 启动或 TR-BDF2。
- **不稳定的识别**：仿真结果中出现**网格尺度的棋盘格振荡**、温度超出初始/边界值范围（违反极值原理）时，首先检查 Courant/Fourier 数 $r=\alpha\Delta t\sum h_i^{-2}$。
- **非均匀网格与 3D**：稳定性由**最小网格尺寸**决定，3D 时条件收紧为 $\alpha\Delta t(h_x^{-2}+h_y^{-2}+h_z^{-2})\le\tfrac12$。局部加密的网格会拖累整个显式计算——这是隐式或局部时间步法（local time stepping）存在的原因。
- **显式格式仍有用武之地**：GPU 上的大规模显式模板计算并行效率极高，在短时间、强非线性（如相变、显式动力学耦合）问题中依然常见。

**参考文献**：LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*, Ch. 9–10；Strikwerda, *Finite Difference Schemes and Partial Differential Equations* (2nd ed.), Ch. 2, 6；Morton & Mayers, *Numerical Solution of Partial Differential Equations* (2nd ed.), Ch. 2–3；Incropera et al., *Fundamentals of Heat and Mass Transfer*, Ch. 5（有限差分瞬态导热）。
