import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { attendanceUrl, userUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import Loading from "component/Preloader";
import ExportButton from "component/ExportButton";
import Table from "./Table";
import { PageAttendance, PreView, PreExport } from "config/PermissionName";
import CheckPermission from "helper";

function Index() {
  const { apiToken, language } = useSelector((state) => state.login);
  const [dataList, SetdataList] = useState([]);
  const sortByS = useState("leave_id");
  const orderByS = useState("DESC");
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const showColumn = [
    { label: Trans("ID", language), field: "attendance_id", sort: true },
    { label: Trans("User", language), field: "user_name", sort: true },
    { label: Trans("Date", language), field: "attendance_date", sort: false },
    { label: Trans("Check-in", language), field: "check_in", sort: false },
    { label: Trans("Check-out", language), field: "check_out", sort: false },
  ];

  const getList = (user_id, month) => {
    SetloadingStatus(true);
    const filterData = {
      api_token: apiToken,
      user_id: user_id,
      month: month,
    };
    POST(attendanceUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          SetdataList(data);
        } else alert(message);
        SetloadingStatus(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);

        SetloadingStatus(false);
      });
  };

  const [getUserList, SetUserList] = useState();

  useEffect(() => {
    let abortController = new AbortController();

    getList("", "");
    function getUserList() {
      const filterData = {
        api_token: apiToken,
      };
      POST(userUrl, filterData)
        .then((response) => {
          console.log(response);
          const { status, data, message } = response.data;
          if (status) {
            SetUserList(data.data);
          } else alert(Trans(message, language));
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
    getUserList();

    return () => {
      abortController.abort();
      // getList("", "");
      // getUserList();
    };
  }, []);

  const months = [
    { name: "January", val: 1 },
    { name: "Feb", val: 2 },
    { name: "Mar", val: 3 },
    { name: "Apr", val: 4 },
    { name: "May", val: 5 },
    { name: "Jane", val: 6 },
    { name: "July", val: 7 },
    { name: "Aug", val: 8 },
    { name: "Sept", val: 9 },
    { name: "Oct", val: 10 },
    { name: "Nov", val: 11 },
    { name: "Dec", val: 12 },
  ];

  const breadcrumb = [
    {
      title: Trans("DASHBOARD", "en"),
      link: "/",
      class: "",
    },
    {
      title: Trans("ATTENDANCE", "en"),
      link: "/",
      class: "active",
    },
  ];

  const HandleFilterData = () => {
    const user_id = document.getElementById("user_id").value;
    const month = document.getElementById("months").value;
    getList(user_id, month);
  };
  return (
    <Content>
      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <CheckPermission PageAccess={PageAttendance} PageAction={PreView}>
            <PageHeader
              breadcumbs={breadcrumb}
              heading={`${Trans("ATTENDANCE_REPORT", language)}`}
            />
            <div className="card" id="custom-user-list">
              <h3 className="card-header">
                {Trans("ATTENDANCE_REPORT", language)}
              </h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-3">
                        <select
                          name="user_id"
                          id="user_id"
                          className="form-control"
                        >
                          <option value="">
                            {Trans("SELECT_USER", language)}
                          </option>
                          {getUserList &&
                            getUserList.map((user) => {
                              return (
                                <option value={user.id} key={user.id}>
                                  {user.first_name} {user.lastst_name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          name="months"
                          id="months"
                          className="form-control"
                        >
                          <option value="">
                            {Trans("SELECT_MONTH", language)}
                          </option>
                          {months &&
                            months.map((months) => {
                              return (
                                <option value={months.val} key={months.val}>
                                  {months.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <button
                          className="btn btn-info"
                          onClick={HandleFilterData}
                        >
                          {Trans("SEARCH", language)}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 text-right">
                    <CheckPermission
                      PageAccess={PageAttendance}
                      PageAction={PreExport}
                    >
                      <ExportButton
                        column={showColumn}
                        data={dataList}
                        filename="Attendance"
                      />
                    </CheckPermission>
                  </div>
                </div>
                {contentloadingStatus ? (
                  <Loading />
                ) : (
                  <div className="row">
                    <Table
                      showColumn={showColumn}
                      dataList={dataList}
                      pageName="Attendance" // for checkpermission
                      sortBy={sortByS}
                      orderBy={orderByS}
                    />
                  </div>
                )}
              </div>
            </div>
          </CheckPermission>
        </div>
      </div>
    </Content>
  );
}

export default Index;
