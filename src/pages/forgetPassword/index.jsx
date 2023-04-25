import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import POST from "../../axios/post";
import { forgetUrl } from "../../config";
import Alert from "../../component/UIElement/Alert";
import { LoaderButton } from "../../component/UIElement/UIElement";
import { Trans } from "../../lang/index";
function Index() {
  const { language } = useSelector((state) => state.login);
  const { register, handleSubmit } = useForm();
  const [msgType, setMsgType] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    console.log(formData);
    POST(forgetUrl, formData)
      .then((response) => {
        const { status, message, data } = response.data;
        if (status) {
          console.log(data);
          setMsgType("success");
          setErrorMsg(Trans("RESET_P_M", language));
        } else {
          console.log(message);
          setMsgType("danger");
          setErrorMsg(message);
        }
        SetformloadingStatus(false);
      })
      .catch((error) => {
        console.log(error.message);
        setMsgType("danger");
        setErrorMsg(error.message);
        SetformloadingStatus(false);
      });
  };
  return (
    <>
      <div className="content content-fixed content-auth-alt">
        <div className="container d-flex justify-content-center ht-100p">
          <div className="mx-wd-300 wd-sm-450 ht-100p d-flex flex-column align-items-center justify-content-center">
            <div className="wd-80p wd-sm-300 mg-b-15">
              <img
                src="https://via.placeholder.com/2083x1466"
                className="img-fluid"
                alt=""
              />
            </div>
            <h4 className="tx-20 tx-sm-24">{Trans("RESET_P", language)}</h4>
            <p className="tx-color-03 mg-b-30 tx-center">
              {Trans("RESET_M", language)}
            </p>
            {msgType &&
              (msgType === "success" ? (
                <Alert type="success">{errorMsg}</Alert>
              ) : (
                <Alert type="danger">{errorMsg}</Alert>
              ))}
            <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="wd-100p d-flex flex-column flex-sm-row mg-b-40">
                <input
                  type="email"
                  className="form-control wd-sm-250 flex-fill"
                  placeholder="Enter username or email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("RESET_PASS", language)}
                  className="btn btn-brand-02 mg-sm-l-10 mg-t-10 mg-sm-t-0"
                />
              </div>
            </form>
            <span className="tx-12 tx-color-03">
              Key business concept vector is created by{" "}
              <a href="https://www.freepik.com/free-photos-vectors/business">
                freepik (freepik.com)
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
