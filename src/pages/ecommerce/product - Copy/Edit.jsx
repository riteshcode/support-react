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
  TextArea,
  StatusSelect,
  Anchor,
  Label,
  GalleryImagePreviewWithUploadWithItem,
} from "component/UIElement/UIElement";
import { Alert, Tab, Tabs } from "react-bootstrap";
import Notify from "component/Notify";
import { ErrorMessage } from "@hookform/error-message";
import Index from ".";
import Select from "react-select";
import WebsiteLink from "config/WebsiteLink";

import ProductType from "./component/Edit/ProductType";
import Category from "./component/Edit/Category";
import LangProductInfo from "./component/Edit/LangProductInfo";
import ProductAttribute from "./component/Edit/ProductAttribute";
import FeatherIcon from "feather-icons-react";
import { Modal, Button } from "react-bootstrap";

const Edit = (props) => {
  const { proId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [key, setKey] = useState("en");
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(true);
  const [editProductAttribute, SetEditProductAttribute] = useState([
    { options_id: "", options_values_id: "", options_values_price: "" },
  ]);
  const [editProAttribute, SetEditProAttribute] = useState();

  const [checkProductCondition, SetCheckProductCondition] = useState(1);

  const methods = useForm({
    defaultValues: {
      productAttribute: editProductAttribute,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = methods;

  const onSubmit = (formData) => {
    console.log("formData", formData);
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
        console.log("response", response);
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });

          Notify(true, Trans(message, language));
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

  useEffect(async () => {
    let abortController = new AbortController();
    const formData = {
      api_token: apiToken,
      language: language,
    };
    await POST(productCreateUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetCategoryList(data.category);
          SetlangList(data.language);
          SetProductTypeList(data.product_type);
          SetProductAttribute(data.product_attribute);
          SetSupplierList(data.supplier);
          SetBrandList(data.brand);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
    return () => abortController.abort();
  }, []);

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

    var readers = new FileReader();
    readers.onload = function (e) {
      console.log("filereade", e);
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
        console.log("temp", response);
        setValue(StoreID, response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };
  const [priceType, SetPriceType] = useState(1);

  const bulkPrice = [];

  for (let index = 0; index < 6; index++) {
    bulkPrice.push(
      <React.Fragment key={index}>
        <Col col={2}>
          <FormGroup mb="20px">
            <Input
              id={Trans("QTY", language)}
              type="text"
              label="QTY"
              placeholder={Trans(`QTY(${index})`, language)}
              className="form-control"
              {...register("product_stock_qty_" + index)}
            />
            <span className="required">
              <ErrorMessage
                errors={errors}
                name={"product_stock_qty_" + index}
              />
            </span>
          </FormGroup>
          <FormGroup mb="20px">
            <Input
              id={Trans("PRICE", language)}
              type="text"
              label="PRICE"
              placeholder={Trans(`PRICE(${index})`, language)}
              className="form-control"
              {...register("product_price_" + index)}
            />
            <span className="required">
              <ErrorMessage errors={errors} name={"product_price_" + index} />
            </span>
          </FormGroup>
        </Col>
      </React.Fragment>
    );
  }

  const [productTypeFields, SetProductTypeFields] = useState("");
  const ModuleChange = (e) => {
    let value = e.target.value;
    if (value !== undefined || value !== "") {
      const sectionlistData =
        e.target.selectedOptions[0].attributes[1].nodeValue;
      SetProductTypeFields(JSON.parse(sectionlistData));
    }
  };

  const [MultiSelectCategoryItem, SetMultiSelectCategoryItem] = useState("");
  const handleMultiSelectChange = (newValue, actionMeta) => {
    console.log("newValue", newValue);
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    // listArr = listArr.join(",");
    console.log("listArr", listArr);
    SetMultiSelectCategoryItem(listArr);
    console.log("actionMeta", actionMeta);
  };

  const [selectedCategory, SetSelectedCategory] = useState();
  const [selectedSupplier, SetSelectedSupplier] = useState();
  const [selectedProductType, SetSelectedProductType] = useState();
  const [productAttribute, SetProductAttribute] = useState();

  const [MultiSelectSupplierItem, SetMultiSelectSupplierItem] = useState("");
  const handleMultiSelectSupplierChange = (newValue, actionMeta) => {
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
  console.log("multipleImage", multipleImageIds);

  // edit info
  useEffect(async () => {
    let abortController = new AbortController();

    const formData = {
      api_token: apiToken,
      language: language,
      product_id: proId,
    };
    await POST(productEditUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetloadingStatus(false);
          const { data } = response.data;
          const fieldList = getValues();
          for (const key in fieldList) {
            setValue(key, data[key]);
          }
          SetSelectedCategory(data?.selected_category);
          SetSelectedSupplier(data?.selected_supplier);
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
          // listArr = listArr.join(",");
          console.log("listArr", listArr);
          SetMultiSelectCategoryItem(listArr);

          SetEditProAttribute(data?.productAttribute);
          SetEditProductAttribute(data?.productAttribute);
          SetProductTypeFields(data?.product_type);

          if (data?.productAttribute.length > 0) {
            const attribute = data?.productAttribute;

            for (let index = 0; index < attribute.length; index++) {
              const element = attribute[index];
              SetSelectedProductType(...editProductAttribute, {
                options_id: element.options_id,
                options_values_id: element.options_values_id,
                options_values_price: element.options_values_price,
              });
            }
          }

          // display product_name value
          if (data?.productdescription_with_lang.length > 0) {
            const lang_with_pro = data?.productdescription_with_lang;
            for (let index = 0; index < lang_with_pro.length; index++) {
              const pro_name = lang_with_pro[index].pivot.products_name;
              const pro_desc = lang_with_pro[index].pivot.products_description;
              setValue(
                "products_name_" + lang_with_pro[index].languages_id,
                pro_name
              );
              setValue(
                "products_description_" + lang_with_pro[index].languages_id,
                pro_desc
              );
            }
          }
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
    return () => abortController.abort();
  }, [proId]);

  // useEffecr Re-render when all edit data set
  useEffect(() => {}, [selectedProductType]);

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
                      <Col col={8}>
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
                          >
                            <option value="">
                              {Trans("SELECT_BRAND", language)}
                            </option>
                            {brandList &&
                              brandList.map((brand) => (
                                <React.Fragment key={brand.brand_id}>
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

                      <LangProductInfo langList={langList} />
                      <Col col={6}>
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
                        </FormGroup>
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
                            <>
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
                                defaultValue={selectedProductType}
                              >
                                <option value="">
                                  {Trans("SELECT_PRODUCT_TYPE", language)}
                                </option>
                                {productTypeList.map((type) => (
                                  <React.Fragment key={type.product_type_id}>
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
                            </>
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
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="product_model"
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id={Trans("PRODUCT_SKU", language)}
                            type="text"
                            label={Trans("PRODUCT_SKU", language)}
                            placeholder={Trans("PRODUCT_SKU", language)}
                            className="form-control"
                            {...register("product_sku", {
                              required: Trans("PRODUCT_SKU_REQUIRED", language),
                            })}
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="product_sku" />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id={Trans("PRODUCT_VIDEO_URL", language)}
                            type="text"
                            label={Trans("PRODUCT_VIDEO_URL", language)}
                            placeholder={Trans("PRODUCT_VIDEO_URL", language)}
                            className="form-control"
                            {...register("product_video_url", {
                              required: Trans(
                                "PRODUCT_VIDEO_URL_REQUIRED",
                                language
                              ),
                            })}
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="product_video_url"
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id={Trans("PRODUCT_EXTERNAL_URL", language)}
                            type="text"
                            label={Trans("PRODUCT_EXTERNAL_URL", language)}
                            placeholder={Trans(
                              "PRODUCT_EXTERNAL_URL",
                              language
                            )}
                            className="form-control"
                            {...register("product_external_url", {
                              required: Trans(
                                "PRODUCT_EXTERNAL_URL_REQUIRED",
                                language
                              ),
                            })}
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="product_external_url"
                            />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={6}>
                        <FormGroup mb="20px">
                          <Label htmlFor="status">
                            {Trans("PRODUCT_CONDITION", language)} :{" "}
                          </Label>
                          {"     "}
                          <input
                            type="radio"
                            {...register("product_condition")}
                            id="product_condition"
                            defaultValue={1}
                            defaultChecked={
                              checkProductCondition === 1 ? true : false
                            }
                          />
                          {"  "}
                          {Trans("NEW", language)}
                          {"   "}
                          <input
                            type="radio"
                            {...register("product_condition")}
                            id="product_condition"
                            defaultValue={2}
                            defaultChecked={true}
                          />{" "}
                          {Trans("REFURBISHED", language)}
                        </FormGroup>
                      </Col>
                      <Col col={6}>
                        <FormGroup mb="20px">
                          <Label htmlFor="product_price_type">
                            {Trans("PRODUCT_PRICE_TYPE", language)} :{" "}
                          </Label>
                          {"     "}
                          <input
                            type="radio"
                            id="product_price_type"
                            {...register("product_price_type")}
                            defaultValue={1}
                            defaultChecked={true}
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
                            onClick={() => {
                              SetPriceType(2);
                            }}
                          />{" "}
                          {Trans("BULK", language)}
                        </FormGroup>
                      </Col>
                      {priceType === 1 && (
                        <>
                          <Col col={3}>
                            <FormGroup mb="20px">
                              <Input
                                id={Trans("PRODUCT_QUANTITY", language)}
                                type="text"
                                label={Trans("PRODUCT_QUANTITY", language)}
                                placeholder={Trans(
                                  "PRODUCT_QUANTITY",
                                  language
                                )}
                                className="form-control"
                                {...register("product_stock_qty", {
                                  required: Trans(
                                    "PRODUCT_QUANTITY_REQUIRED",
                                    language
                                  ),
                                })}
                              />
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
                                type="text"
                                label={Trans("PRODUCT_PRICE", language)}
                                placeholder={Trans("PRODUCT_PRICE", language)}
                                className="form-control"
                                {...register("product_stock_price", {
                                  required: Trans(
                                    "PRODUCT_PRICE_REQUIRED",
                                    language
                                  ),
                                })}
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
                                id={Trans("PRODUCT_PROFIT_MARGIN", language)}
                                type="text"
                                label={Trans("PRODUCT_PROFIT_MARGIN", language)}
                                placeholder={Trans(
                                  "PRODUCT_PROFIT_MARGIN",
                                  language
                                )}
                                className="form-control"
                                {...register("product_profit_margin", {
                                  required: Trans(
                                    "PRODUCT_PROFIT_MARGIN_REQUIRED",
                                    language
                                  ),
                                })}
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
                              <Input
                                id={Trans("PRODUCT_SELLING_PRICE", language)}
                                type="text"
                                label={Trans("PRODUCT_SELLING_PRICE", language)}
                                placeholder={Trans(
                                  "PRODUCT_SELLING_PRICE",
                                  language
                                )}
                                className="form-control"
                                {...register("product_sale_price", {
                                  required: Trans(
                                    "PRODUCT_SELLING_PRICE_REQUIRED",
                                    language
                                  ),
                                })}
                              />
                              <span className="required">
                                <ErrorMessage
                                  errors={errors}
                                  name="PRODUCT_SELLING_PRICE"
                                />
                              </span>
                            </FormGroup>
                          </Col>
                        </>
                      )}

                      {priceType === 2 && bulkPrice}

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("PRODUCT_DISCOUNT_TYPE", language)}
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
                          >
                            <option value="">
                              {Trans("SELECT_PRODUCT_TYPE", language)}
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
                            id={Trans("PRODUCT_DISCOUNT_AMOUNT", language)}
                            type="number"
                            step={0.1}
                            label={Trans("PRODUCT_DISCOUNT_AMOUNT", language)}
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
                              {...register("product_image_temp")}
                            />
                            <input
                              type="file"
                              className="custom-file-input"
                              id="customFile"
                              onChange={(event) =>
                                HandleDocumentUpload(
                                  event,
                                  "fileupload",
                                  "product_image_temp"
                                )
                              }
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              {Trans("IMAGE", language)}
                            </label>
                            <div id={"fileupload"}></div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id={Trans("SORT_ORDER", language)}
                            type="number"
                            label={Trans("SORT_ORDER", language)}
                            placeholder={Trans("SORT_ORDER", language)}
                            className="form-control"
                            {...register("sort_order", {
                              required: Trans("SORT_ORDER_REQUIRED", language),
                            })}
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="sort_order" />
                          </span>
                        </FormGroup>
                      </Col>

                      <ProductAttribute
                        editProductAttribute={editProAttribute}
                        productAttribute={productAttribute}
                      />

                      <Col col={12}>
                        <FormGroup mb="20px">
                          <Label htmlFor="status">
                            {Trans("STATUS", language)} :{" "}
                          </Label>
                          {"     "}
                          <input
                            type="radio"
                            {...register("status")}
                            defaultValue={1}
                            defaultChecked={true}
                          />
                          {"  "}
                          {Trans("ACTIVE", language)}
                          {"   "}
                          <input
                            type="radio"
                            {...register("status")}
                            defaultValue={0}
                          />{" "}
                          {Trans("INACTIVE", language)}
                        </FormGroup>
                      </Col>

                      {/* gallery */}
                      <Col col={12}>
                        <Label display="block" mb="5px" htmlFor="role_name">
                          Gallery Image
                        </Label>
                        <FormGroup mb="20px">
                          {/* {showMulImage && ( */}
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

                          {/* )} */}
                        </FormGroup>
                      </Col>
                      {/* end gallery */}
                      <Col col={12} className="mt-2">
                        <LoaderButton
                          formLoadStatus={formloadingStatus}
                          btnName={Trans("CREATE", language)}
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
