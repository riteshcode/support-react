import React from "react";
import "./style.css";

const Index = ({ totalPage, currPage, filterItem }) => {
  const getPage = (index) => {
    filterItem("pagi", index, "");
  };

  const items = [];

  let start = 1;
  let end = totalPage;

  if (currPage > 2) {
    start = currPage - 2;
  } else if (currPage > 1) {
    start = currPage - 1;
  } else {
    start = 1;
  }

  if (currPage < totalPage - 1) {
    end = currPage + 2;
  } else if (currPage < totalPage) {
    end = currPage + 1;
  } else {
    end = totalPage;
  }

  if (start >= 3) {
    items.push(
      <li className={`page-number`}>
        <a href="#!" onClick={() => getPage(1)}>
          1
        </a>
      </li>
    );
    items.push(
      <li className={`page-number`}>
        <a href="#!" onClick={() => getPage(2)}>
          ...
        </a>
      </li>
    );
  }

  for (let index = start; index <= end; index += 1) {
    let activeItem = "";
    if (index === currPage) activeItem = "active";
    items.push(
      <li key={index} className={`page-number ${activeItem}`}>
        <a href="#!" onClick={() => getPage(index)}>
          {index}
        </a>
      </li>
    );
  }

  if (currPage < totalPage && currPage < totalPage - 2) {
    items.push(
      <li key={`${totalPage}-${totalPage}`} className={`page-number`}>
        <a href="#!" onClick={() => getPage(totalPage - 1)}>
          ...
        </a>
      </li>
    );
    items.push(
      <li key={`${totalPage}-1${totalPage}`} className={`page-number`}>
        <a href="#!" onClick={() => getPage(totalPage)}>
          {totalPage}
        </a>
      </li>
    );
  }
  return (
    <div className="pagination">
      <ul className="pagination-2">
        <li className="page-number prev">
          <a href="#!" onClick={() => getPage(1)}>
            &laquo;
          </a>
        </li>
        {items}
        <li className="page-number prev">
          <a href="#!" onClick={() => getPage(totalPage)}>
            &raquo;
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Index;
