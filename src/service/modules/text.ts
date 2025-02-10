import { preset } from '../../config/preset'; // 导入预设的掩码规则
export { EPresetType } from '../../config/preset';

// 定义掩码规则类型
type MaskRulesType = keyof typeof preset;

// 定义掩码配置类型
export type MaskIoConfig = MaskRulesType | Record<string, [string, string] | MaskRulesType> | [string, string];
/**
 * 字符串掩码函数
 * @param text 要掩码的字符串
 * @param config 配置，三种格式
 * 
 * 1. 字符串：会匹配对应的预设格式
 * 2. 对象：会根据key匹配text找到对应配置
 * 3. 数组：第一项是正则匹配，第二项是需要替换的值，特殊情况：第二项如{{*$1}}的字符串，会使用*来获取$1的长度
 * 
 * config示例:
 * 'all' → text: 1234567890，输出**********，根据text的长度进行掩码
 * {'^[0-9]$': ['^(.*)$', '***'], '^[a-z]$': ['^(.*)$', '*****']} → text: 1234，输出 ***，text：abcd，输出 *****
 * ['^([0-9]{3})(.*)$', '$1{{$2}}'] → text: 123456789，输出 ******789
 * 
 * @param defaultConfig 可选的默认配置
 * 
 * @returns 掩码后的字符串或原始字符串
 */
export const maskText = (text: string, config: MaskIoConfig, defaultConfig?: MaskIoConfig) => {
  // 1. 获取最终的替换规则
  const finalConfig = resolveConfig(text, config, defaultConfig);
  // 2. 没有符合的掩码规则，直接返回原始字符串
  if (!Array.isArray(finalConfig) || finalConfig.length !== 2) {
    console.warn(`${JSON.stringify(config)}配置无效，无法掩码`);
    return text;
  }
  // 3. 使用掩码规则替换文本
  return replaceText(text, finalConfig);
}

/**
 * 解析掩码配置
 * @param text 要掩码的字符串
 * @param config 掩码配置
 * @param defaultConfig 默认掩码配置
 */
function resolveConfig(text: string, config: MaskIoConfig, defaultConfig?: MaskIoConfig): MaskIoConfig {
  // 深拷贝默认配置，避免修改原始数据
  let finalConfig = JSON.parse(JSON.stringify(config));

  // 1. 如果是预设的掩码规则，直接返回
  if (typeof finalConfig === 'string') {
    finalConfig = preset[finalConfig];
  }

  // 2. 如果传入的是对象，根据key匹配text找到对应配置
  if (!Array.isArray(finalConfig) && typeof finalConfig === 'object') {
    // 遍历对象，找到匹配的key
    const key = Object.keys(finalConfig).find((key) => new RegExp(key).test(text));
    // 更新finalConfig为对应的值
    finalConfig = finalConfig[key];
  }

  // 3. 匹配的还是字符串
  if (typeof finalConfig === 'string') {
    finalConfig = preset[finalConfig];
  }

  // 4. 最终匹配的是数组，若不是，则采用默认配置
  // finalConfig.length !== 2 -> 确保有效的掩码规则: [(掩码规则)，（替换的字符串）]
  if (!Array.isArray(finalConfig) || finalConfig.length !== 2) {
    // 使用默认配置
    finalConfig = defaultConfig;
    // 如果默认配置是字符串，则转换为预设的掩码规则
    if (typeof finalConfig === 'string') {
      finalConfig = preset[finalConfig];
    }
  }
  return finalConfig;
}

/**
 * 替换文本中的敏感信息
 * 
 * @param text - 要处理的原始文本
 * @param config - 包含掩码规则的数组，格式为 [掩码规则, 替换字符串]
 * @returns 处理后的字符串，敏感信息已被替换
 */
function replaceText(text: string, config: [string, string]): string {
  // 替换文本中的敏感信息
  const maskData = text.toString().replace(new RegExp(config[0]), config[1]);

  // 模板字符串解析、提取被 "{{" 和 "}}" 包围的内容
  const repeatReg = /\{\{([^{}]+)\}\}/g;
  return maskData.replace(repeatReg, (repaetText) => {
    // 替换掉{{}}包裹的内容，并获取其中的内容
    const text = repaetText.replace('{{', '').replace('}}', '');

    // 第一个字符作为掩码的字符
    const maskChar = text.charAt(0);

    // 去除第一个字符后的源数据
    const source = text.slice(1);

    // 返回掩码后的字符串
    return maskChar.repeat(source.length);
  });
}
