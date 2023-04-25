import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { roleAllUrl } from "../config";
import { useSelector } from "react-redux";

const RoleOptions = () => {
  const { apiToken } = useSelector((state) => state.login);
  const [roleList, setroleList] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();
    const getRoleList = () => {
      const formData = {
        api_token: apiToken,
      };
      POST(roleAllUrl, formData)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) setroleList(data);
          else alert(message);
        })
        .catch((error) => {
          // alert("Something went wrong !");
          console.error("There was an error!", error);
        });
    };
    getRoleList();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <option value="">Select Role</option>
      {roleList &&
        roleList.map((list) => {
          return (
            <option key={list.roles_id} value={list.roles_id}>
              {list.roles_name}
            </option>
          );
        })}
    </>
  );
};

export default RoleOptions;
