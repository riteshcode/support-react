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
  const statusColor = ["warning", "success", "danger", "dark"];

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
                <th>{Trans("AGENT_NAME", language)}</th>
                <th>{Trans("SUBJECT", language)}</th>
                <th>{Trans("TYPE_NAME", language)}</th>
                <th>{Trans("PRIORITY", language)}</th>
                <th>{Trans("STATUS", language)}</th>
                <th>{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    id,
                    agent_alias,
                    subject,
                    type,
                    priority,
                    status,
                    crm_agent,
                    ticket_type,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={idx}>
                      <tr>
                        <td>{idx}</td>
                        <td>{crm_agent?.agent_alias}</td>
                        <td>{subject}</td>
                        <td>{ticket_type?.type}</td>
                        <td>{priority}</td>
                        <td>
                          <span
                            className={`badge badge-${statusColor[status]}`}
                          >
                            {status === 0
                              ? "pending"
                              : status === 1
                              ? "closed"
                              : status === 2
                              ? "resolved"
                              : "open"}
                          </span>
                        </td>
                        <td>
                          <select
                            defaultValue={status}
                            onChange={(e) => {
                              StatusChange(id, e.target.value);
                            }}
                          >
                            <option value={0}>
                              {Trans("pending", language)}
                            </option>
                            <option value={1}>
                              {Trans("closed", language)}
                            </option>
                            <option value={2}>
                              {Trans("resolved", language)}
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
