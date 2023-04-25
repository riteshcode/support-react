import React, { useState } from "react";
import POST from "axios/post";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { updateLoginState } from "redux/slice/loginSlice";
import { loginUrl } from "config";
import Alert from "component/UIElement/Alert";
import { Anchor, LoaderButton } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import LoginBanner from "assets/img/Login_Banner.png";

function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language } = useSelector((state) => state.login);
  const [formloadingStatus, SetformloadingStatus] = useState(false);

  const { register, handleSubmit } = useForm();
  const [msgType, setMsgType] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.loginType = btoa("subscriber");
    POST(loginUrl, formData)
      .then((response) => {
        const { status, message, data } = response.data;
        if (status) {
          console.log(data);
          const regenerateToken = btoa(
            `${data.user.api_token}_DB${data.db_control}`
          );
          data.user.api_token = regenerateToken;
          dispatch(updateLoginState(data));
          setMsgType("success");
          setErrorMsg("You logged in !");
          navigate("/");
        } else {
          console.log(message);
          setMsgType("danger");
          setErrorMsg(Trans(message, language));
        }
        SetformloadingStatus(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setMsgType("danger");
        setErrorMsg(error.message);
        SetformloadingStatus(false);
      });
  };

  return (
    <div className="content content-fixed content-auth">
      <div className="container">
        <div className="media align-items-stretch justify-content-center ht-100p pos-relative">
          <div className="media-body align-items-center d-none d-lg-flex">
            <div className="mx-wd-600">
              <img src={LoginBanner} className="img-fluid" alt="" />
            </div>
          </div>
          <div
            className="sign-wrapper mg-lg-l-50 mg-xl-l-60"
            style={{ width: 340 }}
          >
            <div className="wd-100p">
              <h3 className="tx-color-01 mg-b-5">
                {Trans("SIGN_IN", language)}
              </h3>
              <p className="tx-color-03 tx-16 mg-b-40">
                {Trans("LOGIN_HEADING", language)}
              </p>
              {msgType &&
                (msgType === "success" ? (
                  <Alert type="success">{errorMsg}</Alert>
                ) : (
                  <Alert type="danger">{errorMsg}</Alert>
                ))}
              <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                <input type="hidden" {...register("loginType")} value="admin" />
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="yourname@yourmail.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "invalid email address",
                      },
                    })}
                  />
                </div>
                <div className="form-group">
                  <div className="d-flex justify-content-between mg-b-5">
                    <label className="mg-b-0-f">Password</label>
                    <Anchor path="/forget-password" className="tx-13">
                      {Trans("FORGET_PASS", language)}
                    </Anchor>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum length is 6",
                      },
                      maxLength: {
                        value: 50,
                        message: "Minimum length is 50",
                      },
                    })}
                  />
                </div>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("LOGIN", language)}
                  className="btn btn-brand-02 btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
