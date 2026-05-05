# LangChain：让AI记住你的写作风格，读懂你的素材库

**⭐ 星标**：80.0k | **📅 更新日期**：2026-05-01

---

## 📝 一句话总结

**LangChain是AI写作的"大脑操作系统"——它让AI能记住你的风格、读懂你的素材库、自动完成从选题到发布的全流程。**

---

## 🎯 写作人为什么要关注这个项目？

普通AI写作有一个致命问题：**AI没有记忆**。

每次打开ChatGPT，它都不记得你上次写了什么、你的写作风格是什么、你正在写哪个故事。你每次都要重新告诉它"我是谁、我在写什么、我想要什么风格"。

LangChain解决的就是这个问题——它给AI加了三个能力：

1. **记忆（Memory）**：AI记住你之前的对话和偏好
2. **工具（Tools）**：AI能搜索网页、读取文件、调用API
3. **链（Chains）**：AI能按步骤完成复杂任务

## ✍️ 写作人最该用的3个LangChain功能

### 1. RAG——让AI读懂你的素材库

你有100篇读书笔记、50篇写作素材、30篇草稿——但AI一个字都看不到。

用RAG（检索增强生成），AI就能在你的素材库里搜索相关内容，然后基于你的素材来写作：

```python
from langchain.document_loaders import DirectoryLoader
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

loader = DirectoryLoader("./my_notes/")
documents = loader.load()
vectorstore = Chroma.from_documents(documents, embeddings)
qa = RetrievalQA.from_chain_type(llm, retriever=vectorstore.as_retriever())

result = qa.run("根据我的读书笔记，写一篇关于《红楼梦》人物塑造的评论")
```

**效果**：AI不再"凭空编造"，而是基于你自己的素材来写作。

### 2. Memory——让AI记住你的风格

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.save_context({"input": "我喜欢用短句写作，不用感叹号"}, {"output": "好的，我会用短句风格"})
memory.save_context({"input": "我的写作风格类似余华"}, {"output": "明白，极简叙事风格"})
```

**效果**：AI每次对话都记得你的偏好，不用每次重复说明。

### 3. Agent——让AI自动完成写作流程

```python
from langchain.agents import initialize_agent, Tool

tools = [
    Tool(name="Search", func=search_web, description="搜索网络资料"),
    Tool(name="ReadFile", func=read_file, description="读取本地文件"),
    Tool(name="WriteFile", func=write_file, description="写入文件"),
]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description")
agent.run("搜索《活着》的书评，整理成一篇800字的读书笔记，保存到notes.md")
```

**效果**：AI自动搜索→整理→写作→保存，你只需要下指令。

## 💡 新手入门建议

LangChain的学习曲线比较陡，建议这样入门：

1. **先不用LangChain**：直接用ChatGPT/Ollama写文章，熟悉AI写作流程
2. **遇到瓶颈再用**：当你发现AI"记不住""看不到素材""不能自动操作"时，再学LangChain
3. **从RAG开始**：RAG是最实用的功能，先学会这个就够了

## 🔗 相关链接

- [GitHub 仓库](https://github.com/langchain-ai/langchain)
- [官方文档](https://python.langchain.com/)
- [LangChain 中文入门教程](https://github.com/liaokongVFX/LangChain-Chinese-Getting-Started-Guide)
