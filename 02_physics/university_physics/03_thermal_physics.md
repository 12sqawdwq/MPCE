# 热学 Thermal Physics

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识，无独立节点；通向 `PHYS-TD-01`、`PHYS-SM-01`、`PHYS-TR-01` |
| Phase | 进入 Phase I 之前的前置补习（大学物理） |
| Prerequisites | [力学](01_mechanics.md)（动量、能量）；积分；概率初步 |
| Primary References | Halliday, Resnick & Walker, Ch. 18–20；Schroeder, *An Introduction to Thermal Physics*, Ch. 1–3 |

---

## 1. 核心思想

热学有两套互补的描述：

- **宏观（热力学）**：用温度、压强、体积、内能、熵等少数几个量，配合几条普适定律，不关心微观细节。
- **微观（分子动理论 / 统计）**：把温度、压强解释为大量分子运动的统计平均。

## 2. 温度与热平衡

- 热力学第零定律：A 与 C 热平衡、B 与 C 热平衡，则 A 与 B 热平衡。它保证了温度的定义。
- 热力学温标：$T(\mathrm K)=t(^\circ\mathrm C)+273.15$。
- 热膨胀：$\Delta L=\alpha L\Delta T$。
- 热量与比热：$Q=mc\Delta T$；相变潜热 $Q=mL$。

## 3. 理想气体与分子动理论

- 状态方程：$pV=nRT=Nk_BT$，其中 $R=N_Ak_B$。
- 压强的微观解释：$p=\frac13\frac{N}{V}m\overline{v^2}$。
  - 依据：分子与器壁碰撞的动量变化率。
- 温度的微观解释：$\frac12m\overline{v^2}=\frac32k_BT$。温度是分子平均平动动能的量度。
- 能量均分定理：每个平方项自由度平均分得 $\frac12k_BT$。
  - 单原子分子内能 $U=\frac32nRT$，刚性双原子分子 $U=\frac52nRT$。
- 麦克斯韦速率分布：$f(v)\propto v^2e^{-mv^2/2k_BT}$。
  - 最概然速率 $\sqrt{2k_BT/m}$，平均速率 $\sqrt{8k_BT/\pi m}$，方均根速率 $\sqrt{3k_BT/m}$。
- 玻尔兹曼因子：处于能量 $E$ 状态的概率正比于 $e^{-E/k_BT}$。它是统计力学的核心，也是 Metropolis 蒙特卡洛算法的基础。
- 平均自由程：$\bar\lambda=\frac{1}{\sqrt2\pi d^2n}$。

## 4. 热力学第一定律

- $\Delta U=Q-W$（$Q$ 为吸热，$W$ 为系统对外做功），本质是能量守恒。
- 体积功：$W=\int p\,\mathrm dV$，在 $p$–$V$ 图上是曲线下的面积。
- 理想气体四种典型过程：

| 过程 | 特征 | $W$ | $Q$ |
|---|---|---|---|
| 等容 | $V$ 不变 | $0$ | $nC_V\Delta T$ |
| 等压 | $p$ 不变 | $p\Delta V$ | $nC_p\Delta T$ |
| 等温 | $T$ 不变，$\Delta U=0$ | $nRT\ln\frac{V_2}{V_1}$ | $=W$ |
| 绝热 | $Q=0$，$pV^\gamma=$ 常数 | $-\Delta U$ | $0$ |

- 摩尔热容：$C_p-C_V=R$，比热比 $\gamma=C_p/C_V$。

## 5. 热力学第二定律与熵

- 开尔文表述：不可能从单一热源吸热全部变成功而不产生其他影响。
- 克劳修斯表述：热量不能自发地从低温物体传到高温物体。
- 卡诺循环效率：$\eta=1-\frac{T_c}{T_h}$，是工作在两个热源之间的热机效率上限。
- 熵：$\mathrm dS=\frac{\delta Q_{\text{rev}}}{T}$，是状态函数。
- 熵增原理：孤立系统的熵永不减少，$\Delta S\ge0$，可逆过程取等号。
- 玻尔兹曼熵：$S=k_B\ln\Omega$，$\Omega$ 为微观状态数。熵越大，说明对应的微观状态越多、越"无序"。
- 热力学第三定律：$T\to0$ 时，完美晶体的熵趋于零。

## 6. 热传递初步

- 热传导：傅里叶定律 $\mathbf q=-\kappa\nabla T$。与能量守恒结合，就得到热传导方程（见 [`heat_equation.md`](../../01_mathematics/differential_equations/heat_equation.md)）。
- 对流：牛顿冷却定律 $q=h(T_s-T_\infty)$。
- 辐射：斯特藩–玻尔兹曼定律 $P=\varepsilon\sigma AT^4$。

## 7. 自测

1. 证明理想气体绝热过程满足 $pV^\gamma=$ 常数。
2. 1 mol 理想气体等温膨胀到原体积的 2 倍，求吸热和熵变。
3. 一台热机在 $500\,\mathrm K$ 与 $300\,\mathrm K$ 之间工作，最大效率是多少？
4. 用玻尔兹曼因子解释：为什么温度升高，处于高能级的粒子比例增大？

## 8. 我的疑问与补充

（学习中遇到的问题记在这里）
