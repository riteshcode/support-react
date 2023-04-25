import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import FeatherIcon from "feather-icons-react";
import { Modal, Button } from "react-bootstrap";
import POST from "axios/post";
import {
  staffUpdateUrl,
  staffCreateUrl,
  tempUploadFileUrl,
} from "config/index";
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import {
  Row,
  Col,
  LoaderButton,
  FormGroup,
  Label,
} from "component/UIElement/UIElement";
import { ProductEditDataContext } from "pages/ecommerce/product/ProductContext";

function ProductInfo({ refreshInfo }) {
  const productEditInfo = useContext(ProductEditDataContext);

  const [editInfo, SetEditInfo] = useState();
  const { apiToken, language } = useSelector((state) => state.login);
  const [showModal, SetShowModal] = useState(false);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, getValues, setValue, handleSubmit, reset } = useForm();

  const [DynamicData, SetDynamicData] = useState([]);

  const onSubmit = () => {};

  useEffect(() => {
    let abortController = new AbortController();
    // console.log("productEditInfo", productEditInfo);
    // if (productEditInfo !== undefined) SetEditInfo(JSON.parse(productEditInfo));
    if (productEditInfo !== undefined) SetEditInfo(productEditInfo);

    return () => abortController.abort();
  }, [productEditInfo]);

  console.log("editInfo", editInfo);

  return (
    <>
      <div className="updated-biography">
        <span>
          {Trans("PRODUCT_INFORMATION", language)}{" "}
          <FeatherIcon
            icon="edit"
            size={15}
            fill="#ffc107"
            color="black"
            onClick={() => {
              SetShowModal(true);
            }}
          />
        </span>
        <ul className="list-unstyled profile-info-list">
          <li>
            <span className="tx-color-03">
              {editInfo?.productdescription_with_lang.map((pro_lang, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <span>
                      {pro_lang.languages_name} - <br />
                      {Trans("PRODUCT_NAME", language)} :{" "}
                      {pro_lang?.pivot?.products_name}
                      <br />
                      {Trans("PRODUCT_DESCRIPTION", language)} :{" "}
                      {pro_lang?.pivot?.products_description}
                    </span>
                  </React.Fragment>
                );
              })}
              <br />
              {Trans("PRODUCT_MODEL", language)} : {editInfo?.product_model}{" "}
              <br />
              {Trans("PRODUCT_SKU", language)} : {editInfo?.product_sku} <br />
              {Trans("PRODUCT_PRICE_TYPE", language)} :{" "}
              {editInfo?.product_price_type} <br />
              {Trans("PRODUCT_CONDITION", language)} :{" "}
              {editInfo?.product_condition} <br />
              {Trans("STATUS", language)} :{" "}
              <span className="badge badge-success">
                {editInfo?.product_status}
              </span>{" "}
              <br />
            </span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default ProductInfo;
