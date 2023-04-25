import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { useForm, FormProvider } from "react-hook-form";
import { FeaturedProduct } from 'config/WebsiteUrl';
import {
    FeaturedGroupUpdateUrl, FeaturedGroupEditUrl,
  productCreateUrl,
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

import FeatherIcon from "feather-icons-react";

const Edit = () => {
  const { featuredGroupId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
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

    POST(FeaturedGroupUpdateUrl, saveFormData)
      .then((response) => {
        // console.log("response", response);
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

  // helper data load to cretae product

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
      // console.log("filereade", e);
      document.getElementById(
        previewUrlId
      ).innerHTML = `<a href=${e.target.result} download >Preview</a>`;
    };
    readers.readAsDataURL(event.target.files[0]);

   
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
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    SetMultiSelectCategoryItem(listArr);
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
  // console.log("multipleImage", multipleImageIds);

  // edit info
  useEffect(() => {
    let abortController = new AbortController();

    const formData = {
      api_token: apiToken,
      language: language,
      featured_group_id: featuredGroupId,
    };
    POST(FeaturedGroupEditUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetloadingStatus(false);
          const { data } = response.data;
          const fieldList = getValues();
          delete fieldList.product_condition;
          delete fieldList.product_price_type;
          delete fieldList.status;

          // add product array tags
          setproductTags(data.product_tags.split(","));

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
          // console.log("listArr", listArr);
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
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
    return () => abortController.abort();
  }, []);

  // useEffecr Re-render when all edit data set
  // useEffect(() => {}, [selectedProductType]);

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

  useEffect(() => {
    setValue("product_tags", productTags.join(","));
  }, [productTags]);

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          {
            title: Trans("FEATURED", language),
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
                {Trans("UPDATE_FEATURED", language)}
              </h6>
              <div className="d-none d-md-flex">
                <Anchor
                  className="btn btn-primary pd-3"
                  path={WebsiteLink(FeaturedProduct)}
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
                    <input type="hidden" {...register("featured_group_id")} />
                    <Row>
          <Col col={6}>
            <FormGroup mb="20px">
              <Input
                id="GROUP_NAME"
                label={Trans("GROUP_NAME", language)}
                placeholder={Trans("GROUP_NAME", language)}
                className="form-control"
                {...register("group_name", {
                  required: Trans("GROUP_NAME_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="group_name" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
            <FormGroup mb="20px">
            <Input
                id="GROUP_TITLE"
                label={Trans("GROUP_TITLE", language)}
                placeholder={Trans("GROUP_TITLE", language)}
                className="form-control"
                {...register("group_title", {
                  required: Trans("GROUP_TITLE_REQUIRED", language),
                })}
              />
              <span className="required">
                <ErrorMessage errors={errors} name="group_title" />
              </span>
            </FormGroup>
          </Col>
          <Col col={6}>
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
          <Col col={12}>
            <FormGroup mb="20px">
            <Label htmlFor="status">{Trans("STATUS", language)} : </Label>
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
          <Col col={12}>
            <LoaderButton
              formLoadStatus={formloadingStatus}
              btnName={Trans("CREATE", language)}
              className="btn btn-primary btn-block"
            />
          </Col>
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
