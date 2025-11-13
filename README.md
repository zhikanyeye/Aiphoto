# 🎨 Aiphoto - AI艺术工坊

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/zhikanyeye/Aiphoto?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/zhikanyeye/Aiphoto?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/zhikanyeye/Aiphoto?style=for-the-badge)

**🤖 智能绘画生成器 | 让创意触手可及**

[🌐 在线体验](https://qiyimg.3d.tc/Aiphoto/) | [📖 使用文档](#-使用指南) | [🚀 快速部署](#-快速开始) | [💬 反馈建议](https://github.com/zhikanyeye/Aiphoto/issues)

</div>

---

## ✨ 项目简介

Aiphoto 是一个基于 AI 的智能绘画生成工具，让您只需输入中文描述就能生成精美的 AI 艺术作品。项目采用纯前端架构，通过 Pollinations.ai API 提供强大的图像生成能力。

### 🎯 项目亮点

- 🌍 **中文友好**：支持中文提示词，自动翻译优化
- 🎨 **专业参数**：丰富的绘画参数调节选项
- 🤖 **AI 助手**：集成 Llama 3.3 70B 模型优化提示词
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🚀 **即开即用**：无需安装，打开即用

## 🚀 功能特性

### 核心功能
- ✅ **智能翻译**：中文提示词自动翻译为英文（小牛翻译 API）
- ✅ **AI 提示词增强**：使用 Pollinations AI (Gemini 模型) 自动优化和扩展提示词
- ✅ **多模型支持**：支持 Flux、Turbo、GPT Image 三种图像生成模型
- ✅ **灵感库**：提供丰富的创意参考和模板
- ✅ **多规格生成**：支持多种图片尺寸和批量生成
- ✅ **便捷下载**：一键下载高质量图片
- ✅ **AI 优化**：智能提示词分析与推荐

### 高级特性
- 🎨 **图像模型选择**：
  - **Flux**：标准模型，高质量，速度适中（默认）
  - **Turbo**：快速模型，生成速度快
  - **GPT Image**：创意模型，创意性强
- 🤖 **AI 提示词增强**：一键优化提示词，自动翻译并扩展细节
- 🖼️ **动态壁纸**：自动切换的精美背景壁纸
- 📊 **参数记录**：生成图片的参数信息可查看和复制
- 🔒 **安全存储**：API 密钥本地加密存储

## 📱 最新更新 (v3.0)

<details>
<summary>点击查看详细更新内容</summary>

### 🆕 新增功能 (基于最新 Pollinations API)
- 🎨 **图像模型选择器**：支持 Flux、Turbo、GPT Image 三种模型
  - Flux: 标准模型，高质量，速度适中
  - Turbo: 快速模型，生成速度快
  - GPT Image: 创意模型，创意性强
- 🤖 **AI 提示词增强**：使用 Pollinations AI (Gemini) 自动优化提示词
  - 自动翻译中文提示词为英文
  - 智能扩展提示词细节
  - 优化构图、光线、风格等描述

### 界面体验升级
- 🎨 统一浅色主题设计，提升视觉一致性
- 🌟 圆角设计语言，现代化界面美学
- ✨ 流畅的交互体验和动画效果

### API 更新
- 🔄 使用最新的 Pollinations API 格式
- 🗑️ 移除已废弃的参数（采样步数、CFG Scale、采样方法等）
- ⚡ 简化 API 调用，提升生成速度

### 技术优化
- 📱 移动端下载体验优化
- 🖼️ 自适应壁纸系统，PC/移动端分别适配
- 🔧 API 设置界面优化，更好的用户体验

</details>

## 🛠️ 技术栈

- **前端框架**：原生 HTML5 + CSS3 + JavaScript ES6+
- **UI 框架**：TailwindCSS
- **AI 服务**：Pollinations.ai API
- **翻译服务**：小牛翻译 API
- **AI 模型**：Llama 3.3 70B（提示词优化）
- **存储方案**：LocalStorage（本地安全存储）

## 🚀 快速开始

### 在线使用
直接访问 [在线版本](https://qiyimg.3d.tc/Aiphoto/) 即可开始创作！

### 本地部署

```bash
# 克隆项目
git clone https://github.com/zhikanyeye/Aiphoto.git

# 进入项目目录
cd Aiphoto

# 直接打开 index.html 或启动本地服务器
python -m http.server 8000
```

### 一键部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zhikanyeye/Aiphoto)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhikanyeye/Aiphoto)

## 📖 使用指南

### 基础使用
1. 🖋️ 在文本框中输入图片描述（支持中文）
2. 🤖 （可选）点击"AI增强提示词"按钮优化提示词
3. 🏷️ 选择合适的图片质量标签
4. 🎨 在高级设置中选择图像生成模型（Flux/Turbo/GPT Image）
5. 📐 设置图片尺寸和生成数量
6. 🎨 点击"生成图片"开始创作
7. 💾 生成完成后可下载保存

### AI 提示词增强使用
1. 输入中文或简单英文描述
2. 点击"🤖 AI增强提示词"按钮
3. AI 会自动：
   - 翻译中文为英文
   - 扩展提示词细节
   - 优化构图、光线、风格描述
4. 增强后的提示词会自动填充到输入框

### 图像模型选择
- **Flux（默认）**：适合大多数场景，质量高，速度适中
- **Turbo**：需要快速生成时使用，速度最快
- **GPT Image**：追求创意性和艺术性时使用

### API 配置

<details>
<summary>小牛翻译 API 配置步骤</summary>

1. 访问 [小牛翻译开发者平台](https://niutrans.com/) 注册并申请 API
2. 点击应用左上角 "⚙️ API设置"
3. 输入 API 密钥并保存
4. 密钥将安全存储在浏览器本地，不会上传服务器

**安全说明**：所有 API 密钥均采用本地加密存储，保障您的数据安全。

</details>

## 🎛️ 项目部署

### GitHub Pages部署（推荐）
1. 将项目Fork或推送到你自己的GitHub仓库
2. 进入仓库设置 (Settings)
3. 在左侧菜单找到Pages
4. 在"Source"部分选择"Deploy from a branch"
5. 选择"main"分支和"/(root)"目录
6. 点击"Save"后，等待几分钟即可通过提供的URL访问网站

### 本地部署
1. 将项目克隆到本地：`git clone https://github.com/zhikanyeye/Aiphoto.git`
2. 直接在浏览器中打开`index.html`文件即可使用
3. 也可使用简单的HTTP服务器（如Python的`http.server`）托管：
   ```
   python -m http.server
   ```
   然后访问 http://localhost:8000

### 其他托管服务
本项目是纯静态网站，可部署在任何支持静态网站的服务上，例如：
- Netlify
- Vercel
- Cloudflare Pages
- Amazon S3

## 🤝 贡献指南

我们欢迎任何形式的贡献！

- 🐛 **报告 Bug**：[提交 Issue](https://github.com/zhikanyeye/Aiphoto/issues/new?template=bug_report.md)
- 💡 **功能建议**：[功能请求](https://github.com/zhikanyeye/Aiphoto/issues/new?template=feature_request.md)
- 🔧 **代码贡献**：Fork 项目并提交 Pull Request
- 📖 **文档改进**：帮助完善项目文档

### 开发环境搭建

```bash
# Fork 并克隆项目
git clone https://github.com/yourusername/Aiphoto.git

# 创建功能分支
git checkout -b feature/your-feature

# 提交更改
git commit -m "Add: your feature description"

# 推送并创建 PR
git push origin feature/your-feature
```

## 📄 开源许可

本项目基于 **MIT License** 开源，详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Pollinations.ai](https://pollinations.ai/) - 提供强大的 AI 图像生成服务
- [小牛翻译](https://niutrans.com/) - 提供高质量的翻译服务
- [TailwindCSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- 所有贡献者和用户的支持 ❤️

## 📞 联系我们

- 💬 **问题反馈**：[GitHub Issues](https://github.com/zhikanyeye/Aiphoto/issues)
- 📧 **邮件联系**：[创建 Issue](https://github.com/zhikanyeye/Aiphoto/issues/new)
- 🌟 **关注项目**：点击右上角 Star 支持项目发展

---

<div align="center">

**如果这个项目对您有帮助，请给它一个 ⭐ Star！**

Made with ❤️ by [zhikanyeye](https://github.com/zhikanyeye)

</div>
