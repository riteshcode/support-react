import React from "react";
import { FormGroup, Row, Col } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";

const EnquiryDetails = ({ enquiryDetails }) => {
  const { language } = useSelector((state) => state.login);

  console.log("enquiryDetails", enquiryDetails);
  const {
    customers_name,
    email_address,
    enquiry_no,
    subject,
    message,
    phone,
    created_at,
  } = enquiryDetails;

  const [productInfo, setproductInfo] = React.useState();

  React.useEffect(() => {
    let abortController = new AbortController();

    setproductInfo(enquiryDetails.enquiry_product);

    return () => abortController.abort();
  }, []);
  return (
    <React.Fragment>
      <Row>
        {/* if product enquiry */}
        {productInfo && (
          <React.Fragment>
            <Col col={12}>
              <Row>
                <label className="col-md-4">
                  <b>{Trans("PRODUCT_NAME", language)} : </b>
                </label>
                <span className="col-md-8">
                  {
                    productInfo?.products?.productdescription?.[0][
                      "products_name"
                    ]
                  }
                </span>
              </Row>
            </Col>
            <Col col={12}>
              <Row>
                <label className="col-md-4">
                  <b>{Trans("PRODUCT_SKU", language)} : </b>
                </label>
                <span className="col-md-8">
                  {productInfo?.products?.product_sku}
                </span>
              </Row>
            </Col>
            <Col col={12}>
              <Row>
                <label className="col-md-4">
                  <b>{Trans("ENQUIRY_QTY", language)} : </b>
                </label>
                <span className="col-md-8">{productInfo?.products_qty}</span>
              </Row>
            </Col>
          </React.Fragment>
        )}

        <Col col={12}>
          <Row>
            <label className="col-md-4">
              <b>{Trans("ENQUIRY_NO", language)} : </b>
            </label>
            <span className="col-md-8">{enquiry_no}</span>
          </Row>
        </Col>
        <Col col={12}>
          <Row>
            <label className="col-md-4">
              <b>{Trans("ENQUIRY_DATE", language)} : </b>
            </label>
            <span className="col-md-8">{created_at}</span>
          </Row>
        </Col>

        <Col col={12}>
          <Row>
            <label className="col-md-4">
              <b>{Trans("CUSTOMER_NAME", language)} : </b>
            </label>
            <span className="col-md-8">{customers_name}</span>
          </Row>
        </Col>

        <Col col={12}>
          <Row>
            <label className="col-md-4">
              <b>{Trans("CUSTOMER_EMAIL", language)} : </b>
            </label>
            <span className="col-md-8">{email_address}</span>
          </Row>
        </Col>

        <Col col={12}>
          <Row>
            <label className="col-md-4">
              <b>{Trans("CUSTOMER_PHONE", language)}:</b>
            </label>
            <span className="col-md-8">{phone}</span>
          </Row>
        </Col>

        <Col col={12}>
          <Row>
            <label className="col-md-4">
              <b>{Trans("SUBJECT", language)} : </b>
            </label>
            <span className="col-md-8">{subject}</span>
          </Row>
        </Col>

        <Col col={12}>
          <label className="">
            <b>{Trans("MESSAGE", language)} </b>
          </label>
          <p>{message}</p>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EnquiryDetails;
