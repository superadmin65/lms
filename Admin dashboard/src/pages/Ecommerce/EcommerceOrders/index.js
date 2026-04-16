import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../../components/Common/TableContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DeleteModal from "../../../components/Common/DeleteModal";
import GlobalLoader from "../../../components/Common/GlobalLoader";

import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
} from "reactstrap";

// ✅ IMPORT YOUR DYNAMIC API HELPERS
import { get, post, put, del } from "../../../helpers/api_helper";
import { STAFF_API } from "../../../helpers/url_helper";

function EcommerceOrder() {
  document.title = "Staff Management | Konzeptes";

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [order, setOrder] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (modal || deleteModal) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [modal, deleteModal]);

  const fetchStaff = (showLoader = false) => {
    if (showLoader) setLoading(true);

    // ✅ DYNAMIC GET
    get(STAFF_API)
      .then((data) => {
        // setStaffList(data.items || []);
        const sortedData = (data.items || []).sort(
          (a, b) => b.user_id - a.user_id, // 🔥 latest first
        );

        setStaffList(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStaff(true);
  }, []);

  const handleDeleteOrder = () => {
    if (order && order.user_id) {
      setDeleteModal(false);
      setLoading(true);

      // ✅ DYNAMIC DELETE
      del(`${STAFF_API}/${order.user_id}`)
        .then(() => {
          setLoading(false);
          validation.resetForm();
          Swal.fire({
            title: "Deleted!",
            text: "Staff member has been removed successfully.",
            icon: "success",
            iconColor: "#34c38f",
            confirmButtonColor: "#34c38f",
            confirmButtonText: "Okay",
          });
          fetchStaff();
        })
        .catch((err) => {
          console.error("Delete Error:", err);
          setLoading(false);
        });
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: order?.name || "",
      gender: order?.gender || "Male",
      email: order?.email || "",
      mobile_number: order?.mobile_number || "",
      role: order?.role || "Staff",
      status: order?.status || "yes",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      email: Yup.string().email("Invalid email").required("Please Enter Email"),
      mobile_number: Yup.string().required("Please Enter Mobile Number"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Please Enter Password"),
    }),
    onSubmit: (values) => {
      setLoading(true);

      // ✅ DYNAMIC POST OR PUT DEPENDING ON IF IT IS AN EDIT
      const apiCall = isEdit
        ? put(`${STAFF_API}/${order.user_id}`, values)
        : post(STAFF_API, values);

      apiCall
        .then(() => {
          setLoading(false);
          Swal.fire({
            title: isEdit ? "Updated Successfully!" : "Added Successfully!",
            icon: "success",
            iconColor: "#34c38f",
            confirmButtonText: "Okay",
            confirmButtonColor: "#34c38f",
          });
          fetchStaff();
          toggle();
        })
        .catch((err) => {
          console.error("Submit Error:", err);
          setLoading(false);
        });
    },
  });

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setOrder(null);
      setIsEdit(false);
      setIsView(false);
    }
    setShowPassword(false);
  };

  const handleAddClicks = () => {
    setOrder(null);
    setIsEdit(false);
    setIsView(false);
    validation.resetForm();
    setModal(true);
  };

  const handleEditClick = (staff) => {
    setOrder(staff);
    setIsEdit(true);
    setIsView(false);
    setModal(true);
  };

  const handleViewClick = (staff) => {
    setLoading(true);

    // ✅ DYNAMIC GET FOR SINGLE USER
    get(`${STAFF_API}/${staff.user_id}`)
      .then((data) => {
        setLoading(false);
        setOrder(data.items ? data.items[0] : data);
        setIsEdit(false);
        setIsView(true);
        setModal(true);
      })
      .catch((err) => {
        console.error("View Error:", err);
        setLoading(false);
      });
  };

  const columns = useMemo(
    () => [
      { Header: "Sr No.", accessor: "user_id" },
      { Header: "Name", accessor: "name" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Email ID", accessor: "email" },
      { Header: "Role", accessor: "role" },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cellProps) => (
          <div className="d-flex justify-content-center align-items-center">
            <div className="form-check form-switch mb-0">
              <input
                type="checkbox"
                className="form-check-input"
                style={{
                  cursor: "pointer",
                  transform: "scale(1.4)",
                  backgroundColor:
                    cellProps.row.original.status === "yes" ? "primary" : "",
                }}
                checked={cellProps.row.original.status === "yes"}
                onChange={() => {
                  const updated = {
                    ...cellProps.row.original,
                    status:
                      cellProps.row.original.status === "yes" ? "no" : "yes",
                  };
                  setLoading(true);

                  put(`${STAFF_API}/${updated.user_id}`, updated)
                    .then(() => {
                      setLoading(false);
                      fetchStaff();
                    })
                    .catch((err) => {
                      console.error("Status Update Error:", err);
                      setLoading(false);
                    });
                }}
              />
            </div>
          </div>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (cellProps) => (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Link
              to="#"
              className="text-primary border p-1 rounded"
              onClick={() => handleViewClick(cellProps.row.original)}
            >
              <i className="mdi mdi-eye font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-success border p-1 rounded"
              onClick={() => handleEditClick(cellProps.row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-danger border p-1 rounded"
              onClick={() => {
                setOrder(cellProps.row.original);
                setDeleteModal(true);
              }}
            >
              <i className="mdi mdi-delete font-size-18" />
            </Link>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <GlobalLoader loading={loading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff" breadcrumbItem="Staff List" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={staffList}
                    isGlobalFilter
                    isAddOptions
                    handleOrderClicks={handleAddClicks}
                    customPageSize={10}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal
            isOpen={modal}
            toggle={toggle}
            size="lg"
            centered={false}
            backdrop="static"
            className="mt-5"
          >
            <ModalHeader toggle={toggle}>
              {isView ? "View Details" : isEdit ? "Edit Details" : "Add Staff"}
            </ModalHeader>

            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label>Name</Label>
                      <Input
                        readOnly={isView}
                        {...validation.getFieldProps("name")}
                        invalid={
                          !!(validation.touched.name && validation.errors.name)
                        }
                      />
                      {validation.touched.name && validation.errors.name && (
                        <FormFeedback>{validation.errors.name}</FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label>Email ID</Label>
                      <Input
                        readOnly={isView}
                        {...validation.getFieldProps("email")}
                        invalid={
                          !!(
                            validation.touched.email && validation.errors.email
                          )
                        }
                      />
                      {validation.touched.email && validation.errors.email && (
                        <FormFeedback>{validation.errors.email}</FormFeedback>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label>Mobile Number</Label>
                      <Input
                        readOnly={isView}
                        {...validation.getFieldProps("mobile_number")}
                        invalid={
                          !!(
                            validation.touched.mobile_number &&
                            validation.errors.mobile_number
                          )
                        }
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label>Gender</Label>
                      <Input
                        type="select"
                        disabled={isView}
                        {...validation.getFieldProps("gender")}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Input>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label>Role</Label>
                      <Input
                        type="select"
                        disabled={isView}
                        {...validation.getFieldProps("role")}
                      >
                        <option value="Staff">Staff</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </Input>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3 position-relative w-100">
                      <Label>Password</Label>

                      {/* <Input
                        type={showPassword ? "text" : "password"}
                        {...validation.getFieldProps("password")}
                        className="w-100"
                        style={{ paddingRight: "40px" }} // 👈 ONLY this much
                        invalid={
                          !!(
                            validation.touched.password &&
                            validation.errors.password
                          )
                        }
                      /> */}
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password" // 🔥 IMPORTANT FIX
                        value={validation.values.password || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        style={{ paddingRight: "40px" }}
                      />
                      {/* Eye Icon */}
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          // transform: "translateY(-0%)",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      >
                        <i
                          className={
                            showPassword
                              ? "mdi mdi-eye-off-outline"
                              : "mdi mdi-eye-outline"
                          }
                        />
                      </span>

                      {validation.touched.password &&
                        validation.errors.password && (
                          <FormFeedback>
                            {validation.errors.password}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                </Row>

                {!isView && (
                  <div className="text-end mt-3">
                    <Button color="success" type="submit">
                      {isEdit ? "Update " : "Submit"}
                    </Button>
                  </div>
                )}
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default EcommerceOrder;

// import React, { useEffect, useMemo, useState } from "react"
// import { Link } from "react-router-dom"
// import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
// import TableContainer from "../../../components/Common/TableContainer"
// import * as Yup from "yup"
// import { useFormik } from "formik"
// import Swal from "sweetalert2"
// import Breadcrumbs from "../../../components/Common/Breadcrumb"
// import DeleteModal from "../../../components/Common/DeleteModal"
// import GlobalLoader from "../../../components/Common/GlobalLoader"

// import {
//   Button,
//   Col,
//   Row,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Form,
//   Input,
//   FormFeedback,
//   Label,
//   Card,
//   CardBody,
// } from "reactstrap"

// const BASE_URL = "http://192.168.0.127:8080/ords/lms/staff-api/staff"
// // const BASE_URL = "http://192.168.0.117:8080/ords/dev/staff-api/staff"

// function EcommerceOrder() {
//   document.title = "Staff Management | Konzeptes"

//   const [modal, setModal] = useState(false)
//   const [isEdit, setIsEdit] = useState(false)
//   const [isView, setIsView] = useState(false)
//   const [order, setOrder] = useState(null)
//   const [staffList, setStaffList] = useState([])
//   const [deleteModal, setDeleteModal] = useState(false)
//   const [loading, setLoading] = useState(false) // New loading state

//   useEffect(() => {
//     if (modal || deleteModal) {
//       document.body.style.overflow = "hidden"
//       document.body.style.paddingRight = "0px"
//     } else {
//       document.body.style.overflow = "auto"
//       document.body.style.paddingRight = "0px"
//     }
//     return () => {
//       document.body.style.overflow = "auto"
//       document.body.style.paddingRight = "0px"
//     }
//   }, [modal, deleteModal])

//   const fetchStaff = (showLoader = false) => {
//     if (showLoader) setLoading(true)
//     fetch(BASE_URL)
//       .then(res => res.json())
//       .then(data => {
//         setStaffList(data.items || [])
//         setLoading(false)
//       })
//       .catch(err => {
//         console.error("Fetch Error:", err)
//         setLoading(false)
//       })
//   }

//   useEffect(() => {
//     fetchStaff(true)
//   }, [])

//   const handleDeleteOrder = () => {
//     if (order && order.user_id) {
//       setDeleteModal(false)
//       setLoading(true)

//       fetch(`${BASE_URL}/${order.user_id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({}),
//       }).then(res => {
//         setLoading(false)
//         if (res.ok) {
//           Swal.fire({
//             title: "Deleted!",
//             text: "Staff member has been removed successfully.",
//             icon: "success",
//             iconColor: "#34c38f",
//             confirmButtonColor: "#34c38f",
//             confirmButtonText: "Okay",
//           })
//           fetchStaff()
//         }
//       })
//     }
//   }

//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       name: order?.name || "",
//       gender: order?.gender || "Male",
//       email: order?.email || "",
//       mobile_number: order?.mobile_number || "",
//       role: order?.role || "Staff",
//       status: order?.status || "yes",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required("Please Enter Name"),
//       email: Yup.string().email("Invalid email").required("Please Enter Email"),
//       mobile_number: Yup.string().required("Please Enter Mobile Number"),
//     }),
//     onSubmit: values => {
//       setLoading(true)
//       const method = isEdit ? "PUT" : "POST"
//       const url = isEdit ? `${BASE_URL}/${order.user_id}` : BASE_URL

//       fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       }).then(res => {
//         setLoading(false)
//         if (res.ok) {
//           Swal.fire({
//             title: isEdit ? "Updated Successfully!" : "Added Successfully!",
//             icon: "success",
//             iconColor: "#34c38f",
//             confirmButtonText: "Okay",
//             confirmButtonColor: "#34c38f",
//           })
//           fetchStaff()
//           toggle()
//         }
//       })
//     },
//   })

//   const toggle = () => {
//     setModal(!modal)
//     if (modal) {
//       setOrder(null)
//       setIsEdit(false)
//       setIsView(false)
//     }
//   }

//   const handleAddClicks = () => {
//     setOrder(null)
//     setIsEdit(false)
//     setIsView(false)
//     setModal(true)
//   }

//   const handleEditClick = staff => {
//     setOrder(staff)
//     setIsEdit(true)
//     setIsView(false)
//     setModal(true)
//   }

//   const handleViewClick = staff => {
//     setLoading(true)
//     fetch(`${BASE_URL}/${staff.user_id}`)
//       .then(res => res.json())
//       .then(data => {
//         setLoading(false)
//         setOrder(data.items ? data.items[0] : data)
//         setIsEdit(false)
//         setIsView(true)
//         setModal(true)
//       })
//   }

//   const columns = useMemo(
//     () => [
//       { Header: "Sr No.", accessor: "user_id" },
//       { Header: "Name", accessor: "name" },
//       { Header: "Gender", accessor: "gender" },
//       { Header: "Email ID", accessor: "email" },
//       { Header: "Role", accessor: "role" },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: cellProps => (
//           <div className="d-flex justify-content-center align-items-center">
//             <div className="form-check form-switch mb-0">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 style={{
//                   cursor: "pointer",
//                   transform: "scale(1.4)",
//                   backgroundColor:
//                     cellProps.row.original.status === "yes" ? "primary" : "",
//                 }}
//                 checked={cellProps.row.original.status === "yes"}
//                 onChange={() => {
//                   const updated = {
//                     ...cellProps.row.original,
//                     status:
//                       cellProps.row.original.status === "yes" ? "no" : "yes",
//                   }
//                   setLoading(true)
//                   fetch(`${BASE_URL}/${updated.user_id}`, {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(updated),
//                   }).then(() => {
//                     setLoading(false)
//                     fetchStaff()
//                   })
//                 }}
//               />
//             </div>
//           </div>
//         ),
//       },
//       {
//         Header: "Action",
//         accessor: "action",
//         Cell: cellProps => (
//           <div className="d-flex justify-content-center align-items-center gap-2">
//             <Link
//               to="#"
//               className="text-primary border p-1 rounded"
//               onClick={() => handleViewClick(cellProps.row.original)}
//             >
//               <i className="mdi mdi-eye font-size-18" />
//             </Link>
//             <Link
//               to="#"
//               className="text-success border p-1 rounded"
//               onClick={() => handleEditClick(cellProps.row.original)}
//             >
//               <i className="mdi mdi-pencil font-size-18" />
//             </Link>
//             <Link
//               to="#"
//               className="text-danger border p-1 rounded"
//               onClick={() => {
//                 setOrder(cellProps.row.original)
//                 setDeleteModal(true)
//               }}
//             >
//               <i className="mdi mdi-delete font-size-18" />
//             </Link>
//           </div>
//         ),
//       },
//     ],
//     []
//   )

//   return (
//     <>
//       <GlobalLoader loading={loading} />
//       <DeleteModal
//         show={deleteModal}
//         onDeleteClick={handleDeleteOrder}
//         onCloseClick={() => setDeleteModal(false)}
//       />
//       <div className="page-content">
//         <div className="container-fluid">
//           <Breadcrumbs title="Staff" breadcrumbItem="Staff List" />
//           <Row>
//             <Col xs="12">
//               <Card>
//                 <CardBody>
//                   <TableContainer
//                     columns={columns}
//                     data={staffList}
//                     isGlobalFilter
//                     isAddOptions
//                     handleOrderClicks={handleAddClicks}
//                     customPageSize={10}
//                   />
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>

//           <Modal
//             isOpen={modal}
//             toggle={toggle}
//             size="lg"
//             centered={false}
//             backdrop="static"
//             className="mt-5"
//           >
//             <ModalHeader toggle={toggle}>
//               {isView ? "View Details" : isEdit ? "Edit Details" : "Add Staff"}
//             </ModalHeader>

//             <ModalBody>
//               <Form
//                 onSubmit={e => {
//                   e.preventDefault()
//                   validation.handleSubmit()
//                 }}
//               >
//                 <Row>
//                   <Col md={6}>
//                     <div className="mb-3">
//                       <Label>Name</Label>
//                       <Input
//                         readOnly={isView}
//                         {...validation.getFieldProps("name")}
//                         invalid={
//                           !!(validation.touched.name && validation.errors.name)
//                         }
//                       />
//                       {validation.touched.name && validation.errors.name && (
//                         <FormFeedback>{validation.errors.name}</FormFeedback>
//                       )}
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <div className="mb-3">
//                       <Label>Email ID</Label>
//                       <Input
//                         readOnly={isView}
//                         {...validation.getFieldProps("email")}
//                         invalid={
//                           !!(
//                             validation.touched.email && validation.errors.email
//                           )
//                         }
//                       />
//                       {validation.touched.email && validation.errors.email && (
//                         <FormFeedback>{validation.errors.email}</FormFeedback>
//                       )}
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md={6}>
//                     <div className="mb-3">
//                       <Label>Mobile Number</Label>
//                       <Input
//                         readOnly={isView}
//                         {...validation.getFieldProps("mobile_number")}
//                         invalid={
//                           !!(
//                             validation.touched.mobile_number &&
//                             validation.errors.mobile_number
//                           )
//                         }
//                       />
//                     </div>
//                   </Col>
//                   <Col md={6}>
//                     <div className="mb-3">
//                       <Label>Gender</Label>
//                       <Input
//                         type="select"
//                         disabled={isView}
//                         {...validation.getFieldProps("gender")}
//                       >
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                       </Input>
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md={6}>
//                     <div className="mb-3">
//                       <Label>Role</Label>
//                       <Input
//                         type="select"
//                         disabled={isView}
//                         {...validation.getFieldProps("role")}
//                       >
//                         <option value="Staff">Staff</option>
//                         <option value="Manager">Manager</option>
//                         <option value="Admin">Admin</option>
//                       </Input>
//                     </div>
//                   </Col>
//                 </Row>
//                 {!isView && (
//                   <div className="text-end mt-3">
//                     <Button color="success" type="submit">
//                       {isEdit ? "Update " : "Submit"}
//                     </Button>
//                   </div>
//                 )}
//               </Form>
//             </ModalBody>
//           </Modal>
//         </div>
//       </div>
//     </>
//   )
// }

// export default EcommerceOrder
