import React from "react";
import { useParams } from "react-router-dom";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import CheckPermission from "helper";
import SideBar from "./component/SideBar";
import BusinessSetting from "./component/BusinessSetting";
import PaymentSetting from "./component/PaymentSetting";
import WebsiteSetting from "./component/WebsiteSetting";
import NotificationSetting from "./component/NotificationSetting";
import ApplicationSetting from "./component/ApplicationSetting";
import EmailSetting from "./component/EmailSetting";
import SmsSetting from "./component/SmsSetting";
import TaxSetting from "./component/TaxSetting";

function Index() {
  const { language } = useSelector((state) => state.login);

  const { pagetype } = useParams();
  let page = <BusinessSetting />;

  switch (pagetype) {
    case "business":
      page = <BusinessSetting />;
      break;
    case "payment":
      page = <PaymentSetting />;
      break;
    case "website":
      page = <WebsiteSetting />;
      break;
    case "notification":
      page = <NotificationSetting />;
      break;
    case "application":
      page = <ApplicationSetting />;
      break;
    case "email":
      page = <EmailSetting />;
      break;
    case "sms":
      page = <SmsSetting />;
      break;
    case "tax":
      page = <TaxSetting />;
      break;

    default:
      break;
  }

  return (
    <Content>
      <div className="row row-xs">
        <div className="col-lg-3 col-xl-2 d-none d-lg-block">
          <CheckPermission IsPageAccess="setting.view">
            <SideBar activeClass={pagetype} />
          </CheckPermission>
        </div>
        <div className="col-sm-8 col-lg-9">
          <PageHeader
            breadcumbs={[
              { title: Trans("DASHBOARD", language), link: "/", class: "" },
              { title: Trans("SETTING", language), link: "", class: "" },
              {
                title: `${pagetype} ${Trans("SETTING", language)}`,
                link: "",
                class: "active",
              },
            ]}
          />
          {page}
        </div>
      </div>
    </Content>
  );
}

export default Index;
