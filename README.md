# Aiphoto

AI艺术工坊 - 智能绘画生成器

## 简介
这是一个基于AI的绘画生成工具，可以根据用户输入的中文描述自动生成相应的图片。项目使用纯前端技术实现，通过调用Pollinations.ai的API来进行图片生成，并使用小牛翻译API实现中英文翻译。

## 功能特点
- 中文提示词自动翻译为英文（使用小牛翻译API）
- 灵感库提供创意参考
- 多种图片尺寸和生成数量选择
- 图片质量参数调整
- 深色/浅色主题切换
- 便捷的图片下载功能

## 使用方法
1. 在文本框中输入你想要生成的图片描述
2. 选择合适的图片质量标签
3. 设置图片尺寸和生成数量
4. 点击"生成图片"按钮
5. 等待图片生成完成后，可以下载保存

## 配置小牛翻译API
本项目使用小牛翻译API进行中英文翻译，支持通过界面配置API密钥：

1. 访问 [小牛翻译开发者平台](https://niutrans.com/) 注册账号并申请API密钥
2. 在应用界面点击左上角的"⚙️ API设置"按钮
3. 在弹出的设置面板中输入你的API密钥，点击"保存"
4. API密钥会安全地存储在浏览器的本地存储中，不会上传到服务器
5. 界面右下角会显示API配置状态，点击状态图标可以快速打开设置面板

**安全性说明**：
- API密钥仅存储在浏览器的localStorage中，仅供当前设备使用
- 清除浏览器缓存或使用"清除密钥"按钮可以删除存储的API密钥
- 如果未配置API密钥，应用会自动使用原始中文提示词，不进行翻译

## 项目部署

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

## 技术实现
- 纯HTML/CSS/JavaScript实现
- 使用TailwindCSS进行样式设计
- 调用Pollinations.ai API进行图片生成
- 调用小牛翻译API进行文本翻译
- 使用浏览器localStorage安全存储API密钥

## 在线体验
通过GitHub Pages访问：https://zhikanyeye.github.io/Aiphoto/