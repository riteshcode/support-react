import React from "react";
import Currency from "hooks/currency";
import { Trans } from "lang";
import { BadgeShow } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

function TransactionLog({ transactionLog }) {
  console.log("transactionLog", JSON.parse(transactionLog));

  const [transaction, setTransaction] = useState([]);
  const { apiToken, language } = useSelector((state) => state.login);

  useEffect(() => {
    let abortController = new AbortController();
    setTransaction(JSON.parse(transactionLog));
    return () => abortController.abort();
  }, [transactionLog]);
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{Trans("INVOICE_NO", language)}</th>
                <th scope="col">{Trans("TRANSACTION_NO", language)}</th>
                <th scope="col">{Trans("PAYMENT_METHOD", language)}</th>
                <th scope="col">{Trans("PAYMENT_AMOUNT", language)}</th>
                <th scope="col">{Trans("APPROVAL_STATUS", language)}</th>
                <th scope="col">{Trans("PAYMENT_STATUS", language)}</th>
                <th scope="col">{Trans("PAYMENT_DATE", language)}</th>
                <th scope="col">{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {transaction ? (
                transaction.map((tr, idx) => {
                  return (
                    <tr key={idx}>
                      <th scope="row">{tr.invoice_no}</th>
                      <td>{tr.transaction_no}</td>
                      <td>{tr.payment_method_id}</td>
                      <td>{Currency("$", tr.payment_amount)}</td>
                      <td>
                        <BadgeShow
                          type={tr.approval_status}
                          content={tr.approval_status}
                        />
                      </td>
                      <td>
                        <BadgeShow
                          type={tr.payment_status}
                          content={tr.payment_status}
                        />
                      </td>
                      <td>{tr.created_at}</td>
                      <td></td>
                    </tr>
                  );
                })
              ) : (
                <tr>No result found!</tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionLog;
