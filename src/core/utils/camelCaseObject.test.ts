import camelCaseObject from './camelCaseObject';

test('camel cases an object recursively', () => {
  const obj = {
    NOT_CAMEL: true,
    isCamel: {
      Objects: ['hello', false, null],
      normal: 'ok',
    },
  };

  expect(camelCaseObject(obj)).toStrictEqual({
    isCamel: {
      normal: obj.isCamel.normal,
      objects: obj.isCamel.Objects,
    },
    notCamel: obj.NOT_CAMEL,
  });
});
