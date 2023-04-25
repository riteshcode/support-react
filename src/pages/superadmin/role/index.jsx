import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Alert from "component/UIElement/Alert";
import { LoaderButton, FormGroup, Label } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import PageHeader from "component/PageHeader";
import Content from "layouts/content";
import { roleUrl, editRoleUrl, updateRoleUrl, deleteRoleUrl } from "config";
import Create from "./create";
import PermissionCheckbox from "component/PermissionCheckbox";
import Loading from "component/Preloader";
import Pagination from "component/pagination/index";
import ExportButton from "component/ExportButton";
import SearchBox from "component/SearchBox";
import RecordPerPage from "component/RecordPerPage";
import Table from "component/Table";
import "./style.css";
import { DepartmentView, DepartmentManage } from "config/PermissionName";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [rolelist, SetRoleList] = useState([]);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formShowType, setformShowType] = useState("create");

  const [Pagi, SetPagi] = useState(0);
  const [currPage, SetcurrPage] = useState(0);
  const [searchItem, SetSEarchItem] = useState("");
  const [sortByS, SetsortByS] = useState("roles_id");
  const [orderByS, SetOrderByS] = useState("DESC");
  const [perPageItem, SetPerPageItem] = useState(10);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("ID", language), field: "roles_id", sort: true },
    { label: Trans("NAME", language), field: "roles_name", sort: true },
    {
      label: Trans("PERMISSION", language),
      field: "permissionList",
      sort: false,
    },
    {
      label: Trans("ACTION", language),
      field: "action",
      action_list: ["edit_fun", "delete"],
      sort: false,
    },
  ];

  const getData = (pagev, perPageItemv, searchData, sortBys, OrderBy) => {
    const filterData = {
      api_token: apiToken,
      page: pagev,
      perPage: perPageItemv,
      search: searchData,
      sortBy: sortBys,
      orderBY: OrderBy,
    };
    POST(roleUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetRoleList(data.data);
          SetPagi(data.total_page);
          SetcurrPage(data.current_page);
        } else alert(Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const editRole = (roleID) => {
    const editData = {
      api_token: apiToken,
      updateId: roleID,
    };
    POST(editRoleUrl, editData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          setValue("updatedId", data.id);
          setValue("role_name", data.display_name);
          // set all checked value to null
          const checkedList = document.querySelectorAll(
            'input[name="editpermissionList"]'
          );
          if (checkedList.length > 0) {
            for (let i = 0; i < checkedList.length; i += 1) {
              checkedList[i].removeAttribute("checked");
            }
          }
          // assign checked true to checkd permission
          if (data.permissions.length > 0) {
            for (let index = 0; index < data.permissions.length; index += 1) {
              const nameString = data.permissions[index].id;
              document
                .querySelectorAll(`input[value="${nameString}"]`)[0]
                .setAttribute("checked", "checked");
            }
          }
        } else {
          alert(Trans(message, language));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteRole = (roleID) => {
    const editData = {
      api_token: apiToken,
      deleteId: roleID,
    };
    POST(deleteRoleUrl, editData)
      .then((response) => {
        const { message } = response.data;
        filterItem("refresh", "", "");
        alert(Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = (formData) => {
    SetformloadingStatus(true);

    const checkedList = document.querySelectorAll(
      'input[name="editpermissionList"]:checked'
    );
    if (checkedList.length === 0) {
      console.log("working");
      setMsgType("error");
      setErrorMsg(Trans("PLEASE_CHECK_PERMISSION", language));
      SetformloadingStatus(false);
    } else {
      const permissionArr = [];
      for (let i = 0; i < checkedList.length; i += 1) {
        if (checkedList[i].value !== "")
          permissionArr.push(checkedList[i].value);
      }
      const saveFormData = formData;
      saveFormData.api_token = apiToken;
      saveFormData.permission_name = permissionArr;

      POST(updateRoleUrl, saveFormData)
        .then((response) => {
          const { status, data, message } = response.data;
          if (status) {
            filterItem("refresh", "", "");
            setMsgType("success");
            setErrorMsg(Trans(message, language));
          } else {
            console.log(message);
            setMsgType("danger");
            if (typeof message === "object") {
              let errMsg = "";
              Object.keys(message).map((key) => {
                errMsg += Trans(message[key][0], language);
                return errMsg;
              });
              setErrorMsg(errMsg);
            } else {
              setErrorMsg(Trans(message, language));
            }
          }
          SetformloadingStatus(false);
        })
        .catch((error) => {
          console.log(error);
          setMsgType("danger");
          setErrorMsg("Something went wrong !");
          SetformloadingStatus(false);
        });
    }
  };
  const editRoleTe = (roleId) => {
    setformShowType("edit");
    editRole(roleId);
  };

  const filterItem = (name, value, other) => {
    switch (name) {
      case "perpage":
        SetloadingStatus(true);
        const per = Number(value);
        SetPerPageItem(per);
        getData(1, per, searchItem, sortByS, orderByS);
        break;
      case "searchbox":
        SetSEarchItem(value);
        getData(1, perPageItem, value, sortByS, orderByS);
        break;
      case "sortby":
        SetOrderByS(other);
        SetsortByS(value);
        getData(1, perPageItem, searchItem, value, other);
        break;
      case "pagi":
        SetcurrPage(value);
        getData(value, perPageItem, searchItem, sortByS, orderByS);
        break;
      default:
        getData(currPage, perPageItem, searchItem, sortByS, orderByS);
        break;
    }
  };

  useEffect(() => {
    getData(1, perPageItem, searchItem, sortByS, orderByS);
    return () => {
      getData(1, perPageItem, searchItem, sortByS, orderByS);
    };
  }, []);

  return (
    <>
      <Content>
        <PageHeader
          breadcumbs={[
            { title: Trans("DASHBOARD", language), link: "/", class: "" },
            { title: Trans("ROLES", language), link: "", class: "active" },
          ]}
          heading={Trans("ROLE_LIST", language)}
        />
        <div className="row row-xs">
          <div className="col-sm-8 col-lg-8">
            <CheckPermission IsPageAccess={DepartmentView}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <RecordPerPage
                        filterItem={filterItem}
                        perPageItem={perPageItem}
                      />
                    </div>
                    <div className="col-md-5">
                      <SearchBox filterItem={filterItem} />
                    </div>
                    <div className="col-md-5 text-right">
                      <ExportButton
                        column={[
                          { label: "Name", field: "name" },
                          { label: "PERMISSION", field: "permissionList" },
                        ]}
                        data={rolelist}
                        filename="DEPARTMENT"
                      />
                    </div>
                  </div>
                  {contentloadingStatus ? (
                    <Loading />
                  ) : (
                    <div className="row">
                      <Table
                        showColumn={showColumn}
                        dataList={rolelist}
                        deleteFun={deleteRole}
                        editFun={editRoleTe}
                        pageName="department" // for checkpermission
                        sortBy={sortByS}
                        orderBy={orderByS}
                        filterItem={filterItem}
                      />
                      <Pagination
                        totalPage={Pagi}
                        currPage={currPage}
                        filterItem={filterItem}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CheckPermission>
          </div>
          <div className="col-sm-4 col-lg-4">
            {formShowType === "create" && (
              <CheckPermission IsPageAccess={DepartmentManage}>
                <Create filterItem={filterItem} />
              </CheckPermission>
            )}
            <div
              className={`card ${formShowType === "edit" ? "show" : "hide"}`}
            >
              <div className="card-header">
                <h5>{Trans("EDIT_ROLE", language)}</h5>
                <button
                  type="button"
                  className="btn btn-danger btn-xs btn-icon"
                  onClick={() => {
                    setformShowType("create");
                  }}
                >
                  X
                </button>
              </div>
              <div className="card-body">
                {msgType.length > 2 &&
                  (msgType === "success" ? (
                    <Alert type="success">{errorMsg}</Alert>
                  ) : (
                    <Alert type="danger">{errorMsg}</Alert>
                  ))}

                <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <input {...register("updatedId")} type="hidden" />
                  <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="name">
                      {Trans("NAME", language)}
                    </Label>
                    <input
                      id="name"
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      {...register("role_name", {
                        required: "Role Name is required",
                      })}
                    />
                    {errors.role_name && <span>This field is required</span>}
                  </FormGroup>
                  <FormGroup mb="20px">
                    <Label display="block" mb="5px" htmlFor="permissionList">
                      {Trans("PERMISSION", language)}
                    </Label>
                    <PermissionCheckbox Compname="editpermissionList" />
                  </FormGroup>

                  <LoaderButton
                    formLoadStatus={formloadingStatus}
                    btnName={Trans("UPDATE", language)}
                    className="btn btn-primary btn-block"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}

export default Index;
