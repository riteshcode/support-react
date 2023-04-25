import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "react-bootstrap";
import { Trans } from "lang";
import { Row, Col, FormGroup, Label } from "component/UIElement/UIElement";
import { useState } from "react";

function ProductAttribute({ productAttribute }) {
  const { language } = useSelector((state) => state.login);
  const [arrtArr, SetArrtArr] = useState([]);

  const methods = useFormContext();

  const {
    register,
    formState: { errors },
  } = methods;

  const handleAttr = (target, optionId, param) => {
    if (target) SetArrtArr([...arrtArr, param]);
    else {
      const afterRem = arrtArr.filter((data) => {
        return data.products_options_id !== optionId ? true : false;
      });
      SetArrtArr(afterRem);
    }
  };

  return (
    <Col col={12}>
      <Card className="mb-3">
        <Card.Header as="h6">
          {Trans("PRODUCT_OPTION_ATTRIBUTES", language)}
        </Card.Header>
        <Card.Body>
          <Row>
            {productAttribute &&
              productAttribute.map((attribute_op, idxxx) => {
                return (
                  <Col col={2} key={idxxx}>
                    <Label display="block" mb="5px">
                      {attribute_op.products_options_name}
                      {"  "}
                      <input
                        type="checkbox"
                        onClick={(e) => {
                          handleAttr(
                            e.target.checked,
                            attribute_op.products_options_id,
                            attribute_op
                          );
                        }}
                      />
                    </Label>
                  </Col>
                );
              })}
          </Row>

          {arrtArr &&
            arrtArr.map((attribute_op, idxxx) => {
              return (
                <Row key={idxxx}>
                  <Col col={12}>
                    <Label display="block" mb="5px">
                      <input
                        type="hidden"
                        {...register(`attributes.${idxxx}.name`)}
                        defaultValue={attribute_op.products_options_name}
                      />
                      <input
                        type="hidden"
                        {...register(`attributes.${idxxx}.id`)}
                        defaultValue={attribute_op.products_options_id}
                      />
                      {attribute_op.products_options_name}
                    </Label>
                  </Col>

                  <Col col={12}>
                    <Row>
                      {attribute_op.products_options_values.map(
                        (optionval, idxx) => {
                          return (
                            <Col col={2} key={idxx}>
                              <input
                                type="hidden"
                                {...register(
                                  `attributes.${idxxx}.options.${idxx}.id`
                                )}
                                defaultValue={
                                  optionval.products_options_values_id
                                }
                              />
                              <input
                                type="checkbox"
                                {...register(
                                  `attributes.${idxxx}.options.${idxx}.name`
                                )}
                                id=""
                                defaultChecked={true}
                              />
                              {"  "}
                              <label htmlFor="">
                                {optionval.products_options_values_name}
                              </label>
                              <input
                                {...register(
                                  `attributes.${idxxx}.options.${idxx}.price`
                                )}
                                className="form-control"
                                placeholder={Trans("PRICE", language)}
                              />
                            </Col>
                          );
                        }
                      )}
                    </Row>
                  </Col>
                </Row>
              );
            })}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProductAttribute;
