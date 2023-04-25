import React from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import Content from "layouts/content";
import { Trans } from "lang";
import PageHeader from "component/PageHeader";

function Index() {
  const { role, language } = useSelector((state) => state.login);
  const breadcrumb = [
    {
      title: Trans("DASHBOARD", "en"),
      link: "/",
      class: "",
    },
    {
      title: Trans("SALESMONITER", "en"),
      link: "/",
      class: "active",
    },
  ];

  const options = {
    chart: {
      id: "basic-bar",
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];

  return (
    <>
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
                Conversion Rate
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">0.81%</h3>
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
                Conversion Rate
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">0.81%</h3>
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
                Conversion Rate
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">0.81%</h3>
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
                Conversion Rate
              </h6>
              <div className="d-flex d-lg-block d-xl-flex align-items-end">
                <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">0.81%</h3>
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
          <div className="col-lg-8 col-xl-7 mg-t-10">
            <div className="card">
              <div className="card-header pd-y-20 d-md-flex align-items-center justify-content-between">
                <h6 className="mg-b-0">
                  Account & Monthly Recurring Revenue Growth
                </h6>
                <ul className="list-inline d-flex mg-t-20 mg-sm-t-10 mg-md-t-0 mg-b-0">
                  <li className="list-inline-item d-flex align-items-center">
                    <span className="d-block wd-10 ht-10 bg-df-1 rounded mg-r-5"></span>
                    <span className="tx-sans tx-uppercase tx-10 tx-medium tx-color-03">
                      Growth Actual
                    </span>
                  </li>
                  <li className="list-inline-item d-flex align-items-center mg-l-5">
                    <span className="d-block wd-10 ht-10 bg-df-2 rounded mg-r-5"></span>
                    <span className="tx-sans tx-uppercase tx-10 tx-medium tx-color-03">
                      Actual
                    </span>
                  </li>
                  <li className="list-inline-item d-flex align-items-center mg-l-5">
                    <span className="d-block wd-10 ht-10 bg-df-3 rounded mg-r-5"></span>
                    <span className="tx-sans tx-uppercase tx-10 tx-medium tx-color-03">
                      Plan
                    </span>
                  </li>
                </ul>
              </div>
              <div className="card-body pos-relative pd-0">
                <div className="pos-absolute t-20 l-20 wd-xl-100p z-index-10">
                  <div className="row">
                    <div className="col-sm-5">
                      <h3 className="tx-normal tx-rubik tx-spacing--2 mg-b-5">
                        $620,076
                      </h3>
                      <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-10">
                        MRR Growth
                      </h6>
                      <p className="mg-b-0 tx-12 tx-color-03">
                        Measure How Fast You’re Growing Monthly Recurring
                        Revenue. <a href="/">Learn More</a>
                      </p>
                    </div>
                    <div className="col-sm-5 mg-t-20 mg-sm-t-0">
                      <h3 className="tx-normal tx-rubik tx-spacing--2 mg-b-5">
                        $1,200
                      </h3>
                      <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-10">
                        Avg. MRR/Customer
                      </h6>
                      <p className="mg-b-0 tx-12 tx-color-03">
                        The revenue generated per account on a monthly or yearly
                        basis. <a href="/">Learn More</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="chart-one">
                  <div id="flotChart" className="flot-chart">
                    {/* <Chart options={options} series={series} type="donut" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-xl-5 mg-t-10">
            <div className="card">
              <div className="card-header pd-t-20 pd-b-0 bd-b-0">
                <h6 className="mg-b-5">Account Retention</h6>
                <p className="tx-12 tx-color-03 mg-b-0">
                  Number of customers who have active subscription with you.
                </p>
              </div>
              <div className="card-body pd-20">
                <div className="chart-two mg-b-20">
                  <div id="className2" className="flot-chart">
                    <Chart
                      options={options}
                      series={series}
                      type="bar"
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <h4 className="tx-normal tx-rubik tx-spacing--1 mg-b-5">
                      $1,680<small>.50</small>
                    </h4>
                    <p className="tx-11 tx-uppercase tx-spacing-1 tx-semibold mg-b-10 tx-primary">
                      Expansions
                    </p>
                    <div className="tx-12 tx-color-03">
                      Customers who have upgraded the level of your products or
                      service.
                    </div>
                  </div>
                  <div className="col-sm mg-t-20 mg-sm-t-0">
                    <h4 className="tx-normal tx-rubik tx-spacing--1 mg-b-5">
                      $1,520<small>.00</small>
                    </h4>
                    <p className="tx-11 tx-uppercase tx-spacing-1 tx-semibold mg-b-10 tx-pink">
                      Cancellations
                    </p>
                    <div className="tx-12 tx-color-03">
                      Customers who have ended their subscription with you.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}

export default Index;
