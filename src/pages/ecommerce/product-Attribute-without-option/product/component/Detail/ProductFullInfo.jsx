import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import { ProductEditDataContext } from "pages/ecommerce/product/ProductContext";
import FeatherIcon from "feather-icons-react";
import WebsiteLink from "config/WebsiteLink";
import { Anchor } from "component/UIElement/UIElement";

function ProductFullInfo({ refreshInfo }) {
  const productEditInfo = useContext(ProductEditDataContext);
  console.log(productEditInfo);
  const { apiToken, language } = useSelector((state) => state.login);

  const findOptionName = (dataArray, findid) => {
    const attrname = dataArray.filter((data) => {
      return data.products_options_id === findid
        ? data.products_options_name
        : "";
    });
    return attrname.length > 0 ? attrname[0]["products_options_name"] : "";
  };

  const findOptionValueName = (dataArray, findid) => {
    const attrname = dataArray.filter((data) => {
      return data.products_options_values_id === findid
        ? data.products_options_values_name
        : "";
    });
    return attrname.length > 0
      ? attrname[0]["products_options_values_name"]
      : "";
  };

  return (
    <>
      <div className="card mg-b-20 mg-lg-b-25">
        <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
          <h6 className="tx-uppercase tx-semibold mg-b-0">
            {Trans("PRODUCT_INFORMATION", language)}
          </h6>
          <nav className="nav nav-with-icon tx-13">
            <Anchor
              path={WebsiteLink("/products/create")}
              className="btn btn-primary btn-sm"
            >
              {Trans("ADD_MORE_PRODUCT", language)}
            </Anchor>
            {"   "} {"  "} &nbsp;
            <Anchor
              path={WebsiteLink(
                `/products/edit/${productEditInfo?.product_id}`
              )}
              className="btn btn-info btn-sm"
            >
              {Trans("EDIT_PRODUCT", language)}
            </Anchor>
            {"   "} {"  "} &nbsp;
            <Anchor
              path={WebsiteLink("/products")}
              className="btn btn-warning btn-sm"
            >
              {Trans("GO_BACK", language)}
            </Anchor>
          </nav>
        </div>
        <div className="card-body pd-25">
          <div className="media d-block d-sm-flex mb-3 mt-2">
            <div className="media-body pd-t-25 pd-sm-t-0 pd-sm-l-25">
              <ul className="pd-l-10 mg-0 mt-2 tx-13">
                <li>
                  <b>{Trans("CATEGORY", language)} : </b>{" "}
                  {productEditInfo?.selected_category &&
                    productEditInfo?.selected_category.map((cat, idx) => {
                      return (
                        <React.Fragment key={idx}>{cat.label}, </React.Fragment>
                      );
                    })}
                </li>
                <li>
                  <b>{Trans("PRODUCT_MODEL", language)} : </b>
                  {productEditInfo?.product_model}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_SKU", language)} : </b>
                  {productEditInfo?.product_sku}{" "}
                </li>
                <li>
                  <b> {Trans("PRODUCT_PRICE_TYPE", language)} : </b>
                  {productEditInfo?.product_price_type === 1
                    ? "Single"
                    : "Bulk"}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_CONDITION", language)} : </b>
                  {productEditInfo?.product_condition === 1
                    ? "New"
                    : "Refurbished"}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_STOCK_QTY", language)} : </b>
                  {productEditInfo?.product_stock_qty}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_STOCK_PRICE", language)} : </b>
                  {productEditInfo?.product_stock_price}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_PROFIT_MARGIN", language)} : </b>
                  {productEditInfo?.product_profit_margin}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_SALE_PRICE", language)} : </b>
                  {productEditInfo?.product_sale_price}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_DISCOUNT_TYPE", language)} : </b>
                  {productEditInfo?.product_discount_type}{" "}
                </li>
                <li>
                  <b>{Trans("PRODUCT_DISCOUNT_AMOUNT", language)} : </b>
                  {productEditInfo?.product_discount_amount}{" "}
                </li>
                <li>
                  <b>{Trans("STATUS", language)} : </b>
                  <span className="badge badge-success">
                    {productEditInfo?.product_status}
                  </span>{" "}
                </li>
                {productEditInfo?.products_type_field_value &&
                  productEditInfo?.products_type_field_value.map(
                    (attr, idx) => {
                      return (
                        <React.Fragment key={idx}>
                          <li>
                            <b className="text-uppercase">
                              {attr?.field_label} :{" "}
                            </b>
                            {attr?.pivot?.field_value}
                          </li>{" "}
                        </React.Fragment>
                      );
                    }
                  )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card mg-b-20 mg-lg-b-25">
        <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
          <h6 className="tx-uppercase tx-semibold mg-b-0">
            {Trans("PRODUCT_ATTRIBUTE_INFO", language)}
          </h6>
        </div>
        <div className="card-body pd-25">
          <div className="media d-block d-sm-flex mb-3 mt-2">
            <div className="media-body pd-t-25 pd-sm-t-0 pd-sm-l-25">
              <ul className="pd-l-10 mg-0 mt-2 tx-13">
                {productEditInfo?.productAttribute &&
                  productEditInfo?.productAttribute.map((attr, idx) => {
                    return (
                      <React.Fragment key={idx}>
                        <li>
                          <b className="text-uppercase">
                            {findOptionName(attr.option_list, attr.options_id)}{" "}
                            ,{"  "}
                            {findOptionValueName(
                              attr.option_value_list,
                              attr.options_values_id
                            )}{" "}
                            :{" "}
                          </b>
                          {attr?.options_values_price}{" "}
                        </li>{" "}
                      </React.Fragment>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductFullInfo;
