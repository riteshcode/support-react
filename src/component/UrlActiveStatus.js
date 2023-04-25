import { useSelector } from "react-redux";

function UrlActiveStatus() {
  const { module_list } = useSelector((state) => state.login);

  let response = {
    moduleName: "",
    sectionUrl: "",
  };

  let urlCurrent = window.location.pathname.split("/");
  let urlCurrentPath = "/";

  /* check url curr position  */
  if (urlCurrent[1] === "superadmin") {
    urlCurrentPath = urlCurrent[2];
    // delete superadmin from array to compare with db_url
    urlCurrent = urlCurrent.filter((data) => {
      return data !== "superadmin";
    });
  } else urlCurrentPath = urlCurrent[1];

  // const currenPath = urlCurrent.join("/");
  // console.log("urlCurrent", urlCurrent);
  // let currenPath = urlCurrent.join("/");   // they join all exploded data
  let currenPath = "/" + urlCurrentPath; // only bind 0 pos data

  const menuList = JSON.parse(module_list);

  if (menuList !== undefined && menuList !== "" && menuList !== null) {
    for (let index = 0; index < menuList.length; index++) {
      let IsFound = false;

      let menu = menuList[index].menu; // assign menu

      for (let menuKey = 0; menuKey < menu.length; menuKey++) {
        const submenu = menu[menuKey].submenu; // assigning sub menu
        for (let submenuKey = 0; submenuKey < submenu.length; submenuKey++) {
          if (submenu[submenuKey].section_url === currenPath) {
            IsFound = true;
            // response.sectionUrl = submenu[submenuKey].section_url;
            break;
          }
        } // sub menu

        if (IsFound) {
          // if submenu already set to true than break else go to check in menu
          response.sectionUrl = menu[menuKey].section_slug;
          break;
        }

        if (menu[menuKey].section_url === currenPath) {
          IsFound = true;
          response.sectionUrl = menu[menuKey].section_slug;
          break;
        }
      } /* menu */

      if (IsFound) {
        /* if true tell module_slug to active module */
        response.moduleName = menuList[index].module_slug;
        break;
      }
    }
  }

  return response;
}

export default UrlActiveStatus;
