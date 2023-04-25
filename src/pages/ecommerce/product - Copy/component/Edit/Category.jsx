import React from "react";
import { Trans } from "lang";
import { useSelector } from "react-redux";
import { FormGroup, Col, Label } from "component/UIElement/UIElement";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function Category({ categoryList }) {
  const methods = useFormContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const { apiToken, language } = useSelector((state) => state.login);

  return (
    <Col col={12}>
      <FormGroup mb="20px">
        <Label display="block" mb="5px" htmlFor={Trans("CATEGORY", language)}>
          {Trans("CATEGORY", language)}
        </Label>
        <select
          id={Trans("CATEGORY", language)}
          placeholder={Trans("CATEGORY", language)}
          className="form-control"
          {...register("categories_id[]", {
            required: Trans("CATEGORY_REQUIRED", language),
          })}
          multiple
        >
          {categoryList &&
            categoryList.map((curr) => (
              <React.Fragment key={curr.categories_id}>
                <option value={curr.categories_id}>{curr.category_name}</option>
                {curr.sub_category.length > 0 &&
                  curr.sub_category.map((subcat) => {
                    return (
                      <React.Fragment key={subcat.categories_id}>
                        <option value={subcat.categories_id}>
                          -- {subcat.category_name}
                        </option>
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            ))}
        </select>
        <span className="required">
          <ErrorMessage errors={errors} name="categories_id[]" />
        </span>
      </FormGroup>
    </Col>
  );
}

export default Category;
