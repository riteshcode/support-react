import React from "react";
import ExportExcel from "./ExportExcel";
import ExportCSV from "./ExportCSV";
import FeatherIcon from "feather-icons-react";
import ExportPrint from './ExportPrint'

function ExportButton({ column, data, filename }) {
  return (
    <button className="btn btn-sm btn-icon btn-white btn-uppercase mg-l-5 dropdown-link">
    <label htmlFor="export" className="export-btn " style={{margin: '0px'}}>
      Export
      <FeatherIcon icon="more-vertical" fill="red" />
      <ul className="export-drop-menu">
        <li value="export">
          <ExportExcel column={column} data={data} filename={filename} />
        </li>
        <li value="exportExl">
          <ExportCSV column={column} data={data} filename={filename} />
        </li>
        <li value="print">
          <ExportPrint />
        </li>
      </ul>
    </label>
    </button>
  );
}

export default ExportButton;
