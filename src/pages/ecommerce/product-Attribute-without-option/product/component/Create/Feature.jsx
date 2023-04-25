import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import { Trans } from "lang";
import { Row, Col, FormGroup, Label } from "component/UIElement/UIElement";
import FeatherIcon from "feather-icons-react";
import { ErrorMessage } from "@hookform/error-message";

function Feature({ productAttribute }) {
  const { language } = useSelector((state) => state.login);

  const methods = useFormContext();

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const productFeature = useFieldArray({
    control,
    name: "proFeature",
  });

  console.log("productAttribute", productAttribute);
  return (
    <Col col={12}>
      <Card className="mb-3">
        <Card.Header as="h6">
          {Trans("PRODUCT_EXTRA_FEATURE", language)}
          <span style={{ float: "right" }}>
            <button
              type="button"
              className="btn btn-xs btn-info"
              onClick={() => {
                productFeature.prepend({});
              }}
            >
              <FeatherIcon icon="plus" fill="white" />
              {Trans("ADD_MORE_FEATURE", language)}
            </button>
          </span>
        </Card.Header>
        {productFeature.fields && (
          <Card.Body>
            {productFeature.fields.map((item, index) => {
              return (
                <Row key={item.id}>
                  <Col col={4}>
                    <FormGroup>
                      <input
                        {...register(`proFeature.${index}.feature_key`)}
                        className="form-control"
                        id={`proFeature.${index}.feature_key`}
                        placeholder={Trans("FEATURE_KEY", language)}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`proFeature.${index}.feature_key`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={7}>
                    <FormGroup>
                      <input
                        {...register(`proFeature.${index}.feature_key_value`)}
                        className="form-control"
                        id={`proFeature.${index}.feature_key_value`}
                        placeholder={Trans("FEATURE_KEY_VALUE", language)}
                      />
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name={`proFeature.${index}.feature_key_value`}
                        />
                      </span>
                    </FormGroup>
                  </Col>
                  <Col col={1}>
                    <span style={{ lineHeight: "42px" }}>
                      <FeatherIcon
                        icon="x-square"
                        color="red"
                        onClick={() => productFeature.remove(index)}
                        size={20}
                      />
                    </span>
                  </Col>
                </Row>
              );
            })}
          </Card.Body>
        )}
      </Card>
    </Col>
  );
}

export default Feature;
