# X-Translate Pro

一个智能的 VS Code 翻译插件，支持中英文互译，并提供多种文本格式转换功能。

## 特性

- 🔄 支持中英文互译
- ✨ 智能识别源语言
- 📝 支持选中文本翻译
- ⌨️ 支持直接输入文本翻译
- 🎯 翻译结果可直接替换或插入
- 🔧 支持 Google 翻译

## 使用方法

1. 选中文本翻译：
   - 选中要翻译的文本
   - 按下 `Ctrl+Shift+X`（Mac: `Cmd+Shift+X`）
   - 在弹出的选择框中选择合适的翻译结果
   - 翻译结果会自动替换选中的文本

2. 直接输入翻译：
   - 按下 `Ctrl+Shift+X`（Mac: `Cmd+Shift+X`）
   - 在弹出的输入框中输入要翻译的文本
   - 在弹出的选择框中选择合适的翻译结果
   - 翻译结果会插入到光标位置

## 配置选项

在 VS Code 设置中可以配置以下选项：

1. 自定义镜像地址：
   ```json
   "x-translate.googleMirrorCustom": "https://translate.google.com"
   ```
   当镜像选择为 `custom` 时使用此地址

## 注意事项

1. 默认使用自定义地址模式
2. 如果当前镜像地址无法访问，可以：
   - 在自定义模式下配置其他可用的镜像地址
   - 或从预设列表中选择其他可用的镜像地址

## 更新日志

### 0.0.1
- 初始版本发布
- 支持中英文互译
- 支持选中文本和直接输入两种模式
- 支持 Google 翻译

## 致谢

- 本项目使用 [Cursor](https://cursor.sh/) AI 辅助开发
- 插件图标由 [Microsoft Designer](https://designer.microsoft.com/) AI 生成

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。 