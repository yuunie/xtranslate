export class TextTransformer {
    static toCamelCase(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }

    static toPascalCase(text: string): string {
        const camel = this.toCamelCase(text);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    }

    static toSnakeCase(text: string, upperCase: boolean = false): string {
        const result = text
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, '_');
        return upperCase ? result.toUpperCase() : result;
    }

    static toKebabCase(text: string, upperCase: boolean = false): string {
        const result = text
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, '-');
        return upperCase ? result.toUpperCase() : result;
    }

    private static hasSpaceOrPunctuation(text: string): boolean {
        return /[\s\-_.,!?]/.test(text);
    }

    static transformAll(text: string): Array<{ label: string; value: string }> {
        const result: Array<{ label: string; value: string }> = [];

        // 始终添加驼峰和帕斯卡命名
        result.push(
            { label: '驼峰命名', value: this.toCamelCase(text) },
            { label: '帕斯卡命名', value: this.toPascalCase(text) }
        );

        // 如果有空格或标点，添加下划线和中划线格式
        if (this.hasSpaceOrPunctuation(text)) {
            result.push(
                { label: '小写下划线', value: this.toSnakeCase(text, false) },
                { label: '大写下划线', value: this.toSnakeCase(text, true) },
                { label: '小写中划线', value: this.toKebabCase(text, false) },
                { label: '大写中划线', value: this.toKebabCase(text, true) }
            );
        }

        // 如果文本不是全大写或全小写，添加大小写转换选项
        if (text.toLowerCase() !== text) {
            result.push({ label: '小写', value: text.toLowerCase() });
        }
        if (text.toUpperCase() !== text) {
            result.push({ label: '大写', value: text.toUpperCase() });
        }

        return result;
    }
} 