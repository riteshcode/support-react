import React from "react";
import { Col } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";

const Rating = ({ rateNum }) => {
  let rate = [];
  for (let index = 1; index <= 5; index++) {
    rate.push(
      <FeatherIcon
        key={index}
        icon="star"
        color={index <= rateNum ? "#d37e00" : "#d1d1d1"}
        fill={index <= rateNum ? "#d37e00" : "#d1d1d1"}
        size={15}
      />
    );
  }
  return <React.Fragment> {rate} </React.Fragment>;
};

function Table({ dataList, updateStatusFunction }) {
  const { language } = useSelector((state) => state.login);
  const statusColor = ["warning", "success", "danger"];

  const StatusChange = (quoteId, statusId) => {
    updateStatusFunction(quoteId, statusId);
  };

  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{Trans("SL_NO", language)}</th>
                <th>{Trans("PRODUCT_NAME", language)}</th>
                <th>{Trans("CUSTOMER_NAME", language)}</th>
                <th>{Trans("quality_rating", language)}</th>
                <th>{Trans("price_rating", language)}</th>
                <th>{Trans("reviews_title", language)}</th>
                <th>{Trans("reviews_text", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    reviews_id,
                    customers_name,
                    quality_rating,
                    products_name,
                    price_rating,
                    reviews_title,
                    reviews_text,
                    status,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={idx}>
                      <tr>
                        <td>{idx}</td>
                        <td>{products_name}</td>
                        <td>{customers_name}</td>
                        <td>
                          <Rating rateNum={quality_rating} />
                        </td>
                        <td>
                          <Rating rateNum={price_rating} />
                        </td>
                        <td>{reviews_title}</td>
                        <td>{reviews_text}</td>
                        <td>
                          <span
                            className={`badge badge-${statusColor[status]}`}
                          >
                            {status === 0
                              ? "UnPosted"
                              : status === 1
                              ? "Posted"
                              : "Removed"}
                          </span>
                        </td>
                        <td>
                          <select
                            defaultValue={status}
                            onChange={(e) => {
                              StatusChange(reviews_id, e.target.value);
                            }}
                          >
                            <option value={0}>
                              {Trans("UnPosted", language)}
                            </option>
                            <option value={1}>
                              {Trans("Posted", language)}
                            </option>
                            <option value={2}>
                              {Trans("Removed", language)}
                            </option>
                          </select>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Col>
    </>
  );
}

export default Table;
