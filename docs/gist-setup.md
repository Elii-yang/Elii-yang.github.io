# GitHub Gist 统计配置指南

本项目使用 GitHub Gist 来存储全局访问统计数据（访问量和点赞数）。

## 配置步骤

### 1. 创建 GitHub Personal Access Token

1. 访问 [GitHub Token 设置页面](https://github.com/settings/tokens)
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写信息：
   - **Note**: `Website Statistics Gist`
   - **Expiration**: 选择合适的过期时间（建议选择 "No expiration"）
   - **Select scopes**: 只勾选 `gist` 权限
4. 点击 "Generate token"
5. **重要**: 复制生成的 token（只会显示一次）

### 2. 创建 GitHub Gist

1. 访问 [创建新 Gist](https://gist.github.com/)
2. 创建一个名为 `website-stats.json` 的文件
3. 初始内容：
```json
{
  "visits": 0,
  "likes": 0
}
```
4. 选择 "Create public gist" 或 "Create secret gist"（推荐使用 secret）
5. 创建后，从 URL 中复制 Gist ID
   - 例如：`https://gist.github.com/Elii-yang/abc123def456` → Gist ID 是 `abc123def456`

### 3. 配置环境变量

1. 在项目根目录创建 `.env.local` 文件（已在 .gitignore 中）
2. 添加以下内容：

```bash
NEXT_PUBLIC_GIST_ID=你的_gist_id
NEXT_PUBLIC_GITHUB_TOKEN=你的_github_token
```

**示例**：
```bash
NEXT_PUBLIC_GIST_ID=abc123def456
NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 重启开发服务器

```bash
npm run dev
```

## 工作原理

- **首次访问**: 系统从 Gist 读取当前统计数据
- **新会话**: 每个新的浏览器会话会增加访问计数（使用 sessionStorage 防止重复计数）
- **点赞**: 点击爱心图标会增加点赞数，再次点击可取消点赞
- **全局统计**: 所有访问者共享同一个 Gist 数据，实现真正的全局统计
- **容错机制**: 如果 Gist API 失败，系统会自动降级到 localStorage 本地存储

## GitHub Actions 部署配置

在 GitHub Actions 中使用统计功能，需要配置仓库的 Secrets：

1. 进入仓库设置：`Settings` → `Secrets and variables` → `Actions`
2. 添加以下 secrets：
   - `GIST_ID`: 你的 Gist ID
   - `GITHUB_TOKEN`: 你的 Personal Access Token

3. 更新 `.github/workflows/deploy.yml`，在 build 步骤前添加：

```yaml
- name: Create .env.local
  run: |
    echo "NEXT_PUBLIC_GIST_ID=${{ secrets.GIST_ID }}" > .env.local
    echo "NEXT_PUBLIC_GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}" >> .env.local
```

## 安全注意事项

?? **重要安全提醒**：

1. ? **永远不要**将 `.env.local` 文件提交到 Git
2. ? **永远不要**在代码中硬编码 token
3. ? Token 只需要 `gist` 权限，不要授予其他权限
4. ? 定期轮换 token（建议每 6-12 个月）
5. ? 如果 token 泄露，立即在 GitHub 设置中撤销

## 故障排除

### 统计不更新
- 检查 `.env.local` 文件是否存在且配置正确
- 检查浏览器控制台是否有错误信息
- 验证 GitHub token 是否有效（访问 https://github.com/settings/tokens）
- 确认 Gist 是否存在且可访问

### API 速率限制
- GitHub API 对认证请求的限制是 5000 次/小时
- 对于个人网站，这个限制通常足够
- 如果遇到限制，系统会自动降级到 localStorage

### 本地开发测试
```bash
# 检查环境变量是否加载
npm run dev

# 打开浏览器开发者工具
# 在 Console 中运行：
console.log(process.env.NEXT_PUBLIC_GIST_ID)
```

## 备用方案

如果不想使用 GitHub Gist，系统会自动降级到 localStorage（仅本地计数）：
- 不配置 `.env.local` 文件
- 系统检测到环境变量缺失时，自动使用 localStorage
- 数据存储在每个访问者的浏览器中（非全局统计）
