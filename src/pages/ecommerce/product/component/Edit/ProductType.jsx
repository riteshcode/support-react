import React from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import { Col } from "component/UIElement/UIElement";
import { useFormContext } from "react-hook-form";
import { Card, Button } from "react-bootstrap";
import ProductTypeFields from "./ProductTypeFields";

function ProductType({ htmlElement }) {
  return (
    <Col col={12}>
      {htmlElement &&
        htmlElement.map((htmlEle, idx) => {
          if (htmlEle?.fields?.length > 0) {
            return (
              <Card key={idx} className="mb-3">
                <Card.Header as="h6">{htmlEle.fieldsgroup_name}</Card.Header>
                <Card.Body>
                  <ProductTypeFields htmlElementFields={htmlEle.fields} />
                </Card.Body>
              </Card>
            );
          }
        })}
    </Col>
  );
}

export default ProductType;
