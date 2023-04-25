import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    apiToken: localStorage.getItem("access_token"),
    role: localStorage.getItem("role"),
    userType: localStorage.getItem("userType"),
    permission: localStorage.getItem("permission"),
    name: localStorage.getItem("username"),
    isAuthenticated:
      localStorage.getItem("access_token") !== null ? true : false,
    language:
      localStorage.getItem("language") !== null
        ? localStorage.getItem("language")
        : "en",
    user_id: localStorage.getItem("user_id"),
    language_list: localStorage.getItem("language_list"),
    module_list: localStorage.getItem("module_list"),
    moduleSectionList: localStorage.getItem("ModuleSectionList"),
    quickSectionList: localStorage.getItem("quickSectionList"),
    userInfo: localStorage.getItem("userInfo"),
    settingInfo: localStorage.getItem("settingInfo"),
    superSettingInfo: localStorage.getItem("superSettingInfo"),
    tempSubMenuHold: localStorage.getItem("tempSubMenuHold"),
    notiCount: localStorage.getItem("notiCount"),
    msgCount: localStorage.getItem("msgCount"),
    pusherDId: localStorage.getItem("pusherDId"),
  },
  reducers: {
    updateLoginState: (state, action) => {
      const {
        role,
        permission,
        userType,
        module_list,
        ModuleSectionList,
        quick_list,
        user,
        languageInfo,
        settingInfo,
        msgCount,
        notiCount,
        db_control,
      } = action.payload;

      const { id, first_name, last_name } = action.payload.user;
      const apiToken = action.payload.user.api_token;
      state.apiToken = apiToken;
      state.name = first_name + " " + last_name;
      state.role = role;
      state.isAuthenticated = true;
      state.permission = JSON.stringify(permission);
      state.language = "en";
      state.user_id = id;
      state.userType = userType;
      state.msgCount = msgCount;
      state.notiCount = notiCount;
      state.pusherDId = db_control;

      state.module_list = JSON.stringify(module_list);
      state.moduleSectionList = JSON.stringify(ModuleSectionList);
      state.quickSectionList = JSON.stringify(quick_list);
      state.userInfo = JSON.stringify(user);
      state.settingInfo = JSON.stringify(settingInfo);
      if (languageInfo !== "") {
        state.language_list = languageInfo?.lang_value;
        state.language = languageInfo?.language?.languages_code;
        localStorage.setItem("language_list", languageInfo?.lang_value);
        localStorage.setItem(
          "language",
          languageInfo?.language?.languages_code
        );
      }

      localStorage.setItem("access_token", apiToken);
      localStorage.setItem("role", role);
      localStorage.setItem("permission", JSON.stringify(permission));
      localStorage.setItem("username", first_name + " " + last_name);
      localStorage.setItem("user_id", id);
      localStorage.setItem("userType", userType);
      localStorage.setItem("msgCount", msgCount);
      localStorage.setItem("notiCount", notiCount);
      localStorage.setItem("pusherDId", db_control);

      localStorage.setItem("module_list", JSON.stringify(module_list));
      localStorage.setItem(
        "ModuleSectionList",
        JSON.stringify(ModuleSectionList)
      );
      localStorage.setItem("quickSectionList", JSON.stringify(quick_list));
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("settingInfo", JSON.stringify(settingInfo));
    },
    updateLangState: (state, action) => {
      const { lang, langDetails } = action.payload;
      state.language = lang;
      state.language_list = langDetails;
      localStorage.setItem("language_list", langDetails);
      localStorage.setItem("language", lang);
    },
    upNotiMsgCount: (state, action) => {
      const { count, type } = action.payload;
      if (type === "msg") {
        state.msgCount = count;
        localStorage.setItem("msgCount", count);
      } else {
        state.notiCount = count;
        localStorage.setItem("notiCount", count);
      }
    },
    updateSuperSettingState: (state, action) => {
      const json = JSON.stringify(action.payload);
      state.superSettingInfo = json;
      localStorage.setItem("superSettingInfo", json);
    },
    updateModuleListState: (state, action) => {
      const { module_list, quick_list } = action.payload;
      state.module_list = JSON.stringify(module_list);
      state.quickSectionList = JSON.stringify(quick_list);
      localStorage.setItem("module_list", JSON.stringify(module_list));
      localStorage.setItem("quickSectionList", JSON.stringify(quick_list));
    },
    logoutState: (state) => {
      state.apiToken = "";
      state.name = "";
      state.role = "";
      state.isAuthenticated = false;
      state.permission = "";
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      localStorage.removeItem("permission");
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");
      localStorage.clear();
    },

    tempSubMenu: (state, action) => {
      const temp = JSON.stringify(action.payload);
      localStorage.setItem("tempSubMenuHold", temp);
      state.tempSubMenuHold = temp;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateLoginState,
  logoutState,
  updateLangState,
  updateModuleListState,
  tempSubMenu,
  updateSuperSettingState,
  upNotiMsgCount,
} = loginSlice.actions;

export default loginSlice.reducer;
