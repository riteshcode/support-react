import React, { useEffect, useState } from "react";
import Content from '../../layouts/content'
import PageHeader from '../../component/PageHeader'
import { userUrl,deleteUserUrl } from "../../config";
import FeatherIcon from 'feather-icons-react'
import POST from '../../axios/post';
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import { Badge,IconButton, Anchor } from '../../component/UIElement/UIElement'
import { Trans } from '../../lang/index'
import CheckPermission from "../../helper"
import Create from './create'
import Loading from '../../component/Preloader'
import Pagination from "component/pagination/index"
import ExportExcel from "component/ExportExcel"
import './style.css'
import Table from "component/Table";

function Index() {

    const { apiToken, language } = useSelector((state) => state.login);
    const [colSize, setColSize] = useState(12);
    const [msgType, setMsgType] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [userlist, SetUserList] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    //  filter
    const [Pagi, SetPagi] = useState(0);
    const [currPage, SetcurrPage] = useState(0);
    const [searchItem, SetSEarchItem] = useState("");
    const [sortByS, SetsortByS] = useState("id");
    const [orderByS, SetOrderByS] = useState("ASC");
    const [perPageItem, SetPerPageItem] = useState(10);
    const [contentloadingStatus, SetloadingStatus] = useState(true);
    const [formloadingStatus, SetformloadingStatus] = useState(false);


    const showColumn = [
        {
            "label":"id",
            "field":"id",
            "sort":true,
        },{
            "label":"name",
            "field":"name",
            "sort":false,
        },{
            "label":"Email",
            "field":"email",
            "sort":true,
        },{
            "label":Trans("DEPT", language),
            "field":"role_name",
            "sort":false,
        },{
            "label":"Status",
            "field":"status",
            "sort":false,
        },{
            "label":"Action",
            "field":"action",
            "action_list":['edit','delete'],
            "sort":false,
        },
    ];

    const getUser = (
        pagev,
        perPageItemv,
        searchData,
        sortBys,
        OrderBy
    ) => {
        const filterData = {
            api_token: apiToken,
            page: pagev,
            perPage: perPageItemv,
            search: searchData,
            sortBy: sortBys,
            orderBY: OrderBy,
        };
        POST(userUrl, filterData)
            .then((response) => {
                console.log(response);
                const { status, data, message } = response.data;
                if (status) {
                    SetloadingStatus(false);
                    SetUserList(data.data);
                    SetPagi(data.total_page);
                    SetcurrPage(data.current_page);
                } else alert(message);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };
    
    const deleteUser = (userID) => {
        const editData = {
            api_token: apiToken,
            deleteId: userID,
        };
        POST(deleteUserUrl, editData)
            .then((response) => {
                const { message } = response.data;
                getUser(1, perPageItem, searchItem, sortByS, orderByS);
                alert(message);
            })
            .catch((error) => {
                console.log(error);
            });
    };
  
    useEffect(() => {
        getUser(1, perPageItem, searchItem, sortByS, orderByS);
    }, []);

    return (
        <>
        <Content>
            <PageHeader
                breadcumbs={[{"title":Trans("DASHBOARD", "en"),"link":"/","class":"",},{"title":Trans("USER", "en"),"link":"","class":"active",}]}
                heading={Trans("USER_LIST", "en")}
            />
            <div className="row row-xs">
            <div className="col-sm-8 col-lg-8" id="user-list">
                    <CheckPermission IsPageAccess="role.view">
                    <div className="card" id="custom-user-list">
                        {/* <div className="card-header">
                            <h5>{Trans("USER_LIST", language)}</h5>
                        </div> */}
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-2">
                                    <label htmlFor="perPage">
                                        {/* <b>{Trans("RECORDS", language)}</b> */}
                                        <select
                                            name="perPage"
                                            id="perPage"
                                            className="form-control"
                                            defaultValue={perPageItem}
                                            onBlur={(e) => {
                                                SetloadingStatus(true);
                                                SetPerPageItem(
                                                    Number(e.target.value)
                                                );
                                                const per = Number(
                                                    e.target.value
                                                );
                                                getUser(
                                                    1,
                                                    per,
                                                    searchItem,
                                                    sortByS,
                                                    orderByS
                                                );
                                                console.log(e.target.value);
                                            }}
                                        >
                                            <option value="1">1</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                        </select>
                                    </label>
                                </div>
                                <div className="col-md-5">
                                    <label htmlFor="search">
                                        {/* <b>{Trans("SEARCH", language)}</b> */}
                                        <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            className="form-control"
                                            placeholder="Search name or email.."
                                            onChange={(e) => {
                                                const searchItesdm =
                                                    e.target.value;
                                                SetSEarchItem(searchItesdm);
                                                getUser(
                                                    1,
                                                    perPageItem,
                                                    searchItesdm,
                                                    sortByS,
                                                    orderByS
                                                );
                                            }}
                                        />
                                    </label>
                                </div>
                                <div className="col-md-5 text-right">
                                <label htmlFor="export" className="export-btn">
                                <FeatherIcon icon="more-horizontal" fill="red" />
                                <ul className="export-drop-menu">
                                    <li value="export"><a href="#"><FeatherIcon icon="log-out" fill="#fff" /> Export</a></li>
                                    <li value="exportExl">
                                        <ExportExcel column={[
                                            {"label":"Name","field":"name"},
                                            {"label":"Email","field":"email"},
                                            {"label":"Status","field":"status"}
                                        ]} data={userlist} filename="USER" />

                                    </li>
                                    <li value="exportPDF"><a href="#"><FeatherIcon icon="book-open" fill="#fff" /> Export as pdf</a></li>
                                    <li value="exportWord"><a href="#"><FeatherIcon icon="file" fill="#fff" /> Export as word doc</a></li>
                                    <li value="print"><a href="#"><FeatherIcon icon="printer" fill="#fff" /> Print</a></li>
                                    <li value="download"><a href="#"><FeatherIcon icon="download" fill="#fff" /> Download</a></li>
                                </ul>
                                </label>
                                
                                </div>
                            </div>
                            {contentloadingStatus ? (
                                <Loading />
                            ) : (
                                <div className="row">
                                    <Table
                                        showColumn={showColumn}
                                        dataList={userlist}
                                    />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th
                                                    scope="col"
                                                    onClick={() => {
                                                        const OBy =
                                                            orderByS === "ASC"
                                                                ? "DESC"
                                                                : "ASC";
                                                        SetOrderByS(OBy);
                                                        getUser(
                                                            1,
                                                            perPageItem,
                                                            searchItem,
                                                            "id",
                                                            OBy
                                                        );
                                                    }}
                                                >
                                                    {Trans("ID", language)}
                                                    {orderByS === "ASC"
                                                                ? <FeatherIcon icon="chevron-up" fill="red" />
                                                                : <FeatherIcon icon="chevron-down" fill="#000" />}
                                                </th>
                                                <th
                                                    scope="col"
                                                    onClick={() => {
                                                        const OBy =
                                                            orderByS === "ASC"
                                                                ? "DESC"
                                                                : "ASC";
                                                        SetOrderByS(OBy);
                                                        getUser(
                                                            1,
                                                            perPageItem,
                                                            searchItem,
                                                            "name",
                                                            OBy
                                                        );
                                                    }}
                                                >
                                                    {Trans("NAME", language)}
                                                    {orderByS === "ASC"
                                                                ? <FeatherIcon icon="chevron-up" fill="red" />
                                                                : <FeatherIcon icon="chevron-down" fill="#000" />}
                                                </th>
                                                <th scope="col">
                                                    {Trans("EMAIL", language)}
                                                </th>
                                                <th scope="col">
                                                    {Trans("DEPT", language)}
                                                </th>
                                                <th scope="col">
                                                    {Trans("STATUS", language)}
                                                </th>
                                                <th scope="col">
                                                    {Trans("ACTION", language)}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userlist &&
                                                userlist.map((list, index) => (
                                                    <tr key={list.id + 1}>
                                                        <th scope="row">
                                                            {index + 1}
                                                        </th>
                                                        <td>{list.name}</td>
                                                        <td>{list.email}</td>
                                                        <td>
                                                            {list.roles.map((rolesData) => (
                                                                    <Badge color="primary" key={rolesData.id}>
                                                                        {rolesData.display_name}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {list.status ===
                                                            "active" ? (
                                                                <Badge color="success">
                                                                    { list.status }
                                                                </Badge>
                                                            ) : (
                                                                <Badge color="danger">
                                                                    { list.status }
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <CheckPermission IsPageAccess="user.edit">
                                                                <Anchor path={`edit/${list.id}`} className="btn btn-primary btn-xs btn-icon">
                                                                    <FeatherIcon icon="edit-2" fill="white" />
                                                                </Anchor>
                                                            </CheckPermission>
                                                            &nbsp;
                                                            <CheckPermission IsPageAccess="user.destroy">
                                                                <IconButton
                                                                    color="danger"
                                                                    onClick={() =>
                                                                        deleteUser(
                                                                            list.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FeatherIcon icon="trash-2" fill="red" />
                                                                </IconButton>
                                                            </CheckPermission>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        totalPage={Pagi}
                                        currPage={currPage}
                                        getUser={getUser}
                                        searchItem={searchItem}
                                        perPageItem={perPageItem}
                                        sortBy={sortByS}
                                        orderBy={orderByS}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    </CheckPermission>
                </div>
            <div className="col-sm-3 col-lg-3" id="create-new-user">
                    <CheckPermission IsPageAccess="user.create">
                        <Create getUser={getUser} />
                    </CheckPermission>    
                </div> 
                
                        
            </div>       
            </Content>
        </>
    )
}

export default Index
