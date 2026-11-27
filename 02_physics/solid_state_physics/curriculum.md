# 固体与半导体物理 Solid State & Semiconductor Physics

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `PHYS-SS-01`（能带理论与布洛赫定理）· `PHYS-SS-02`（费米–狄拉克统计与载流子统计）· `PHYS-SS-03`（泊松–漂移–扩散模型） |
| Phase | Phase IV（IV.5–IV.6，M11–M12） |
| Prerequisites | [量子力学](../quantum_mechanics/curriculum.md)；[统计力学](../thermodynamics/curriculum.md)；傅里叶分析；[电动力学](../electromagnetism/curriculum.md)中的 Poisson 方程 |
| Primary References | Kittel, *Introduction to Solid State Physics* 8e；Streetman & Banerjee, *Solid State Electronic Devices* 7e；Ashcroft & Mermin（参考） |

---

## 1. 定位

把量子力学和统计力学用到大量原子组成的晶体上，解释为什么有导体、半导体和绝缘体，以及晶体管如何工作。本模块是半导体与集成电路方向（TCAD、器件仿真）最直接的物理基础。

## 2. 必须掌握的知识点

### 2.1 晶体结构

- [ ] 布拉维格子、原胞、晶胞；常见结构（简立方、FCC、BCC、金刚石结构）
- [ ] 倒格子、布里渊区
- [ ] X 射线衍射、布拉格定律、劳厄条件

### 2.2 晶格振动

- [ ] 一维单原子链、双原子链的色散关系
- [ ] 声子、声学支与光学支
- [ ] 德拜模型与晶格热容

### 2.3 电子能带（IV.5）`PHYS-SS-01`

- [ ] 自由电子气、费米能级、态密度
- [ ] 布洛赫定理：$\psi_{\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{\mathbf k}(\mathbf r)$
- [ ] 近自由电子模型：带隙的起源
- [ ] 紧束缚模型：一维链的能带 $E(k)=E_0-2t\cos ka$
- [ ] Kronig–Penney 模型
- [ ] 有效质量 $\frac{1}{m^*}=\frac{1}{\hbar^2}\frac{\mathrm d^2E}{\mathrm dk^2}$，空穴
- [ ] 导体、半导体、绝缘体的能带解释；直接带隙与间接带隙

### 2.4 半导体物理（IV.6）`PHYS-SS-02`、`PHYS-SS-03`

- [ ] 本征半导体：载流子浓度 $n_i$ 与温度的关系
- [ ] 掺杂：施主、受主，n 型与 p 型，费米能级位置
- [ ] 质量作用定律 $np=n_i^2$，电中性条件
- [ ] 载流子输运：漂移（迁移率）、扩散（爱因斯坦关系 $D=\mu k_BT/q$）
- [ ] 产生与复合、少子寿命、连续性方程
- [ ] 泊松–漂移–扩散方程组
- [ ] p–n 结：内建电势、耗尽区宽度、能带图、肖克利二极管方程
- [ ] MOS 电容与 MOSFET 基本原理：阈值电压、C–V 特性

## 3. 学时

约 80 h。

## 4. 验收标准

- 能推导一维紧束缚模型的能带，并由能带曲率求有效质量。
- 能用费米–狄拉克积分数值计算硅的本征载流子浓度随温度的变化。
- 能画出并解释 p–n 结的平衡能带图，标出 $E_c$、$E_v$、$E_F$ 和内建电势。
- 能写出泊松–漂移–扩散方程组，并说明每个方程的物理含义。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| 泊松–漂移–扩散模型 | TCAD 器件仿真 `ENG-SEMI-02`、Scharfetter–Gummel 有限体积格式 |
| 能带、布洛赫定理 | DFT 能带计算 `ENG-MAT-02`、平面波方法 |
| 声子、晶格振动 | 热输运、分子动力学 |
| p–n 结、MOSFET | 半导体与集成电路 `ENG-SEMI-01` |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）
