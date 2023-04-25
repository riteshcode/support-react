import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  FeaturedProductStoreUrl,
  FeaturedProductUrl,
  FeaturedProductDeleteUrl,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Input,
  IconButton,
  Label,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";
import { ErrorMessage } from "@hookform/error-message";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";

const ManageFeatureProduct = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [contentloadingStatus, SetloadingStatus] = useState(true);

  const { editData } = props;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;
    POST(FeaturedProductStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          getFeatuerdProductList();
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
        SetformloadingStatus(false);
      })
      .catch((error) => {
        console.log(error);
        SetformloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  const [allProducts, setAllProducts] = useState([]);
  const [groupDetail, setGroupDetail] = useState([]);

  const getFeatuerdProductList = () => {
    setValue("featured_group_id", editData);
    const editInfo = {
      api_token: apiToken,
      featured_group_id: editData,
    };

    POST(FeaturedProductUrl, editInfo)
      .then((response) => {
        SetloadingStatus(false);
        setGroupDetail(response.data.data.group_details);
        setAllProducts(response.data.data.product_list);
      })
      .catch((error) => {
        SetloadingStatus(false);
        Notify(true, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getFeatuerdProductList();
    return () => abortController.abort();
  }, []);

  // delete item
  const deleteFeatuerdProduct = (deleteId) => {
    const editInfo = {
      api_token: apiToken,
      featured_products_id: deleteId,
    };
    POST(FeaturedProductDeleteUrl, editInfo)
      .then((response) => {
        const { status, message } = response.data;
        Notify(true, Trans(message, language));
        getFeatuerdProductList();
      })
      .catch((error) => {
        Notify(true, Trans(error.message, language));
      });
  };

  return (
    <React.Fragment>
      {contentloadingStatus ? (
        <Loading />
      ) : (
        <React.Fragment>
          {error.status && (
            <Alert
              variant={error.type}
              onClose={() => setError({ status: false, msg: "", type: "" })}
              dismissible
            >
              {error.msg}
            </Alert>
          )}
          <Row>
            <Col col={12}>
              <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                <input type="hidden" {...register("featured_group_id")} />
                <Row>
                  <Col col={10}>
                    <FormGroup mb="20px">
                      <input
                        type="hidden"
                        id={Trans("PRODUCTS", language)}
                        label={Trans("PRODUCTS", language)}
                        placeholder={Trans("PRODUCTS", language)}
                        className="form-control"
                        {...register("products_id", {
                          required: Trans("CHOOSE_PRODUCTS_REQUIRED", language),
                        })}
                      />

                      <Select
                        isMulti
                        name={Trans("ALL_PRODUCT", language)}
                        options={allProducts}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Search Product SKU"
                        onChange={(newValue, actionMeta) => {
                          let listArr = [];
                          for (let index = 0; index < newValue.length; index++)
                            listArr[index] = newValue[index].value;

                          listArr = listArr.join(",");
                          console.log("listArr", listArr);
                          setValue("products_id", listArr);
                        }}
                      />
                      <span className="required">
                        <ErrorMessage errors={errors} name="products_id" />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={2}>
                    <LoaderButton
                      formLoadStatus={formloadingStatus}
                      btnName={Trans("ADD", language)}
                      className="btn btn-info btn-sm"
                    />
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>

          <Row>
            <Col col={12}>
              <div className="card" id="custom-user-list">
                <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
                  <h6 className="tx-uppercase tx-semibold mg-b-0">
                    {groupDetail?.group_name}
                  </h6>
                </div>
                <div className="card-body">
                  <Row>
                    <Col col={12}>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>{Trans("SL_NO", language)}</th>
                              {/* <th>{Trans("PRODUCT_NAME", language)}</th> */}
                              <th>{Trans("PRODUCT_SKU", language)}</th>
                              <th className="text-center">
                                {Trans("ACTION", language)}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupDetail?.feature_product &&
                              groupDetail.feature_product.map((cat, IDX) => {
                                console.log("cat", cat);
                                const { featured_products_id } = cat;
                                return (
                                  <React.Fragment key={IDX}>
                                    <tr>
                                      <td>{IDX + 1}</td>
                                      {/* <td>{cat?.product?.product_sku}</td> */}
                                      <td>{cat?.product?.product_sku}</td>
                                      <td className="text-center">
                                        <button
                                          type="button"
                                          className="btn btn-danger"
                                        >
                                          <FeatherIcon
                                            icon="x-circle"
                                            size={20}
                                            onClick={() => {
                                              deleteFeatuerdProduct(
                                                featured_products_id
                                              );
                                            }}
                                          />
                                        </button>
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col col={12}></Col>
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ManageFeatureProduct;
