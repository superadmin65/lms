import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import TableContainer from "../../components/Common/TableContainer";
import {
  UserId,
  ParentName,
  ChildName,
  DateCol,
  UserLevel,
  MobileCol,
  EmailCol,
} from "./LatestTranactionCol";

// ✅ IMPORT YOUR HELPERS HERE
import { get } from "../../helpers/api_helper";
import { GET_LATEST_USERS } from "../../helpers/url_helper";

const LatestTranaction = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleModal = () => setModal(!modal);

  const handleViewClick = (userData) => {
    setSelectedUser(userData);
    toggleModal();
  };

  useEffect(() => {
    // ✅ USE YOUR GET HELPER INSTEAD OF FETCH
    get(GET_LATEST_USERS)
      .then((data) => {
        // Axios automatically parses the JSON, so we skip the res.json() step!
        setUsers(data.items || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching latest users:", error);
        setLoading(false);
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "user_id",
        Cell: (cellProps) => <UserId {...cellProps} />,
      },
      {
        Header: "Parent Name",
        accessor: "parent_name",
        Cell: (cellProps) => (
          <ParentName
            value={cellProps.row.original.parent_name}
            salutation={cellProps.row.original.salutation}
          />
        ),
      },
      {
        Header: "Child Name",
        accessor: "child_name",
        Cell: (cellProps) => <ChildName {...cellProps} />,
      },
      {
        Header: "Mobile",
        accessor: "mobile",
        Cell: (cellProps) => <MobileCol {...cellProps} />,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: (cellProps) => <EmailCol {...cellProps} />,
      },
      {
        Header: "Date Joined",
        accessor: "created_at",
        Cell: (cellProps) => <DateCol {...cellProps} />,
      },
      {
        Header: "Level",
        accessor: "user_level",
        Cell: (cellProps) => <UserLevel {...cellProps} />,
      },
      {
        Header: "Action",
        accessor: "view",
        disableFilters: true,
        Cell: (cellProps) => (
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
              style={{ color: "#24aa3dff", fontSize: "16px" }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="card-title mb-0">Top 10 Registration</h4>
            <Link to="/ecommerce-customers">
              <Button
                color="primary"
                size="sm"
                className="btn-rounded waves-effect waves-light"
              >
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <TableContainer
              columns={columns}
              data={users}
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={6}
              className="custom-header-wrapper"
              tableClass="align-middle table-nowrap mb-0"
              theadClass="table-light"
            />
          )}
        </CardBody>
      </Card>

      {/* Detail Popup Modal */}
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>
          User Registration Details
        </ModalHeader>
        <ModalBody>
          {selectedUser && (
            <Table responsive borderless className="mb-0">
              <tbody>
                <tr>
                  <th scope="row" style={{ width: "40%" }}>
                    Parent Name:
                  </th>
                  <td>
                    {selectedUser.salutation}. {selectedUser.parent_name}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Child Name:</th>
                  <td>{selectedUser.child_name}</td>
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
                    <UserLevel value={selectedUser.user_level} />
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

export default LatestTranaction;

// import React, { useEffect, useState, useMemo } from "react"
// import { Link } from "react-router-dom"
// import {
//   Card,
//   CardBody,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Table,
// } from "reactstrap"
// import TableContainer from "../../components/Common/TableContainer"
// import {
//   UserId,
//   ParentName,
//   ChildName,
//   DateCol,
//   UserLevel,
//   MobileCol,
//   EmailCol,
// } from "./LatestTranactionCol"

// const LatestTranaction = () => {
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
//     fetch("http://192.168.0.127:8080/ords/lms/v1/users/latest")
//     // fetch("http://192.168.0.117:8080/ords/dev/v1/users/latest")
//       .then(res => res.json())
//       .then(data => {
//         setUsers(data.items || [])
//         setLoading(false)
//       })
//   }, [])

//   const columns = useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "user_id",
//         Cell: cellProps => <UserId {...cellProps} />,
//       },
//       {
//         Header: "Parent Name",
//         accessor: "parent_name",
//         Cell: cellProps => (
//           <ParentName
//             value={cellProps.row.original.parent_name}
//             salutation={cellProps.row.original.salutation}
//           />
//         ),
//       },
//       {
//         Header: "Child Name",
//         accessor: "child_name",
//         Cell: cellProps => <ChildName {...cellProps} />,
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         Cell: cellProps => <MobileCol {...cellProps} />,
//       },
//       {
//         Header: "Email",
//         accessor: "email",
//         Cell: cellProps => <EmailCol {...cellProps} />,
//       },
//       {
//         Header: "Date Joined",
//         accessor: "created_at",
//         Cell: cellProps => <DateCol {...cellProps} />,
//       },
//       {
//         Header: "Level",
//         accessor: "user_level",
//         Cell: cellProps => <UserLevel {...cellProps} />,
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
//               style={{ color: "#24aa3dff", fontSize: "16px" }}
//             />
//           </div>
//         ),
//       },
//     ],
//     []
//   )

//   return (
//     <React.Fragment>
//       <Card>
//         <CardBody>
//           <div className="d-flex align-items-center justify-content-between mb-4">
//             <h4 className="card-title mb-0">Top 10 Registration</h4>
//             <Link to="/ecommerce-customers">
//               <Button
//                 color="primary"
//                 size="sm"
//                 className="btn-rounded waves-effect waves-light"
//               >
//                 View All
//               </Button>
//             </Link>
//           </div>

//           {loading ? (
//             <div className="text-center">Loading...</div>
//           ) : (
//             <TableContainer
//               columns={columns}
//               data={users}
//               isGlobalFilter={true}
//               isAddOptions={false}
//               customPageSize={6}
//               className="custom-header-wrapper"
//               tableClass="align-middle table-nowrap mb-0"
//               theadClass="table-light"
//             />
//           )}
//         </CardBody>
//       </Card>

//       {/* Detail Popup Modal */}
//       <Modal isOpen={modal} toggle={toggleModal} centered>
//         <ModalHeader toggle={toggleModal}>
//           User Registration Details
//         </ModalHeader>
//         <ModalBody>
//           {selectedUser && (
//             <Table responsive borderless className="mb-0">
//               <tbody>
//                 {/* User ID Row Removed */}
//                 <tr>
//                   <th scope="row" style={{ width: "40%" }}>
//                     Parent Name:
//                   </th>
//                   <td>
//                     {selectedUser.salutation}. {selectedUser.parent_name}
//                   </td>
//                 </tr>
//                 <tr>
//                   <th scope="row">Child Name:</th>
//                   <td>{selectedUser.child_name}</td>
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
//                     <UserLevel value={selectedUser.user_level} />
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

// export default LatestTranaction
