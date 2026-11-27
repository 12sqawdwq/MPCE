# 振动与波 Oscillations and Waves

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识，无独立节点；通向 `MATH-DE-01`、`MATH-DE-03`、`MATH-FA-01` |
| Phase | 进入 Phase I 之前的前置补习（大学物理） |
| Prerequisites | [力学](01_mechanics.md)；指数与三角函数；泰勒展开 |
| Primary References | Halliday, Resnick & Walker, Ch. 15–17；French, *Vibrations and Waves*；MIT 8.03 |

---

## 1. 核心思想

几乎所有稳定平衡附近的小运动都是简谐振动：在平衡点附近把势能做二阶泰勒展开，恢复力就变成线性的。很多个振子耦合起来、连续分布开来，就得到波。

## 2. 简谐振动

- 动力学方程：$m\ddot x=-kx$，即 $\ddot x+\omega_0^2x=0$，其中 $\omega_0=\sqrt{k/m}$。
- 通解：$x(t)=A\cos(\omega_0t+\varphi)$，振幅 $A$ 和初相 $\varphi$ 由初始条件决定。
- 周期 $T=\frac{2\pi}{\omega_0}$，频率 $f=\frac1T$。
- 能量：$E=\frac12kA^2$，动能与势能来回转换。
- 单摆（小角度）：$\sin\theta\approx\theta$，于是 $\omega_0=\sqrt{g/L}$。
- 复数表示：$x=\operatorname{Re}\big(\tilde Ae^{i\omega t}\big)$，把求导变成乘以 $i\omega$。
- 旋转矢量：把简谐振动看成匀速圆周运动在一条直径上的投影。

## 3. 振动的合成

- 同方向、同频率：合成后仍是同频率简谐振动，振幅按矢量相加。
- 同方向、频率相近：出现**拍**，拍频 $f_{\text{beat}}=|f_1-f_2|$。
- 相互垂直：合成李萨如图形。

## 4. 阻尼振动与受迫振动

- 阻尼振动：$\ddot x+2\beta\dot x+\omega_0^2x=0$。
  - 欠阻尼 $\beta<\omega_0$：振幅按 $e^{-\beta t}$ 衰减的振荡；
  - 临界阻尼 $\beta=\omega_0$：最快回到平衡且不振荡；
  - 过阻尼 $\beta>\omega_0$：缓慢回到平衡。
- 受迫振动：$\ddot x+2\beta\dot x+\omega_0^2x=\frac{F_0}{m}\cos\omega t$。
  - 稳态振幅 $A(\omega)=\frac{F_0/m}{\sqrt{(\omega_0^2-\omega^2)^2+4\beta^2\omega^2}}$；
  - 驱动频率接近固有频率时出现**共振**；
  - 品质因数 $Q\approx\frac{\omega_0}{2\beta}$，$Q$ 越大，共振峰越尖。
- 同一数学形式也描述 RLC 电路，见 [电磁学](04_electromagnetism.md)。

## 5. 耦合振动与简正模

- 两个用弹簧耦合的振子会出现两个**简正模**：同相振动和反相振动，各有自己的频率。
- 任意运动都是简正模的叠加。
- 求简正模就是求解广义特征值问题 $K\mathbf x=\omega^2M\mathbf x$，这是线性代数特征值问题最直接的物理例子。

## 6. 机械波

- 一维波动方程：$\frac{\partial^2y}{\partial t^2}=v^2\frac{\partial^2y}{\partial x^2}$。
- 简谐行波：$y=A\cos(kx-\omega t+\varphi)$。
  - 波数 $k=\frac{2\pi}{\lambda}$，角频率 $\omega=2\pi f$，波速 $v=\frac{\omega}{k}=\lambda f$。
- 弦上横波速度 $v=\sqrt{T/\mu}$（$T$ 为张力，$\mu$ 为线密度）。
- 能量与强度：强度正比于振幅平方。
- 叠加原理：线性介质中，两列波相遇后各自独立传播。
- 干涉：相位差为 $2\pi$ 的整数倍时加强，为 $\pi$ 的奇数倍时减弱。

## 7. 驻波

- 两列振幅相同、方向相反的行波叠加：$y=2A\sin kx\cos\omega t$。
- 两端固定的弦：$L=n\frac{\lambda}{2}$，固有频率 $f_n=\frac{nv}{2L}$，$n=1,2,3,\dots$
- 驻波的各个频率就是连续体的简正模，也是分离变量法求解波动方程的物理原型。

## 8. 多普勒效应与色散

- 声波多普勒效应：$f'=f\,\frac{v\pm v_o}{v\mp v_s}$（观察者靠近取上方符号，波源靠近取下方符号）。
- 色散：波速依赖频率时，波包整体的移动速度为群速度 $v_g=\frac{\mathrm d\omega}{\mathrm dk}$，与相速度 $v_p=\frac{\omega}{k}$ 不同。

## 9. 自测

1. 证明弹簧振子的机械能守恒，并求动能等于势能时的位移。
2. 写出欠阻尼振动的解，说明振幅衰减到初值 $1/e$ 所需的时间。
3. 一根两端固定的弦长 $0.5\,\mathrm m$，基频 $440\,\mathrm{Hz}$，求波速和第三谐频。
4. 两个相同质量、三根相同弹簧串联的耦合振子，求两个简正频率。

## 10. 我的疑问与补充

（学习中遇到的问题记在这里）
