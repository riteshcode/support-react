import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { Trans } from "lang/index";
import { productEditUrl, staffUpdateUrl } from "config";
import POST from "axios/post";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import Notify from "component/Notify";
import WebsiteLink from "config/WebsiteLink";
import ProductInfo from "./component/Detail/ProductInfo";
import ProductFullInfo from "./component/Detail/ProductFullInfo";
import { ProductEditDataContext } from "./ProductContext";

function Detail() {
  const { proId } = useParams();
  const { apiToken, language } = useSelector((state) => state.login);
  const [EditData, setData] = useState();

  const editProduct = (proId) => {
    const editData = {
      api_token: apiToken,
      product_id: proId,
    };
    POST(productEditUrl, editData)
      .then((response) => {
        console.log("response", response);
        const { status, data, message } = response.data;
        if (status) {
          console.log("data.data", data);
          // setData(JSON.stringify(data));
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
    editProduct(proId);
    return () => {
      abortController.abort();
    };
  }, []);

  const RefreshInfo = () => {
    editProduct(proId);
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
          {
            title: Trans("DASHBOARD", language),
            link: WebsiteLink("/"),
            class: "",
          },
          {
            title: Trans("PRODUCT", language),
            link: WebsiteLink("/products"),
            class: "",
          },
          { title: Trans("DETAIL", language), link: "", class: "active" },
        ]}
        // heading={Trans("VIEW_STAFF", language)}
      />
      <ProductEditDataContext.Provider value={EditData}>
        <div className="row row-xs">
          <div className="col-sm-3 col-md-3 col-lg-3" id="updated-info">
            <h6>{Trans("PRODUCT_DETAIL", language)}</h6>

            <div className="updated-img">
              <div className="col-sm-3 col-md-12 col-lg">
                <label htmlFor="profileimg">
                  <img
                    src={EditData?.product_image}
                    // src="ds"
                    alt={EditData?.staff_name}
                    // onError="this.onerror=null; this.remove();"
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
              <ProductInfo refreshInfo={RefreshInfo} />
              {/* <Address EditData={EditData} refreshInfo={RefreshInfo} /> */}{" "}
            </div>
          </div>
          <div className="col-sm-3 col-md-8 col-lg-8" id="edit-info">
            <ProductFullInfo refreshInfo={RefreshInfo} />
          </div>
        </div>
      </ProductEditDataContext.Provider>
    </Content>
  );
}

export default Detail;
