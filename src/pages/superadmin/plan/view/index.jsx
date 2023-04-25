import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { subscriptionDetailsUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { useParams } from "react-router-dom";
import { Anchor } from "component/UIElement/UIElement";
import FeatherIcon from "feather-icons-react";

function Index() {
  const { subcription_id } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [DataList, SetDataList] = useState();
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const getData = () => {
    const filterData = {
      api_token: apiToken,
      subscription_id: subcription_id,
    };
    POST(subscriptionDetailsUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        console.log(data);
        if (status) {
          SetloadingStatus(false);
          SetDataList(data);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Content>
      <CheckPermission IsPageAccess="subscription.view">
        {contentloadingStatus ? (
          <Loading />
        ) : (
          <>
            <div className="content bd-b">
              <div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0">
                <div className="d-sm-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mg-b-5">
                      {Trans("SUBSCRIPTION", language)}{" "}
                      {Trans("UniID", language)} #
                      {DataList && DataList.subscription_unique_id}
                    </h4>
                    <p className="mg-b-0 tx-color-03">
                      Expire on {DataList && DataList.subs_expiry_date}
                    </p>
                  </div>
                  <div className="mg-t-20 mg-sm-t-0">
                    <Anchor
                      path="/superadmin/subscription"
                      className="btn btn-primary mg-l-5"
                    >
                      <FeatherIcon icon="undo" />
                      Go Back
                    </Anchor>
                  </div>
                </div>
              </div>
            </div>
            <div className="content tx-13">
              <div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0">
                <div className="row">
                  <div className="col-sm-6">
                    <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                      Subscriber Details
                    </label>
                    {DataList && DataList.subscriber && (
                      <>
                        <h6 className="tx-15 mg-b-10">
                          {DataList.subscriber.subs_company_name}
                        </h6>
                        <p className="mg-b-0">
                          {DataList.subscriber.subs_name}
                        </p>
                        <p className="mg-b-0">
                          Tel No: {DataList.subscriber.subs_contact_no}
                        </p>
                        <p className="mg-b-0">
                          Email: {DataList.subscriber.subs_email}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="col-sm-6 tx-right d-none d-md-block">
                    <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                      {Trans("SUBSCRIPTION", language)}{" "}
                      {Trans("UniID", language)}
                    </label>
                    <h1 className="tx-normal tx-color-04 mg-b-10 tx-spacing--2">
                      #{DataList && DataList.subscription_unique_id}
                    </h1>
                  </div>
                </div>

                <div className="table-responsive mg-t-40">
                  <table className="table table-invoice bd-b">
                    <thead>
                      <tr>
                        <th className="wd-20p">Invoice No.</th>
                        <th className="wd-40p d-none d-sm-table-cell">Note</th>
                        <th className="tx-center">Subscription Amount</th>
                        <th className="tx-right">Discount</th>
                        <th className="tx-right">Final Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DataList &&
                        DataList.subscriber_history &&
                        DataList.subscriber_history.map((historyData, idx) => {
                          const { subs_amount } = historyData;
                          const {
                            discount_amount,
                            discount_type,
                            final_amount,
                            invoice_no,
                            note,
                            payment_status,
                          } = historyData.transaction;
                          return (
                            <>
                              <tr>
                                <td className="tx-nowrap">{invoice_no}</td>
                                <td className="d-none d-sm-table-cell tx-color-03">
                                  {note}
                                </td>
                                <td className="tx-center">${subs_amount}</td>
                                <td className="tx-right">
                                  {discount_amount}
                                  {discount_type}
                                </td>
                                <td className="tx-right">${final_amount}</td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                <div className="row justify-content-between">
                  <div className="col-sm-6 col-lg-6 order-2 order-sm-0 mg-t-40 mg-sm-t-0">
                    <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                      Notes
                    </label>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem accusantium doloremque laudantium, totam rem
                      aperiam, eaque ipsa quae ab illo inventore veritatis et
                      quasi architecto beatae vitae dicta sunt explicabo.{" "}
                    </p>
                  </div>
                  <div className="col-sm-6 col-lg-4 order-1 order-sm-0">
                    <ul className="list-unstyled lh-7 pd-r-10">
                      <li className="d-flex justify-content-between">
                        <span>Sub-Total</span>
                        <span>$5,750.00</span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Tax (5%)</span>
                        <span>$287.50</span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span>Discount</span>
                        <span>-$50.00</span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <strong>Total Due</strong>
                        <strong>$5,987.50</strong>
                      </li>
                    </ul>

                    <button className="btn btn-block btn-primary">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CheckPermission>
    </Content>
  );
}

export default Index;
