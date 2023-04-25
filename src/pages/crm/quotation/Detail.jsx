import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { Trans } from "lang/index";
import { QuotationEditUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import Notify from "component/Notify";
import WebsiteLink from "config/WebsiteLink";
import Moment from "react-moment";
import { GenerateHtmlToPdf } from "component/GenerateHtmlToPdf";

function Detail() {
  const { quoteId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [EditData, setData] = useState();

  useEffect(() => {
    let abortController = new AbortController();

    const editData = {
      api_token: apiToken,
      quotation_id: quoteId,
    };
    POST(QuotationEditUrl, editData)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          console.log("data.data", data);
          setData(data);
        } else {
          Notify(false, Trans(message, language));
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(false, Trans(error.message, language));
      });
    return () => abortController.abort();
  }, [quoteId]);

  const statusArr = ["Deleted", "Pending", "Accepted", "Declined"];

  // generate pdf for quatation

  const printDocument = (quotationId) => {
    GenerateHtmlToPdf("divToPrint", `QUOTE_${quotationId}.pdf`);
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
            title: Trans("QUOTATION", language),
            link: WebsiteLink("/quotation"),
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
                {Trans("QUOTATION_NUMBER", language)} #{EditData?.quotation_no}
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
                onClick={() => printDocument(EditData?.quotation_no)}
              >
                <FeatherIcon icon="download" /> {Trans("DOWNLOAD", language)}
              </button>
              {"  "}
              {EditData?.shareUrl && (
                <a
                  target="_BLANK"
                  className="btn btn-primary mg-l-5"
                  href={EditData?.shareUrl}
                  style={{ padding: "1px 5px 1px 5px" }}
                >
                  <FeatherIcon icon="share-2" /> {Trans("SHARE", language)}
                </a>
              )}
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
                {Trans("QUOTATION_NUMBER", language)}
              </label>
              <h1 className="tx-normal tx-color-04 mg-b-10 tx-spacing--2">
                #{EditData?.quotation_no}
              </h1>
            </div>
            <div className="col-sm-6 col-lg-8 mg-t-40 mg-sm-t-0 mg-md-t-40">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("Billed To", language)}
              </label>
              <h6 className="tx-15 mg-b-10">
                {EditData?.crm_quotation_customer?.company_name}
              </h6>
              <p className="mg-b-0">
                {EditData?.crm_quotation_address?.street_address} ,
                {EditData?.crm_quotation_address?.city},
                {EditData?.crm_quotation_address?.state},
              </p>
              <p className="mg-b-0">
                {EditData?.crm_quotation_address?.countries_id}, -{" "}
                {EditData?.crm_quotation_address?.zipcode}
              </p>
              <p className="mg-b-0">
                Contact Person : {EditData?.crm_quotation_contact?.contact_name}
              </p>
              <p className="mg-b-0">
                Tel No : {EditData?.crm_quotation_address?.phone}
              </p>
              <p className="mg-b-0">
                Email : {EditData?.crm_quotation_contact?.contact_email}
              </p>
              <p className="mg-b-0">
                {Trans("WEBSITE", language)} :{" "}
                {EditData?.crm_quotation_customer?.website}
              </p>
            </div>
            <div className="col-sm-6 col-lg-4 mg-t-40">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("QUOTATION_INFORMATION", language)}
              </label>
              <ul className="list-unstyled lh-7">
                <li className="d-flex justify-content-between">
                  <span>{Trans("ISSUE_DATE", language)}</span>
                  <span>
                    <Moment format="Do MMMM YYYY">
                      {EditData?.created_at}
                    </Moment>
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>{Trans("STATUS", language)}</span>
                  <span>{EditData && statusArr[EditData.status]}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="table-responsive mg-t-40">
            <table className="table table-invoice bd-b">
              <thead>
                <tr>
                  <th className="tx-left">{Trans("SL_NO", language)}</th>
                  <th className="wd-40p d-none d-sm-table-cell">
                    {Trans("ITEM", language)}
                  </th>
                  <th className="tx-center">{Trans("QTY", language)}</th>
                  <th className="tx-center">{Trans("UNIT_PRICE", language)}</th>
                  <th className="tx-center">{Trans("DISCOUNT", language)}</th>
                  <th className="tx-right">{Trans("ITEM_COST", language)}</th>
                </tr>
              </thead>
              <tbody>
                {EditData?.crm_quotation_item?.map((item, idx) => {
                  const {
                    item_name,
                    item_cost,
                    discount,
                    quantity,
                    unit_price,
                  } = item;
                  return (
                    <tr key={idx}>
                      <td className="tx-left">{idx + 1}</td>
                      <td className="d-none d-sm-table-cell tx-color-03">
                        {item_name}
                        {item.attributes_list && (
                          <React.Fragment>
                            {" "}
                            (
                            {item.attributes_list.map((attr) => {
                              return (
                                <React.Fragment>
                                  {" "}
                                  {
                                    attr?.product_options?.products_options_name
                                  }{" "}
                                  : {attr?.products_options_values_name} ,
                                </React.Fragment>
                              );
                            })}
                            )
                          </React.Fragment>
                        )}
                      </td>
                      <td className="tx-center">{quantity}</td>
                      <td className="tx-center">
                        {EditData?.currency}
                        {unit_price.toFixed(2)}
                      </td>
                      <td className="tx-center">
                        {EditData?.currency}
                        {discount.toFixed(2)}
                      </td>
                      <td className="tx-right">
                        {EditData?.currency}
                        {item_cost.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-between">
            <div className="col-sm-6 col-lg-6 order-2 order-sm-0 mg-t-40 mg-sm-t-0">
              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("Notes", language)}
              </label>
              <p>{EditData?.note}</p>

              <label className="tx-sans tx-uppercase tx-10 tx-medium tx-spacing-1 tx-color-03">
                {Trans("PAYMENT_TERM", language)}
              </label>
              <p>
                {EditData?.crm_quotation_to_payment_term?.map((term, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      {term?.terms_name}
                      {" : "}
                    </React.Fragment>
                  );
                })}
              </p>
            </div>
            <div className="col-sm-6 col-lg-4 order-1 order-sm-0">
              <ul className="list-unstyled lh-7 pd-r-10">
                <li className="d-flex justify-content-between">
                  <span>{Trans("TOTAL_ITEM_COST", language)}</span>
                  <span>
                    {EditData?.currency}
                    {EditData?.total_item_cost.toFixed(2)}
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
                    {EditData?.total_tax.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>{Trans("SHIPPING_COST", language)}</span>
                  <span>
                    {EditData?.currency}
                    {EditData?.shipping_cost.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>{Trans("DISCOUNT", language)}</span>
                  <span>
                    -{EditData?.currency}
                    {EditData?.discount.toFixed(2)}
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <strong>{Trans("FINAL_COST", language)}</strong>
                  <strong>
                    {EditData?.currency}
                    {EditData?.final_cost.toFixed(2)}
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
