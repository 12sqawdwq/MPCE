# 实验 03：谐振子上的数值 ODE 积分器——收敛阶与长时间能量行为（Numerical ODE Integrators: Convergence Order & Long-Time Energy Behaviour）

| 属性 | 内容 |
|---|---|
| 实验 ID | 03 |
| 阶段 Phase | III（常微分方程、哈密顿力学）→ V（数值分析：相容性、稳定性、收敛性；几何积分） |
| 状态 Status | ✅ Implemented & Verified（2026-11-25，见 §8） |
| 运行时间 Runtime | 数秒量级（纯 Python 逐步循环；最长一条为 Forward/Backward Euler 的 $N=25600$ 步） |
| 随机种子 Seed | 无（完全确定性，不使用 RNG） |

---

## 1. Experiment Objective | 实验目标

1. **从零实现**四种一步法（不调用 `scipy.integrate`）：Forward Euler、Backward Euler、经典 RK4、Velocity Verlet。
2. 在有解析解的谐振子 $x''+\omega^2x=0$ 上，用 7 级步长的双对数最小二乘拟合测得**经验收敛阶（empirical order）**，与理论阶 $1,1,4,2$ 比较。
3. 在 100 个周期的长时间积分中对比**能量行为**，区分三种本质不同的误差结构：
   - 显式 Euler：能量按 $(1+h^2\omega^2)^n$ **指数增长**（数值反阻尼）；
   - 隐式 Euler：能量按 $(1+h^2\omega^2)^{-n}$ **指数衰减**（数值阻尼）；
   - RK4：高阶但非辛（non-symplectic），存在微小的**单调耗散**；
   - Velocity Verlet：辛（symplectic），能量只做 $O(h^2)$ 有界振荡，**无长期漂移**，且一个修正的"影子能量（shadow energy）"守恒到舍入误差。
4. 说明"高阶 ≠ 长时间可靠"：对保守系统，结构保持（structure preservation）往往比局部精度更重要。

## 2. Physical Background | 物理背景

谐振子是几乎所有振动系统在平衡点附近的线性化模型：

- **结构动力学**：单自由度弹簧–质量系统、多自由度系统的每个模态坐标；
- **分子动力学（MD）**：键伸缩振动，长时间 NVE 模拟要求能量不漂移——这正是 MD 普遍使用 Verlet 类积分器的原因；
- **天体力学 / 粒子加速器**：长时间轨道积分需要辛方法，否则会出现人为的轨道衰减或外扩；
- **电路**：理想 LC 振荡回路 $L\ddot q + q/C = 0$。

谐振子同时是哈密顿系统 $H(x,v)=\tfrac12 v^2+\tfrac12\omega^2x^2$，其相流保持相空间面积。离散积分器是否保持这一几何结构，决定了长时间行为的定性正确性。

## 3. Mathematical Model | 数学模型

二阶 ODE 与一阶形式：

$$
x''+\omega^2 x = 0,\quad x(0)=x_0,\ v(0)=v_0
\qquad\Longleftrightarrow\qquad
\mathbf y'=A\mathbf y,\ \ \mathbf y=\begin{pmatrix}x\\ v\end{pmatrix},\ A=\begin{pmatrix}0&1\\-\omega^2&0\end{pmatrix}.
$$

解析解与能量：

$$
x(t)=x_0\cos\omega t+\frac{v_0}{\omega}\sin\omega t,\qquad E=\tfrac12 v^2+\tfrac12\omega^2x^2\ \ (\dot E=0).
$$

本实验参数：$\omega=1$，$x_0=1$，$v_0=0$，故 $E_0=0.5$，周期 $P=2\pi$，精确相轨迹为单位圆 $x^2+(v/\omega)^2=1$。

| 方法 | 类型 | 理论阶 $p$ | 辛？ | 对 $\mathbf y'=A\mathbf y$ 的放大因子 $R(z)$，$z=h\lambda$，$\lambda=\pm i\omega$ |
|---|---|---|---|---|
| Forward Euler | 显式 | 1 | 否 | $1+z$，$\lvert R\rvert^2=1+h^2\omega^2>1$ |
| Backward Euler | 隐式 | 1 | 否 | $(1-z)^{-1}$，$\lvert R\rvert^2=(1+h^2\omega^2)^{-1}<1$ |
| RK4 | 显式 | 4 | 否 | $1+z+\tfrac{z^2}{2}+\tfrac{z^3}{6}+\tfrac{z^4}{24}$，$\lvert R\rvert<1$（略小于 1） |
| Velocity Verlet | 显式 | 2 | **是** | $\det M=1$，$h\omega<2$ 时特征值在单位圆上 |

## 4. Governing Equations | 控制方程

**一步映射**（$a(x)=-\omega^2x$）：

- Forward Euler：$x_{n+1}=x_n+hv_n,\ \ v_{n+1}=v_n+h\,a(x_n)$；
- Backward Euler：$(I-hA)\mathbf y_{n+1}=\mathbf y_n$，闭式解 $x_{n+1}=\dfrac{x_n+hv_n}{1+h^2\omega^2},\ v_{n+1}=\dfrac{v_n-h\omega^2x_n}{1+h^2\omega^2}$；
- RK4：标准四级 $k_1,\dots,k_4$，$\mathbf y_{n+1}=\mathbf y_n+\tfrac h6(k_1+2k_2+2k_3+k_4)$；
- Velocity Verlet（kick–drift–kick）：$v_{n+\frac12}=v_n+\tfrac h2a(x_n)$，$x_{n+1}=x_n+hv_{n+\frac12}$，$v_{n+1}=v_{n+\frac12}+\tfrac h2a(x_{n+1})$。

**离散能量律**（本实验断言的精确关系）：

$$
\frac{E_N^{\text{FE}}}{E_0}=(1+h^2\omega^2)^{N},\qquad
\frac{E_N^{\text{BE}}}{E_0}=(1+h^2\omega^2)^{-N},\qquad
\frac{E_N^{\text{RK4}}}{E_0}=\lvert R(ih\omega)\rvert^{2N}.
$$

**Verlet 影子能量**（修正哈密顿量，对线性问题精确守恒）：

$$
\tilde E=\tfrac12v^2+\tfrac{\omega^2}{2}\Bigl(1-\tfrac{h^2\omega^2}{4}\Bigr)x^2,
\qquad
\max_n\frac{\lvert E_n-E_0\rvert}{E_0}\le\frac{(h\omega)^2/4}{1-(h\omega)^2/4}.
$$

**全局误差度量**（能量加权状态误差）：$e(h)=\sqrt{(x_N-x(T))^2+\bigl((v_N-v(T))/\omega\bigr)^2}$。

## 5. Numerical Method | 数值方法

**A. 符号验证**：SymPy 检查解析解满足 ODE、初值条件、$\dot E=0$，并与 `dsolve` 结果比对（四项残差均为 0）。

**B. 收敛阶研究**（$T=10$）：每种方法 7 级步长、逐级减半；对 $\log e$ 关于 $\log h$ 做最小二乘线性拟合，斜率即经验阶 $p$。步长阶梯选在各方法的**渐近区**：

| 方法 | 步数 $N$ | 步长 $h=T/N$ |
|---|---|---|
| Forward / Backward Euler | $400,800,\dots,25600$ | $0.025\to3.9\times10^{-4}$ |
| RK4 / Velocity Verlet | $50,100,\dots,3200$ | $0.2\to3.1\times10^{-3}$ |

一阶方法需要较小的 $h\omega T$，使 $O(h^2T^2)$ 修正项衰减；RK4 则不能取得过小，否则会撞上舍入误差平台（$\sim N\varepsilon$）。

**C. 长时间能量研究**：$h=0.05$（$h\omega=0.05$），$N=\mathrm{round}(100\cdot2\pi/0.05)=12566$ 步 ≈ 100 周期。长期漂移定义为"最后 10 个周期的平均相对能量误差 − 最初 10 个周期的平均"，平均可消去 $O(h^2)$ 的有界振荡，只留下长期趋势。

## 6. Implementation & How to Run | 实现与运行方式

**依赖（Dependencies）**：Python ≥ 3.10，`numpy`，`sympy`，`matplotlib`。安装见 [`../../README.md`](../../README.md#2-environment-setup--环境配置)。

```bash
cd 05_experiments/dynamics/03_numerical_ode_solver
python experiment.py          # exit code 0 ⇔ 全部断言通过
```

代码结构（`experiment.py`）：

| 函数 | 作用 |
|---|---|
| `forward_euler` / `backward_euler` / `rk4` / `velocity_verlet` | 一步映射 $(x_n,v_n,h)\mapsto(x_{n+1},v_{n+1})$ |
| `integrate(step, h, n_steps)` | 通用时间推进，返回 $t,x,v$ 数组 |
| `symbolic_check()` | SymPy 验证解析解 |
| `convergence_study()` | 7 级步长收敛研究 + 阶数拟合 |
| `energy_study()` | 100 周期能量律、影子能量与漂移检查 |
| `make_figures()` | 生成 3 张图到 `output/` |

参数：`OMEGA = 1.0`，`X0, V0 = 1.0, 0.0`，`T_CONV = 10.0`，`H_LONG = 0.05`，`N_PERIODS = 100`，`ORDER_TOL = 0.1`。

## 7. Visualization | 可视化说明

输出目录 `output/`（已被 `.gitignore` 忽略）：

| 文件 | 内容 | 读图要点 |
|---|---|---|
| `ode_convergence.png` | 四种方法在 $T=10$ 的全局误差 vs $h$（双对数），虚线为斜率 1、1、4、2 的参考线，图例给出拟合阶 | 各曲线与对应参考线平行；RK4 用更大步长仍达到最低误差 |
| `ode_energy_drift.png` | $\lvert E(t)-E_0\rvert/E_0$ vs 时间（单位：周期，半对数） | FE 指数上升、BE 趋向 1（能量耗尽）、RK4 缓慢线性增长、Verlet 平稳振荡于 $\sim6\times10^{-4}$ |
| `ode_phase_portraits.png` | 四个子图：100 周期的相图 $(x, v/\omega)$，叠加精确单位圆 | FE 向外螺旋（坐标限于 $[-4,4]$）、BE 向原点螺旋、RK4 与 Verlet 都贴合单位圆 |

## 8. Verification | 验证标准与结果

**判据（全部以 `assert` 实现，任一失败则非零退出）：**

| # | 判据 | 阈值 |
|---|---|---|
| V1 | SymPy：ODE 残差、IC 残差、$\dot E$、`dsolve` 差值 | 全部 $=0$ |
| V2 | 经验阶 $\lvert p-p_{\text{theory}}\rvert$（四种方法） | $<0.1$ |
| V3 | FE、BE、RK4 末态能量与离散能量律的相对偏差 | $<10^{-9}$ |
| V4 | FE：$E_N/E_0>10^{10}$ 且能量严格单调递增；BE：$E_N/E_0<10^{-10}$ 且严格单调递减 | — |
| V5 | Verlet：$\max\lvert E-E_0\rvert/E_0\le(h\omega)^2/4\,/\,(1-(h\omega)^2/4)$ | 理论界 |
| V6 | Verlet 影子能量最大相对偏差 | $<10^{-12}$ |
| V7 | Verlet 长期漂移 $<10^{-3}\times$ 其振荡幅度，且小于 RK4 的漂移 | — |

**实测结果（2026-11-25，exit code 0）：**

V1 — SymPy 符号验证：**通过**（所有残差为 0）。

V2 — 经验收敛阶（$T=10$，7 级步长最小二乘拟合）：

| 方法 | 拟合阶 $p$ | 理论阶 | $\lvert p-p_{\text{theory}}\rvert$ | 状态 |
|---|---|---|---|---|
| Forward Euler | **1.0132** | 1 | 0.0132 | PASS |
| Backward Euler | **0.9870** | 1 | 0.0130 | PASS |
| RK4 | **3.9999** | 4 | 0.0001 | PASS |
| Velocity Verlet | **2.0004** | 2 | 0.0004 | PASS |

V3–V7 — 100 周期能量（$h=0.05$，$N=12566$ 步，$E_0=0.5$）：

| 方法 | 关键量 | 实测 | 理论预测 / 判据 |
|---|---|---|---|
| Forward Euler | $E_N/E_0$ | $\mathbf{4.23\times10^{13}}$ | $(1.0025)^{12566}\approx4.23\times10^{13}$ |
| Backward Euler | $E_N/E_0$ | $\mathbf{2.36\times10^{-14}}$ | $(1.0025)^{-12566}\approx2.36\times10^{-14}$ |
| RK4 | $E_N/E_0$ | $\mathbf{0.9999973}$ | $\lvert R(0.05i)\rvert^{2N}\approx1-N(h\omega)^6/72\approx0.9999973$ |
| Velocity Verlet | $\max\lvert E-E_0\rvert/E_0$ | $\mathbf{6.25\times10^{-4}}$ | 上界 $6.254\times10^{-4}$ |
| Velocity Verlet | 影子能量最大偏差 | $\mathbf{1.20\times10^{-14}}$ | $<10^{-12}$ |

## 9. Error Analysis | 误差分析

1. **经验阶与理论阶一致**：四种方法偏差均 $\le0.014$。Euler 两法的偏差（$\pm0.013$，符号相反）来自尚未完全消失的高阶修正项：FE 振幅按 $(1+h^2\omega^2)^{N/2}$ 增长、BE 按其倒数衰减，两者的非线性修正方向相反，因此一个略大于 1、一个略小于 1。RK4 和 Verlet 的阶梯处于干净的渐近区，偏差 $\le4\times10^{-4}$。
2. **步长阶梯的选择是关键**：若对一阶方法使用 $N=50$ 起步（$h=0.2$，$h\omega T=2$），$(1+h^2\omega^2)^{N/2}$ 的非线性效应会污染拟合；若对 RK4 使用 $N=25600$，误差 $\sim h^4\approx10^{-14}$ 会触及舍入平台，斜率被压低。
3. **Euler 能量律是精确的，不是近似**：对线性问题 $\lvert R(\pm ih\omega)\rvert^2=1+h^2\omega^2$ 精确成立，$E_n=E_0\lvert R\rvert^{2n}$ 逐步精确，因此实测与预测的偏差只剩舍入误差（判据 $10^{-9}$）。$h\omega=0.05$ 看似很小，但每步 $0.25\%$ 的增益在 12566 步后复利为 $10^{13}$ 倍——**局部误差小不代表长时间误差小**。
4. **RK4 的耗散**：$\lvert R(iz)\rvert^2=1-z^6/72+z^8/576$，每步能量损失 $\approx2.2\times10^{-10}$，100 周期累积为 $2.7\times10^{-6}$。量很小，但**单调**——在 $10^6$ 周期的模拟中将变为不可忽略的人为阻尼。
5. **Verlet 的有界误差**：Verlet 是辛映射（$\det M=1$），它精确保持影子能量 $\tilde E$；真实能量 $E$ 与 $\tilde E$ 只差 $O(h^2)$ 的 $x^2$ 项，故 $E$ 在 $[\tilde E,\ \tilde E/(1-h^2\omega^2/4)]$ 间振荡，振幅 $h^2\omega^2/4=6.25\times10^{-4}$ 与实测完全吻合，且不随时间增长。影子能量偏差 $1.2\times10^{-14}$ 约为 $50\varepsilon$，即 12566 步的舍入累积。
6. **相位误差 vs 幅值误差**：Verlet 不守恒相位（存在 $O(h^2)$ 的频率偏移），因此其**轨迹误差**仍随时间线性增长；它保证的是**轨道形状**（能量面）的正确性。RK4 相位误差为 $O(h^4)$，在中等时长内轨迹更准。

## 10. Engineering Interpretation | 工程意义

- **永远不要用显式 Euler 积分振荡/保守系统**：即使 $h\omega=0.05$（每周期 125 步），100 周期后能量也被放大 $10^{13}$ 倍。这类"能量爆炸"是游戏物理、简易动力学仿真中最常见的 bug 来源。
- **隐式 Euler 的数值阻尼是双刃剑**：它对刚性问题无条件稳定（A-稳定、L-稳定），适合高频模态需要被滤掉的场合（如瞬态热–结构耦合）；但在需要保持振幅的模态分析中，它会把物理振动"吃掉"，100 周期后能量只剩 $10^{-14}$。
- **分子动力学与天体力学首选辛积分器**：Velocity Verlet（及 leapfrog、Störmer–Verlet）是 GROMACS、LAMMPS 等 MD 软件的默认方法，正因为其能量误差有界、无漂移，可以运行 $10^8$ 步。
- **结构动力学**中的 Newmark-$\beta$（$\beta=1/4,\gamma=1/2$，平均加速度法）同样是无数值耗散、二阶的方法，与 Verlet 思想一致；若需要可控的高频耗散，则使用 HHT-$\alpha$ 或广义-$\alpha$ 法。
- **选择积分器的经验法则**：短时间、高精度、非保守问题 → 高阶 RK（带自适应步长）；长时间、保守/哈密顿问题 → 辛方法；刚性问题 → 隐式方法（BDF、Radau）。

**参考文献**：Hairer, Lubich & Wanner, *Geometric Numerical Integration* (2nd ed.), Ch. I, VI, IX；Hairer, Nørsett & Wanner, *Solving Ordinary Differential Equations I*, §II.1–II.3；Leimkuhler & Reich, *Simulating Hamiltonian Dynamics*, Ch. 2–5；LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*, Ch. 5–7。
