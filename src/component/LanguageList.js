import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useSelector, useDispatch } from "react-redux";
import { languageUrl } from "config";

export default function LanguageList() {
  const { apiToken, language } = useSelector((state) => state.login);
  const formData = {
    api_token: apiToken,
  };

  const [langList, SetlangList] = useState([]);
  POST(languageUrl, formData)
    .then((response) => {
      const { status, data, message } = response.data;
      if (status) {
        SetlangList(data.data);
      } else alert(message);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });

  return langList;
}
