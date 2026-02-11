# physic
# 光波相干性在线教学平台 (Optical Coherence Teaching Tool)

这是一个基于 Web 的交互式物理教学软件，旨在通过可视化模拟帮助学生理解光学中的**空间相干性**与**时间相干性**。

## 🚀 在线预览
https://physic-pguao5ebj-iris-projects-4066ea05.vercel.app/

## ✨ 核心功能
* **时间相干性模拟**：通过调节波列长度（相干时间），实时观察干涉条纹对比度的变化。
* **空间相干性演示**：模拟扩展光源对干涉条纹的影响，展示相干孔径的概念。
* **交互式参数调节**：用户可实时改变波长、缝宽、光源距离等物理参数。
* **实时绘图**：利用数学公式动态渲染光强分布曲线 $I = I_1 + I_2 + 2\sqrt{I_1 I_2}\cos\delta$。

## 🛠️ 技术实现 (Technical Stack)

本项目采用现代前端技术栈构建，确保了物理模拟的流畅性与交互体验：

* **Core Engine:** 基于 **React 18** 开发，利用其高效的组件化机制处理复杂的物理参数状态管理。
* **UI Components:** 使用 **Lucide React** 图标库提升视觉交互引导。
* **Physics Logic:** 纯 JavaScript 编写的干涉算法，实时计算光程差、相位及光强分布。
* **Deployment:** 通过 **Vercel** 进行自动化部署（CI/CD），确保在全球范围内拥有极速的访问体验。

## 📖 物理原理简介
### 1. 时间相干性 (Temporal Coherence)
与光源的单色性有关。相干长度 $L_c$ 与带宽 $\Delta \nu$ 的关系：
$$L_c = c \cdot \tau_c \approx \frac{\lambda^2}{\Delta \lambda}$$

### 2. 空间相干性 (Spatial Coherence)
与光源的几何尺寸有关。根据范西泰特-泽尼克定理，展示相干距离与光源张角的关系。

## 🛠️ 如何在本地运行
1. 克隆仓库:
   git clone https://github.com/Irisbusch/physic.git
2. 安装依赖:
   npm install
3. 启动项目:
   npm run dev
