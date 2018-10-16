import snakeCaseObject from './snakeCaseObject';

test('camel cases an object recursively', () => {
  const obj = {
    NOT_CAMEL: true,
    isCamel: {
      Objects: ['hello', false, null],
      normal: 'ok',
    },
  };

  expect(snakeCaseObject(obj)).toStrictEqual({
    is_camel: {
      normal: obj.isCamel.normal,
      objects: obj.isCamel.Objects,
    },
    not_camel: obj.NOT_CAMEL,
  });
});
