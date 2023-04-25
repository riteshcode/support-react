import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { Trans } from "lang/index";
import { staffEditUrl, updateUserUrl } from "config";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { LoaderButton } from "component/UIElement/UIElement";
import Alert from "component/UIElement/Alert";
// import "./style.css";
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
      staff_id: userID,
    };
    POST(staffEditUrl, editData)
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
        <div className="col-sm-3 col-md-3 col-lg-3" id="updated-info">
          <h6>Updated Profile</h6>

          <div className="updated-img">
            <img src={data.full_image_path} alt={data.full_image_path} />
          </div>
          <div className="updated-name">{data.name}</div>
          <div className="updated-title">{data.role_name}</div>
          <div className="updated-email">{data.email}</div>

          <div className="updated-social-links">
            <span>WEBSITES & SOCIAL CHANNEL</span>
            <a href="!">
              <i className="fab fa-facebook"></i> https://facebook.com/
            </a>
            <a href="!">
              <i className="fab fa-twitter"></i> https://twitter.com/
            </a>
            <a href="!">
              <i className="fab fa-linkedin"></i> https://linkedin.com/
            </a>
            <a href="!">
              <i className="fab fa-google-plus-g"></i> https://google.com/
            </a>
          </div>
          <div className="updated-biography">
            <span>BIOGRAPHY</span>
            <p>{data.bio}</p>
          </div>
        </div>
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
            <h2>Basic Information</h2>
            <hr />
            <div className="form-group">
              <div className="col-sm-3 col-md-6 col-lg">
                <label>First Name</label>
                <input
                  type="text"
                  id="first_name"
                  placeholder="Enter your first name"
                  {...register("first_name", {
                    required: "First Name is required",
                  })}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-3 col-md-6 col-lg">
                <label>Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  placeholder="Enter your last name"
                  {...register("last_name")}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-lg">
                <label>Email</label>
                <input
                  type="email"
                  id="emailid"
                  placeholder="Enter you email id"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  readOnly
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-3 col-md-6 col-lg">
                <label>Contact No.</label>
                <input
                  type="text"
                  id="emailid"
                  placeholder="Enter you Contact Number"
                  {...register("contact")}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-lg">
                <label>Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter your title e.g Web Developer"
                  {...register("title")}
                />
              </div>
            </div>

            <h2>About Me</h2>
            <hr />
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-lg">
                <label>Upload user profile image</label>
                <input
                  type="file"
                  id="profileimg"
                  {...register("profileimg")}
                  onChange={Imagechange}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-lg">
                <label>Biography</label>
                <textarea
                  name="user_biography"
                  id="user_biography"
                  placeholder="Tell me about yourself !"
                  {...register("bio")}
                ></textarea>
              </div>
            </div>

            <h2>Security</h2>
            <hr />
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-lg">
                <label htmlFor="autoGenerate">
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
                </label>
              </div>
              {!autoGenPass && (
                <div
                  className="col-sm-3 col-md-12 col-lg"
                  style={{ marginTop: 40 }}
                >
                  <label>Password</label>
                  <input
                    type="password"
                    name="userpassword"
                    id="userpassword"
                    placeholder="**********"
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <div className="col-sm-3 col-md-12 col-lg">
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
