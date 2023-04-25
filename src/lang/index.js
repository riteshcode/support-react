export const Trans = (key, language) => {
  const languageList2 = localStorage.getItem("language_list");
  // console.log("languageList2", languageList2)
  const lang = JSON.parse(languageList2);
  if (lang !== null)
    if (lang[key]) return lang[key];
    else return key;
  else return key;
};
