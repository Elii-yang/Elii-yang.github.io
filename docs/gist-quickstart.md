# 快速设置：GitHub Gist 统计

## 三步配置

### 1?? 创建 GitHub Token

访问 https://github.com/settings/tokens → Generate new token (classic)

- **权限**: 只勾选 `gist`
- **过期**: 建议 No expiration
- **保存 token**（只显示一次！）

### 2?? 创建 Gist

访问 https://gist.github.com/

创建文件 `website-stats.json`：

```json
{
  "visits": 0,
  "likes": 0
}
```

保存 Gist ID（URL 中的哈希值）

### 3?? 配置项目

#### 本地开发

创建 `.env.local`：

```bash
NEXT_PUBLIC_GIST_ID=你的gist_id
NEXT_PUBLIC_GITHUB_TOKEN=ghp_你的token
```

重启开发服务器：

```bash
npm run dev
```

#### GitHub Pages 部署

在仓库设置 Settings → Secrets and variables → Actions 添加：

- `GIST_ID` = 你的 Gist ID
- `GITHUB_TOKEN` = 你的 Personal Access Token

推送代码即可自动部署！

## ? 完成

访问网站，统计数据将全局同步！

---

详细文档：[docs/gist-setup.md](./gist-setup.md)
