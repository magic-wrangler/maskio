import { maskText, MaskIoConfig } from './text';

type FiledHandler = (val: number | string, pathAr?: any[]) => string;

/**
 * 递归掩码JSON
 * @param obj - 待处理的对象或数组
 * @param config - 配置项，键为路径，值为掩码配置或字段处理函数
 * @returns 处理后的对象
 */
export const maskObject = (
  obj: Record<string, any> | any[],
  config: Record<string, MaskIoConfig | FiledHandler>,
) => {
  return recursiveObject(obj, config, []);
}

/**
 * 递归处理对象，支持掩码和自定义处理
 *
 * @param obj - 待处理对象
 * @param config - 配置项，键为路径，值为掩码配置或字段处理函数
 * @param pathArr - 路径数组，默认为空数组
 * @returns 处理后的对象
 */
function recursiveObject(
  obj: any,
  config: Record<string, MaskIoConfig | FiledHandler>,
  pathArr: any[],
) {
  // 判断是否是对象
  if (typeof obj !== 'object') {
    return handleValue(obj, config, pathArr);
  }
  // 创建一个新的对象|数组 newObj
  const newObj: Record<string, any> = Array.isArray(obj) ? [] : {};
  // 遍历obj, newObj进行赋值
  Object.keys(obj).forEach((key) => {
    pathArr.push(key);
    newObj[key] = recursiveObject(obj[key], config, pathArr);
    pathArr.pop();
  });
  return newObj;
}

/**
 * 处理基本类型值
 *
 * @param value - 待处理值
 * @param config - 配置对象
 * @param pathArr - 路径数组
 * @returns 处理后的值
 */
function handleValue(value: any, config: Record<string, MaskIoConfig | FiledHandler>, pathArr: any[]): any {
  // 1.判断value数字或字符串, 不是直接返回原值
  if (typeof value === 'number' || typeof value === 'string') {
    // 1.1找到匹配的掩码规则
    const maskType = config[Object.keys(config).find(key => new RegExp(key).test(pathArr.join('.')))];
    // 1.2掩码规则是个函数，返回调用函数处理的值
    if (typeof maskType === 'function') {
      return maskType(value, pathArr);
    }
    // 1.3普通的正则表达式，掉用字符串掩码方法，返回掩码数据
    if (maskType) {
      return maskText(value.toString(), maskType as MaskIoConfig);
    }
  }
  // 2.未匹配到规则，返回原数据
  return value;
}
