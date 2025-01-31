export function stringifyWithOrder(
  value: any,
  depth: number = 0,
  maxDepth: number = 100,
): string {
  // 异常处理：检查递归深度是否过大
  if (depth > maxDepth) {
    throw new Error('Max recursion depth exceeded');
  }

  // 异常处理：检测非对象类型或无效的值
  if (value === undefined || value === null) {
    throw new Error('Invalid value: undefined or null cannot be serialized');
  }

  // 异常处理：BigInt、函数或Symbol等无法序列化的类型
  if (
    typeof value === 'bigint' ||
    typeof value === 'function' ||
    typeof value === 'symbol'
  ) {
    throw new Error(`Cannot serialize value of type ${typeof value}`);
  }

  // 如果是对象，排序对象的键
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      // 如果是数组，排序数组中的每个元素
      try {
        return JSON.stringify(
          value
            .map(item => stringifyWithOrder(item, depth + 1, maxDepth))
            .sort(),
        );
      } catch (error) {
        throw new Error('Error serializing array elements');
      }
    } else {
      // 如果是对象，排序键并递归处理值
      try {
        const sortedObj = Object.keys(value)
          .sort()
          .reduce((acc, key) => {
            acc[key] = stringifyWithOrder(value[key], depth + 1, maxDepth);
            return acc;
          }, {} as Record<string, any>);

        return JSON.stringify(sortedObj);
      } catch (error) {
        throw new Error('Error serializing object values');
      }
    }
  }

  // 如果是基本数据类型，直接返回
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new Error(`Error serializing value: ${value}`);
  }
}

export function parseWithOrder(
  value: string,
  depth: number = 0,
  maxDepth: number = 100,
): any {
  // 异常处理：检查递归深度是否过大
  if (depth > maxDepth) {
    throw new Error('Max recursion depth exceeded');
  }

  try {
    // 反序列化 JSON 字符串
    const parsedValue = JSON.parse(value);

    // 如果是对象，递归处理它的每个键值对
    if (typeof parsedValue === 'object' && parsedValue !== null) {
      if (Array.isArray(parsedValue)) {
        // 如果是数组，按顺序处理每个元素
        return parsedValue.map(item =>
          parseWithOrder(item, depth + 1, maxDepth),
        );
      } else {
        // 如果是对象，递归处理每个键
        const sortedObj = Object.keys(parsedValue)
          .sort()
          .reduce((acc, key) => {
            acc[key] = parseWithOrder(parsedValue[key], depth + 1, maxDepth);
            return acc;
          }, {} as Record<string, any>);
        return sortedObj;
      }
    }

    // 如果是基本数据类型，直接返回
    return parsedValue;
  } catch (error) {
    throw new Error('Error parsing the serialized value');
  }
}
