// import React, { useEffect, useState } from "react"
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   CardTitle,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Spinner,
//   Badge,
// } from "reactstrap"
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
// import { Link } from "react-router-dom"
// import Breadcrumbs from "../../components/Common/Breadcrumb"

// const ResponsiveTables = () => {
//   document.title = "Performance | Konzeptes"

//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modal, setModal] = useState(false)
//   const [analyticsData, setAnalyticsData] = useState([]) // Initialized as array
//   const [modalLoading, setModalLoading] = useState(false)

//   // Fetch main table data
//   useEffect(() => {
//     fetch("http://192.168.0.127:8080/ords/lms/user/performance")
//       // fetch("http://192.168.0.117:8080/ords/dev/user/performance")
//       .then(res => res.json())
//       .then(data => {
//         setRows(data.items || [])
//         setLoading(false)
//       })
//       .catch(err => {
//         console.error("API Error:", err)
//         setLoading(false)
//       })
//   }, [])

//   const toggle = () => {
//     setModal(!modal)
//     if (modal) setAnalyticsData([])
//   }

//   const handleReviewClick = async user => {
//     setModal(true)
//     setModalLoading(true)
//     try {
//       const response = await fetch(
//         // `http://192.168.0.127:8080/ords/lms/user/analytics/${user.user_seq_id}`
//         `http://192.168.0.117:8080/ords/dev/user/analytics/${user.user_seq_id}`
//       )
//       const data = await response.json()
//       // Now storing the entire array of exercises returned by the new SQL UNION
//       setAnalyticsData(data.items || [])
//     } catch (error) {
//       console.error("Analytics API Error:", error)
//     } finally {
//       setModalLoading(false)
//     }
//   }

//   // Dynamic Stat Card Helper
//   const RenderStatCard = item => (
//     <Col md={12} className="mb-3" key={item.category_name}>
//       <Card className="border shadow-none bg-light">
//         <CardBody className="p-3">
//           <CardTitle tag="h6" className="text-dark mb-3 fw-bold text-uppercase">
//             {item.category_name}
//           </CardTitle>
//           <Row className="text-center g-2">
//             <Col xs={3}>
//               <p className="text-muted mb-1 font-size-12 fw-medium">
//                 Attempted
//               </p>
//               <div className="bg-white border rounded py-2 shadow-sm">
//                 <h5 className="font-size-14 mb-0 fw-bold">
//                   {item.attempted || 0}
//                 </h5>
//               </div>
//             </Col>
//             <Col xs={3}>
//               <p className="text-muted mb-1 font-size-12 fw-medium">Total</p>
//               <div className="bg-white border rounded py-2 shadow-sm">
//                 <h5 className="font-size-14 mb-0 fw-bold">{item.total || 0}</h5>
//               </div>
//             </Col>
//             <Col xs={3}>
//               <p className="text-muted mb-1 font-size-12 fw-medium">Score</p>
//               <div className="bg-white border rounded py-2 shadow-sm">
//                 <h5 className="font-size-14 mb-0 fw-bold text-dark">
//                   {item.score || 0}
//                 </h5>
//               </div>
//             </Col>
//             <Col xs={3}>
//               <p className="text-muted mb-1 font-size-12 fw-medium">Progress</p>
//               <div className="bg-white border rounded py-2 shadow-sm d-flex align-items-center justify-content-center">
//                 <Badge
//                   color={item.theme_color || "primary"}
//                   className="font-size-12"
//                 >
//                   {item.percentage || 0}%
//                 </Badge>
//               </div>
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>
//     </Col>
//   )

//   return (
//     <div className="page-content">
//       <div className="container-fluid">
//         <Breadcrumbs title="Tables" breadcrumbItem="Performance" />

//         <Row>
//           <Col>
//             <Card>
//               <CardBody>
//                 <CardTitle className="mb-4">User Exam Performance</CardTitle>
//                 {loading ? (
//                   <div className="text-center">
//                     <Spinner color="primary" />
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <Table className="table table-striped table-bordered align-middle">
//                       <Thead className="table-light">
//                         <Tr>
//                           <Th>User ID</Th>
//                           <Th>User Name</Th>
//                           <Th>Email</Th>
//                           <Th>Attempted </Th>
//                           <Th>Total </Th>
//                           <Th className="text-center">Action</Th>
//                         </Tr>
//                       </Thead>
//                       <Tbody>
//                         {rows.length === 0 ? (
//                           <Tr>
//                             <Td colSpan="6" className="text-center">
//                               No Data Found
//                             </Td>
//                           </Tr>
//                         ) : (
//                           rows.map(row => (
//                             <Tr key={row.user_seq_id}>
//                               <Td className="fw-bold text-muted">
//                                 {row.user_seq_id}
//                               </Td>
//                               <Td>{row.user_name}</Td>
//                               <Td>{row.email}</Td>
//                               <Td>{row.attempted_exercise}</Td>
//                               <Td>{row.total_exercise}</Td>
//                               <Td className="text-center">
//                                 <Link
//                                   to="#"
//                                   className="text-primary border p-1 rounded d-inline-block"
//                                   style={{
//                                     borderColor: "#ced4da",
//                                     lineHeight: "1",
//                                   }}
//                                   onClick={() => handleReviewClick(row)}
//                                 >
//                                   <i className="mdi mdi-eye font-size-18" />
//                                 </Link>
//                               </Td>
//                             </Tr>
//                           ))
//                         )}
//                       </Tbody>
//                     </Table>
//                   </div>
//                 )}
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>

//         {/* DYNAMIC ANALYTICS MODAL */}
//         <Modal
//           isOpen={modal}
//           toggle={toggle}
//           centered={false}
//           size="lg"
//           className="mt-5"
//         >
//           <ModalHeader toggle={toggle}>Performance Analytics</ModalHeader>
//           <ModalBody>
//             {modalLoading ? (
//               <div className="text-center p-5">
//                 <Spinner color="primary" />
//               </div>
//             ) : analyticsData.length > 0 ? (
//               <Row>
//                 {/* This is the magic part:
//                   It loops through whatever categories the API sends.
//                 */}
//                 {analyticsData.map(item => RenderStatCard(item))}
//               </Row>
//             ) : (
//               <div className="text-center p-4">
//                 No analytics found for this user.
//               </div>
//             )}
//           </ModalBody>
//         </Modal>
//       </div>
//     </div>
//   )
// }

// export default ResponsiveTables

import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Badge,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

// ✅ IMPORT YOUR DYNAMIC API HELPERS
import { get } from "../../helpers/api_helper";
import {
  GET_USER_PERFORMANCE,
  GET_USER_ANALYTICS,
} from "../../helpers/url_helper";

const ResponsiveTables = () => {
  document.title = "Performance | Konzeptes";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch main table data
  useEffect(() => {
    // ✅ DYNAMIC GET FOR PERFORMANCE TABLE
    get(GET_USER_PERFORMANCE)
      .then(data => {
        setRows(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const toggle = () => {
    setModal(!modal);
    if (modal) setAnalyticsData([]);
  };

  const handleReviewClick = async user => {
    setModal(true);
    setModalLoading(true);
    try {
      // ✅ DYNAMIC GET FOR MODAL ANALYTICS (Appending the user ID to the path)
      const data = await get(`${GET_USER_ANALYTICS}/${user.user_seq_id}`);

      setAnalyticsData(data.items || []);
    } catch (error) {
      console.error("Analytics API Error:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Dynamic Stat Card Helper
  const RenderStatCard = item => (
    <Col md={12} className="mb-3" key={item.category_name}>
      <Card className="border shadow-none bg-light">
        <CardBody className="p-3">
          <CardTitle tag="h6" className="text-dark mb-3 fw-bold text-uppercase">
            {item.category_name}
          </CardTitle>
          <Row className="text-center g-2">
            <Col xs={3}>
              <p className="text-muted mb-1 font-size-12 fw-medium">
                Attempted
              </p>
              <div className="bg-white border rounded py-2 shadow-sm">
                <h5 className="font-size-14 mb-0 fw-bold">
                  {item.attempted || 0}
                </h5>
              </div>
            </Col>
            <Col xs={3}>
              <p className="text-muted mb-1 font-size-12 fw-medium">Total</p>
              <div className="bg-white border rounded py-2 shadow-sm">
                <h5 className="font-size-14 mb-0 fw-bold">{item.total || 0}</h5>
              </div>
            </Col>
            <Col xs={3}>
              <p className="text-muted mb-1 font-size-12 fw-medium">Score</p>
              <div className="bg-white border rounded py-2 shadow-sm">
                <h5 className="font-size-14 mb-0 fw-bold text-dark">
                  {item.score || 0}
                </h5>
              </div>
            </Col>
            <Col xs={3}>
              <p className="text-muted mb-1 font-size-12 fw-medium">Progress</p>
              <div className="bg-white border rounded py-2 shadow-sm d-flex align-items-center justify-content-center">
                <Badge
                  color={item.theme_color || "primary"}
                  className="font-size-12"
                >
                  {item.percentage || 0}%
                </Badge>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Tables" breadcrumbItem="Performance" />

        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle className="mb-4">User Exam Performance</CardTitle>
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="table table-striped table-bordered align-middle">
                      <Thead className="table-light">
                        <Tr>
                          <Th>User ID</Th>
                          <Th>User Name</Th>
                          <Th>Email</Th>
                          <Th>Attempted </Th>
                          <Th>Total </Th>
                          <Th className="text-center">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {rows.length === 0 ? (
                          <Tr>
                            <Td colSpan="6" className="text-center">
                              No Data Found
                            </Td>
                          </Tr>
                        ) : (
                          rows.map(row => (
                            <Tr key={row.user_seq_id}>
                              <Td className="fw-bold text-muted">
                                {row.user_seq_id}
                              </Td>
                              <Td>{row.user_name}</Td>
                              <Td>{row.email}</Td>
                              <Td>{row.attempted_exercise}</Td>
                              <Td>{row.total_exercise}</Td>
                              <Td className="text-center">
                                <Link
                                  to="#"
                                  className="text-primary border p-1 rounded d-inline-block"
                                  style={{
                                    borderColor: "#ced4da",
                                    lineHeight: "1",
                                  }}
                                  onClick={() => handleReviewClick(row)}
                                >
                                  <i className="mdi mdi-eye font-size-18" />
                                </Link>
                              </Td>
                            </Tr>
                          ))
                        )}
                      </Tbody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* DYNAMIC ANALYTICS MODAL */}
        <Modal
          isOpen={modal}
          toggle={toggle}
          centered={false}
          size="lg"
          className="mt-5"
        >
          <ModalHeader toggle={toggle}>Performance Analytics</ModalHeader>
          <ModalBody>
            {modalLoading ? (
              <div className="text-center p-5">
                <Spinner color="primary" />
              </div>
            ) : analyticsData.length > 0 ? (
              <Row>
                {/* This is the magic part:
                  It loops through whatever categories the API sends.
                */}
                {analyticsData.map(item => RenderStatCard(item))}
              </Row>
            ) : (
              <div className="text-center p-4">
                No analytics found for this user.
              </div>
            )}
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default ResponsiveTables;
