import React from "react";

function SearchBox({ filterItem }) {
  const searchItem = (value) => {
    filterItem("searchbox", value, "");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // if (event.target.value !== "") {
      searchItem(event.target.value);
      // }
    }
  };

  return (
    <label htmlFor="search">
      <input
        type="text"
        name="search"
        id="search"
        className="form-control"
        placeholder="Search..."
        onBlur={(e) => {
          if (e.target.value !== "") {
            searchItem(e.target.value);
          }
        }}
        onKeyPress={handleKeyPress}
      />
    </label>
  );
}

export default SearchBox;
