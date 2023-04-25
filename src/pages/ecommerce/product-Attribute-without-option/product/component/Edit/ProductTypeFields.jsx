import React from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import {
  FormGroup,
  Col,
  Input,
  TextArea,
  Row,
  Label,
} from "component/UIElement/UIElement";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function ProductTypeFields({ htmlElementFields }) {
  const methods = useFormContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const { apiToken, language } = useSelector((state) => state.login);

  console.log("htmlElementFields", htmlElementFields);

  return (
    <Row>
      {htmlElementFields &&
        htmlElementFields.map((htmlEle, idx) => {
          switch (htmlEle.field_type) {
            case "select":
              let selectArray = [];
              if (htmlEle.field_options.search(/,/i) >= 0)
                selectArray = htmlEle.field_options.split(",");
              else selectArray.push(htmlEle.field_options);
              return (
                <Col col={3} key={idx}>
                  <FormGroup mb="20px">
                    <Label
                      display="block"
                      mb="5px"
                      htmlFor={Trans("PRODUCT_TYPE", language)}
                    >
                      {Trans(htmlEle.field_label, language)}
                    </Label>
                    <select
                      id={Trans(htmlEle.field_label, language)}
                      className="form-control"
                      {...register(
                        htmlEle.field_name,
                        htmlEle.field_required === "yes" && {
                          required: Trans("PRODUCT_TYPE_REQUIRED", language),
                        }
                      )}
                      defaultValue={htmlEle.show_value}
                    >
                      <option value="">
                        {Trans(htmlEle.field_placeholder, language)}
                      </option>
                      {selectArray &&
                        selectArray.map((selectItem, idx) => {
                          return (
                            <option value={selectItem}>{selectItem}</option>
                          );
                        })}
                    </select>
                    <span className="required">
                      <ErrorMessage errors={errors} name={htmlEle.field_name} />
                    </span>
                  </FormGroup>
                </Col>
              );
              break;

            default:
              return (
                <Col col={3} key={idx}>
                  <FormGroup mb="20px">
                    <Input
                      id={Trans(htmlEle.field_label, language)}
                      type="text"
                      label={Trans(htmlEle.field_label, language)}
                      placeholder={Trans(htmlEle.field_placeholder, language)}
                      className="form-control"
                      {...register(
                        htmlEle.field_name,
                        htmlEle.field_required === "yes" && {
                          required: Trans("REQUIRED", language),
                        }
                      )}
                      defaultValue={htmlEle.show_value}
                    />
                    <span className="required">
                      <ErrorMessage errors={errors} name={htmlEle.field_name} />
                    </span>
                  </FormGroup>
                </Col>
              );
              break;
          }
        })}
    </Row>
  );
}

export default ProductTypeFields;
