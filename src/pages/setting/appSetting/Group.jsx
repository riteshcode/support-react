import React from "react";
import { useSelector } from "react-redux";
import KeyAppSetting from "./KeyAppSetting";
import { Tab, Tabs } from "react-bootstrap";
import { Trans } from "lang";

function Group({ fieldKey, HelperData }) {
  const { language, userType } = useSelector((state) => state.login);

  return (
    <React.Fragment>
      <Tabs
        defaultActiveKey={`set_0`}
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        {fieldKey.map((item, idx) => {
          return (
            <Tab
              eventKey={`set_${idx}`}
              key={idx}
              title={Trans(item.group_name, language)}
            >
              <KeyAppSetting
                fieldKey={item.settings}
                HelperData={HelperData}
                currKey={item.group_id}
              />
            </Tab>
          );
        })}
      </Tabs>
    </React.Fragment>
  );
}

export default Group;
