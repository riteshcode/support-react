import React, { useState } from "react";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import {
  FormGroup,
  Row,
  Col,
  Input,
  TextArea,
} from "component/UIElement/UIElement";
import { Tab, Tabs } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function LangProductInfo({ langList }) {
  const { apiToken, language } = useSelector((state) => state.login);
  const [key, setKey] = useState("en");
  const methods = useFormContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  return (
    <Col col={12}>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        {langList &&
          langList.map((lang) => {
            const { languages_code, languages_id, languages_name } = lang;
            return (
              <Tab
                eventKey={languages_code}
                key={languages_id}
                title={languages_name}
              >
                <Row>
                  <Col col={6}>
                    <FormGroup mb="20px">
                      <Input
                        id={`${Trans(
                          "PRODUCT_NAME",
                          language
                        )} (${languages_code})`}
                        label={`${Trans(
                          "PRODUCT_NAME",
                          language
                        )} (${languages_code})`}
                        placeholder={`${Trans(
                          "PRODUCT_NAME",
                          language
                        )} (${languages_code})`}
                        hint="Enter text" // for bottom hint
                        className="form-control"
                        {...register(`products_name_${languages_id}`, {
                          required: Trans("PRODUCT_NAME_REQUIRED", language),
                        })}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`products_name_${languages_id}`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={6}>
                    <FormGroup mb="20px">
                      <Input
                        id={`${Trans(
                          " SEO_TITLE",
                          language
                        )} (${languages_code})`}
                        label={`${Trans(
                          " SEO_TITLE",
                          language
                        )} (${languages_code})`}
                        placeholder={`${Trans(
                          " SEO_TITLE",
                          language
                        )} (${languages_code})`}
                        hint="Enter text" // for bottom hint
                        className="form-control"
                        {...register(`seometa_title_${languages_id}`)}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`seometa_title_${languages_id}`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={12}>
                    <FormGroup mb="20px">
                      <TextArea
                        id={`${Trans(
                          "PRODUCT_DESCRIPTION",
                          language
                        )} (${languages_code})`}
                        label={`${Trans(
                          "PRODUCT_DESCRIPTION",
                          language
                        )} (${languages_code})`}
                        placeholder={`${Trans(
                          "PRODUCT_DESCRIPTION",
                          language
                        )} (${languages_code})`}
                        className="form-control"
                        {...register(`products_description_${languages_id}`, {
                          required: Trans(
                            "PRODUCT_DESCRIPTION_REQUIRED",
                            language
                          ),
                        })}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`products_description_${languages_id}`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={12}>
                    <FormGroup mb="20px">
                      <TextArea
                        id={`${Trans(
                          "SEO_META_DESCRIPTION",
                          language
                        )} (${languages_code})`}
                        label={`${Trans(
                          "SEO_META_DESCRIPTION",
                          language
                        )} (${languages_code})`}
                        placeholder={`${Trans(
                          "SEO_META_DESCRIPTION",
                          language
                        )} (${languages_code})`}
                        className="form-control"
                        {...register(`seometa_desc_${languages_id}`)}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`seometa_desc_${languages_id}`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
              </Tab>
            );
          })}
      </Tabs>
    </Col>
  );
}

export default LangProductInfo;
