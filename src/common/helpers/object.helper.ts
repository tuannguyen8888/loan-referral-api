import * as _ from "lodash";

export const transformObjectKeysToSnakeCase = (data: unknown): any => {
  const parsedData = {};
  _.forEach(data, function(value: unknown, key: string) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = transformObjectKeysToSnakeCase(value);
    }
    parsedData[_.snakeCase(key)] = value;
  });
  return parsedData;
};

export const transformObjectKeysToCamelCase = (data: unknown): any => {
  const parsedData = {};
  _.forEach(data, function(value: unknown, key: string) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = transformObjectKeysToCamelCase(value);
    }
    parsedData[_.camelCase(key)] = value;
  });
  return parsedData;
};
