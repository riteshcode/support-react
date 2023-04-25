import React from "react";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import { Trans } from "lang";

function ExportCSV({ column, data, filename }) {
  const { language } = useSelector((state) => state.login);

  const handleClick = (e) => {
    e.preventDefault();

    var csvColumn = "";
    column.forEach(function (column) {
      csvColumn += column.label + ",";
    });
    csvColumn += "\n";

    //merge the data with CSV
    data.forEach(function (row) {
      column.forEach(function (column) {
        csvColumn += row[column.field] + ",";
      });
      csvColumn += "\n";
    });

    //display the created CSV data on the web browser
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvColumn);

    const date = new Date();
    hiddenElement.download = `${filename}_${date.getFullYear()}.csv`;
    hiddenElement.click();
  };
  return (
    <a href="!" onClick={handleClick}>
      <FeatherIcon icon="file-text" fill="#fff" />{" "}
      {Trans("EXP_TO_CSV", language)}
    </a>
  );
}

export default ExportCSV;
