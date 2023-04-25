import React from "react";
import CheckPermission from "helper";
import FeatherIcon from "feather-icons-react";
import { BadgeShow, IconButton } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import ModalAlert from "component/ModalAlert";
import { useState } from "react";
import { PreUpdate, PreRemove, PreView } from "config/PermissionName";

function CategoryTable({
  dataList,
  pageName,
  filterItem,
  editFun,
  updateIsfeatureFunction,
  updateStatusFunction,
}) {
  const [showModalAlert, SetshowModalAlert] = useState(false);

  const closeModal = () => {
    SetshowModalAlert(false);
  };

  const [ModalObject, SetModalObject] = useState({
    status: false,
    msg: "",
    functionName: "",
    param: "",
  });

  // change Status function
  const ChangeStatus = (deleteId) => {
    SetshowModalAlert(true);
    SetModalObject({
      msg: "Are you sure want to change status !",
      functionName: updateStatusFunction,
      param: deleteId,
      closeModal: closeModal,
    });
  };

  // change IsFeature function
  const ChangeIsFeature = (deleteId) => {
    SetshowModalAlert(true);
    SetModalObject({
      msg: "Are you sure want to change Is Feature !",
      functionName: updateIsfeatureFunction,
      param: deleteId,
      closeModal: closeModal,
    });
  };

  const editFunction = (editId) => {
    editFun(editId);
  };
  // filter order by id,email etc...
  const searchItem = (value, ord) => {
    filterItem("sortby", value, ord);
  };

  return (
    <>
      <div className="table-responsive">
        {dataList.length > 0 &&
          dataList.map((subCat) => {
            const { categories_id, categories_image, category_name, status, is_featured} =
              subCat;

            return (
              <table className="table" key={categories_id}>
                <thead>
                  <tr>
                    <th>{categories_id}</th>
                    <th>
                      <img
                        src={categories_image}
                        alt={categories_image}
                        height="30"
                      />
                    </th>
                    <th>{category_name}</th>
                    <th>
                      <BadgeShow type={status} content={status} />
                    </th>
                    <th>
                    <BadgeShow
                            type={is_featured === 1 ? "active" : "deactive"}
                            content={
                              is_featured === 1 ? "ACTIVE" : "DEACTIVE"
                            }/>
                    </th>
                    <th>
                      {" "}
                      <CheckPermission
                        PageAccess={pageName}
                        PageAction={PreUpdate}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => editFunction(categories_id)}
                        >
                          <FeatherIcon
                            icon="edit-2"
                            fill="white"
                            onClick={() => editFunction(categories_id)}
                          />
                        </IconButton>{" "}
                      </CheckPermission>
                      {"  "}
                      <IconButton
                        color="primary"
                        onClick={() => ChangeStatus(categories_id)}
                      >
                        <FeatherIcon
                          icon="repeat"
                          fill="white"
                          onClick={() => ChangeStatus(categories_id)}
                        />
                      </IconButton>
                      {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeIsFeature(categories_id)}
                          >
                            <FeatherIcon
                              icon="feather"
                              fill="white"
                              onClick={() => ChangeIsFeature(categories_id)}
                            />
                          </IconButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subCat.sub_sub_category.length > 0 &&
                    subCat.sub_sub_category.map((sub_sub_category) => {
                      const {
                        categories_id,
                        categories_image,
                        category_name,
                        status,
                        is_featured,
                      } = sub_sub_category;
                      return (
                        <React.Fragment key={categories_id}>
                          <tr>
                            <td>{categories_id}</td>
                            <td>
                              <img
                                src={categories_image}
                                alt={categories_image}
                                height="30"
                              />
                            </td>
                            <td>{category_name}</td>
                            <td>
                              <BadgeShow type={status} content={status} />
                            </td>
                            <td>
                            <BadgeShow
                            type={is_featured === 1 ? "active" : "deactive"}
                            content={
                              is_featured === 1 ? "ACTIVE" : "DEACTIVE"
                            }/>
                            </td>
                            <td>
                              {" "}
                              <CheckPermission
                                PageAccess={pageName}
                                PageAction={PreUpdate}
                              >
                                <IconButton
                                  color="primary"
                                  onClick={() => editFunction(categories_id)}
                                >
                                  <FeatherIcon
                                    icon="edit-2"
                                    fill="white"
                                    onClick={() => editFunction(categories_id)}
                                  />
                                </IconButton>{" "}
                              </CheckPermission>
                              {"  "}
                              <IconButton
                                color="primary"
                                onClick={() => ChangeStatus(categories_id)}
                              >
                                <FeatherIcon
                                  icon="repeat"
                                  fill="white"
                                  onClick={() => ChangeStatus(categories_id)}
                                />
                              </IconButton>
                              {"  "}
                          <IconButton
                            color="primary"
                            onClick={() => ChangeIsFeature(categories_id)}
                          >
                            <FeatherIcon
                              icon="feather"
                              fill="white"
                              onClick={() => ChangeIsFeature(categories_id)}
                            />
                          </IconButton>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            );
          })}
      </div>
      {showModalAlert && <ModalAlert ModalObject={ModalObject} />}
    </>
  );
}

export default CategoryTable;
