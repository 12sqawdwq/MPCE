# 近代物理 Modern Physics

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识，无独立节点；通向 `PHYS-QM-01`、`PHYS-SS-01`、`PHYS-SS-02` |
| Phase | 进入 Phase I 之前的前置补习（大学物理） |
| Prerequisites | [力学](01_mechanics.md)；[电磁学](04_electromagnetism.md)；[光学](05_optics.md)；[热学](03_thermal_physics.md) 中的玻尔兹曼因子 |
| Primary References | Halliday, Resnick & Walker, Ch. 37–44；Serway, Moses & Moyer, *Modern Physics* |

---

## 1. 核心思想

经典物理在两个极端失效：速度接近光速时需要狭义相对论；尺度到原子量级时需要量子力学。大学物理阶段的目标是理解为什么需要这两套新理论，并能做数量级估算。

## 2. 狭义相对论

- 两条基本假设：所有惯性系中物理规律相同；真空光速在所有惯性系中相同。
- 洛伦兹因子：$\gamma=\frac{1}{\sqrt{1-v^2/c^2}}$。
- 时间膨胀 $\Delta t=\gamma\Delta t_0$；长度收缩 $L=\frac{L_0}{\gamma}$；同时性是相对的。
- 洛伦兹变换：$x'=\gamma(x-vt)$，$t'=\gamma\big(t-\frac{vx}{c^2}\big)$。
- 相对论动量 $p=\gamma mv$，能量 $E=\gamma mc^2$，静能 $E_0=mc^2$。
- 能量–动量关系：$E^2=(pc)^2+(mc^2)^2$；光子 $E=pc$。

## 3. 量子论的起源

- 黑体辐射：普朗克假设能量量子化 $E=nh\nu$，解决了紫外灾难。
  - 维恩位移定律 $\lambda_{\max}T=b$，其中 $b\approx2.898\times10^{-3}\,\mathrm{m\cdot K}$。
- 光电效应：$h\nu=W+E_{k,\max}$。存在截止频率，光强只影响光电子数目，说明光由光子组成。
- 康普顿散射：$\Delta\lambda=\frac{h}{m_ec}(1-\cos\theta)$，光子像粒子一样与电子碰撞。
- 德布罗意物质波：$\lambda=\frac{h}{p}$。电子衍射实验证实了粒子的波动性。
- 波粒二象性：光和实物粒子都同时具有波动性和粒子性。

## 4. 量子力学初步

- 波函数 $\psi(x,t)$：$|\psi|^2$ 是概率密度，满足归一化 $\int|\psi|^2\,\mathrm dx=1$。
- 不确定关系：$\Delta x\,\Delta p\ge\frac{\hbar}{2}$，$\hbar=\frac{h}{2\pi}$。
- 定态薛定谔方程（一维）：$-\frac{\hbar^2}{2m}\frac{\mathrm d^2\psi}{\mathrm dx^2}+V(x)\psi=E\psi$。它是一个特征值问题：只有特定的能量 $E$ 才有物理上允许的解。
- 一维无限深势阱：$E_n=\frac{n^2\pi^2\hbar^2}{2mL^2}$，$\psi_n=\sqrt{\frac2L}\sin\frac{n\pi x}{L}$。能量量子化来自边界条件，与驻波完全类似。
- 隧道效应：粒子能以一定概率穿过高于自身能量的势垒（扫描隧道显微镜、隧穿二极管、闪存）。
- 谐振子：$E_n=\big(n+\frac12\big)\hbar\omega$，存在零点能。

## 5. 原子物理

- 氢原子玻尔模型：$E_n=-\frac{13.6\,\mathrm{eV}}{n^2}$；跃迁发光 $h\nu=E_i-E_f$。
- 四个量子数：$n$（主）、$l$（角）、$m_l$（磁）、$m_s$（自旋）。
- 泡利不相容原理：同一原子中不能有两个电子处于完全相同的量子态，由此解释元素周期表。
- 激光：受激辐射与粒子数反转。

## 6. 固体物理初步

- 能带：大量原子靠近时，分立能级展宽成能带。
- 导体、半导体、绝缘体的区别在于价带是否填满，以及禁带宽度 $E_g$ 的大小。硅的 $E_g\approx1.12\,\mathrm{eV}$（室温）。
- 费米–狄拉克分布：$f(E)=\frac{1}{e^{(E-E_F)/k_BT}+1}$。
- 半导体：本征激发产生电子–空穴对；掺杂形成 n 型、p 型；p–n 结具有单向导电性。
- 这些内容在 Phase IV 的固体物理 `PHYS-SS-01`、`PHYS-SS-02` 中会严格展开。

## 7. 原子核物理（了解）

- 质能亏损与结合能：$\Delta E=\Delta mc^2$。
- 放射性衰变：$N=N_0e^{-\lambda t}$，半衰期 $T_{1/2}=\frac{\ln2}{\lambda}$。
- 裂变与聚变。

## 8. 自测

1. 一个 μ 子静止寿命 $2.2\,\mu\mathrm s$，以 $0.99c$ 运动时，在地面参考系中平均能飞行多远？
2. 用 $400\,\mathrm{nm}$ 的光照射逸出功 $2.3\,\mathrm{eV}$ 的金属，求光电子最大动能。
3. 估算动能为 $100\,\mathrm{eV}$ 的电子的德布罗意波长，并说明为什么电子显微镜分辨率高于光学显微镜。
4. 求电子在宽 $1\,\mathrm{nm}$ 的无限深势阱中基态能量（以 eV 为单位）。
5. 用能带图解释：为什么半导体的导电性随温度升高而增强，金属却相反？

## 9. 我的疑问与补充

（学习中遇到的问题记在这里）
