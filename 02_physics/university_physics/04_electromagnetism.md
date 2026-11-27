# 电磁学 Electromagnetism

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识，无独立节点；通向 `PHYS-EM-01`、`MATH-VC-01`、`MATH-VC-02`、`PHYS-SS-03` |
| Phase | 进入 Phase I 之前的前置补习（大学物理） |
| Prerequisites | [力学](01_mechanics.md)；向量点积与叉积；线积分与面积分的直观概念 |
| Primary References | Halliday, Resnick & Walker, Ch. 21–33；Purcell & Morin, *Electricity and Magnetism*；MIT 8.02 |

---

## 1. 核心思想

电磁学用"场"描述电荷之间的相互作用。整门课最终收束为四个 Maxwell 方程：电荷产生电场，没有磁单极子，变化的磁场产生电场，电流和变化的电场产生磁场。

## 2. 静电场

- 库仑定律：$\mathbf F=\frac{1}{4\pi\varepsilon_0}\frac{q_1q_2}{r^2}\hat{\mathbf r}$。
- 电场：$\mathbf E=\frac{\mathbf F}{q}$，点电荷场强 $E=\frac{q}{4\pi\varepsilon_0r^2}$，满足叠加原理。
- 电通量：$\Phi_E=\int\mathbf E\cdot\mathrm d\mathbf A$。
- **高斯定理**：$\oint\mathbf E\cdot\mathrm d\mathbf A=\frac{Q_{\text{in}}}{\varepsilon_0}$。
  - 用于球、柱、面对称分布的电场：均匀带电球壳外 $E=\frac{Q}{4\pi\varepsilon_0r^2}$，壳内为 0；无限长直线 $E=\frac{\lambda}{2\pi\varepsilon_0r}$；无限大平面 $E=\frac{\sigma}{2\varepsilon_0}$。
- 电势：$V=-\int\mathbf E\cdot\mathrm d\mathbf l$，$\mathbf E=-\nabla V$；点电荷电势 $V=\frac{q}{4\pi\varepsilon_0r}$。
- 静电场是保守场：$\oint\mathbf E\cdot\mathrm d\mathbf l=0$。
- 导体静电平衡：内部场强为零，导体是等势体，电荷分布在表面。
- 电偶极子：偶极矩 $\mathbf p=q\mathbf d$，在外场中受力矩 $\boldsymbol\tau=\mathbf p\times\mathbf E$。

## 3. 电容与电介质

- 电容：$C=\frac{Q}{V}$；平行板电容器 $C=\frac{\varepsilon A}{d}$。
- 串联 $\frac1C=\sum\frac1{C_i}$，并联 $C=\sum C_i$。
- 储能：$U=\frac12CV^2$，电场能量密度 $u=\frac12\varepsilon E^2$。
- 电介质：极化削弱内部场强，$\varepsilon=\varepsilon_r\varepsilon_0$；电位移 $\mathbf D=\varepsilon\mathbf E$，满足 $\oint\mathbf D\cdot\mathrm d\mathbf A=Q_{\text{自由}}$。

## 4. 电流与电路

- 电流 $I=\frac{\mathrm dQ}{\mathrm dt}$，电流密度 $\mathbf J=nq\mathbf v_d$。
- 欧姆定律：$V=IR$，微观形式 $\mathbf J=\sigma\mathbf E$；电阻 $R=\rho\frac{L}{A}$。
- 功率：$P=IV=I^2R$。
- 电动势与内阻：$V=\mathcal E-Ir$。
- 基尔霍夫定律：
  - 节点电流定律 $\sum I=0$（电荷守恒）；
  - 回路电压定律 $\sum V=0$（静电场保守）。
  - 大型电路列出的方程组就是线性方程组 $A\mathbf x=\mathbf b$。
- RC 电路：充放电按 $e^{-t/RC}$ 变化，时间常数 $\tau=RC$。

## 5. 磁场

- 洛伦兹力：$\mathbf F=q(\mathbf E+\mathbf v\times\mathbf B)$。
  - 带电粒子在匀强磁场中做圆周运动，半径 $r=\frac{mv}{qB}$，回旋频率 $\omega=\frac{qB}{m}$。
- 安培力：$\mathrm d\mathbf F=I\,\mathrm d\mathbf l\times\mathbf B$。
- 载流线圈：磁矩 $\boldsymbol\mu=NI\mathbf A$，受力矩 $\boldsymbol\tau=\boldsymbol\mu\times\mathbf B$（电动机原理）。
- 毕奥–萨伐尔定律：$\mathrm d\mathbf B=\frac{\mu_0}{4\pi}\frac{I\,\mathrm d\mathbf l\times\hat{\mathbf r}}{r^2}$。
- **安培环路定理**：$\oint\mathbf B\cdot\mathrm d\mathbf l=\mu_0I_{\text{enc}}$。
  - 无限长直导线 $B=\frac{\mu_0I}{2\pi r}$；长螺线管内 $B=\mu_0nI$。
- 磁场的高斯定理：$\oint\mathbf B\cdot\mathrm d\mathbf A=0$，没有磁单极子。
- 霍尔效应：$V_H=\frac{IB}{nqt}$，可用来测量载流子浓度和类型，是半导体表征的基本手段。
- 磁介质：顺磁、抗磁、铁磁；$\mathbf B=\mu\mathbf H$。

## 6. 电磁感应

- 法拉第定律：$\mathcal E=-\frac{\mathrm d\Phi_B}{\mathrm dt}$。
- 楞次定律：感应电流的磁场总是阻碍原磁通的变化（负号的含义）。
- 动生电动势：$\mathcal E=\int(\mathbf v\times\mathbf B)\cdot\mathrm d\mathbf l$；感生电场：$\oint\mathbf E\cdot\mathrm d\mathbf l=-\frac{\mathrm d\Phi_B}{\mathrm dt}$。
- 自感：$\mathcal E=-L\frac{\mathrm dI}{\mathrm dt}$，储能 $U=\frac12LI^2$，磁场能量密度 $u=\frac{B^2}{2\mu_0}$。
- 互感与变压器：$\frac{V_2}{V_1}=\frac{N_2}{N_1}$。
- RL 电路时间常数 $\tau=L/R$；LC 电路振荡频率 $\omega_0=\frac1{\sqrt{LC}}$。

## 7. 交流电路

- 阻抗：$Z_R=R$，$Z_L=i\omega L$，$Z_C=\frac{1}{i\omega C}$。用复数表示后，交流电路和直流电路的计算方法相同。
- RLC 串联谐振：$\omega_0=\frac{1}{\sqrt{LC}}$，与受迫振动的共振完全对应（见 [振动与波](02_oscillations_and_waves.md)）。
- 有效值：$I_{\text{rms}}=\frac{I_0}{\sqrt2}$。

## 8. Maxwell 方程组与电磁波

积分形式：

$$
\begin{aligned}
\oint\mathbf E\cdot\mathrm d\mathbf A&=\frac{Q_{\text{in}}}{\varepsilon_0} &&\text{（高斯定理）}\\
\oint\mathbf B\cdot\mathrm d\mathbf A&=0 &&\text{（无磁单极子）}\\
\oint\mathbf E\cdot\mathrm d\mathbf l&=-\frac{\mathrm d\Phi_B}{\mathrm dt} &&\text{（法拉第定律）}\\
\oint\mathbf B\cdot\mathrm d\mathbf l&=\mu_0I_{\text{enc}}+\mu_0\varepsilon_0\frac{\mathrm d\Phi_E}{\mathrm dt} &&\text{（安培–麦克斯韦定律）}
\end{aligned}
$$

- 位移电流 $\varepsilon_0\frac{\mathrm d\Phi_E}{\mathrm dt}$ 是 Maxwell 的关键补充，使电荷守恒得以成立，并预言了电磁波。
- 电磁波：横波，$\mathbf E\perp\mathbf B\perp$ 传播方向，真空中速度 $c=\frac{1}{\sqrt{\mu_0\varepsilon_0}}$，且 $E=cB$。
- 能流密度（坡印廷矢量）：$\mathbf S=\frac1{\mu_0}\mathbf E\times\mathbf B$。
- 电磁波谱：无线电、微波、红外、可见光、紫外、X 射线、γ 射线。
- 用散度定理和斯托克斯定理把积分形式化为微分形式，是 Phase III 的内容。

## 9. 自测

1. 用高斯定理求均匀带电实心球内外的电场分布。
2. 求平行板电容器在插入相对介电常数为 $\varepsilon_r$ 的电介质前后的电容和储能变化。
3. 一个质子以 $10^6\,\mathrm{m/s}$ 垂直进入 $0.1\,\mathrm T$ 的匀强磁场，求轨道半径。
4. 长为 $L$ 的导体棒在匀强磁场 $B$ 中以速度 $v$ 垂直切割磁感线，求动生电动势，并用洛伦兹力解释它的来源。
5. 说明为什么没有位移电流项时，安培定理在电容器充电过程中会出现矛盾。

## 10. 我的疑问与补充

（学习中遇到的问题记在这里）
