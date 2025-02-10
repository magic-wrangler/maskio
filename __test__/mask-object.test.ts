import { maskObject } from '../src'

describe('maskIO - maskObject 对象掩码场景', () => {
  test('对象遍历', () => {
    const source = {
      firstCode: '123456',
      otherCode: {
        resultCode: '123',
        name: '小明',
      },
    };
    const result = {
      firstCode: '******',
      otherCode: {
        resultCode: '***',
        name: '*明',
      },
    };
    const config = { '^.*Code$': 'all', '^otherCode\.name$': 'userName' }
    expect(JSON.stringify(maskObject(source, config))).toBe(JSON.stringify(result));
  })

  test('数组遍历', () => {
    const sourceArr = [
      123,
      {
        firstCode: '123456',
        otherCode: [
          {
            resultCode: '123',
            other: '234',
          },
          123,
          235,
        ],
      }];
    const resultArr = [
      123,
      {
        firstCode: '******',
        otherCode: [
          {
            resultCode: '***',
            other: '234',
          },
          123,
          235,
        ],
      }];
    const config = { '^.*Code$': 'all' }
    expect(JSON.stringify(maskObject(sourceArr, config))).toBe(JSON.stringify(resultArr));
  })

  test('特殊数据类型', () => {
    const sourceType = { strCode: '123456', numCode: 123, funcCode: () => { }, arrCode: [1, 2], boolCode: true };
    const resultType = { strCode: '******', numCode: '***', funcCode: () => { }, arrCode: [1, 2], boolCode: true };
    const config = { '^.*Code$': 'all' }
    expect(JSON.stringify(maskObject(sourceType, config))).toBe(JSON.stringify(resultType));
  })

  test('自定义方法', () => {
    const sourceCustom = { firstCode: '123456' };
    const resultCustom = { firstCode: '*123456*' };
    const config = { '^.*Code$': (value) => `*${value}*` }
    expect(JSON.stringify(maskObject(sourceCustom, config))).toBe(JSON.stringify(resultCustom));
  })
})
