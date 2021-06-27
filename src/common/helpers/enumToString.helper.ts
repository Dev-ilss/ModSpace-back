/**
 * Converts an enum into a String
 * @param _enum Enum
 * @returns string type
 * @gist https://gist.github.com/ysp0lur/0ba6d61fb3094d69ce461080f3d22cdf
 */
export const EnumToString = (_enum: object) =>
  Object.keys(_enum)
    .map((key) => _enum[key])
    .filter((value) => typeof value === 'string') as string[];
