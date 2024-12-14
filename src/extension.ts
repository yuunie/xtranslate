import * as vscode from 'vscode';
import { GoogleTranslator, TranslationService } from './translationService';
import { TextTransformer } from './textTransformer';

export function activate(context: vscode.ExtensionContext) {
    // 跳转到扩展配置
    const openSettings = () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'xtranslate');
    };

    // 翻译命令
    let translateCommand = vscode.commands.registerCommand('xtranslate.translate', async () => {
        const editor = vscode.window.activeTextEditor;
        let text = '';
        let isInputMode = false;

        if (editor) {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                text = editor.document.getText(selection);
            }
        }
        
        // 如果没有选中文本，弹出输入框
        if (!text) {
            const input = await vscode.window.showInputBox({
                prompt: '请输入要翻译的文本',
                placeHolder: '输入文本后按回车进行翻译'
            });
            
            if (!input) {
                return;
            }
            text = input;
            isInputMode = true;
        }

        // 创建 QuickPick 实例
        const quickPick = vscode.window.createQuickPick();
        quickPick.placeholder = '正在翻译...';
        quickPick.busy = true;
        quickPick.matchOnDescription = true;
        quickPick.items = [{ label: '正在翻译...' }];
        quickPick.show();

        try {
            const translator = new GoogleTranslator();

            // 设置超时提示
            const timeoutId = setTimeout(() => {
                vscode.window.showInformationMessage(
                    '请求响应较慢，请耐心等待或考虑切换其他镜像地址',
                    '打开设置'
                ).then(selection => {
                    if (selection === '打开设置') {
                        openSettings();
                    }
                });
            }, 10000);

            // 执行翻译
            const translatedTexts = await translator.translate(text);
            
            // 清除超时提示
            clearTimeout(timeoutId);
            
            // 更新选择项
            quickPick.busy = false;
            
            // 检查翻译结果是否包含中文
            const containsChinese = translatedTexts.some(t => /[\u4e00-\u9fa5]/.test(t));
            
            let items: Array<{ label: string; description?: string; detail?: string; value: string }> = [];
            
            if (containsChinese) {
                // 如果是中文结果，显示所有翻译结果
                items = translatedTexts.map(t => {
                    const isLongText = text.length > 50 || t.length > 50;
                    return {
                        label: isLongText ? '...' : t,
                        description: text,
                        detail: isLongText ? `${t}\n${text}` : undefined,
                        value: t
                    };
                });
                quickPick.placeholder = '选择翻译结果';
            } else {
                // 如果不是中文结果，为每个翻译结果生成所有格式选项
                translatedTexts.forEach(t => {
                    const transformedTexts = TextTransformer.transformAll(t);
                    items.push(...transformedTexts.map(item => ({
                        label: item.value.length > 50 ? '...' : item.value,
                        detail: item.value.length > 50 ? item.value : undefined,
                        value: item.value
                    })));
                    
                    const isLongText = text.length > 50 || t.length > 50;
                    items.push({
                        label: isLongText ? '...' : t,
                        description: text,
                        detail: isLongText ? `${t}\n${text}` : undefined,
                        value: t
                    });
                });
                quickPick.placeholder = '选择要使用的格式';
            }

            quickPick.items = items;

            // 监听选择事件
            quickPick.onDidAccept(() => {
                const selected = quickPick.selectedItems[0] as { label: string; description?: string; detail?: string; value: string };
                if (selected && selected.value && editor) {
                    if (!isInputMode && !editor.selection.isEmpty) {
                        // 如果是选中文本模式，替换选中的文本
                        editor.edit(editBuilder => {
                            editBuilder.replace(editor.selection, selected.value);
                        });
                    } else {
                        // 如果是输入框模式或没有选中文本，在光标位置插入
                        editor.edit(editBuilder => {
                            editBuilder.insert(editor.selection.active, selected.value);
                        });
                    }
                }
                quickPick.dispose();
            });

            // 监听隐藏事件
            quickPick.onDidHide(() => {
                quickPick.dispose();
            });

        } catch (error) {
            quickPick.dispose();
            vscode.window.showErrorMessage(
                `翻译失败: ${error instanceof Error ? error.message : '未知错误'}`,
                '打开设置'
            ).then(selection => {
                if (selection === '打开设置') {
                    openSettings();
                }
            });
        }
    });

    context.subscriptions.push(translateCommand);
}

export function deactivate() {} 