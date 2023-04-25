import React, { useState, useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import POST from '../../axios/post';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux'
import Alert from '../../component/UIElement/Alert';
import { LoaderButton, FormGroup, Label } from '../../component/UIElement/UIElement'
import { Trans } from '../../lang/index'
import CheckPermission from "../../helper";
import PageHeader from '../../component/PageHeader'
import Content from '../../layouts/content'
import {
    roleUrl,
    editRoleUrl,
    updateRoleUrl,
    deleteRoleUrl,
} from "../../config";
import Create from './create'
import PermissionCheckbox from '../../component/PermissionCheckbox'


function Index() {

    const { apiToken, language } = useSelector((state) => state.login);
    const [rolelist, SetRoleList] = useState([]);
    const [editRoleData, SeteditRoleData] = useState([]);
    const [formloadingStatus, SetformloadingStatus] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const [msgType, setMsgType] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [formShowType, setformShowType] = useState("create");

    const getRoles = () => {
        const formData = {
            api_token: apiToken,
        };
        POST(roleUrl, formData).then((response) => {
                console.log(response);
                const { status, data, message } = response.data;
                if (status) SetRoleList(data);
                else alert(message);
        }).catch((error) => {
                console.error("There was an error!", error);
        });
    };
    const editRole = (roleID) => {
        
        
        const editData = {
            api_token: apiToken,
            updateId: roleID,
        };
        POST(editRoleUrl, editData).then((response) => {
                console.log(response);
                const { status, data, message } = response.data;
                if (status) {
                    setValue("updatedId", data.id);
                    setValue("role_name", data.display_name);
                    // set all checked value to null
                    const checkedList = document.querySelectorAll(
                        'input[name="editpermissionList"]'
                    );
                    if (checkedList.length > 0) {
                        for (let i = 0; i < checkedList.length; i += 1) {
                            checkedList[i].removeAttribute("checked");
                        }
                    }
                    // assign checked true to checkd permission
                    if (data.permissions.length > 0) {
                        for (
                            let index = 0;
                            index < data.permissions.length;
                            index += 1
                        ) {
                            const nameString =
                                data.permissions[index].name;
                            document
                                .querySelectorAll(
                                    `input[value="${nameString}"]`
                                )[0]
                                .setAttribute("checked", "checked");
                        }
                    }
                } else {
                    alert(message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const deleteRole = (roleID) => {
        const editData = {
            api_token: apiToken,
            deleteId: roleID,
        };
        POST(deleteRoleUrl, editData)
            .then((response) => {
                console.log(response);
                const { message } = response.data;
                getRoles();
                alert(message);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const onSubmit = (formData) => {
        console.log(formData);
        const checkedList = document.querySelectorAll(
            'input[name="editpermissionList"]:checked'
        );
        console.log(checkedList.length);
        if (checkedList.length === 0) {
            console.log("working");
            setMsgType("error");
            setErrorMsg("Please check any permission");
        } else {
            const permissionArr = [];
            for (let i = 0; i < checkedList.length; i += 1) {
                permissionArr.push(checkedList[i].value);
            }
            const saveFormData = formData;
            saveFormData.api_token = apiToken;
            saveFormData.permission_name = permissionArr;
            console.log(saveFormData);
            POST(updateRoleUrl, saveFormData)
                .then((response) => {
                    console.log(response);
                    const { status, data, message } = response.data;
                    if (status) {
                        getRoles();
                        setMsgType("success");
                        setErrorMsg(message);
                    } else {
                        console.log(message);
                        setMsgType("danger");
                        if (typeof message === "object") {
                            let errMsg = "";
                            Object.keys(message).map((key) => {
                                errMsg += message[key][0];
                                return errMsg;
                            });
                            setErrorMsg(errMsg);
                        } else {
                            setErrorMsg(message);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setMsgType("danger");
                    setErrorMsg("Something went wrong !");
                });
        }
    };
    const editRoleTe = (roleId)=> {
        setformShowType("edit");
        editRole(roleId);
    }
    useEffect(() => {
        getRoles();
    }, []);

    return (
        <>
        <Content>
            <PageHeader
                breadcumbs={[{"title":Trans("DASHBOARD", "en"),"link":"/","class":"",},{"title":Trans("DEPT", "en"),"link":"","class":"active",}]}
                heading={Trans("DEPT_LIST", language)}
            />
            <div className="row row-xs">
                <div className="col-sm-8 col-lg-8">
                    <CheckPermission IsPageAccess="role.view">
                    <div className="card">
                        <div className="card-header">
                            <h5>{Trans("DEPT_LIST", language)}</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                {Trans("ID", language)}
                                            </th>
                                            <th scope="col">
                                                {Trans("NAME", language)}
                                            </th>
                                            <th scope="col">
                                                {Trans("PERMISSION", language)}
                                            </th>
                                            <th scope="col">
                                                {Trans("ACTION", language)}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rolelist &&
                                            rolelist.map((list, index) => (
                                                <tr key={list.id + 1}>
                                                    <th scope="row">
                                                        {index + 1}
                                                    </th>
                                                    <td>{list.display_name}</td>
                                                    <td>
                                                        {list.permissions.map(
                                                            (pers) => (
                                                                <span
                                                                    key={
                                                                        pers.id
                                                                    }
                                                                >
                                                                    {pers.name}
                                                                    ,&nbsp;
                                                                </span>
                                                            )
                                                        )}
                                                    </td>
                                                    <td>
                                                        <CheckPermission IsPageAccess="role.edit">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-xs btn-icon"
                                                                onClick={() =>editRoleTe(list.id)}
                                                            >
                                                                <FeatherIcon icon="edit-2" fill="white" />
                                                            </button>
                                                        </CheckPermission>
                                                        &nbsp;
                                                        <CheckPermission IsPageAccess="role.destroy">
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-xs btn-icon"
                                                                onClick={() =>deleteRole(list.id)}
                                                            >
                                                                <FeatherIcon icon="trash-2" fill="red" />
                                                            </button>
                                                        </CheckPermission>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    </CheckPermission>
                </div>
                <div className="col-sm-4 col-lg-4">
                    {formShowType === 'create' && (    
                            <CheckPermission IsPageAccess="role.create">
                                <Create getRoles={()=>getRoles()} />
                            </CheckPermission>
                        )}
                            <div className={`card ${formShowType === "edit" ? "show" : "hide"}`} >
                                <div className="card-header">
                                    <h5>{Trans("DEPT_U", language)}</h5>
                                    <button type="button" className="btn btn-danger btn-xs btn-icon" onClick={()=>{
                                        setformShowType("create");
                                    }}>X</button>
                                </div>
                                <div className="card-body">
                                    {msgType.length > 2 &&
                                        (msgType === "success" ? (
                                            <Alert type="success">
                                                {errorMsg}
                                            </Alert>
                                        ) : (
                                            <Alert type="danger">
                                                {errorMsg}
                                            </Alert>
                                    ))}

                                    <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
                                        <input
                                            {...register("updatedId")}
                                            type="hidden"
                                        />
                                        <FormGroup mb="20px">
                                            <Label display="block" mb="5px" htmlFor="name">
                                                {Trans("NAME", language)}
                                            </Label>
                                            <input
                                                id="name"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your name"
                                                {...register("role_name", {
                                                    required: "Role Name is required",
                                                })}
                                            />
                                            {errors.role_name && <span>This field is required</span>}
                                        </FormGroup>
                                        <FormGroup mb="20px">
                                            <Label
                                                display="block"
                                                mb="5px"
                                                htmlFor="permissionList"
                                            >
                                                {Trans("PERMISSION", language)}
                                            </Label>
                                            <PermissionCheckbox Compname="editpermissionList" />
                                        </FormGroup>
                                        <LoaderButton
                                            formLoadStatus={formloadingStatus}
                                            btnName={Trans("UPDATE", language)}
                                            className="btn btn-primary btn-block"
                                        />
                                    </form>
                                </div>
                            </div>
                        
                    
                </div>                
            </div>
        </Content>
        </>
    )
}

export default Index
