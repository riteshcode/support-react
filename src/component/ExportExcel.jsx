import React from "react";
import FeatherIcon from "feather-icons-react";
import ReactExport from "react-export-excel";
import { useSelector } from "react-redux";
import { Trans } from "lang";

function ExportExcel({ column, data, filename }) {
  const { language } = useSelector((state) => state.login);
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  return (
    <>
      <ExcelFile
        element={
          <a href="#!">
            <FeatherIcon icon="log-out" fill="#fff" />{" "}
            {Trans("EXP_TO_XL", language)}
          </a>
        }
        filename={filename}
      >
        <ExcelSheet data={data} name={filename}>
          {column &&
            column.map((clm, idx) => {
              return (
                <ExcelColumn key={idx} label={clm.label} value={clm.field} />
              );
            })}
        </ExcelSheet>
      </ExcelFile>
    </>
  );
}

export default ExportExcel;
