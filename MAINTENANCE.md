# 个人主页维护指南

这个项目不需要安装框架，网站内容主要集中在 `index.html`。建议用 VS Code 打开整个项目文件夹，修改后通过本地预览确认效果。

## 本地预览

在项目目录中运行：

```powershell
python -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/`。修改 HTML 后刷新浏览器即可。

## 各区域对应位置

### 封面与个人名片

在 `index.html` 中搜索 `id="top"`。

- 大标题、昵称、简介：搜索 `class="hero-title"` 和 `class="hero-intro"`。
- 封面统计数字：搜索 `class="stats"`。当前核心研究方向为 `02`。
- 个人照片：搜索 `assets/ysming-profile.jpg`。
- 名片学校、所在地、研究方向标签：搜索 `class="profile-card"`。
- 替换照片时，把新照片放到 `assets/`，再修改 `img` 标签的 `src` 和 `alt`。

### 01 About

搜索 `id="about"`。

- `about-heading`：这一区域的大标题。
- `about-copy`：个人介绍正文。
- 修改学校和经历时，直接替换对应英文句子即可。

### 02 Research

搜索 `id="research"`。

两个研究点分别对应两个 `article class="research-card reveal"`：

1. `3D Reconstruction & Gaussian Splatting`
2. `SLAM & Spatial Perception`

每个卡片中都包含 `h3` 标题、`p` 简介和 `topic-list` 关键词。若要增加研究点，复制完整的 `article` 卡片并修改内容。

### 03 Work

搜索 `id="publications"`。

目前只有一个研究示例：

- 左侧编号：`class="pub-year"`，当前为 `R.01`。
- 右侧编号：`class="pub-number"`，当前为 `01`。
- 标题、作者、摘要：修改当前 `publication` 卡片中的对应文字。
- 增加一项工作时，复制整个 `article class="publication reveal"`，并同时修改左右编号。

### 04 Interests：Vibe Coding

搜索 `vibe-panel`。

目前有一张 `Academic Homepage` 仓库卡片，已经链接到当前 GitHub 仓库。若要增加新的仓库，
复制整个 `repo-card`，然后确保卡片中的链接使用这种格式：

```html
<a class="repo-action" href="https://github.com/你的用户名/仓库名" target="_blank" rel="noreferrer">
  View repository
  <svg class="icon" aria-hidden="true"><use href="#icon-arrow-up-right"></use></svg>
</a>
```

修改项目名称、描述和技术标签后即可。

### 04 Interests：旅行相册

相册入口位于 `index.html` 的 `albums-panel` 中，每个入口是一个 `album-tile`。

现有相册：

- `albums/weekend-walks.html`
- `albums/mountain-days.html`
- `albums/city-after-dark.html`

添加照片：

1. 把图片放入对应目录，例如 `assets/albums/weekend-walks/`。
2. 先压缩图片。安装 `ffmpeg` 后运行：

   ```powershell
   .\scripts\optimize-album-images.ps1
   ```

   其他相册使用 `-AlbumDirectory .\assets\albums\相册目录`。

3. 打开对应的相册 HTML。
4. 用响应式照片网格替换 `album-empty-state`：

```html
<div class="album-photo-grid">
  <figure>
    <picture>
      <source
        type="image/webp"
        srcset="
          ../assets/albums/weekend-walks/01-park-480.webp 480w,
          ../assets/albums/weekend-walks/01-park-960.webp 960w,
          ../assets/albums/weekend-walks/01-park-1600.webp 1600w
        "
        sizes="(max-width: 480px) calc(100vw - 28px), (max-width: 760px) calc(50vw - 24px), 360px"
      />
      <img
        src="../assets/albums/weekend-walks/01-park-960.webp"
        alt="Describe the photo"
        width="1600"
        height="2133"
        loading="lazy"
        decoding="async"
      />
    </picture>
    <figcaption>Optional caption</figcaption>
  </figure>
</div>
```

不要把手机原图或相机原图直接放进发布目录。原始大图应另外备份，GitHub Pages 不需要部署它们。

添加新相册：

1. 复制一个现有相册 HTML，并改成新的文件名。
2. 修改相册标题、介绍、编号和 `album-walks` / `album-mountains` / `album-city` 主题类名。
3. 在 `index.html` 的 `album-list` 中复制一个 `album-tile`，更新名称、副标题和 `href`。
4. 在 `assets/albums/` 下创建对应的照片目录。

### Contact

搜索 `id="contact"`。

- 显示邮箱：修改 `button button-light` 中的文字和 `mailto:`。
- 复制邮箱按钮：同时修改 `data-copy="..."` 中的邮箱。
- 联系区标题和介绍：直接修改该区域的英文文字。

当前页面只保留 Contact 区域这一处完整邮箱展示。

## 修改颜色与整体样式

打开 `styles.css`，文件顶部 `:root` 中包含主要颜色变量：

```css
--bg: #f3f1ea;
--ink: #18221f;
--accent: #ed5d3f;
--green: #1d6758;
```

建议只改这些颜色值，不要随意修改页面区块的 `id`，因为顶部导航依赖它们：

- `#about`
- `#research`
- `#publications`
- `#interest`
- `#contact`

## 修改后的发布流程

1. 在本地预览并检查桌面和手机布局。
2. 使用 GitHub Desktop 提交修改并推送。
3. 如果曾经部署过 GitHub Pages，推送后会自动更新。
4. 如果浏览器仍显示旧页面，提高 `index.html` 中 `styles.css?v=数字` 和 `script.js?v=数字` 的数字。

如果只改文字，通常不需要修改版本号；如果改了 `styles.css` 或 `script.js`，建议提高版本号。
