import React from "react";
import FeatherIcon from "feather-icons-react";
import { Col, Anchor } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";
import WebsiteLink from "config/WebsiteLink";
import Moment from "react-moment";

function Table({ dataList, updateStatusFunction }) {
  const { language } = useSelector((state) => state.login);

  const paymentStatusColor = ["warning", "warning", "success", "danger"];
  const statusColor = [
    "warning",
    "warning",
    "info",
    "info",
    "success",
    "danger",
  ];

  const StatusChange = (quoteId, paymentStatus, statusId) => {
    updateStatusFunction(quoteId, paymentStatus, statusId);
  };

  return (
    <>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{Trans("SL_NO", language)}</th>
                <th className="text-center">{Trans("DATE", language)}</th>
                <th className="text-center">
                  {Trans("CUSTOMER_NAME", language)}
                </th>
                <th className="text-center">
                  {Trans("ORDER_NUMBER", language)}
                </th>

                <th className="text-center">
                  {Trans("GRAND_TOTAL", language)}
                </th>
                <th className="text-center">
                  {Trans("PAYMENT_STATUS", language)}
                </th>
                <th className="text-center">
                  {Trans("ORDER_STATUS", language)}
                </th>
                <th className="text-center">{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    order_id,
                    created_at,
                    order_number,
                    user,
                    grand_total,
                    payment_status,
                    order_status,
                  } = cat;
                  idx++;
                  return (
                    <React.Fragment key={order_id}>
                      <tr>
                        <td>{idx}</td>
                        <td className="text-center">
                          <Moment format="YYYY/MM/DD ">{created_at}</Moment>
                        </td>
                        <td className="text-center">{`${user?.first_name} ${user?.last_name}`}</td>
                        <td className="text-center">
                          <Anchor path={WebsiteLink(`/order/${order_number}`)}>
                            {order_number}
                          </Anchor>
                        </td>

                        <td className="text-center">
                          {grand_total.toFixed(2)}
                        </td>
                        <td className="text-center">
                          <select
                            className={`badge badge-${paymentStatusColor[payment_status]}`}
                            value={payment_status}
                            onChange={(e) => {
                              StatusChange(
                                order_id,
                                e.target.value,
                                order_status
                              );
                            }}
                          >
                            <option value={1}>
                              {Trans("Pending", language)}
                            </option>
                            <option value={2}>{Trans("Paid", language)}</option>
                            <option value={3}>
                              {Trans("Failed", language)}
                            </option>
                          </select>
                        </td>
                        <td className="text-center">
                          <select
                            className={`badge badge-${statusColor[order_status]}`}
                            value={order_status}
                            onChange={(e) => {
                              StatusChange(
                                order_id,
                                payment_status,
                                e.target.value
                              );
                            }}
                          >
                            <option value={1}>
                              {Trans("Pending", language)}
                            </option>
                            <option value={2}>
                              {Trans("InProcess", language)}
                            </option>
                            <option value={3}>
                              {Trans("Dispatch", language)}
                            </option>
                            <option value={4}>
                              {Trans("Deliverd", language)}
                            </option>
                          </select>
                        </td>
                        <td className="text-center">
                          <Anchor
                            path={WebsiteLink(`/order/${order_number}`)}
                            className="btn btn-dark btn-xs btn-icon"
                          >
                            <FeatherIcon icon="eye" />
                          </Anchor>
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
