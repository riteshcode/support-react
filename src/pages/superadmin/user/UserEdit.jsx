import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { Trans } from "lang/index";
import { editUserUrl, updateUserUrl } from "config";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { LoaderButton } from "component/UIElement/UIElement";
import Alert from "component/UIElement/Alert";
//import "./style.css";
import Notify from "component/Notify";

function UserEdit() {
  const { userId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [autoGenPass, setautoGenPass] = useState(false);
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const [data, setData] = useState([]);
  console.log(userId);

  const editUser = (userID) => {
    const editData = {
      api_token: apiToken,
      user_id: userID,
    };
    POST(editUserUrl, editData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          const { email } = data;
          console.log(data);
          setData(data);
          setValue("updatedId", data.id);
          setValue("first_name", data.first_name);
          setValue("last_name", data.last_name);
          setValue("email", email);
          setValue("gender", data.gender);
          setValue("date_of_birth", data.date_of_birth);
          setValue("role_name", data.role_name);
          setValue("status", data.status);
          setValue("contact", data.contact);
          // setValue("facebook_url", data.facebook_url);
          // setValue("twitter_url", data.twitter_url);
          // setValue("google_url", data.google_url);
          // setValue("linkedin_url", data.linkedin_url);
        } else {
          alert(Trans(message, language));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [profileImage, SetprofileImage] = useState();
  const Imagechange = (event) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;
    var readers = new FileReader();
    readers.onload = function (e) {
      document.querySelector(
        "#profileimg"
      ).style.backgroundImage = `url(${e.target.result})`;
    };
    readers.readAsDataURL(event.target.files[0]);
    SetprofileImage(event.target.files[0]);
  };

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;
    formData.user_id = userId;
    const fdata = new FormData(document.getElementById("edituser"));
    fdata.set("api_token", apiToken);
    fdata.set("profileimg", profileImage);
    fdata.set("user_id", userId);

    console.log(fdata);
    POST(updateUserUrl, fdata)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, message } = response.data;
        if (status) {
          setMsgType("success");
          Notify(true, message);
          setErrorMsg(message);
          editUser(userId);
        } else {
          setMsgType("danger");
          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += message[key][0];
              return errMsg;
            });
            setErrorMsg(errMsg);
          } else {
            setErrorMsg(message);
          }
        }
      })
      .catch((error) => {
        SetformloadingStatus(false);
        console.log(error);
        setMsgType("danger");
        setErrorMsg("Something went wrong !");
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    editUser(userId);
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", "en"), link: "/", class: "" },
          { title: Trans("EDIT_USER", "en"), link: "", class: "active" },
        ]}
        heading={Trans("EDIT_USER", "en")}
      />
      <div className="row row-xs">
        <div className="col-sm-3 col-md-8 col-lg" id="edit-info">
          {msgType.length > 2 &&
            (msgType === "success" ? (
              <Alert type="success">{errorMsg}</Alert>
            ) : (
              <Alert type="danger">{errorMsg}</Alert>
            ))}

          <form
            className="edit-user-form"
            action="#"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            id="edituser"
          >
            <fieldset class="form-fieldset">
              <legend>Personal Info</legend>

              <div class="form-row">
                <div className="form-group col-md-2">
                  <div className="col-sm-3 col-md-2 col-sm">
                    <input
                      type="file"
                      id="profileimg"
                      {...register("profileimg")}
                      onChange={Imagechange}
                    />
                  </div>
                </div>
                <div className="form-group col-md-10">
                  <div class="form-row">
                    <div className="col-sm-3 col-md-6 col-sm">
                      <label>First Name</label>
                      <input
                        type="text"
                        id="first_name"
                        placeholder="Enter your first name"
                        className="form-control"
                        {...register("first_name", {
                          required: "First Name is required",
                        })}
                      />
                    </div>
                    <div className="col-sm-3 col-md-6 col-sm">
                      <label>Last Name</label>
                      <input
                        type="text"
                        id="last_name"
                        className="form-control"
                        placeholder="Enter your last name"
                        {...register("last_name")}
                      />
                    </div>
                  </div>
                  <br />
                  <div class="form-row">
                    <div className=" form-group col-sm-3 col-md-6 col-sm">
                      <label>Email</label>
                      <input
                        type="email"
                        id="emailid"
                        className="form-control"
                        placeholder="Enter you email id"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        readOnly
                      />
                    </div>

                    <div className=" form-group col-sm-3 col-md-6 col-sm">
                      <label>Gender.</label>
                      <select
                        id="gender"
                        className="form-control"
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                      >
                        <option value="">
                          {Trans("SELECT_GENDER", language)}
                        </option>
                        <option value={1}>{Trans("MALE", language)}</option>
                        <option value={2}>{Trans("FEMALE", language)}</option>
                        <option value={3}>
                          {Trans("TRANSGENDER", language)}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div className=" form-group col-sm-3 col-md-6 col-sm">
                      <label>Date Of Birth.</label>
                      <input
                        id="emailid"
                        type="date"
                        className="form-control"
                        placeholder="Enter you Date Of Birth"
                        {...register("date_of_birth")}
                      />
                    </div>

                    <div className=" form-group col-sm-3 col-md-6 col-sm">
                      <label>Contact No.</label>
                      <input
                        type="text"
                        id="emailid"
                        className="form-control"
                        placeholder="Enter you Contact Number"
                        {...register("contact")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <br />

            <fieldset class="form-fieldset">
              <legend>Change Password</legend>

              {/* <label htmlFor="autoGenerate" class="py-3">
                Auto Generate Password and send to email.
                <input
                  type="checkbox"
                  id="autoGenerate"
                  {...register("autoGenerate")}
                  onClick={(event) => {
                    console.log(event.target.checked);
                    setautoGenPass(event.target.checked);
                  }}
                />
              </label> */}
              <div class="form-row">
                {/* {!autoGenPass && ( */}
                <div className=" form-group col-sm-3 col-md-6 col-sm">
                  <label>Password</label>
                  <input
                    type="password"
                    name="userpassword"
                    className="form-control"
                    id="userpassword"
                    placeholder="**********"
                  />
                </div>
                {/* )} */}
                {/* {!autoGenPass && ( */}
                <div className=" form-group col-sm-3 col-md-6 col-sm">
                  <label>Re-Enter Password</label>
                  <input
                    type="password"
                    name="userpassword"
                    id="userpassword"
                    className="form-control"
                    placeholder="**********"
                  />
                </div>
                {/* )} */}
              </div>
            </fieldset>
            <br />
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-sm">
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("UPDATE", language)}
                  className="btn btn-primary text-right"
                  id="updateform"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Content>
  );
}

export default UserEdit;
