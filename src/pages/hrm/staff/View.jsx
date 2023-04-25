import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { Trans } from "lang/index";
import { staffEditUrl, staffUpdateUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import Notify from "component/Notify";
import WorkExp from "./component/view/WorkExp";
import Education from "./component/view/Education";
import Document from "./component/view/Document";
import BasicInfo from "./component/view/BasicInfo";
import Address from "./component/view/Address";
import WebsiteLink from "config/WebsiteLink";

function View() {
  const { staffId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [EditData, setData] = useState([]);

  const editUser = (staffId) => {
    const editData = {
      api_token: apiToken,
      staff_id: staffId,
    };
    POST(staffEditUrl, editData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          setData(data);
        } else {
          Notify(false, Trans(message, language));
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(false, Trans(error.message, language));
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    editUser(staffId);
    return () => {
      abortController.abort();
    };
  }, []);

  const RefreshInfo = () => {
    editUser(staffId);
  };

  const HandleDocumentUpload = (event, previewUrlId, StoreID) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;

    var readers = new FileReader();
    readers.onload = function (e) {
      document.querySelector(".OnChnageImageLabel").src = e.target.result;
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    formdata.append("updateSection", "ProfileImageUpdate");
    formdata.append("staff_id", EditData?.staff_id);

    POST(staffUpdateUrl, formdata)
      .then((response) => {
        console.log("temp", response);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: Trans("STAFF", language), link: "/staff", class: "" },
          { title: Trans("VIEW_STAFF", language), link: "", class: "active" },
        ]}
        heading={Trans("VIEW_STAFF", language)}
      />
      <div className="row row-xs">
        <div className="col-sm-3 col-md-3 col-lg-3" id="updated-info">
          <h6>Updated Profile</h6>

          <div className="updated-img">
            <div className="col-sm-3 col-md-12 col-lg">
              <label htmlFor="profileimg">
                <img
                  src={EditData?.staff_photo}
                  // src="ds"
                  alt={EditData?.staff_name}
                  onerror="this.onerror=null; this.remove();"
                  htmlFor="profileimg"
                  className="OnChnageImageLabel"
                />
              </label>

              <input
                type="file"
                id="profileimg"
                style={{ display: "none" }}
                onChange={HandleDocumentUpload}
              />
            </div>
          </div>
          <div className="updated-name">{EditData?.staff_name}</div>
          <div className="updated-title">
            {EditData?.designation?.designation_name}
          </div>
          <div className="updated-email">{EditData?.statff_email}</div>

          <div className="mg-t-20">
            <BasicInfo EditData={EditData} refreshInfo={RefreshInfo} />
            <Address EditData={EditData} refreshInfo={RefreshInfo} />
          </div>

          <div className="updated-biography">
            <span>BIOGRAPHY</span>
            <p>{EditData.bio}</p>
          </div>
        </div>
        <div className="col-sm-3 col-md-8 col-lg-8" id="edit-info">
          <WorkExp EditData={EditData} refreshInfo={RefreshInfo} />
          <Education EditData={EditData} refreshInfo={RefreshInfo} />
          <Document EditData={EditData} refreshInfo={RefreshInfo} />
        </div>
      </div>
    </Content>
  );
}

export default View;
