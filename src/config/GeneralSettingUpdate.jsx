import { SuperGeneralSettingUrl } from "config";
import POST from "axios/post";
import { useDispatch } from "react-redux";
import {
  updateLangState,
  updateSuperSettingState,
} from "redux/slice/loginSlice";

export const GeneralSetting = async ({ lang }) => {
  const dispatch = useDispatch();

  await POST(SuperGeneralSettingUrl, {
    language: lang,
    lang_key: "backend",
  })
    .then((response) => {
      const dataVal = response.data.data.language_data.lang_value;
      const setting_data = response.data.data.setting_data;
      const formData = {
        lang: lang,
        langDetails: dataVal,
      };
      dispatch(updateLangState(formData));
      dispatch(updateSuperSettingState(setting_data));
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });

  return <></>;
};
