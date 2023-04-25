import React, { useState, useEffect } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import {
  subscriptionStoreUrl,
  subscriberAllUrl,
  industryUrlAll,
  subscriptionIndustryPlanUrl,
} from "config/index";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  LoaderButton,
  FormGroup,
  Row,
  Col,
  Label,
} from "component/UIElement/UIElement";
import { Alert } from "react-bootstrap";
import Notify from "component/Notify";
import Loading from "component/Preloader";

const Create = (props) => {
  const { apiToken, language } = useSelector((state) => state.login);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  });
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const [contentloadingStatus, SetloadingStatus] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    const saveFormData = formData;
    saveFormData.api_token = apiToken;

    POST(subscriptionStoreUrl, saveFormData)
      .then((response) => {
        SetformloadingStatus(false);
        const { status, message } = response.data;
        if (status) {
          setError({
            status: true,
            msg: message,
            type: "success",
          });
          props.filterItem("refresh", "", "");
          props.handleModalClose();
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
        console.log(error);
        SetformloadingStatus(false);
        setError({
          status: true,
          msg: error.message,
          type: "danger",
        });
      });
  };

  const [businessList, SetbusinessList] = useState([]);
  const [industryList, SetindustryList] = useState([]);
  const [planList, SetplanList] = useState([]);
  const [onSelectLoad, SetonSelectLoad] = useState(false);

  const getPlanListBYIndustryId = (industry_id) => {
    SetonSelectLoad(true);
    const filterData2 = {
      api_token: apiToken,
      industry_id: industry_id,
    };

    POST(subscriptionIndustryPlanUrl, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log("subscriptionIndustryPlanUrl", data);
        if (status) {
          SetonSelectLoad(false);
          SetplanList(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const getAllData = () => {
    SetloadingStatus(true);
    const filterData2 = {
      api_token: apiToken,
    };
    POST(subscriberAllUrl, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        console.log(data);
        if (status) {
          SetloadingStatus(false);
          SetbusinessList(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    POST(industryUrlAll, filterData2)
      .then((response) => {
        const { status, data, message } = response.data;
        if (status) {
          SetindustryList(data);
        } else Notify(false, Trans(message, language));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    let abortController = new AbortController();
    getAllData();
    return () => abortController.abort(); //getAllData();
  }, []);

  return (
    <>
      {contentloadingStatus ? (
        <Loading />
      ) : (
        <>
          {error.status && (
            <Alert
              variant={error.type}
              onClose={() => setError({ status: false, msg: "", type: "" })}
              dismissible
            >
              {error.msg}
            </Alert>
          )}
          <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("BUSINESS", language)}
                  >
                    {Trans("BUSINESS", language)}
                  </Label>
                  <select
                    {...register("business_id", {
                      required: Trans("BUSINESS_REQUIRED", language),
                    })}
                    className="form-control"
                    placeholder="Pick a state..."
                  >
                    <option value="">{Trans("SELECT_BUSINESS")}</option>
                    {businessList &&
                      businessList.map((data, idx) => {
                        return (
                          <option value={data.business_id} key={idx}>
                            {data.business_name} ( {data.business_unique_id})
                          </option>
                        );
                      })}
                  </select>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("INDUSTRY", language)}
                  >
                    {Trans("INDUSTRY", language)}
                  </Label>
                  <select
                    {...register("industry_id", {
                      required: Trans("INDUSTRY_REQUIRED", language),
                    })}
                    className="form-control"
                    onChange={(e) => getPlanListBYIndustryId(e.target.value)}
                  >
                    <option>{Trans("SELECT_INDUSTRY")}</option>
                    {industryList &&
                      industryList.map((industry, idx) => {
                        return (
                          <option value={industry.industry_id} key={idx}>
                            {industry.industry_name}
                          </option>
                        );
                      })}
                  </select>
                </FormGroup>
              </Col>
              <Col col={12}>
                <FormGroup mb="20px">
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("PLAN", language)}
                  >
                    {Trans("PLAN", language)}
                  </Label>
                  <select
                    {...register("plan_id", {
                      required: Trans("PLAN_REQUIRED", language),
                    })}
                    className="form-control"
                  >
                    <option value="">
                      {onSelectLoad ? "Laoding..." : Trans("SELECT_PLAN")}
                    </option>
                    {planList &&
                      planList.map((plan, idx) => {
                        return (
                          <option
                            value={plan.subscription_plan_details?.plan_id}
                            key={idx}
                          >
                            {plan.subscription_plan_details?.plan_name}(
                            {plan.subscription_plan_details?.plan_amount})
                          </option>
                        );
                      })}
                  </select>
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
        </>
      )}
    </>
  );
};

export default Create;
