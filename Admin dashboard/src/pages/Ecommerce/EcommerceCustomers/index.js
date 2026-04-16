// import React, { useEffect, useState, useMemo } from "react"
// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Table,
// } from "reactstrap"
// import moment from "moment"

// // Import Components
// import Breadcrumbs from "components/Common/Breadcrumb"
// import TableContainer from "../../../components/Common/TableContainer"

// // Import Column Formatters
// import {
//   CustId,
//   UserName,
//   ChildName,
//   MobileCol,
//   EmailCol,
//   JoiningDate,
//   LevelBadge,
// } from "./EcommerceCustCol"

// const EcommerceCustomers = () => {
//   document.title = "Registration |Konzeptes "

//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Modal State
//   const [modal, setModal] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)

//   const toggleModal = () => setModal(!modal)

//   const handleViewClick = userData => {
//     setSelectedUser(userData)
//     toggleModal()
//   }

//   useEffect(() => {
//     fetch("http://192.168.0.127:8080/ords/lms/v1/users/all")
//       // fetch("http://192.168.0.117:8080/ords/dev/v1/users/all")
//       .then(res => res.json())
//       .then(data => {
//         setUsers(data.items || [])
//         setLoading(false)
//       })
//       .catch(err => {
//         console.error("API Error:", err)
//         setLoading(false)
//       })
//   }, [])

//   const columns = useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "user_id",
//         Cell: cellProps => <CustId {...cellProps} />,
//       },
//       {
//         Header: "Parent Name",
//         accessor: "parent_name",
//         filterable: true,
//         Cell: cellProps => <UserName {...cellProps} />,
//       },
//       {
//         Header: "Child Name",
//         accessor: "child_name",
//         filterable: true,
//         Cell: cellProps => <ChildName {...cellProps} />,
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         filterable: true,
//         Cell: cellProps => <MobileCol {...cellProps} />,
//       },
//       {
//         Header: "Email",
//         accessor: "email",
//         filterable: true,
//         Cell: cellProps => <EmailCol {...cellProps} />,
//       },
//       {
//         Header: "Date Joined",
//         accessor: "created_at",
//         Cell: cellProps => <JoiningDate {...cellProps} />,
//       },
//       {
//         Header: "Level",
//         accessor: "user_level",
//         Cell: cellProps => <LevelBadge {...cellProps} />,
//       },
//       {
//         Header: "Action",
//         accessor: "view",
//         disableFilters: true,
//         Cell: cellProps => (
//           <div
//             onClick={() => handleViewClick(cellProps.row.original)}
//             style={{
//               cursor: "pointer",
//               width: "32px",
//               height: "32px",
//               border: "1px solid #e9ebec",
//               borderRadius: "8px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "#fff",
//             }}
//           >
//             <i
//               className="mdi mdi-eye-outline"
//               style={{ color: "#2f9237ff", fontSize: "16px" }}
//             />
//           </div>
//         ),
//       },
//     ],
//     []
//   )

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title="Registration"
//             breadcrumbItem="Registration List"
//           />
//           <Row>
//             <Col xs="12">
//               <Card>
//                 <CardBody>
//                   <div className="d-flex align-items-center justify-content-between mb-4">
//                     <h4 className="card-title mb-0">Registration List</h4>
//                   </div>

//                   {loading ? (
//                     <div className="text-center py-4">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       >
//                         <span className="sr-only">Loading...</span>
//                       </div>
//                     </div>
//                   ) : (
//                     <TableContainer
//                       columns={columns}
//                       data={users}
//                       isGlobalFilter={true}
//                       customPageSize={10}
//                       tableClass="align-middle table-nowrap mb-0"
//                       theadClass="table-light"
//                     />
//                   )}
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* Details Modal Popup */}
//       <Modal isOpen={modal} toggle={toggleModal} centered>
//         <ModalHeader toggle={toggleModal}>Registration Details</ModalHeader>
//         <ModalBody>
//           {selectedUser && (
//             <Table responsive borderless className="mb-0">
//               <tbody>
//                 <tr>
//                   <th scope="row" style={{ width: "40%" }}>
//                     Parent Name:
//                   </th>
//                   <td className="text-capitalize">
//                     {selectedUser.salutation}. {selectedUser.parent_name}
//                   </td>
//                 </tr>
//                 <tr>
//                   <th scope="row">Child Name:</th>
//                   <td className="text-capitalize">{selectedUser.child_name}</td>
//                 </tr>
//                 <tr>
//                   <th scope="row">Mobile:</th>
//                   <td>{selectedUser.mobile}</td>
//                 </tr>
//                 <tr>
//                   <th scope="row">Email:</th>
//                   <td>{selectedUser.email}</td>
//                 </tr>
//                 <tr>
//                   <th scope="row">Level:</th>
//                   <td>
//                     <LevelBadge value={selectedUser.user_level} />
//                   </td>
//                 </tr>
//                 <tr>
//                   <th scope="row">Date Joined:</th>
//                   <td>
//                     {moment(selectedUser.created_at).format("DD MMM YYYY")}
//                   </td>
//                 </tr>
//               </tbody>
//             </Table>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={toggleModal}>
//             Close
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </React.Fragment>
//   )
// }

// export default EcommerceCustomers

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";
import moment from "moment";

// Import Components
import Breadcrumbs from "components/Common/Breadcrumb";
import TableContainer from "../../../components/Common/TableContainer";

// Import Column Formatters
import {
  CustId,
  UserName,
  ChildName,
  MobileCol,
  EmailCol,
  JoiningDate,
  LevelBadge,
} from "./EcommerceCustCol";

// ✅ IMPORT YOUR DYNAMIC API HELPERS
import { get } from "../../../helpers/api_helper";
import { GET_ALL_USERS } from "../../../helpers/url_helper";

const EcommerceCustomers = () => {
  document.title = "Registration |Konzeptes ";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleModal = () => setModal(!modal);

  const handleViewClick = userData => {
    setSelectedUser(userData);
    toggleModal();
  };

  useEffect(() => {
    // ✅ DYNAMIC GET FOR ALL USERS
    get(GET_ALL_USERS)
      .then(data => {
        setUsers(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "user_id",
        Cell: cellProps => <CustId {...cellProps} />,
      },
      {
        Header: "Parent Name",
        accessor: "parent_name",
        filterable: true,
        Cell: cellProps => <UserName {...cellProps} />,
      },
      {
        Header: "Child Name",
        accessor: "child_name",
        filterable: true,
        Cell: cellProps => <ChildName {...cellProps} />,
      },
      {
        Header: "Mobile",
        accessor: "mobile",
        filterable: true,
        Cell: cellProps => <MobileCol {...cellProps} />,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
        Cell: cellProps => <EmailCol {...cellProps} />,
      },
      {
        Header: "Date Joined",
        accessor: "created_at",
        Cell: cellProps => <JoiningDate {...cellProps} />,
      },
      {
        Header: "Level",
        accessor: "user_level",
        Cell: cellProps => <LevelBadge {...cellProps} />,
      },
      {
        Header: "Action",
        accessor: "view",
        disableFilters: true,
        Cell: cellProps => (
          <div
            onClick={() => handleViewClick(cellProps.row.original)}
            style={{
              cursor: "pointer",
              width: "32px",
              height: "32px",
              border: "1px solid #e9ebec",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <i
              className="mdi mdi-eye-outline"
              style={{ color: "#2f9237ff", fontSize: "16px" }}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Registration"
            breadcrumbItem="Registration List"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="card-title mb-0">Registration List</h4>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={users}
                      isGlobalFilter={true}
                      customPageSize={10}
                      tableClass="align-middle table-nowrap mb-0"
                      theadClass="table-light"
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Details Modal Popup */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Registration Details</ModalHeader>
        <ModalBody>
          {selectedUser && (
            <Table responsive borderless className="mb-0">
              <tbody>
                <tr>
                  <th scope="row" style={{ width: "40%" }}>
                    Parent Name:
                  </th>
                  <td className="text-capitalize">
                    {selectedUser.salutation}. {selectedUser.parent_name}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Child Name:</th>
                  <td className="text-capitalize">{selectedUser.child_name}</td>
                </tr>
                <tr>
                  <th scope="row">Mobile:</th>
                  <td>{selectedUser.mobile}</td>
                </tr>
                <tr>
                  <th scope="row">Email:</th>
                  <td>{selectedUser.email}</td>
                </tr>
                <tr>
                  <th scope="row">Level:</th>
                  <td>
                    <LevelBadge value={selectedUser.user_level} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Date Joined:</th>
                  <td>
                    {moment(selectedUser.created_at).format("DD MMM YYYY")}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default EcommerceCustomers;
