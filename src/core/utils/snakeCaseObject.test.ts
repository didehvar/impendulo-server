import snakeCaseObject from './snakeCaseObject';

test('snake cases an object recursively', () => {
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

test('snake cases arrays', () => {
  const arr = [{ 'Obi-Wan': 'hello' }, 'there'];

  expect(snakeCaseObject(arr)).toStrictEqual([
    {
      obi_wan: (arr[0] as any)['Obi-Wan'],
    },
    arr[1],
  ]);
});
