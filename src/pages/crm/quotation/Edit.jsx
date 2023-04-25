import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { useForm, FormProvider } from "react-hook-form";
import {
  QuotationUpdateUrl,
  QuotationEditUrl,
  QuotationCustomerDataUrl,
  QuotationCreateUrl,
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
  Label,
  Anchor,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Select from "react-select";
import WebsiteLink from "config/WebsiteLink";
import { ErrorMessage } from "@hookform/error-message";

import MultipleItem from "./component/Edit/MultipleItem";
import FeatherIcon from "feather-icons-react";
import { Card } from "react-bootstrap";
import CustomerAddContact from "./component/Edit/CustomerAddContact";

const Edit = () => {
  const { quoteId } = useParams();

  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(false);

  const methods = useForm({
    defaultValues: {
      Item: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    // check customer or lead
    if (SelectedPaymentTerm === "" || SelectedPaymentTerm.length === 0) {
      Notify(false, "CHOOSE_YOUR_PAYMENT_TERM");
      SetformloadingStatus(false);
      return "";
    }
    saveFormData.payment_term = SelectedPaymentTerm;

    POST(QuotationUpdateUrl, saveFormData)
      .then((response) => {
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

  const [checkQuoteDiscount, SetcheckQuoteDiscount] = useState(0);
  const [checkShipDiscount, SetcheckShipDiscount] = useState(0);

  const [customer, SetCustomer] = useState([]);
  const [lead, SetLead] = useState([]);
  const [product, SetProduct] = useState([]);
  const [currency, SetCurrency] = useState([]);
  const [country, SetCountry] = useState([]);
  const [PaymentTerm, SetPaymentTerm] = useState("");
  const [tax, SetTax] = useState("");
  const [proAttr, SetProAttr] = useState("");

  useEffect(() => {
    let abortController = new AbortController();
    const formData = {
      api_token: apiToken,
      language: language,
    };
    POST(QuotationCreateUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        // console.log(data);
        if (status) {
          SetCustomer(data.customer);
          SetLead(data.lead);
          SetProduct(data.product);
          SetCurrency(data?.currency);
          SetCountry(data?.country);
          SetPaymentTerm(data?.paymentterms);
          SetTax(data?.tax);
          SetProAttr(data?.product_key_att);
          saveValueFields(); //call edit functin
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
    return () => abortController.abort();
  }, []);

  const [customerSelect, SetCustomerSelect] = useState("");
  const handleCustomerSelectChange = (newValue, actionMeta) => {
    SetCustomerSelect(newValue.value);
  };

  const [leadSelect, SetLeadSelect] = useState("");
  const handleLeadSelectChange = (newValue, actionMeta) => {
    SetLeadSelect(newValue.value);
    handleCustomerDetail(newValue.value);
  };

  const [customerAddress, SetCustomerAddress] = useState([]);
  const [customerContact, SetCustomerContact] = useState([]);
  const handleCustomerDetail = (customer_id) => {
    const formData = {
      api_token: apiToken,
      customer_id: customer_id,
    };
    POST(QuotationCustomerDataUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetCustomerAddress(data.addressdata);
          SetCustomerContact(data.contactdata);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
  };

  const totalItemCost = () => {
    let total = 0;
    const Itemlist = getValues("Item");
    if (Itemlist.length > 0) {
      for (let index = 0; index < Itemlist.length; index++) {
        total = total + parseFloat(Itemlist[index].item_cost);
      }
    }
    setValue("total_item_cost", total.toFixed(2));
    calculateFinalCost();
  };

  const calculateFinalCost = () => {
    let total_item_cost = getValues("total_item_cost");
    let shipping_cost = getValues("shipping_cost");
    let total_tax = getValues("total_tax");
    let tax_type = getValues("tax_type");
    let discount = getValues("discount");

    if (total_item_cost === "") total_item_cost = 0;
    if (shipping_cost === "") shipping_cost = 0;
    if (total_tax === "") total_tax = 0;
    if (discount === "") discount = 0;

    // if tax type = inclusive
    if (tax_type === "0") total_tax = 0;

    const finalCost =
      parseFloat(total_item_cost) +
      parseFloat(shipping_cost) +
      parseFloat(total_tax) -
      parseFloat(discount);

    setValue("final_cost", finalCost.toFixed(2));
  };

  const [editItem, SetEditItem] = useState([]);
  const [selectedCustomer, SetSelectedCustomer] = useState([]);

  const [editItemData, SetEditItemData] = useState([]);
  const [selectpaymenTterm, SetSelectpaymentTerm] = useState([]);

  const saveValueFields = () => {
    const formData = {
      api_token: apiToken,
      language: language,
      quotation_id: quoteId,
    };
    POST(QuotationEditUrl, formData)
      .then((response) => {
        const { status, data } = response.data;
        if (status) {
          SetloadingStatus(false);
          const { data } = response.data;
          const fieldList = [
            "quotation_id",
            "item_discount",
            "final_cost",
            "discount",
            "note",
            "quotation_id",
            "shipping_cost",
            "tax_percent",
            "tax_type",
            "total_item_cost",
            "total_tax",
            "currency",
          ];

          SetcheckQuoteDiscount(data?.quote_discount);
          SetcheckShipDiscount(data?.shipping);

          for (let index = 0; index < fieldList.length; index++) {
            const key = fieldList[index];
            setValue(key, data[key]);
          }

          // show seleceted item

          let SelectedpaymentTermData = [];
          let temp = [];

          let _payment_term = data.crm_quotation_to_payment_term;
          if (_payment_term.length > 0) {
            for (let index = 0; index < _payment_term.length; index++) {
              const element = _payment_term[index];
              const data = {
                value: _payment_term[index]["terms_id"],
                label: _payment_term[index]["terms_name"],
              };
              SelectedpaymentTermData.push(data);
              temp.push(_payment_term[index]["terms_id"]);
            }
          }
          SetSelectedPaymentTerm(temp); // set selected value array in submit form statte
          SetSelectpaymentTerm(SelectedpaymentTermData); // only selected value show purpose
          SetEditItemData(data); // set edit data to a state
          SetEditItem(data?.crm_quotation_item); // set quotation_item_list
          SetCustomerSelect(data?.customer_id);
          SetCustomerAddress(data?.addressdata);
          SetCustomerContact(data?.contactdata);
        } else Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
      })
      .catch((error) => {
        Notify(false, Trans("HAVING_ISSUE_WITH_LANGUAGE", language));
        console.error("There was an error!", error);
      });
  };

  const handleTax = (e) => {
    const tax_type = getValues("tax_type");
    const total_item_cost = getValues("total_item_cost");

    if (tax_type === "") {
      Notify(false, "CHOOSE_TAX_TYPE");
      setValue("tax_name", "");
      return;
    }

    if (total_item_cost === "") {
      Notify(false, "ADD_SOME_ITEM");
      setValue("tax_name", "");
      return;
    }

    const taxInfo = e.target.value;
    if (taxInfo === "" || taxInfo === undefined) {
      Notify(false, "NOT_FOUND");
      setValue("tax_name", "");
      return;
    }

    // if tax_type = exclusive
    const tax_part = taxInfo.split("::");
    const tax_id = tax_part[0];
    const percent = tax_part[1];
    setValue("tax_percent", percent);
    const percentArr = percent.split(",");

    let TotalTax = 0.0;
    if (percentArr.length > 0) {
      for (let index = 0; index < percentArr.length; index++) {
        const per = parseFloat(percentArr[index]);
        TotalTax = TotalTax + (parseFloat(total_item_cost) * per) / 100;
      }
    }

    setValue("total_tax", TotalTax.toFixed(2));

    calculateFinalCost();
    // console.log("percentArr", percentArr);
  };

  // for payment term handle
  const [SelectedPaymentTerm, SetSelectedPaymentTerm] = useState("");
  const handleMultiPaymentTermChange = (newValue, actionMeta) => {
    let listArr = [];
    for (let index = 0; index < newValue.length; index++) {
      listArr[index] = newValue[index].value;
    }
    SetSelectedPaymentTerm(listArr);
  };

  // useEffect(() => {}, [editItemData]);

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          {
            title: Trans("QUOTATION", language),
            link: WebsiteLink("/quotation"),
            class: "",
          },
          { title: Trans("UPDATE", language), link: "", class: "active" },
        ]}
      />

      <div className="row row-xs">
        <div className="col-sm-12 col-lg-12">
          <div className="card" id="custom-user-list">
            <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
              <h6 className="tx-uppercase tx-semibold mg-b-0">
                {Trans("UPDATE_QUOTATION", language)}
              </h6>
              <div className="d-none d-md-flex">
                <Anchor
                  className="btn btn-primary pd-3"
                  path={WebsiteLink("/quotation")}
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
                    <input type="hidden" {...register("quotation_id")} />
                    <Row>
                      {customerAddress && (
                        <Col col={12}>
                          <CustomerAddContact
                            customerAddress={customerAddress}
                            customerContact={customerContact}
                            editItemData={editItemData}
                          />
                        </Col>
                      )}

                      <Col col={12}>
                        <Card>
                          <Card.Body>
                            <Row>
                              <Col col={3}>
                                <FormGroup mb="20px">
                                  <Label>{Trans("CURRENCY", language)}</Label>
                                  {currency && (
                                    <select
                                      className="form-control"
                                      {...register("currency", {
                                        required: Trans(
                                          "currency_REQUIRED",
                                          language
                                        ),
                                      })}
                                      defaultValue={editItemData.currency}
                                    >
                                      <option value="">
                                        {Trans("SELECT_CURRENCY", language)}
                                      </option>
                                      {currency.map((add, idx) => {
                                        return (
                                          <option
                                            value={add?.currencies_code}
                                            key={idx}
                                          >
                                            {add?.currencies_code}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  )}
                                  <span className="required">
                                    <ErrorMessage
                                      errors={errors}
                                      name="currency"
                                    />
                                  </span>
                                </FormGroup>
                              </Col>
                              <Col col={3}>
                                <FormGroup mb="20px">
                                  <Label>
                                    {Trans("ITEM_DISCOUNT", language)}
                                  </Label>
                                  <select
                                    className="form-control"
                                    {...register("item_discount")}
                                  >
                                    <option value="">
                                      {Trans("SELECT_ITEM_DISCOUNT", language)}
                                    </option>
                                    <option value={0}>
                                      {Trans("NO", language)}
                                    </option>
                                    <option value={1}>
                                      {Trans("YES", language)}
                                    </option>
                                  </select>
                                  <span className="required">
                                    <ErrorMessage
                                      errors={errors}
                                      name="item_discount"
                                    />
                                  </span>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col col={12} className="mb-3">
                        <MultipleItem
                          proAttr={proAttr}
                          product={product}
                          editItem={editItem}
                          totalItemCost={totalItemCost}
                        />
                      </Col>

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Label>{Trans("QUOTE_DISCOUNT", language)}</Label>
                          {"  "}
                          <input
                            type="radio"
                            id="quote_discount"
                            {...register("quote_discount", {
                              required: Trans(
                                "SELECT_QUOTE_DISCOUNT",
                                language
                              ),
                            })}
                            defaultValue={0}
                            defaultChecked={
                              checkQuoteDiscount === 0 ? true : false
                            }
                            onClick={() => {
                              document.getElementById(
                                "QUOTE_COST"
                              ).readOnly = true;
                              setValue("discount", 0);
                              calculateFinalCost();
                            }}
                          />
                          {"  "}
                          {Trans("NO", language)}
                          {"  "}
                          <input
                            type="radio"
                            id="quote_discount"
                            {...register("quote_discount", {
                              required: Trans(
                                "SELECT_QUOTE_DISCOUNT",
                                language
                              ),
                            })}
                            defaultValue={1}
                            defaultChecked={
                              checkQuoteDiscount === 1 ? true : false
                            }
                            onClick={() => {
                              document.getElementById(
                                "QUOTE_COST"
                              ).readOnly = false;
                            }}
                          />
                          {"  "}
                          {Trans("YES", language)}
                          {"  "}
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="quote_discount"
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <input
                            id="QUOTE_COST"
                            label={Trans("DISCOUNT", language)}
                            placeholder={Trans("DISCOUNT", language)}
                            className="form-control"
                            {...register("discount")}
                            type="number"
                            onKeyUp={calculateFinalCost}
                            defaultValue={0.0}
                            readOnly={
                              editItemData?.quote_discount === 0 ? true : false
                            }
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="discount" />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Label>{Trans("SHIPPING", language)}</Label>
                          {"  "}
                          <input
                            type="radio"
                            id="shipping"
                            {...register("shipping", {
                              required: Trans("SELECT_SHIPPING", language),
                            })}
                            value={0}
                            onClick={() => {
                              document.getElementById(
                                "SHIPPING_COST"
                              ).readOnly = true;
                              setValue("shipping_cost", 0);
                              calculateFinalCost();
                            }}
                            defaultChecked={
                              checkShipDiscount === 0 ? true : false
                            }
                          />
                          {"  "}
                          {Trans("NO", language)}
                          {"  "}
                          <input
                            type="radio"
                            id="shipping"
                            {...register("shipping", {
                              required: Trans("SELECT_SHIPPING", language),
                            })}
                            defaultValue={1}
                            onClick={() => {
                              document.getElementById(
                                "SHIPPING_COST"
                              ).readOnly = false;
                            }}
                            defaultChecked={
                              checkShipDiscount === 1 ? true : false
                            }
                          />
                          {"  "}
                          {Trans("YES", language)}
                          {"  "}
                          <span className="required">
                            <ErrorMessage errors={errors} name="shipping" />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <input
                            id="SHIPPING_COST"
                            label={Trans("SHIPPING_COST", language)}
                            placeholder={Trans("SHIPPING_COST", language)}
                            className="form-control"
                            {...register("shipping_cost")}
                            type="number"
                            onKeyUp={calculateFinalCost}
                            defaultValue={0.0}
                            readOnly={
                              editItemData?.shipping === 0 ? true : false
                            }
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="shipping_cost"
                            />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id="TOTAL_ITEM_COST"
                            label={Trans("TOTAL_ITEM_COST", language)}
                            placeholder={Trans("TOTAL_ITEM_COST", language)}
                            className="form-control"
                            {...register("total_item_cost", {
                              required: Trans(
                                "TOTAL_ITEM_COST_REQUIRED",
                                language
                              ),
                            })}
                            readOnly
                          />
                          <span className="required">
                            <ErrorMessage
                              errors={errors}
                              name="total_item_cost"
                            />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Label>{Trans("TAX_TYPE", language)}</Label>
                          <select
                            className="form-control"
                            {...register("tax_type")}
                            onChange={calculateFinalCost}
                          >
                            <option value="">
                              {Trans("SELECT_TAX_TYPE", language)}
                            </option>
                            <option value={0}>
                              {Trans("INCLUSIVE", language)}
                            </option>
                            <option value={1}>
                              {Trans("EXCLUSIVE", language)}
                            </option>
                          </select>
                          <span className="required">
                            <ErrorMessage errors={errors} name="tax_type" />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("TAX_NAME", language)}
                          >
                            {Trans("TAX_NAME", language)}
                          </Label>
                          {tax && (
                            <select
                              id="TAX_NAME"
                              label={Trans("TAX_NAME", language)}
                              placeholder={Trans("TAX_NAME", language)}
                              className="form-control"
                              {...register("tax_name", {
                                required: Trans("TAX_NAME_REQUIRED", language),
                              })}
                              onChange={(e) => {
                                handleTax(e);
                              }}
                              value={editItemData.tax_name}
                            >
                              <option value={0}>
                                {Trans("SELECT_TAX", language)}
                              </option>
                              {tax.map((tax, idx) => (
                                <option
                                  value={`${tax.tax_id}::${tax.tax_percantage}`}
                                  key={idx}
                                >
                                  {tax.tax_name}
                                </option>
                              ))}
                            </select>
                          )}

                          <span className="required">
                            <ErrorMessage errors={errors} name={`tax_name`} />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id="TAX_PERCENTAGE"
                            label={Trans("TAX_PERCENTAGE", language)}
                            placeholder={Trans("TAX_PERCENTAGE", language)}
                            className="form-control"
                            {...register("tax_percent", {
                              required: Trans(
                                "TAX_PERCENTAGE_REQUIRED",
                                language
                              ),
                            })}
                            readOnly
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="tax_percent" />
                          </span>
                        </FormGroup>
                      </Col>
                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id="TOTAL_TAX"
                            label={Trans("TOTAL_TAX", language)}
                            placeholder={Trans("TOTAL_TAX", language)}
                            className="form-control"
                            {...register("total_tax")}
                            type="number"
                            onKeyUp={calculateFinalCost}
                            readOnly
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="total_tax" />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={3}>
                        <FormGroup mb="20px">
                          <Input
                            id="FINAL_COST"
                            label={Trans("FINAL_COST", language)}
                            placeholder={Trans("FINAL_COST", language)}
                            className="form-control"
                            {...register("final_cost")}
                            type="text"
                            readOnly
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="final_cost" />
                          </span>
                        </FormGroup>
                      </Col>

                      <Col col={6}>
                        <FormGroup mb="20px">
                          <Label
                            display="block"
                            mb="5px"
                            htmlFor={Trans("PAYMENT_TERM", language)}
                          >
                            {Trans("PAYMENT_TERM", language)}
                          </Label>
                          {PaymentTerm && (
                            <Select
                              name={Trans("PAYMENT_TERM", language)}
                              options={PaymentTerm}
                              value={selectpaymenTterm}
                              isMulti
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleMultiPaymentTermChange}
                              placeholder="Select PAYMENT TERM.."
                            />
                          )}
                        </FormGroup>
                      </Col>

                      <Col col={6}>
                        <FormGroup mb="20px">
                          <TextArea
                            id="NOTE"
                            label={Trans("NOTE", language)}
                            placeholder={Trans("NOTE", language)}
                            className="form-control"
                            {...register("note")}
                          />
                          <span className="required">
                            <ErrorMessage errors={errors} name="note" />
                          </span>
                        </FormGroup>
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
