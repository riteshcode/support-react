import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { Trans } from "lang/index";
import { OrdersDetailsUrl, OrdersChangeStatusUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import Notify from "component/Notify";
import WebsiteLink from "config/WebsiteLink";
import Moment from "react-moment";
import { GenerateHtmlToPdf } from "component/GenerateHtmlToPdf";

const StatusBadge = ({ color, msg }) => {
  return (
    <React.Fragment>
      <span className={`badge badge-${color}`}>{msg}</span>
    </React.Fragment>
  );
};

function Detail() {
  const { orderNumber } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [EditData, setData] = useState();
  const [billingAdd, SetBillingAdd] = useState([]);
  const [shippingAdd, SetShippingAdd] = useState([]);
  const [item, SetItem] = useState([]);

  const productDetail = () => {
    const editData = {
      api_token: apiToken,
      order_number: orderNumber,
    };

    POST(OrdersDetailsUrl, editData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          console.log("data", data);
          setData(data);
          if (data !== null) {
            SetBillingAdd(data.address !== null ? data.address[0] : []);
            SetShippingAdd(data.address !== null ? data.address[1] : []);
            SetItem(data.item);
          }
        } else {
          Notify(false, Trans(message, language));
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    productDetail(); // product details
    return () => abortController.abort();
  }, []);

  const statusArr = ["Deleted", "Pending", "Accepted", "Declined"];

  // generate pdf for quatation

  const printDocument = (quotationId) => {
    GenerateHtmlToPdf("divToPrint", `QUOTE_${quotationId}.pdf`);
  };

  const ChangeFunction = (orderId, payment_status, order_status) => {
    debugger;
    const editData = {
      api_token: apiToken,
      order_id: orderId,
      payment_status: payment_status,
      order_status: order_status,
    };
    POST(OrdersChangeStatusUrl, editData)
      .then((response) => {
        const { message } = response.data;
        productDetail();
        Notify(true, Trans(message, language));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          {
            title: Trans("DASHBOARD", language),
            link: WebsiteLink("/"),
            class: "",
          },
          {
            title: Trans("ORDER", language),
            link: WebsiteLink("/orders"),
            class: "",
          },
          { title: Trans("DETAIL", language), link: "", class: "active" },
        ]}
        // heading={Trans("VIEW_STAFF", language)}
      />

      <div className="">
        <div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0">
          <div className="d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 className="mg-b-5">
                {Trans("ORDER_NUMBER", language)} #{EditData?.order_number}
              </h4>
              <p className="mg-b-0 tx-color-03">
                <Moment format="Do MMMM YYYY">{EditData?.created_at}</Moment>
              </p>
            </div>
            <div className="mg-t-20 mg-sm-t-0">
              <button
                className="btn btn-info"
                onClick={() => {
                  window.print();
                }}
              >
                <FeatherIcon icon="printer" /> {Trans("Print", language)}
              </button>
              <button
                className="btn btn-primary mg-l-5"
                onClick={() => printDocument(EditData?.order_number)}
              >
                <FeatherIcon icon="download" /> {Trans("DOWNLOAD", language)}
              </button>
              {"  "}
              {/* <a
                target="_BLANK"
                className="btn btn-primary mg-l-5"
                href={WebsiteLink(
                  `/quotation/payment/${btoa(
                    EditData?.order_number + "::" + EditData?.quotation_id
                  )}/${EditData?.order_number}`
                )}
              >
                <FeatherIcon icon="download" /> {Trans("SHARE", language)}
              </a> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5" id="divToPrint">
        <div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0">
          <div className="row">
            <div className="col-sm-6">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                Billed From
              </label>
              <h6 className="tx-15 mg-b-10">ThemePixels, Inc.</h6>
              <p className="mg-b-0">
                201 Something St., Something Town, YT 242, Country 6546
              </p>
              <p className="mg-b-0">Tel No: 324 445-4544</p>
              <p className="mg-b-0">Email: youremail@companyname.com</p>
            </div>
            <div className="col-sm-6 tx-right d-none d-md-block">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("ORDER_NUMBER", language)}
              </label>
              <h1 className="tx-normal tx-color-04 mg-b-10 tx-spacing--2">
                #{EditData?.order_number}
              </h1>
            </div>
            {/* billing adrres */}
            {billingAdd && (
              <React.Fragment>
                <div className="col-sm-6 col-lg-6 mg-t-40 mg-sm-t-0 mg-md-t-40">
                  <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                    {Trans("BILL_TO", language)}
                  </label>
                  <h6 className="tx-15 mg-b-10">{billingAdd.company_name}</h6>
                  <p className="mg-b-0">
                    {billingAdd?.customer_address} ,{billingAdd?.customer_city},
                    {billingAdd?.customer_state},
                  </p>
                  <p className="mg-b-0">
                    {billingAdd?.customer_country}, -{" "}
                    {billingAdd?.customer_postcode}
                  </p>
                  <p className="mg-b-0">
                    Contact Person : {billingAdd?.customer_name}
                  </p>
                  <p className="mg-b-0">
                    Tel No : {billingAdd?.customer_phone}
                  </p>
                  <p className="mg-b-0">Email : {billingAdd?.customer_email}</p>
                </div>
              </React.Fragment>
            )}

            <div className="col-sm-6 col-lg-6 mg-t-40 text-right">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("SHIP_TO", language)}
              </label>
              <h6 className="tx-15 mg-b-10">{shippingAdd.company_name}</h6>
              <p className="mg-b-0">
                {shippingAdd?.customer_address} ,{shippingAdd?.customer_city},
                {shippingAdd?.customer_state},
              </p>
              <p className="mg-b-0">
                {shippingAdd?.customer_country}, -{" "}
                {shippingAdd?.customer_postcode}
              </p>
              <p className="mg-b-0">
                Contact Person : {shippingAdd?.customer_name}
              </p>
              <p className="mg-b-0">Tel No : {shippingAdd?.customer_phone}</p>
              <p className="mg-b-0">Email : {shippingAdd?.customer_email}</p>
            </div>
          </div>

          {item && (
            <React.Fragment>
              <div className="table-responsive mg-t-40">
                <table className="table table-invoice bd-b">
                  <thead>
                    <tr>
                      <th className="tx-left">{Trans("SL_NO", language)}</th>
                      <th className="wd-40p d-none d-sm-table-cell">
                        {Trans("ITEM", language)}
                      </th>
                      <th className="tx-center">{Trans("QTY", language)}</th>
                      <th className="tx-center">
                        {Trans("UNIT_PRICE", language)}
                      </th>
                      <th className="tx-right">
                        {Trans("ITEM_COST", language)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item?.map((item, idx) => {
                      const { total_price, product, qty, unit_price } = item;
                      return (
                        <tr key={idx}>
                          <td className="tx-left">{idx + 1}</td>
                          <td className="d-none d-sm-table-cell tx-color-03">
                            {product?.productdescription[0]["products_name"]}
                          </td>
                          <td className="tx-center">{qty}</td>
                          <td className="tx-center">
                            {EditData?.currency}
                            {unit_price.toFixed(2)}
                          </td>
                          <td className="tx-right">
                            {EditData?.currency}
                            {total_price.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          )}

          <div className="row justify-content-between">
            <div className="col-sm-6 col-lg-6 order-2 order-sm-0 mg-t-40 mg-sm-t-0">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("Notes", language)}
              </label>
              <p>{EditData?.note}</p>

              {/* order tstaus */}
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("ORDER_STATUS", language)} :{" "}
                {(() => {
                  console.log("swicth call");
                  switch (EditData?.order_status) {
                    case 4:
                      return <StatusBadge color="success" msg="Deliverd" />;
                    case 2:
                      return <StatusBadge color="primary" msg="InProcess" />;
                    case 3:
                      return <StatusBadge color="info" msg="Dispatch" />;
                    default:
                      return <StatusBadge color="warning" msg="Pending" />;
                  }
                })()}
              </label>
              <p>
                <select
                  defaultValue={EditData?.order_status}
                  onChange={(e) => {
                    ChangeFunction(
                      EditData?.order_id,
                      EditData?.payment_status,
                      e.target.value
                    );
                  }}
                >
                  <option value={1}>{Trans("Pending", language)}</option>
                  <option value={2}>{Trans("InProcess", language)}</option>
                  <option value={3}>{Trans("Dispatch", language)}</option>
                  <option value={4}>{Trans("Deliverd", language)}</option>
                </select>
              </p>

              {/* payment tstaus */}
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("PAYMENT_STATUS", language)} :{" "}
                {(() => {
                  switch (EditData?.payment_status) {
                    case 2:
                      return <StatusBadge color="success" msg="Paid" />;
                    case 3:
                      return <StatusBadge color="danger" msg="Failed" />;
                    default:
                      return <StatusBadge color="warning" msg="Pending" />;
                  }
                })()}
              </label>
              <p>
                <select
                  defaultValue={EditData?.payment_status}
                  onChange={(e) => {
                    ChangeFunction(
                      EditData?.order_id,
                      e.target.value,
                      EditData?.order_status
                    );
                  }}
                >
                  <option value={1}>{Trans("Pending", language)}</option>
                  <option value={2}>{Trans("Paid", language)}</option>
                  <option value={3}>{Trans("Failed", language)}</option>
                </select>
              </p>
            </div>
            <div className="col-sm-6 col-lg-4 order-1 order-sm-0">
              <ul className="list-unstyled lh-7 pd-r-10">
                <li className="d-flex justify-content-between">
                  <span>{Trans("TOTAL_ITEM_COST", language)}</span>
                  <span>
                    {EditData?.currency}
                    {EditData?.sub_total.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>
                    {Trans("TAX", language)} (
                    {EditData?.tax_type === 0 ? "INCLUSIVE" : "EXCLUSIVE"}) -(
                    {EditData?.tax_percent}%)
                  </span>
                  <span>
                    {EditData?.currency}
                    {EditData?.tax_amount.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>{Trans("SHIPPING_COST", language)}</span>
                  <span>
                    {EditData?.currency}
                    {EditData?.shipping_total.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>{Trans("DISCOUNT", language)}</span>
                  <span>
                    -{EditData?.currency}
                    {EditData?.discount_total.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <strong>{Trans("FINAL_COST", language)}</strong>
                  <strong>
                    {EditData?.currency}
                    {EditData?.grand_total.toFixed(2)}
                  </strong>
                </li>
              </ul>

              {/* <button className="btn btn-block btn-primary">Pay Now</button> */}
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}

export default Detail;
