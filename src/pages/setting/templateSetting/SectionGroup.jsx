import React from "react";
import Section from "./Section";
import { Col, Row, Anchor } from "component/UIElement/UIElement";
import WebsiteLink from "config/WebsiteLink";

function SectionGroup({ sectiongroup, selectData, refreshItem }) {
  console.log("sectiongroup", sectiongroup);
  return (
    <Col col={12}>
      <div className={`card`}>
        <div className="card-header">
          <h6>{sectiongroup?.section_name}</h6>
        </div>
        <div className="card-body">
          <Row>
            {sectiongroup?.template_section_options &&
              sectiongroup?.template_section_options.map((section, idx) => (
                <Section
                  section={section}
                  key={idx}
                  section_key={sectiongroup?.section_key}
                  selectData={selectData}
                  refreshItem={refreshItem}
                />
              ))}
          </Row>
        </div>
      </div>
    </Col>
  );
}

export default SectionGroup;
