import React from "react";
import POST from "axios/post";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import Content from "layouts/content";
import { Trans } from "lang";
import PageHeader from "component/PageHeader";
import { useState } from "react";
import { DashboardUrl } from "config/index";
import Notify from "component/Notify";
import { BadgeShow, Anchor } from "component/UIElement/UIElement";
import WebsiteLink from "config/WebsiteLink";

function Dashboard() {
  const { role, apiToken, userType, language } = useSelector(
    (state) => state.login
  );
  const breadcrumb = [
    {
      title: Trans("DASHBOARD", language),
      link: "/",
      class: "",
    },
  ];

  const [dashboardData, SetdashboardData] = useState([]);

  React.useEffect(() => {
    const formData = {
      api_token: apiToken,
      language: language,
      userType: userType,
    };
    POST(DashboardUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        console.log("dashboardData", data);
        if (status) {
          SetdashboardData(data);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, error.message);
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <React.Fragment>
      <Content>
        <PageHeader
          EPG={true}
          breadcumbs={breadcrumb}
          heading={`${role} ${Trans("WTD", language)}`}
        />
        <div className="row row-xs">
          <div className="col-sm-6 col-lg-3">
            <div className="card card-body">
              <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-8">
                {Trans("TOTAL_ORDER", language)}
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">
                  {dashboardData?.total_orders}
                </h3>
                <p className="tx-11 tx-color-03 mg-b-0">
                  <span className="tx-medium tx-success">
                    1.2% <i className="icon ion-md-arrow-up"></i>
                  </span>{" "}
                  than last week
                </p>
              </div>
              <div className="chart-three">
                <div id="flotChart3" className="flot-chart ht-30"></div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card card-body">
              <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-8">
                {Trans("TOTAL_USERS", language)}
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">
                  {dashboardData?.total_users}
                </h3>
                <p className="tx-11 tx-color-03 mg-b-0">
                  <span className="tx-medium tx-success">
                    1.2% <i className="icon ion-md-arrow-up"></i>
                  </span>{" "}
                  than last week
                </p>
              </div>
              <div className="chart-three">
                <div id="flotChart3" className="flot-chart ht-30"></div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card card-body">
              <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-8">
                {Trans("TOTAL_PROFIT", language)}
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">
                  {dashboardData?.total_order_profit}
                </h3>
                <p className="tx-11 tx-color-03 mg-b-0">
                  <span className="tx-medium tx-success">
                    1.2% <i className="icon ion-md-arrow-up"></i>
                  </span>{" "}
                  than last week
                </p>
              </div>
              <div className="chart-three">
                <div id="flotChart3" className="flot-chart ht-30"></div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card card-body">
              <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-8">
                {Trans("TOTAL_QUOTATIONS", language)}
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">
                  {dashboardData?.total_quatations}
                </h3>
                <p className="tx-11 tx-color-03 mg-b-0">
                  <span className="tx-medium tx-success">
                    1.2% <i className="icon ion-md-arrow-up"></i>
                  </span>{" "}
                  than last week
                </p>
              </div>
              <div className="chart-three">
                <div id="flotChart3" className="flot-chart ht-30"></div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 mg-t-10">
            <div className="card">
              <div className="card-header pd-y-20 d-md-flex align-items-center justify-content-between">
                <h6 className="mg-b-0">{Trans("LATEST_ORDERS", language)}</h6>
              </div>
              <div className="card-body pos-relative pd-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{Trans("ORDER_NUMBER", language)}</th>
                      <th className="text-center">
                        {Trans("TOTAL", language)}
                      </th>
                      <th className="text-center">
                        {Trans("ORDER_STATUS", language)}
                      </th>
                      <th className="text-center">
                        {Trans("PAYMENT_STATUS", language)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.total_orders_list &&
                      dashboardData?.total_orders_list.map((order, idxx) => {
                        return (
                          <tr key={idxx}>
                            <td>
                              <Anchor
                                path={WebsiteLink(
                                  "/order/" + order?.order_number
                                )}
                              >
                                {order?.order_number}
                              </Anchor>
                            </td>
                            <td className="text-center">
                              {order?.grand_total}
                            </td>
                            <td className="text-center">
                              <BadgeShow
                                type={
                                  order?.order_status === "Deliverd"
                                    ? "active"
                                    : "pending"
                                }
                                content={order?.order_status}
                              />
                            </td>
                            <td className="text-center">
                              <BadgeShow
                                type={order?.payment_status}
                                content={order?.payment_status}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 mg-t-10">
            <div className="card">
              <div className="card-header pd-t-20 pd-b-0 bd-b-0">
                <h6 className="mg-b-5">
                  {Trans("ORDERS_STATISTICS", language)}
                </h6>
                <p className="tx-12 tx-color-03 mg-b-0">
                  {Trans("LAST_10_YEARS_ORDERS_STATISTICS", language)}
                </p>
              </div>
              <div className="card-body pd-20">
                <div className="chart-two mg-b-20">
                  <div id="className2" className="flot-chart">
                    {dashboardData?.chartItem10Year?.series && (
                      <Chart
                        options={dashboardData.chartItem10Year.options}
                        series={dashboardData.chartItem10Year.series}
                        type="bar"
                        width="100%"
                        height="100%"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </React.Fragment>
  );
}

export default Dashboard;
