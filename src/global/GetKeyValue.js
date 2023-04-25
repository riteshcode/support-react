export const GetKeyValue = (key, superSettingInfo) => {
  if (superSettingInfo === null) return "";
  const res = JSON.parse(superSettingInfo);
  if (res.hasOwnProperty(key)) return res[key]; // if key exist return value
  return "";
};
