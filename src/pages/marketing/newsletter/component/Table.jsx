import React from "react";
import { Col } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";

function Table({ dataList, updateStatusFunction }) {
  const { language } = useSelector((state) => state.login);
  const statusColor = ["danger", "success", "warning", "danger"];

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
                <th>{Trans("COMPANY_NAME", language)}</th>
                <th>{Trans("CUSTOMER_NAME", language)}</th>
                <th>{Trans("CUSTOMER_EMAIL", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    newsletter_id,
                    customer_name,
                    customer_email,
                    company_name,
                    status,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={newsletter_id}>
                      <tr>
                        <td>{idx}</td>
                        <td>{company_name}</td>
                        <td>{customer_name}</td>
                        <td>{customer_email}</td>
                        <td>
                          <span
                            className={`badge badge-${statusColor[status]}`}
                          >
                            {status === 1
                              ? "Subscribed"
                              : status === 2
                              ? "UnSubscribed"
                              : "Blocked"}
                          </span>
                        </td>
                        <td>
                          <select
                            defaultValue={status}
                            onChange={(e) => {
                              StatusChange(newsletter_id, e.target.value);
                            }}
                          >
                            <option value={1}>
                              {Trans("Subscribed", language)}
                            </option>
                            <option value={2}>
                              {Trans("UnSubscribed", language)}
                            </option>
                            <option value={3}>
                              {Trans("Blocked", language)}
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
