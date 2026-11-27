# 量子力学 Quantum Mechanics

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `PHYS-QM-01`（薛定谔方程）· `PHYS-QM-02`（密度泛函理论，概要） |
| Phase | Phase IV（IV.1–IV.3，M9–M11） |
| Prerequisites | [大学物理·近代物理](../university_physics/06_modern_physics.md)；线性代数（谱定理、SVD）；傅里叶分析；Sturm–Liouville 理论；Hamilton 力学；[泛函分析初步](../../01_mathematics/functional_analysis/curriculum.md) |
| Primary References | Griffiths & Schroeter, *Introduction to Quantum Mechanics* 3e；Sakurai & Napolitano 3e；MIT 8.04 / 8.05 |

---

## 1. 定位

量子力学本质上是无穷维线性代数：态是 Hilbert 空间中的向量，可观测量是自伴算子，能级是特征值。它是固体物理、半导体器件、材料计算（DFT）和量子计算的基础。

## 2. 必须掌握的知识点

### 2.1 波函数与薛定谔方程

- [ ] 波函数的统计诠释、归一化、概率流守恒
- [ ] 含时与定态薛定谔方程，分离变量
- [ ] 期望值、动量算符 $\hat p=-i\hbar\partial_x$

### 2.2 一维定态问题（IV.2）

- [ ] 无限深势阱、有限深势阱
- [ ] 谐振子：解析法（Hermite 多项式）与阶梯算符法
- [ ] 自由粒子与波包
- [ ] δ 势、势垒散射与隧穿、透射系数

### 2.3 数学框架（IV.1）

- [ ] Hilbert 空间、Dirac 记号 $|\psi\rangle$、$\langle\phi|\psi\rangle$
- [ ] 厄米算符：本征值为实数，本征矢正交、完备
- [ ] 测量公设、态的坍缩、本征态展开
- [ ] 对易子与广义不确定关系
- [ ] 坐标表象与动量表象（傅里叶变换）
- [ ] 时间演化算符 $e^{-i\hat Ht/\hbar}$，海森堡绘景

### 2.4 三维问题

- [ ] 球坐标中的薛定谔方程，球谐函数
- [ ] 角动量算符、对易关系、本征值
- [ ] 氢原子：能级、简并度、径向波函数
- [ ] 自旋 1/2、泡利矩阵、角动量合成

### 2.5 全同粒子

- [ ] 玻色子与费米子，交换对称性
- [ ] 泡利不相容原理，多电子原子与周期表

### 2.6 近似方法（IV.3）

- [ ] 定态微扰论（非简并、简并）
- [ ] 变分法：基态能量的上界
- [ ] WKB 近似
- [ ] 含时微扰与费米黄金规则

### 2.7 多体问题概要（衔接 DFT）`PHYS-QM-02`

- [ ] Born–Oppenheimer 近似
- [ ] Hartree–Fock 思想
- [ ] Hohenberg–Kohn 定理与 Kohn–Sham 方程（概要）

## 3. 学时

约 110 h。

## 4. 验收标准

- 能解析求解无限深势阱、谐振子、氢原子能级。
- 能用阶梯算符推导谐振子能谱。
- 能用有限差分把一维薛定谔方程化成稀疏对称矩阵特征值问题，并用 `scipy.sparse.linalg.eigsh` 求解、验证收敛。
- 能用一阶微扰论和变分法估算氦原子基态能量。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| 特征值问题 $\hat H\psi=E\psi$ | 数值特征值求解 `COMP-03` |
| 周期势中的薛定谔方程 | 能带理论 `PHYS-SS-01` |
| 变分原理、Kohn–Sham 方程 | DFT `PHYS-QM-02`、材料计算 `ENG-MAT-02` |
| 含时演化 | Crank–Nicolson、分步傅里叶方法 |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）
