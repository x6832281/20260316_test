# Git 分支操作学习计划

## 目标
学习如何在 GitHub 上创建分支、分开开发以及合并代码。

---

## 步骤概览

### 第一步：理解分支概念
- 分支是独立的工作线，不影响主线代码
- 每个人在自己的分支上开发，互不干扰
- 开发完成后通过 Merge/Pull Request 合并回主线

### 第二步：学会创建分支
```bash
# 从 main 创建新分支
git switch -c feature/分支名

# 推送到 GitHub
git push origin feature/分支名
```

### 第三步：分开开发
1. 从 `main` 拉取最新代码
2. 创建自己的功能分支
3. 在分支上正常开发、提交
4. 把分支推送到 GitHub 远程仓库
5. 其他人也各自在自己的分支上开发

### 第四步：合并代码
- **方式 A (推荐)**：在 GitHub 上创建 Pull Request → Code Review → Merge
- **方式 B**：本地 `git merge` 然后 `git push`

### 第五步：处理冲突
- 当多人修改同一文件同一行时会产生冲突
- 手动解决冲突文件中的标记（`<<<<<<<` / `=======` / `>>>>>>>`）
- `git add` + `git commit` 完成合并

### 第六步：清理分支
- 分支合并完成后可删除 `git branch -d 分支名`
- 远程分支：`git push origin --delete 分支名`

---

## 常用命令速查

| 命令 | 作用 |
|------|------|
| `git branch` | 查看本地分支 |
| `git branch -a` | 查看所有分支（含远程） |
| `git switch -c 分支名` | 创建并切换到新分支 |
| `git switch 分支名` | 切换分支 |
| `git merge 分支名` | 合并指定分支到当前分支 |
| `git branch -d 分支名` | 删除本地分支 |
| `git push origin 分支名` | 推送分支到远程 |

---

## 注意事项
- 本计划仅涉及 Git 操作学习，**不涉及任何代码修改**
- 当前项目已有 `.git` 版本控制，可直接练习
