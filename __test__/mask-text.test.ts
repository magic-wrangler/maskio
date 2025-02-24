import { maskText } from '../src';

describe('maskIo - maskText 字符串掩码常用场景', () => {
  test('银行卡号掩码：输入 - 1234567890123456 , 输出 - ************3456', () => {
    expect(maskText('1234567890123456', 'bankCard')).toBe('************3456');
  });

  test('证件号掩码：输入 - 360429202507200125 , 输出 - 360***********012*', () => {
    expect(maskText('360429202507200125', 'idCard')).toBe('360***********012*');
  });

  test('姓名掩码：输入 - 张三 , 输出 - *三', () => {
    expect(maskText('张三', 'userName')).toBe('*三');
  });

  test('金额掩码：输入 - 1000.00 , 输出 - *******', () => {
    expect(maskText('1000.00', 'amount')).toBe('*******');
  });

  test('验证码掩码：输入 - 123456 , 输出 - ******', () => {
    expect(maskText('123456', 'verification')).toBe('******');
  });

  test('地址掩码：输入 - 北京市朝阳区 , 输出 - ******', () => {
    expect(maskText('北京市朝阳区', 'address')).toBe('******');
  });

  test('IP地址掩码：输入 - 192.168.1.1 , 输出 - 192.168.1.***', () => {
    expect(maskText('192.168.1.1', 'ip')).toBe('192.168.1.***');
  });

  test('URL掩码：输入 - https://www.example.com/path?query=123 , 输出 - https://www.example.com/***', () => {
    expect(maskText('https://www.example.com/path?query=123', 'url')).toBe('https://www.example.com/***');
  });

  test('车牌号掩码：输入 - 京A12345 , 输出 - 京A*****', () => {
    expect(maskText('京A12345', 'licensePlate')).toBe('京A*****');
  });

  test('无效配置：输入 - 123456 , 输出 - 123456', () => {
    expect(maskText('123456', 'invalidConfig')).toBe('123456');
  });

  test('自定义规则：输入 - 123456 , 输出 - **56', () => {
    expect(maskText('123456', ['^(.*)(.{2})$', '{{*$1}}$2'])).toBe('****56');
  });
});

describe('maskIo - maskText 电话号码掩码', () => {
  const phoneTestCases = [
    { input: '13812345678', expected: '138******78', title: '大陆手机号：' },
    { input: '96123456', expected: '96****56', title: '香港手机号：' },
    { input: '66812345', expected: '66****45', title: '澳门手机号：' },
    { input: '091234567', expected: '09*****67', title: '台湾手机号：' },
    { input: '1234567890', expected: '12******90', title: '其他手机号：' },
  ];

  phoneTestCases.forEach(({ input, expected, title }) => {
    test(`${title} 输入 - ${input} , 输出 - ${expected}`, () => {
      expect(maskText(input, 'phone')).toBe(expected);
    });
  });
});

describe('maskIo - maskText 固定电话号码掩码', () => {
  const landlineTestCases = [
    { input: '010-12345678', expected: '010-******78', title: '默认固定电话：' },
    { input: '1234567890', expected: '********90', title: '其他：' },
  ];

  landlineTestCases.forEach(({ input, expected, title }) => {
    test(`${title} 输入 - ${input} , 输出 - ${expected}`, () => {
      expect(maskText(input, 'landline')).toBe(expected);
    });
  });
});

describe('maskIo - maskText 邮箱掩码', () => {
  const emailTestCases = [
    { input: 'example@gmail.com', expected: 'exam***@gmail.com', title: '前缀大于3位：' },
    { input: 'ab@gmail.com', expected: 'ab***@gmail.com', title: '前缀小于3位：' },
    { input: 'abc@gmail.com', expected: '***@gmail.com', title: '前缀等于3位：' },
    { input: 'gmail.com', expected: '*********', title: '匹配不上' },
  ];

  emailTestCases.forEach(({ input, expected, title }) => {
    test(`${title} 输入 - ${input} , 输出 - ${expected}`, () => {
      expect(maskText(input, 'email')).toBe(expected);
    });
  });
});

describe('maskIo - maskText 按规则匹配', () => {
  const config: Record<string, [string, string]> = {
    // 两位
    '^[0-9]{2}$': ['^(.{1})(.*)$', '$1{{*$2}}'],
    // 三位以上
    '^[0-9]{3,}$': ['^(.{2})(.*)$', '$1{{*$2}}'],
    // 默认匹配
    '^.*$': ['^(.*)$', '{{*$1}}'],
  };

  const rulesTestCases = [
    { input: '12', expected: '1*', title: '两数字位' },
    { input: '123456', expected: '12****', title: '三数字位以上' },
    { input: 'abcdefg', expected: '*******', title: '默认匹配' }
  ]

  rulesTestCases.forEach(({ input, expected, title }) => {
    test(`${title} 输入 - ${input} , 输出 - ${expected}`, () => {
      expect(maskText(input, config)).toBe(expected);
    });
  });
})

describe('maskIo - maskText 无效规则，切配置默认规则', () => {
  const testRules: Record<string, [string, string]> = {
    '^[a-z]+$': ['^(.*)$', '{{#$1}}']

  }
  const defaultRulesTestCases = [
    { input: '123456', expected: '******', title: '无效字符串', config: 'invalidConfig' },
    {
      input: '123456', expected: '******', title: '未匹配到规则', config: testRules
    },
  ]

  defaultRulesTestCases.forEach(({ input, expected, title, config }) => {
    test(`${title} 输入 - ${input} , 输出 - ${expected}`, () => {
      expect(maskText(input, config, 'all')).toBe(expected);
    });
  });
})
