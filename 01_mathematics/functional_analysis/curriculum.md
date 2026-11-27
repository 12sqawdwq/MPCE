# 泛函分析初步 Applied Functional Analysis

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-FA-04`（Hilbert/Sobolev 空间与弱形式）· 关联 `MATH-FA-02`、`MATH-FA-03`、`MATH-LA-01` |
| Phase | Phase II 后半（与 Sturm–Liouville、Green 函数同步），在 Phase V 学习 FEM 之前必须完成 |
| Prerequisites | 线性代数（内积空间、谱定理）；一元与多元积分；傅里叶级数；分部积分与散度定理 |
| Primary References | Kreyszig, *Introductory Functional Analysis with Applications*；Brenner & Scott, *The Mathematical Theory of Finite Element Methods*, Ch. 1–2；Evans, *PDE*, Ch. 5 |

---

## 1. 定位

泛函分析把线性代数推广到无穷维的函数空间。MPCE 只需要它的"应用版"，用来回答三个问题：

1. 量子力学的波函数、傅里叶级数的系数在什么空间里？（Hilbert 空间、正交展开）
2. FEM 为什么要用弱形式？解在什么意义下存在唯一？（Sobolev 空间、Lax–Milgram 定理）
3. 微分算子的特征函数为什么能构成完备基？（自伴算子的谱理论）

## 2. 必须掌握的知识点

### 2.1 赋范空间与内积空间

- [ ] 度量、范数、内积；$\ell^p$ 与 $L^p$ 空间
- [ ] 完备性：Banach 空间、Hilbert 空间
- [ ] 柯西–施瓦茨不等式、三角不等式
- [ ] 有限维与无穷维的关键区别（有界闭集不一定紧）

### 2.2 Hilbert 空间

- [ ] 正交、正交补、投影定理（最小二乘的无穷维版本）
- [ ] 正交基、Parseval 等式、傅里叶级数作为正交展开
- [ ] Riesz 表示定理

### 2.3 线性算子

- [ ] 有界线性算子与算子范数
- [ ] 伴随算子与自伴算子
- [ ] 微分算子是无界算子；Sturm–Liouville 算子的自伴性
- [ ] 紧算子与谱定理的直观（特征值离散、特征函数完备）

### 2.4 Sobolev 空间与弱形式

- [ ] 弱导数的概念
- [ ] Sobolev 空间 $H^1$、$H^1_0$ 的定义与直观
- [ ] 从强形式 $-\nabla\cdot(k\nabla u)=f$ 推导弱形式 $a(u,v)=\ell(v)$
- [ ] 本质边界条件与自然边界条件
- [ ] Lax–Milgram 定理（陈述与使用）：有界性 + 强制性 ⇒ 存在唯一
- [ ] Galerkin 方法与 Céa 引理：FEM 误差 ≤ 常数 × 最佳逼近误差

### 2.5 分布（广义函数）初步

- [ ] δ 函数的严格含义
- [ ] 分布意义下的导数，Green 函数满足 $Lu=\delta$

## 3. 学时

约 60 h。以掌握定义、定理陈述和应用为主，严格证明可选。

## 4. 验收标准

- 能说明 $L^2$ 为什么是 Hilbert 空间，并把傅里叶级数解释为正交投影。
- 能证明 Sturm–Liouville 算子在适当边界条件下自伴，并推出特征值为实数、特征函数正交。
- 能为一维和二维 Poisson 方程写出弱形式，并验证 Lax–Milgram 定理的条件。
- 能解释量子力学中"可观测量对应自伴算子"的数学原因。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| Hilbert 空间、自伴算子 | 量子力学 `PHYS-QM-01` |
| 弱形式、Lax–Milgram、Céa 引理 | FEM `COMP-07`、线弹性 `PHYS-EL-01` |
| 正交投影、Parseval | 傅里叶分析 `MATH-FA-01`、谱方法 `COMP-04` |
| 算子与函数空间之间的映射 | 神经算子 `COMP-13` |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）
