import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { subscriberDetailsUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { useParams } from "react-router-dom";
// import { Anchor } from "component/UIElement/UIElement";
// import FeatherIcon from "feather-icons-react";

function Index() {
  const { subscriber_id } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [DataList, SetDataList] = useState();
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const getData = () => {
    const filterData = {
      api_token: apiToken,
      subscriber_id: subscriber_id,
    };
    POST(subscriberDetailsUrl, filterData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetloadingStatus(false);
          SetDataList(data);
        } else alert(Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    getData();
    return () => {
      getData();
    };
  }, []);

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        {contentloadingStatus ? (
          <Loading />
        ) : (
          <>
            {DataList && (
              <>
                <PageHeader
                  breadcumbs={[
                    {
                      title: Trans("DASHBOARD", language),
                      link: "/superadmin",
                      class: "",
                    },
                    {
                      title: Trans("SUBSCRIBER_LIST", language),
                      link: "/superadmin/subscriber",
                      class: "",
                    },
                    {
                      title: DataList && DataList.subs_name,
                      link: "",
                      class: "active",
                    },
                  ]}
                  heading={DataList && DataList.subs_name}
                />
                <div className="row row-xs">
                  <div className="col-lg-3 col-xl-3 mg-t-10">
                    <div className="card">
                      <div className="card-header pd-t-20">
                        <h5 className="">{Trans("SUBS_DETAILS", language)}</h5>
                      </div>
                      <div className="card-body pd-20">
                        <p>
                          <b>{Trans("SUBS_NAME", language)}:</b>{" "}
                          {DataList && DataList.subs_name}
                        </p>
                        <p>
                          <b>{Trans("COMPANY", language)}:</b>{" "}
                          {DataList && DataList.subs_company_name}
                        </p>
                        <p>
                          <b>{Trans("EMAIL", language)}:</b>{" "}
                          {DataList && DataList.subs_email}
                        </p>
                        <p>
                          <b>{Trans("PHONE", language)}:</b>{" "}
                          {DataList && DataList.subs_contact_no}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* busineess idmm */}
                  {DataList.business && (
                    <>
                      <div className="col-lg-3 col-xl-3 mg-t-10">
                        <div className="card">
                          <div className="card-header pd-t-20">
                            <h5 className="">
                              {Trans("BUSINESS_DETAILS", language)}
                            </h5>
                          </div>
                          <div className="card-body pd-20">
                            <p>
                              <b>{Trans("BUSINESS_NAME", language)}:</b>{" "}
                              {DataList.business.business_name}
                            </p>
                            <p>
                              <b>{Trans("BUSINESS_DESC", language)}:</b>{" "}
                              {DataList.business.business_description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* end busineess id */}

                  {/* subcription list */}
                  {DataList.subscription && (
                    <>
                      <div className="col-lg-6 col-xl-6 mg-t-10">
                        <div className="card">
                          <div className="card-header pd-t-20">
                            <h5 className="">{Trans("SUBS_LIST", language)}</h5>
                          </div>
                          <div className="card-body pd-20">
                            {DataList.subscription.map((subscrip) => {
                              return (
                                <div className="card card-body">
                                  <p>
                                    <b>{Trans("UniID", language)}:</b>
                                    {subscrip.subscription_unique_id}
                                    &nbsp;&nbsp;&nbsp;
                                    <b>{Trans("SUBS_EXP_DATE", language)} : </b>
                                    {subscrip.subs_expiry_date}
                                  </p>
                                  {subscrip.subscriber_history && (
                                    <>
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th>
                                              {Trans(
                                                "TRANSACTION_ID",
                                                language
                                              )}
                                            </th>
                                            <th>{Trans("AMOUNT", language)}</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {subscrip.subscriber_history.map(
                                            (hist) => {
                                              return (
                                                <tr>
                                                  <td>{hist.transaction_id}</td>
                                                  <td>{hist.subs_amount}</td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </table>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* end busineess id */}
                </div>
              </>
            )}
          </>
        )}
      </CheckPermission>
    </Content>
  );
}

export default Index;
