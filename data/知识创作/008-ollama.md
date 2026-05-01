# Ollama 实战教程：零成本在本地跑AI写作助手

**⭐ 星标**：105.0k | **📅 更新日期**：2026-05-01

---

## 📝 一句话总结

不用花钱买API，不用把作品上传到别人的服务器——用Ollama在自己的电脑上跑AI写作助手，10分钟搞定。

---

## 🎯 写作人为什么要用Ollama？

你有没有过这样的担心：
- 用ChatGPT写东西，内容会不会被拿去训练？
- 用Claude改稿，商业机密会不会泄露？
- 每月花200块买API，但大部分时间只是改改措辞？

Ollama解决的就是这些问题：**AI跑在你自己的电脑上，数据不出你的硬盘，一分钱不花。**

## 🔧 手把手安装教程

### 第一步：安装Ollama

**Windows用户：**
1. 去 [ollama.com](https://ollama.com/) 下载安装包
2. 双击安装，一路Next
3. 安装完成后，打开命令行，输入：
```
ollama --version
```
看到版本号就说明安装成功了。

**Mac用户：**
```bash
brew install ollama
```

### 第二步：下载你的第一个AI模型

推荐写作人用的第一个模型是 **Qwen2.5**（通义千问），中文能力最强：

```bash
ollama run qwen2.5:7b
```

这条命令会自动下载模型（约4.7GB），下载完就能直接对话了。

> 💡 7b代表70亿参数，8GB内存的电脑就能跑。如果你的电脑有16GB以上内存，可以用14b版本，效果更好：
> ```bash
> ollama run qwen2.5:14b
> ```

### 第三步：测试你的AI写作助手

在命令行里直接输入：

```
>>> 请帮我改写这段话，让它更有文学感："今天天气很好，我去了公园，看到了很多花。"
```

Qwen2.5会给出改写结果。试试看！

### 第四步（推荐）：安装Open WebUI获得ChatGPT体验

命令行聊天不够直观？安装Open WebUI，获得和ChatGPT一样的网页界面：

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

然后打开浏览器访问 `http://localhost:3000`，你就有了一个本地的ChatGPT！

## ✍️ 写作人实用Prompt模板

装好Ollama后，试试这几个写作专用的Prompt：

### 1. 去AI味改写
```
请改写以下段落，要求：
1. 去掉所有空洞的形容词（"令人惊叹的""无与伦比的"）
2. 用具体的细节替代抽象的描述
3. 保持原意不变，但让文字像人写的

原文：[粘贴你的AI生成文本]
```

### 2. 仿写练习
```
请模仿以下段落的写作风格，写一段200字的[场景描写/人物对话/心理活动]：

参考段落：[粘贴经典文学段落]
```

### 3. 拆书辅助
```
请从以下角度分析这段文字：
1. 句式特点（长短、节奏、重复）
2. 修辞手法
3. 叙事视角
4. 情感层次（表面 vs 深层）

[粘贴段落原文]
```

## ⚠️ 常见问题

**Q：我的电脑配置够吗？**
A：8GB内存可以跑7b模型，16GB可以跑14b，32GB可以跑32b。显存不是必须的，Ollama支持纯CPU运行。

**Q：中文效果怎么样？**
A：Qwen2.5是目前中文能力最强的开源模型，日常写作完全够用。DeepSeek-V3也不错，但需要更好的配置。

**Q：和ChatGPT比差多少？**
A：7b模型大概相当于GPT-3.5水平，14b接近GPT-4的70%，32b可以和GPT-4掰手腕。对于改写、润色、拆书辅助这些任务，7b已经够用了。

## 🔗 相关链接

- [GitHub 仓库](https://github.com/ollama/ollama)
- [官网](https://ollama.com/)
- [Open WebUI](https://github.com/open-webui/open-webui)
- [模型库](https://ollama.com/library)
