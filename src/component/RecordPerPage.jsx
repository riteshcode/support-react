import React from 'react'

function RecordPerPage({filterItem, perPageItem}) {

    const searchItem = (value) => {
        filterItem("perpage",value,"")
    }

    return (
        <label htmlFor="perPage">
            <select
                name="perPage"
                id="perPage"
                className="form-control"
                defaultValue={perPageItem}
                onChange={(e) => searchItem(e.target.value)}
            >
                <option value="2">2</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
        </label>
    )
}

export default RecordPerPage
