import React from "react";
import { useSelector } from "react-redux";
import PageNotFound from "pages/error/pageNotFound";

const CheckPermission = (props) => {
  const { children, PageAccess, PageAction } = props;
  const { role, permission, moduleSectionList } = useSelector(
    (state) => state.login
  );

  if (role === "super_admin") return <>{children}</>;

  if (PageAccess === undefined) return null;

  // get section_id using section_name( user, ) static
  let moduleSection = JSON.parse(moduleSectionList);
  let pageId = "";
  for (const key in moduleSection) {
    const element = moduleSection[key];
    if (element === PageAccess) pageId = key;
  }

  // get permission_id using permission_namev static
  const permissionArr = {
    1: "add",
    2: "view",
    3: "update",
    4: "remove",
    5: "export",
    6: "print",
  };
  let actionId = "";
  for (const index in permissionArr) {
    const element = permissionArr[index];
    if (element === PageAction) actionId = index;
  }

  const permissionList = JSON.parse(permission);

  if (permissionList[pageId] === undefined) return null; //check if section_id exist in permission array
  if (permissionList[pageId][actionId] === undefined) return null; //check if section_id and permission_id exist in permission array

  if (permissionList[pageId][actionId] !== "none") {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return null;
};

export default CheckPermission;
