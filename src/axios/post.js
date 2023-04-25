// import React, { useState } from "react";
import axios from "axios";
export const TempFileUpload = (url, data) => {
  // const [tmpUrl, SettmpUrl] = useState();
  axios
    .post(url, data)
    .then((res) => {
      return res;
      // SettmpUrl(res.data);
    })
    .catch((err) => {});
  return;
};

function POST(url, formdata) {
  if (localStorage.getItem("latitude") === undefined) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
      });
    }
  }
  return axios.post(url, formdata);
}

export default POST;
