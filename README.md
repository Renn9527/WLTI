# WLTI - 王蕾倾向指数测试

> MBTI过时了，SBTI过时了，CSTI过时了——WLTI的时代来了！

## 项目简介

WLTI（Wang Lei Tendency Index）是一个致敬抖音CS女主播碳眠无郎（王蕾）的趣味人格测试项目。通过25道精心设计的题目，测试你的"王蕾人格类型"。

灵感来源：[SBTI项目](https://pingfanfan.github.io/SBTI/)

## 五大维度

- **W - 抽象度**
- **L - 撒娇度**
- **T - 冲动度**
- **I - 反撩度**
- **Q - 气质度**

## 20种人格类型

包括但不限于：
- 碳眠无郎（全满型）
- 可爱小猫
- 王老急
- 高冷枪女
- 恩师王蕾
- 训犬师
- 语言尖刀
- 科二刺客
- 上官子怡
- 炼金术士
- ...等20种独特人格


## 技术栈

- 纯HTML + CSS + JavaScript
- 无需后端，可直接部署到GitHub Pages
- 响应式设计，支持移动端

## 使用方法

1. 克隆或下载本项目
2. 直接打开 `index.html` 即可使用
3. 或部署到任何静态网站托管服务

也可以直接打开 `preview.html`，手动点选 20 种固定结果，快速检查结果卡片在桌面和手机宽度下是否稳定。

### 本地校验

可选地运行：

```bash
node scripts/standardize-result-images.js
node scripts/validate.js
```

第一条会把 `photo` 中的结果图统一生成成 1200x1200 的 JPG，并把原图备份到 `photo/_source/`。

第二条会检查脚本语法、题库与人格数据的一致性、结果图规格，以及 `index.html` 中页面挂载点和脚本顺序是否满足当前实现。

## 部署到GitHub Pages

1. Fork本项目
2. 进入仓库设置 Settings > Pages
3. 选择 main 分支作为源
4. 保存后即可通过 `https://你的用户名.github.io/WLTI/` 访问

## 文件结构

```
WLTI/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 主逻辑
├── questions.js        # 题目数据
├── results.js          # 结果计算和人格类型数据
├── README.md           # 项目说明
├── 设定集.md           # 人格类型设定
├── 资料.md             # 王蕾相关资料
└── WLTI题目设计.md     # 题目设计文档
```

## 自定义

### 修改题目
编辑 `questions.js` 文件，按照现有格式添加或修改题目。

### 修改人格类型
编辑 `results.js` 文件，修改 `personalityTypes` 对象。

### 修改样式
编辑 `style.css` 文件，可以修改颜色、字体等样式。

## 致谢

- 灵感来源：[SBTI项目](https://pingfanfan.github.io/SBTI/)

## 免责声明

本项目仅供娱乐，不代表任何官方立场。所有内容均为粉丝创作，如有不妥请联系删除。

## License

MIT License

---

**快来测测你是哪种王蕾！** 🎮✨
