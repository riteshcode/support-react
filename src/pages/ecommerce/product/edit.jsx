import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { useForm, FormProvider } from "react-hook-form";
import {
  productUpdateUrl,
  tempUploadFileUrl,
  productCreateUrl,
  productEditUrl,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  Anchor,
  Label,
  GalleryImagePreviewWithUploadWithItem,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import WebsiteLink from "config/WebsiteLink";
import { useNavigate } from "react-router-dom";

import ProductType from "./component/Edit/ProductType";
import BulkPrice from "./component/Edit/BulkPrice";
import LangProductInfo from "./component/Edit/LangProductInfo";
import Feature from "./component/Edit/Feature";
import ProductAttribute from "./component/Edit/ProductAttribute";
import FeatherIcon from "feather-icons-react";

const Edit = () => {
  const { proId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const navigate = useNavigate();

  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const [editProAttribute, SetEditProAttribute] = useState();
  const [editLoad, SeteditLoad] = useState(false);

  const methods = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = methods;

  const onSubmit = (formData) => {
    // console.log("formData", formData);
    SetformloadingStatus(true);
    if (MultiSelectCategoryItem.length == 0) {
      Notify(false, "CHOOSE ATLEAST ONE CATEGORY");
      return "";
    }

    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    saveFormData.categories_id = MultiSelectCategoryItem;
    saveFormData.supplier_ids = MultiSelectSupplierItem;
    saveFormData.gallery_ids = multipleImageIds;

    POST(productUpdateUrl, saveFormData)
      .then((response) => {
        // console.log("response", response);
        SetformloadingStatus(false);
        const { status, message, data } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });

          Notify(true, Trans(message, language));
          navigate(`/products/show/${data.product_id}`);
        } else {
          var errObj = {
            status: true,
            msg: "",
            type: "danger",
          };

          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            errObj.msg = errMsg;
          } else {
            errObj.msg = message;
          }
          setError(errObj);
        }
      })
      .catch((error) => {
        SetformloadingStatus(false);
        Notify(false, error.message);
      });
  };

  const [langList, SetlangList] = useState([]);
  const [productTypeList, SetProductTypeList] = useState([]);
  const [categoryList, SetCategoryList] = useState([]);
  const [brandList, SetBrandList] = useState([]);
  const [supplierList, SetSupplierList] = useState([]);

  // helper data load to cretae produc
  useEffect(() => {
    let abortController = new AbortController();
    const formData = {
      api_token: apiToken,
      language: language,
    };
    POST(productCreateUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetCategoryList(data.all_category);
          SetlangList(data.language);
          SetProductTypeList(data.product_type);
          SetProductAttribute(data.product_attribute);
          SetSupplierList(data.supplier);
          SetBrandList(data.brand);
          saveValueToField();
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, error.message);
        console.error("There was an error!", error);
      });
    return () => abortController.abort();
  }, []);

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

    var readers = new FileReader();
    readers.onload = function (e) {
      // console.log("filereade", e);
      document.getElementById(
        previewUrlId
      ).innerHTML = `<a href=${e.target.result} download >Preview</a>`;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    POST(tempUploadFileUrl, formdata)
      .then((response) => {
        // console.log("temp", response);
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };
  const [priceType, SetPriceType] = useState(1);

  const [productTypeFields, SetProductTypeFields] = useState("");
  const ModuleChange = (e) => {
    let value = e.target.value;
    if (value !== undefined || value !== "") {
      const sectionlistData =
        e.target.selectedOptions[0].attributes[1].nodeValue;
      SetProductTypeFields(JSON.parse(sectionlistData));
    }
  };

  const [MultiSelectCategoryItem, SetMultiSelectCategoryItem] = useState([]);
  const handleMultiSelectChange = (newValue, actionMeta) => {
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    SetMultiSelectCategoryItem(listArr);
  };

  const [selectedCategory, SetSelectedCategory] = useState();
  const [selectedSupplier, SetSelectedSupplier] = useState("");
  const [selectedProductType, SetSelectedProductType] = useState();
  const [productAttribute, SetProductAttribute] = useState();

  const [MultiSelectSupplierItem, SetMultiSelectSupplierItem] = useState("");
  const handleMultiSelectSupplierChange = (newValue, actionMeta) => {
    // alert("sdf");
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    SetMultiSelectSupplierItem(listArr);
  };

  const [multipleImageIds, SetMultipleImageIds] = useState([]);
  const [showMulImage, SetShowMulImage] = useState([]);

  const imageHandleComp = (type, operation, data) => {
    if (operation === "add") SetMultipleImageIds([...multipleImageIds, data]);
    else {
      const NewList = multipleImageIds.filter((image, key) => {
        return key !== data;
      });
      SetMultipleImageIds(NewList);
    }
    return true;
  };
  // console.log("multipleImage", multipleImageIds);
  const [editInfo, SeteditInfo] = useState("");
  // edit info

  const saveValueToField = () => {
    const formData = {
      api_token: apiToken,
      language: language,
      product_id: proId,
    };
    POST(productEditUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        console.log("data", data);
        if (status) {
          SetloadingStatus(false);
          const { data } = response.data;

          SeteditInfo(data);

          const fieldList = getValues();
          delete fieldList.product_condition;
          delete fieldList.product_price_type;
          delete fieldList.status;

          // set SetPriceType
          SetPriceType(data.product_price_type);

          // add product array tags
          if (data.product_tags !== null)
            setproductTags(data.product_tags.split(","));

          for (const key in fieldList) {
            setValue(key, data[key]);
          }

          SetSelectedCategory(data.selected_category);
          SetSelectedSupplier(data.selected_supplier);
          SetMultiSelectSupplierItem(data?.selected_supplier_id);
          SetMultipleImageIds(data?.gallery_ids);
          SetShowMulImage(data?.gallery_image);

          let listArr = [];
          if (data?.selected_category?.length > 0) {
            for (
              let index = 0;
              index < data?.selected_category.length;
              index++
            ) {
              listArr[index] = data?.selected_category[index].value;
            }
          }
          SetMultiSelectCategoryItem(listArr);

          SetEditProAttribute(data?.product_attribute);
          SetProductTypeFields(data?.product_type);

          // display product_name value
          if (data?.productdescription.length > 0) {
            const lang_with_pro = data?.productdescription;
            for (let index = 0; index < lang_with_pro.length; index++) {
              const pro_name = lang_with_pro[index].products_name;
              const pro_desc = lang_with_pro[index].products_description;
              setValue(
                "products_name_" + lang_with_pro[index].languages_id,
                pro_name
              );
              setValue(
                "products_description_" + lang_with_pro[index].languages_id,
                pro_desc
              );

              setValue(
                "seometa_title_" + lang_with_pro[index]["languages_id"],
                lang_with_pro[index].seo.seometa_title
              );
              setValue(
                "seometa_desc_" + lang_with_pro[index]["languages_id"],
                lang_with_pro[index].seo.seometa_desc
              );
            }
          }
          SeteditLoad(true);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, error.message);
        console.error("There was an error!", error);
      });
  };

  // useEffecr Re-render when all edit data set
  // useEffect(() => {}, [selectedSupplier]);

  const [productTags, setproductTags] = useState([]);

  const addTag = (value) => {
    setproductTags([...productTags, value]);
    // setValue("product_tags", productTags.join(","));
  };

  const removeTag = (pos) => {
    let newTags = productTags.filter((data, idx) => {
      return idx !== pos ? true : false;
    });
    setproductTags(newTags);
  };

  // useEffect(() => {
  //   setValue("product_tags", productTags.join(","));
  // }, [productTags]);

  const [manStock, SetManStock] = useState(true);
  const calculateSellprice = () => {
    const price = parseFloat(getValues("product_stock_price"));
    const percentage = getValues("product_profit_margin");

    if (price === NaN || percentage === NaN) return false;

    console.log("percentage", percentage, "price", price);

    let per = (percentage / 100) * price;
    console.log("per", per);
    let sellPrice = price + per;
    setValue("product_sale_price", sellPrice);
  };

  // const createSelectLabel = () => {};

  const createSelectLabel = (data, selData = "") => {
    return data;

    let labelData = [];
    console.log("data", data);
    console.log("selData", selData);

    // if (data.length > 0) {
    //   labelData = selData.filter((item) => {
    //     let boolS = false;
    //     for (let index = 0; index < data.length; index++) {
    //       const valId = data[index]["value"];
    //       if ((item.value = valId)) {
    //         boolS = true;
    //         break;
    //       }
    //     }
    //     return boolS;
    //   });
    // }

    // console.log("labelData", labelData);
    return labelData;
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          {
            title: Trans("PRODUCT", language),
            link: WebsiteLink("/products"),
            class: "",
          },
          { title: Trans("EDIT", language), link: "", class: "active" },
        ]}
      />

      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <div className="card" id="custom-user-list">
            <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
              <h6 className="tx-uppercase tx-semibold mg-b-0">
                {Trans("UPDATE_PRODUCT", language)}
              </h6>
              <div className="d-none d-md-flex">
                <Anchor
                  className="btn btn-primary pd-3"
                  path={WebsiteLink("/products")}
                >
                  <FeatherIcon
                    icon="corner-down-left"
                    className="wd-10 mg-r-5"
                  />
                  {Trans("GO_BACK", language)}
                </Anchor>
              </div>
            </div>
            <div className="card-body">
              <>
                {error.status && (
                  <Alert
                    variant={error.type}
                    onClose={() =>
                      setError({ status: false, msg: "", type: "" })
                    }
                    dismissible
                  >
                    {error.msg}
                  </Alert>
                )}
                <FormProvider {...methods}>
                  <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input type="hidden" {...register("product_id")} />
                    <Row>
                      <Col col={4}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("CATEGORY", language)}
                          >
                            {Trans("CATEGORY", language)}
                          </Label>
                          {selectedCategory && (
                            <Select
                              isMulti
                              defaultValue={selectedCategory}
                              name={Trans("CATEGORY", language)}
                              options={categoryList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectChange}
                            />
                          )}
                          {/* {editLoad ? (
                            <Select
                              isMulti
                              value={editInfo?.selected_category}
                              name={Trans("CATEGORY", language)}
                              options={categoryList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectChange}
                            />
                          ) : (
                            <Select
                              isMulti
                              name={Trans("CATEGORY", language)}
                              options={categoryList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectChange}
                            />
                          )} */}
                        </FormGroup>
                      </Col>
                      <Col col={4}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("BRAND", language)}
                          >
                            {Trans("BRAND", language)}
                          </Label>
                          <select
                            id={Trans("BRAND", language)}
                            placeholder={Trans("BRAND", language)}
                            className="form-control"
                            {...register("product_brand_id", {
                              required: Trans("BRAND_REQUIRED", language),
                            })}
                            defaultValue={editInfo?.product_brand_id}
                          >
                            <option value="">
                              {Trans("SELECT_BRAND", language)}
                            </option>
                            {brandList &&
                              brandList.map((brand, idxx) => (
                                <React.Fragment key={idxx}>
                                  <option value={brand.brand_id}>
                                    {brand.brand_name}
                                  </option>
                                </React.Fragment>
                              ))}
                          </select>
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="product_brand_id"
                            />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={4}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("SUPPLIER", language)}
                          >
                            {Trans("SUPPLIER", language)}
                          </Label>
                          {selectedSupplier && (
                            <Select
                              isMulti
                              defaultValue={selectedSupplier}
                              name={Trans("SUPPLIER", language)}
                              options={supplierList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectSupplierChange}
                            />
                          )}
                          {!selectedSupplier && (
                            <Select
                              isMulti
                              name={Trans("SUPPLIER", language)}
                              options={supplierList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectSupplierChange}
                            />
                          )}

                          {/* {editLoad === false ? (
                            <Select
                              isMulti
                              name={Trans("SUPPLIER", language)}
                              options={supplierList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectSupplierChange}
                            />
                          ) : (
                            <Select
                              isMulti
                              defaultValue={selectedSupplier}
                              name={Trans("SUPPLIER", language)}
                              options={supplierList}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiSelectSupplierChange}
                            />
                          )} */}
                        </FormGroup>
                      </Col>

                      <Col col={12}>
                        <fieldset className="form-fieldset">
                          <legend>
                            {Trans("PRODUCT_INFORMATION", language)}
                          </legend>
                          <Row>
                            <LangProductInfo langList={langList} />

                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("PRODUCT_SLUG", language)}
                                  type="text"
                                  label={Trans("PRODUCT_SLUG", language)}
                                  placeholder={Trans("PRODUCT_SLUG", language)}
                                  className="form-control"
                                  {...register("product_slug", {
                                    required: Trans(
                                      "PRODUCT_SLUG_REQUIRED",
                                      language
                                    ),
                                  })}
                                />
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("PRODUCT_MODEL", language)}
                                  type="text"
                                  label={Trans("PRODUCT_MODEL", language)}
                                  placeholder={Trans("PRODUCT_MODEL", language)}
                                  className="form-control"
                                  {...register("product_model", {
                                    required: Trans(
                                      "PRODUCT_MODEL_REQUIRED",
                                      language
                                    ),
                                  })}
                                />
                              </FormGroup>
                            </Col>
                            <Col col={2}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("PRODUCT_SKU", language)}
                                  type="text"
                                  label={Trans("PRODUCT_SKU", language)}
                                  placeholder={Trans("PRODUCT_SKU", language)}
                                  className="form-control"
                                  {...register("product_sku")}
                                />
                              </FormGroup>
                            </Col>
                            <Col col={4}>
                              <label htmlFor="">
                                <b>{Trans("PRODUCT_VIDEO_URL", language)}</b>
                              </label>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <select
                                    {...register("video_provider")}
                                    className="btn btn-outline-light"
                                    value={editInfo?.video_provider}
                                  >
                                    <option value="1">
                                      {Trans("YOUTUBE", language)}
                                    </option>
                                    <option value="2">
                                      {Trans("DailyMotion", language)}
                                    </option>
                                    <option value="3">
                                      {Trans("Custom", language)}
                                    </option>
                                  </select>
                                </div>
                                <input
                                  id={Trans("PRODUCT_VIDEO_URL", language)}
                                  type="text"
                                  label={Trans("PRODUCT_VIDEO_URL", language)}
                                  placeholder={Trans(
                                    "PRODUCT_VIDEO_URL",
                                    language
                                  )}
                                  className="form-control"
                                  {...register("product_video_url")}
                                />
                              </div>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("PRODUCT_EXTERNAL_URL", language)}
                                  type="text"
                                  label={Trans(
                                    "PRODUCT_EXTERNAL_URL",
                                    language
                                  )}
                                  placeholder={Trans(
                                    "PRODUCT_EXTERNAL_URL",
                                    language
                                  )}
                                  className="form-control"
                                  {...register("product_external_url")}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </fieldset>
                      </Col>

                      <Col col={12} className="mt-3">
                        <fieldset className="form-fieldset">
                          <legend>
                            {Trans("QUANTITY_AND_PRICE", language)}
                          </legend>
                          <Row className="mt-2">
                            {editInfo?.product_condition && (
                              <Col col={6}>
                                <FormGroup mb="20px">
                                  <Label htmlFor="status">
                                    {Trans("PRODUCT_CONDITION", language)} :{" "}
                                  </Label>{" "}
                                  <input
                                    type="radio"
                                    {...register("product_condition")}
                                    defaultValue={1}
                                    defaultChecked={
                                      editInfo.product_condition === 1 && true
                                    }
                                  />
                                  {"  "}
                                  {Trans("NEW", language)}
                                  {"   "}
                                  <input
                                    type="radio"
                                    {...register("product_condition")}
                                    defaultValue={2}
                                    defaultChecked={
                                      editInfo.product_condition === 2 && true
                                    }
                                  />{" "}
                                  {Trans("REFURBISHED", language)}
                                </FormGroup>
                              </Col>
                            )}

                            {editInfo?.product_price_type && (
                              <Col col={6}>
                                <FormGroup mb="20px">
                                  <Label htmlFor="product_price_type">
                                    {Trans("PRODUCT_PRICE_TYPE", language)} :{" "}
                                  </Label>
                                  {"    "}
                                  <input
                                    type="radio"
                                    id="product_price_type"
                                    {...register("product_price_type")}
                                    defaultValue={1}
                                    defaultChecked={
                                      editInfo.product_price_type === 1 && true
                                    }
                                    onClick={() => {
                                      SetPriceType(1);
                                    }}
                                  />
                                  {"  "}
                                  {Trans("SINGLE", language)}
                                  {"   "}
                                  <input
                                    type="radio"
                                    id="product_price_type"
                                    {...register("product_price_type")}
                                    defaultValue={2}
                                    defaultChecked={
                                      editInfo.product_price_type === 2 && true
                                    }
                                    onClick={() => {
                                      SetPriceType(2);
                                    }}
                                  />{" "}
                                  {Trans("WHOLESALE", language)}
                                </FormGroup>
                              </Col>
                            )}
                          </Row>

                          <Row>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Label
                                  display="block"
                                  mb="5px"
                                  htmlFor={Trans("MANAGE_STOCK", language)}
                                >
                                  {Trans("MANAGE_STOCK", language)}
                                </Label>
                                <select
                                  {...register("product_stock_manage")}
                                  className="form-control"
                                  onChange={(e) => {
                                    let bools =
                                      e.target.value === "1" ? true : false;
                                    SetManStock(bools);
                                  }}
                                >
                                  <option value={1}>
                                    {Trans("YES", language)}
                                  </option>
                                  <option value={0}>
                                    {Trans("NO", language)}
                                  </option>
                                </select>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                {manStock ? (
                                  <Input
                                    id={Trans("STOCK_QUANTITY", language)}
                                    type="number"
                                    label={Trans("STOCK_QUANTITY", language)}
                                    placeholder={Trans(
                                      "STOCK_QUANTITY",
                                      language
                                    )}
                                    className="form-control"
                                    {...register("product_stock_qty", {
                                      required: Trans(
                                        "STOCK_QUANTITY_REQUIRED",
                                        language
                                      ),
                                    })}
                                    defaultValue={0}
                                    readOnly={false}
                                  />
                                ) : (
                                  <Input
                                    id={Trans("STOCK_QUANTITY", language)}
                                    type="number"
                                    label={Trans("STOCK_QUANTITY", language)}
                                    placeholder={Trans(
                                      "STOCK_QUANTITY",
                                      language
                                    )}
                                    className="form-control"
                                    {...register("product_stock_qty", {
                                      required: Trans(
                                        "STOCK_QUANTITY_REQUIRED",
                                        language
                                      ),
                                    })}
                                    defaultValue={0}
                                    readOnly={true}
                                  />
                                )}

                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="product_stock_qty"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("PRODUCT_PRICE", language)}
                                  type="number"
                                  label={Trans("PRODUCT_PRICE", language)}
                                  placeholder={Trans("PRODUCT_PRICE", language)}
                                  className="form-control"
                                  {...register("product_stock_price", {
                                    required: Trans(
                                      "PRODUCT_PRICE_REQUIRED",
                                      language
                                    ),
                                  })}
                                  onKeyUp={calculateSellprice}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="PRODUCT_PRICE"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("PROFIT_PERCENT", language)}
                                  type="number"
                                  label={Trans("PROFIT_PERCENT", language)}
                                  placeholder={Trans(
                                    "PROFIT_PERCENT",
                                    language
                                  )}
                                  className="form-control"
                                  {...register("product_profit_margin", {
                                    required: Trans(
                                      "PROFIT_PERCENT_REQUIRED",
                                      language
                                    ),
                                  })}
                                  onKeyUp={calculateSellprice}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="product_profit_margin"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Label
                                  display="block"
                                  mb="5px"
                                  htmlFor={Trans(
                                    "PRODUCT_DISCOUNT_TYPE",
                                    language
                                  )}
                                >
                                  {Trans("PRODUCT_DISCOUNT_TYPE", language)}
                                </Label>

                                <select
                                  id={Trans("PRODUCT_DISCOUNT_TYPE", language)}
                                  placeholder={Trans(
                                    "PRODUCT_DISCOUNT_TYPE",
                                    language
                                  )}
                                  className="form-control"
                                  {...register("product_discount_type", {
                                    required: Trans(
                                      "PRODUCT_DISCOUNT_TYPE_REQUIRED",
                                      language
                                    ),
                                  })}
                                  onChange={calculateSellprice}
                                >
                                  <option value="no">
                                    {Trans("NO", language)}
                                  </option>
                                  <option value="flat">
                                    {Trans("FLAT", language)}
                                  </option>
                                  <option value="percentage">
                                    {Trans("PERCENTAGE", language)}
                                  </option>
                                </select>
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="product_discount_type"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans(
                                    "PRODUCT_DISCOUNT_AMOUNT",
                                    language
                                  )}
                                  onKeyUp={calculateSellprice}
                                  type="number"
                                  step={0.1}
                                  defaultValue={0.0}
                                  label={Trans(
                                    "PRODUCT_DISCOUNT_AMOUNT",
                                    language
                                  )}
                                  placeholder={Trans(
                                    "PRODUCT_DISCOUNT_AMOUNT",
                                    language
                                  )}
                                  className="form-control"
                                  {...register("product_discount_amount", {
                                    required: Trans(
                                      "PRODUCT_DISCOUNT_AMOUNT_REQUIRED",
                                      language
                                    ),
                                  })}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="product_discount_amount"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans(
                                    "ADDITIONAL_SHIPPING_CHARGE",
                                    language
                                  )}
                                  type="number"
                                  defaultValue={0.0}
                                  label={Trans(
                                    "ADDITIONAL_SHIPPING_CHARGE",
                                    language
                                  )}
                                  onKeyUp={calculateSellprice}
                                  placeholder={Trans(
                                    "ADDITIONAL_SHIPPING_CHARGE",
                                    language
                                  )}
                                  className="form-control"
                                  {...register("shipping_charge")}
                                />
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <input
                                type="hidden"
                                {...register("product_sale_price")}
                              />
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("SELL_PRICE", language)}
                                  type="number"
                                  label={Trans("SELL_PRICE", language)}
                                  placeholder={Trans("SELL_PRICE", language)}
                                  className="form-control"
                                  {...register("product_sale_price_show")}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="PRODUCT_SELLING_PRICE"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("MIN_ORDER_QTY", language)}
                                  type="text"
                                  label={Trans("MIN_ORDER_QTY", language)}
                                  placeholder={Trans("MIN_ORDER_QTY", language)}
                                  className="form-control"
                                  {...register("min_order_qty")}
                                />
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("MAX_ORDER_QTY", language)}
                                  type="text"
                                  label={Trans("MAX_ORDER_QTY", language)}
                                  placeholder={Trans("MAX_ORDER_QTY", language)}
                                  className="form-control"
                                  {...register("max_order_qty")}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            {priceType === 2 && (
                              <BulkPrice
                                editPrice={editInfo?.product_price}
                                editLoad={editLoad}
                              />
                            )}
                          </Row>
                        </fieldset>
                      </Col>
                      <Col col={6}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("PRODUCT_TYPE", language)}
                          >
                            {Trans("PRODUCT_TYPE", language)}
                          </Label>
                          {productTypeList && (
                            <select
                              id={Trans("PRODUCT_TYPE", language)}
                              placeholder={Trans("PRODUCT_TYPE", language)}
                              className="form-control"
                              {...register("product_type_id", {
                                required: Trans(
                                  "PRODUCT_TYPE_REQUIRED",
                                  language
                                ),
                              })}
                              onChange={ModuleChange}
                              value={editInfo.product_type_id}
                            >
                              <option value="">
                                {Trans("SELECT_PRODUCT_TYPE", language)}
                              </option>
                              {productTypeList.map((type, idx) => (
                                <React.Fragment key={idx}>
                                  <option
                                    value={type.product_type_id}
                                    attributes={JSON.stringify(
                                      type.fields_group
                                    )}
                                  >
                                    {type.product_type_name}
                                  </option>
                                </React.Fragment>
                              ))}
                            </select>
                          )}
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="product_type_id"
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      {productTypeFields && (
                        <ProductType htmlElement={productTypeFields} />
                      )}

                      <ProductAttribute
                        editProductAttribute={editProAttribute}
                        productAttribute={productAttribute}
                        editLoad={editLoad}
                      />

                      <Feature
                        editFeature={editInfo?.product_feature}
                        editLoad={editLoad}
                      />
                      {/* gallery */}
                      <Col col={12}>
                        <fieldset className="form-fieldset">
                          <legend>{Trans("PRODUCT_IMAGES", language)}</legend>
                          <Row>
                            <Col col={3}>
                              <FormGroup>
                                <Label
                                  display="block"
                                  mb="5px"
                                  htmlFor={"fileupload"}
                                >
                                  {Trans("PRODUCT_IMAGE", language)}
                                </Label>
                                <div className="custom-file">
                                  <input
                                    type="hidden"
                                    {...register("product_image", {
                                      required: Trans(
                                        "PRODUCT_IMAGE_REQUIRED",
                                        language
                                      ),
                                    })}
                                  />
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={(event) =>
                                      HandleDocumentUpload(
                                        event,
                                        "fileupload",
                                        "product_image"
                                      )
                                    }
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="customFile"
                                  >
                                    {Trans("IMAGE", language)}
                                  </label>
                                  <span className="required">
                                    <ErrorMessage
                                      errors={errors}
                                      name="product_image"
                                    />
                                  </span>
                                  <div id={"fileupload"}></div>
                                </div>
                              </FormGroup>
                            </Col>
                            <Col col={12} className="mt-3">
                              <Label
                                display="block"
                                mb="5px"
                                htmlFor="role_name"
                              >
                                {Trans("GALLERY_IMAGES", language)}
                              </Label>
                              <FormGroup mb="20px">
                                {showMulImage === undefined ? (
                                  <GalleryImagePreviewWithUploadWithItem
                                    label="multipleImage"
                                    className="form-control"
                                    imageHandleComp={imageHandleComp}
                                    onDrop={imageHandleComp}
                                    selectedImageList={showMulImage}
                                  />
                                ) : (
                                  <GalleryImagePreviewWithUploadWithItem
                                    label="multipleImage"
                                    className="form-control"
                                    imageHandleComp={imageHandleComp}
                                    onDrop={imageHandleComp}
                                    selectedImageList={showMulImage}
                                  />
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </fieldset>
                      </Col>
                      {/* end gallery */}

                      {/* OTHER INFO */}
                      <Col col={12} className="mt-3">
                        <fieldset className="form-fieldset">
                          <legend>{Trans("OTHER_INFO", language)}</legend>
                          <Row>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("SORT_ORDER", language)}
                                  type="number"
                                  label={Trans("SORT_ORDER", language)}
                                  placeholder={Trans("SORT_ORDER", language)}
                                  className="form-control"
                                  {...register("sort_order", {
                                    required: Trans(
                                      "SORT_ORDER_REQUIRED",
                                      language
                                    ),
                                  })}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="sort_order"
                                  />
                                </span>
                              </FormGroup>
                            </Col>

                            {/* // stts */}
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Label htmlFor="status">
                                  {Trans("STATUS", language)} :{" "}
                                </Label>
                                <select
                                  {...register("product_status")}
                                  className="form-control"
                                  value={editInfo?.product_status}
                                >
                                  <option value="0">
                                    {Trans("DRAFT", language)}
                                  </option>
                                  <option value="1">
                                    {Trans("PUBLISH", language)}
                                  </option>
                                  <option value="2">
                                    {Trans("INACTIVE", language)}
                                  </option>
                                </select>
                              </FormGroup>
                            </Col>

                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("EXPIRE_AT", language)}
                                  type="datetime-local"
                                  label={Trans("EXPIRE_AT", language)}
                                  placeholder={Trans("EXPIRE_AT", language)}
                                  className="form-control"
                                  {...register("expire_at")}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="expire_at"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("LIVE_DATE", language)}
                                  type="date"
                                  label={Trans("LIVE_DATE", language)}
                                  placeholder={Trans("LIVE_DATE", language)}
                                  className="form-control"
                                  {...register("product_live_date")}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="product_live_date"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                            <Col col={3}>
                              <FormGroup mb="20px">
                                <Input
                                  id={Trans("DELIVERY_TIME", language)}
                                  type="number"
                                  label={Trans("DELIVERY_TIME", language)}
                                  placeholder={Trans("DELIVERY_TIME", language)}
                                  className="form-control"
                                  {...register("product_delivery_time")}
                                />
                                <span className="required">
                                  <ErrorMessage
                                    errors={errors}
                                    name="product_delivery_time"
                                  />
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                        </fieldset>
                      </Col>
                      {/* OTHER INFO */}

                      <br />
                      {/* product tags */}
                      <Col col={12} className="mt-3">
                        <Input
                          id={Trans("PRODUCT_TAGS", language)}
                          type="text"
                          label={Trans("PRODUCT_TAGS", language)}
                          placeholder="Use Insert Button To Add"
                          className="form-control"
                          onKeyUp={(e) => {
                            e.preventDefault();
                            if (e.keyCode === 45) {
                              addTag(e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />

                        <input type="hidden" {...register("product_tags")} />

                        <div className="All_Tags">
                          {productTags &&
                            productTags.map((tag, idx) => {
                              return (
                                <React.Fragment>
                                  <span className="tags btn btn-info">
                                    {tag}{" "}
                                    <FeatherIcon
                                      icon="x"
                                      className="wd-10 mg-r-5"
                                      onClick={() => {
                                        removeTag(idx);
                                      }}
                                    />
                                  </span>
                                </React.Fragment>
                              );
                            })}
                        </div>
                      </Col>

                      <Col col={12} className="mt-2">
                        <LoaderButton
                          formLoadStatus={formloadingStatus}
                          btnName={Trans("UPDATE", language)}
                          className="btn btn-primary btn-block"
                        />
                      </Col>
                      <br />
                    </Row>
                  </form>
                </FormProvider>
              </>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default Edit;
