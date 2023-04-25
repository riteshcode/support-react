import React, { useEffect, useState } from "react";
import Content from "layouts/content";
import { subscriptionDetailsUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import Loading from "component/Preloader";
import { useParams } from "react-router-dom";
import { Anchor, BadgeShow } from "component/UIElement/UIElement";
import FeatherIcon from "feather-icons-react";
import { SubscriptionView } from "config/PermissionName";
import WebsiteLink from "config/WebsiteLink";
import Currency from "hooks/currency";
import { Modal, Button } from "react-bootstrap";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import TransactionLog from "./TransactionLog";

function Index() {
  const { subcription_id } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [DataList, SetDataList] = useState();
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  useEffect(() => {
    let abortController = new AbortController();
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
    getData();
    return () => {
      getData();
      abortController.abort();
    };
  }, [subcription_id]);

  // transacationmodal
  const [showTransactionModal, SetshowTransactionModal] = useState(false);
  const handleShowTransactionModal = () => {
    SetshowTransactionModal(showTransactionModal ? false : true);
  };

  const [transactionLog, SetTransactionLog] = useState("");

  return (
    <Content>
      <CheckPermission IsPageAccess={SubscriptionView}>
        {contentloadingStatus ? (
          <Loading />
        ) : (
          <>
            <div className="content bd-b">
              <div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0">
                <div className="d-sm-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mg-b-5">
                      {Trans("SUBSCRIPTION_UNIQUE_ID", language)} #
                      {DataList?.subscription_unique_id}
                    </h4>
                    <p className="mg-b-0 tx-color-03">
                      Expire on {DataList?.expired_at}
                    </p>
                  </div>
                  <div className="mg-t-20 mg-sm-t-0">
                    <Anchor
                      path={WebsiteLink("/subscription")}
                      className="btn btn-primary mg-l-5"
                    >
                      <FeatherIcon icon="arrow-left" />
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
                      {Trans("BUSINESS_DETAILS", language)}
                    </label>
                    {DataList?.subscriber_business && (
                      <>
                        <h6 className="tx-15 mg-b-10">
                          {DataList.subscriber_business?.business_name} (
                          {DataList.subscriber_business?.business_unique_id} )
                        </h6>
                        <p className="mg-b-0">
                          {Trans("INDUSTRY", language)} :
                          {DataList.industry_details?.industry_name}
                        </p>
                        <p className="mg-b-0">
                          Email : {DataList.subscriber_business?.business_email}
                        </p>
                      </>
                    )}
                  </div>

                  {/* 
                  <div className="col-sm-6 tx-right d-none d-md-block">
                    <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                      {Trans("SUBSCRIPTION", language)}
                      {Trans("UniID", language)}
                    </label>
                    <h1 className="tx-normal tx-color-04 mg-b-10 tx-spacing--2">
                      #{DataList?.subscription_unique_id}
                    </h1>
                  </div> */}
                  {/* billing info details */}
                  {DataList && DataList.subscriber_business_info && (
                    <div className="col-sm-6 tx-right d-none d-md-block">
                      <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                        {Trans("BILLING_INFO", language)}
                      </label>
                      <h6 className="tx-15 mg-b-10">
                        {
                          DataList.subscriber_business_info
                            ?.billing_contact_name
                        }
                      </h6>
                      <p className="mg-b-0">
                        {Trans("EMAIL", language)} :{" "}
                        {DataList.subscriber_business_info?.billing_email}
                      </p>
                      <p className="mg-b-0">
                        {Trans("CONTACT", language)} :{" "}
                        {DataList.subscriber_business_info?.billing_phone}
                      </p>
                      <p className="mg-b-0">
                        {Trans("GST", language)} :{" "}
                        {DataList.subscriber_business_info?.billing_gst}
                      </p>
                      <p className="mg-b-0">
                        {Trans("ADDRESS", language)} :{" "}
                        {
                          DataList.subscriber_business_info
                            ?.billing_street_address
                        }
                        , {DataList.subscriber_business_info?.billing_city}
                        <br />
                        {DataList.subscriber_business_info?.billing_state},
                        {DataList.subscriber_business_info?.billing_country}, -{" "}
                        {DataList.subscriber_business_info?.billing_zipcode},
                      </p>
                    </div>
                  )}
                  {/* end billing */}
                </div>

                <div className="table-responsive mg-t-40">
                  <table className="table table-invoice bd-b">
                    <thead>
                      <tr>
                        <th className="tx-center">{Trans("ID", language)}</th>
                        <th className="tx-center">
                          {Trans("PLAN_NAME", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("PLAN_DURATION", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("PLAN_AMOUNT", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("PLAN_DISCOUNT", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("APPROVAL_STATUS", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("APPROVAL_DATE", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("PAYMENT_LINK", language)}
                        </th>
                        <th className="tx-center">
                          {Trans("Action", language)}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DataList?.subscription_history &&
                        DataList.subscription_history.map(
                          (historyData, idx) => {
                            const {
                              subs_history_id,
                              plan_amount,
                              plan_discount,
                              plan_duration,
                              plan_name,
                              approval_status,
                              approved_at,
                            } = historyData;

                            return (
                              <tr key={idx}>
                                <td className="tx-nowrap">{subs_history_id}</td>
                                <td className="tx-center">{plan_name}</td>
                                <td className="tx-center">{plan_duration}</td>
                                <td className="tx-center">
                                  {Currency("$", plan_amount)}
                                </td>
                                <td className="tx-center">{plan_discount}</td>
                                <td className="tx-center">
                                  <BadgeShow
                                    type={approval_status}
                                    content={approval_status}
                                  />
                                </td>
                                <td className="tx-center">{approved_at}</td>
                                <td className="tx-center">
                                  <a
                                    variant="primary"
                                    href={`/subscription/payment/${subs_history_id}`}
                                    target="_blank"
                                  >
                                    <FeatherIcon
                                      icon="external-link"
                                      size="18"
                                    />
                                  </a>
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      SetTransactionLog(
                                        JSON.stringify(
                                          historyData.subscription_transaction
                                        )
                                      );
                                      handleShowTransactionModal();
                                    }}
                                  >
                                    {Trans("VIEW_LOG", language)}
                                  </Button>
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* add modal */}
            <Modal show={show} onHide={handleModalClose}>
              <Modal.Header>
                <Modal.Title>{Trans("MAKE_PAYMENT", language)}</Modal.Title>
                <Button variant="danger" onClick={handleModalClose}>
                  X
                </Button>
              </Modal.Header>
              <Modal.Body>
                <PayPalScriptProvider
                  options={{
                    "client-id":
                      "AZoK2isU25D_oBhH6BNfPkriQCpdNKz4-su9frNmFduk7YANjtFr5mrb2fMuLdn3aRXiBB19x6S1Yysd",
                  }}
                >
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: "1.99",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        console.log("transaction_details", details);
                        const name = details.payer.name.given_name;
                        alert(`Transaction completed by ${name}`);
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </Modal.Body>
            </Modal>
            {/* end end modal */}

            {/* transactionlog */}
            <Modal
              show={showTransactionModal}
              onHide={handleShowTransactionModal}
              size="lg"
            >
              <Modal.Header>
                <Modal.Title>
                  {Trans("TRANSACTION_HISTORY", language)}
                </Modal.Title>
                <Button variant="danger" onClick={handleShowTransactionModal}>
                  X
                </Button>
              </Modal.Header>
              <Modal.Body>
                <TransactionLog transactionLog={transactionLog} />
              </Modal.Body>
            </Modal>
            {/* transaction_log */}
          </>
        )}
      </CheckPermission>
    </Content>
  );
}

export default Index;
