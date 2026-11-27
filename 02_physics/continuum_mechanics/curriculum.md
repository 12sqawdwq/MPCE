# 连续介质力学 Continuum Mechanics, Fluids & Heat Transfer

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `PHYS-EL-01`（线弹性）· `PHYS-FL-01`（Navier–Stokes 方程）· `PHYS-TR-01`（传热与传质）· 关联 `PHYS-CL-01` |
| Phase | Phase III（III.7–III.8，M7–M8） |
| Prerequisites | [大学物理·力学](../university_physics/01_mechanics.md)；向量微积分（散度定理）；线性代数（张量、特征值）；PDE |
| Primary References | Fung, *A First Course in Continuum Mechanics* 3e；Kundu, Cohen & Dowling, *Fluid Mechanics* 6e；Bergman et al., *Fundamentals of Heat and Mass Transfer* |

---

## 1. 定位

把固体和流体看成连续分布的介质，用场量（位移、速度、应力、温度）描述。所有方程都来自同一个套路：**守恒律（积分形式）→ 散度定理 → 微分形式 + 本构关系**。这是先进制造、多物理场仿真、FEM 和 CFD 的物理基础。

## 2. 必须掌握的知识点

### 2.1 数学工具

- [ ] 张量与指标记号、爱因斯坦求和约定
- [ ] 张量的坐标变换、主值与主方向（对称矩阵特征值）
- [ ] 散度定理、雷诺输运定理

### 2.2 运动学与应力（III.7）

- [ ] 拉格朗日描述与欧拉描述，物质导数 $\frac{\mathrm D}{\mathrm Dt}=\partial_t+\mathbf v\cdot\nabla$
- [ ] 应变张量（小变形）、应变率张量
- [ ] 柯西应力张量、主应力、Mohr 圆

### 2.3 守恒律

- [ ] 质量守恒：连续性方程 $\partial_t\rho+\nabla\cdot(\rho\mathbf v)=0$
- [ ] 动量守恒：柯西运动方程 $\rho\frac{\mathrm D\mathbf v}{\mathrm Dt}=\nabla\cdot\boldsymbol\sigma+\mathbf f$
- [ ] 角动量守恒 ⇒ 应力张量对称
- [ ] 能量守恒

### 2.4 线弹性 `PHYS-EL-01`

- [ ] 胡克定律的张量形式，杨氏模量与泊松比、Lamé 常数
- [ ] Navier 方程、平面应力与平面应变
- [ ] 梁理论（Euler–Bernoulli）
- [ ] 弹性能与最小势能原理（FEM 的出发点）
- [ ] 热应力

### 2.5 流体力学 `PHYS-FL-01`（III.8）

- [ ] 理想流体：欧拉方程、伯努利方程
- [ ] 牛顿流体本构关系，Navier–Stokes 方程
- [ ] 无量纲化与相似准则：雷诺数 $Re$、普朗特数 $Pr$、佩克莱数 $Pe$
- [ ] 经典解析解：Couette 流、Poiseuille 流
- [ ] 边界层、层流与湍流（概念）

### 2.6 传热与传质 `PHYS-TR-01`

- [ ] 傅里叶导热定律与热传导方程
- [ ] 对流换热与努塞尔数，牛顿冷却
- [ ] 辐射换热
- [ ] 对流–扩散方程；菲克定律与质量扩散

## 3. 学时

约 80 h。

## 4. 验收标准

- 能从控制体守恒律出发，用散度定理推导连续性方程和柯西运动方程。
- 能从线弹性方程推导悬臂梁挠度，并与 Euler–Bernoulli 梁理论对照。
- 能推导平板 Poiseuille 流的速度剖面。
- 能对对流–扩散方程做无量纲化，并说明佩克莱数大小对解的影响。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| 线弹性、最小势能原理 | FEM `COMP-07`、结构分析与热–力耦合 `ENG-MFG-02` |
| Navier–Stokes 方程 | 有限体积法 `COMP-08`、CFD |
| 守恒律形式 | 有限体积法、大规模 PDE 仿真 `ENG-HPC-02` |
| 热传导方程 | [`heat_equation.md`](../../01_mathematics/differential_equations/heat_equation.md)、芯片热管理 |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）
