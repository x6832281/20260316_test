# stable-diffusion-webui：零代码用AI生成高质量图片的完整教程

**⭐ 星标**：100.0k | **📅 更新日期**：2026-05-01

---

## 📝 一句话总结

**给小说配封面、给文章配插图——不用花钱请设计师，用Stable Diffusion WebUI在本地免费生成任何你想要的图片。**

---

## 🎯 写作人为什么要关注这个项目？

你需要图片的场景：
- 📖 网文封面——一张好封面决定点击率
- 📝 文章配图——有图的文章阅读完成率高30%
- 🎨 角色设定——把小说人物可视化
- 📱 社交媒体——小红书/公众号的封面图

用Stable Diffusion WebUI，你不需要任何绘画技能，只需要描述你想要的画面，AI就能帮你画出来。

## ✍️ 写作人最常用的3种图片生成方式

### 1. 文生图（Text to Image）——从文字到图片

输入一段描述，AI生成图片：

```
提示词：a lonely old man walking with a buffalo at sunset, vast empty field, warm golden light, cinematic composition, oil painting style
```

这就能生成一张类似《活着》封面的图片。

**技巧**：提示词越具体，效果越好。不要只写"一个老人"，要写"一个穿灰色棉袄的老人，弯着腰，牵着一头老牛，夕阳下，油画风格"。

### 2. 图生图（Image to Image）——基于参考图修改

你有一张接近但不完美的图？用图生图功能，在原图基础上修改：

1. 上传参考图
2. 描述你想要的修改
3. AI基于原图生成新图

**写作场景**：你找到一张风景照，想把它改成小说封面的风格——上传照片，输入"改成水墨画风格，加一个远处的村庄"。

### 3. ControlNet——精确控制构图

想让AI按照你画的草图生成图片？ControlNet可以：

1. 画一个简单的草图（火柴人级别就行）
2. ControlNet按照草图的构图生成精美图片

**写作场景**：你脑海中有小说封面的构图，但画不出来——画个草图，让AI帮你完成。

## 🔧 安装教程（Windows）

### 方法一：一键安装包（推荐新手）

1. 下载 [Stable Diffusion WebUI 一键包](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
2. 解压到任意目录
3. 双击 `run.bat`
4. 等待自动安装（第一次需要下载模型，约5GB）
5. 浏览器自动打开 `http://localhost:7860`

### 方法二：下载模型

安装完成后，你需要下载模型（Checkpoint）才能生成图片：

**推荐模型**：
- **写实风格**：ChilloutMix、MajicMix——适合小说封面
- **二次元风格**：Anything V5、Counterfeit——适合轻小说
- **艺术风格**：DreamShaper、Deliberate——适合文艺文章配图

模型下载后放到 `models/Stable-diffusion/` 目录下。

## 💡 写作人实用提示词模板

### 小说封面
```
提示词：book cover design, [你的小说主题], dramatic lighting, [风格：oil painting/digital art/watercolor], professional book cover, text space at top
负面提示词：blurry, low quality, watermark, text, logo
```

### 文章配图
```
提示词：editorial illustration, [文章主题], clean composition, magazine style, soft colors, minimalist
负面提示词：photograph, realistic, cluttered, dark
```

### 角色设定
```
提示词：character design sheet, [角色描述], multiple angles, front view and side view, detailed face, [服装描述], white background
负面提示词：blurry, deformed, extra limbs, bad anatomy
```

## 🔗 相关链接

- [GitHub 仓库](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [模型下载站 Civitai](https://civitai.com/)
- [提示词教程](https://stable-diffusion-art.com/prompts/)
