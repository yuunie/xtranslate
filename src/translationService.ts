import * as vscode from 'vscode';
import fetch from 'node-fetch';

export interface TranslationService {
    translate(text: string, from?: string, to?: string): Promise<string[]>;
}

export class GoogleTranslator implements TranslationService {
    private getMirrorUrl(): string {
        const config = vscode.workspace.getConfiguration('x-translate');
        const preset = config.get<string>('googleMirrorPreset');
        
        // 使用预设地址
        const presetUrls: { [key: string]: string } = {
            'tantu': 'https://google-translate-proxy.tantu.com',
            'iass': 'https://tr.iass.top',
            'renwole': 'https://translate.renwole.com',
            '996vin': 'https://ts.996.vin',
            'yifan': 'https://gt1.yifan.ai',
            'willbon': 'https://translate.willbon.top',
            'lvshitou': 'https://www.lvshitou.com',
            'bomea': 'http://a.bomea.com'
        };

        // 如果是自定义或预设值无效，使用自定义地址
        if (preset === 'custom' || !preset || !presetUrls[preset]) {
            return config.get('googleMirrorCustom') || 'https://translate.google.com';
        }

        return presetUrls[preset];
    }

    private isChineseText(text: string): boolean {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    async translate(text: string, from: string = 'auto', to?: string): Promise<string[]> {
        // 自动判断目标语言
        if (!to) {
            to = this.isChineseText(text) ? 'en' : 'zh-CN';
        }

        const baseUrl = this.getMirrorUrl();
        const apiUrl = new URL(`${baseUrl}/translate_a/single`);
        apiUrl.searchParams.append('client', 'gtx');
        apiUrl.searchParams.append('sl', from);
        apiUrl.searchParams.append('tl', to);
        apiUrl.searchParams.append('dt', 't');
        apiUrl.searchParams.append('dt', 'at'); // 添加备选翻译
        apiUrl.searchParams.append('q', text);

        try {
            const response = await fetch(apiUrl.toString());
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            const data = await response.json();
            
            const results: string[] = [];
            
            // 主要翻译结果
            if (data[0] && data[0][0]) {
                results.push(data[0][0][0]);
            }

            // 备选翻译结果
            if (data[1]) {
                data[1].forEach((alt: any) => {
                    if (alt[0] && !results.includes(alt[0])) {
                        results.push(alt[0]);
                    }
                });
            }

            if (results.length === 0) {
                throw new Error('未获取到翻译结果');
            }

            return results;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            throw new Error(`翻译失败: ${errorMessage}`);
        }
    }
}

// 其他翻译服务的实现可以按需添加 