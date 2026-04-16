import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";

import classNames from "classnames";
// import StackedColumnChart from "./StackedColumnChart";
// import { getChartsData as onGetChartsData } from "../../store/actions"

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

import WelcomeComp from "./WelcomeComp";
// import MonthlyEarning from "./MonthlyEarning";
// import SocialSource from "./SocialSource";
// import ActivityComp from "./ActivityComp";
// import TopCities from "./TopCities";
import LatestTranaction from "./LatestTranaction";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";

// ✅ IMPORT YOUR DYNAMIC API HELPERS
import { get } from "../../helpers/api_helper";
import { GET_REGISTRATION_COUNT } from "../../helpers/url_helper";

const Dashboard = (props) => {
  const [modal, setmodal] = useState(false);
  const [subscribemodal, setSubscribemodal] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [easyCount, setEasyCount] = useState(0);
  const [intermediateCount, setIntermediateCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  const { chartsData } = useSelector((state) => ({
    chartsData: state.Dashboard.chartsData,
  }));

  function fetchDashboardMetrics() {
    // ✅ USE DYNAMIC GET INSTEAD OF HARDCODED FETCH
    get(GET_REGISTRATION_COUNT)
      .then((data) => {
        console.log("API Data Received:", data);
        if (data.items && data.items.length > 0) {
          const item = data.items[0];

          setRegistrationCount(item.registrationcount || 0);
          setEasyCount(item.easycount || 0);
          setIntermediateCount(item.intermediatecount || 0);
          setHardCount(item.hardcount || 0);
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  }

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const reports = [
    {
      title: "Registration",
      iconClass: "bx-user-plus",
      description: registrationCount,
    },
    { title: "Easy", iconClass: "bx-star", description: easyCount },
    {
      title: "Intermediate",
      iconClass: "bx-medal",
      description: intermediateCount,
    },
    { title: "Hard", iconClass: "bx-trophy", description: hardCount },
  ];

  useEffect(() => {
    setTimeout(() => {
      setSubscribemodal(true);
    }, 2000);
  }, []);

  const [periodData, setPeriodData] = useState([]);
  const [periodType, setPeriodType] = useState("yearly");

  useEffect(() => {
    setPeriodData(chartsData);
  }, [chartsData]);

  // const onChangeChartPeriod = pType => {
  //   setPeriodType(pType)
  //   dispatch(onGetChartsData(pType))
  // }

  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(onGetChartsData("yearly"))
  // }, [dispatch])

  //meta title
  document.title = "Dashboard | Konzeptes ";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          <Row>
            <Col xl="4">
              <WelcomeComp />
            </Col>
            <Col xl="8">
              <Row>
                {/* Reports Render */}
                {reports.map((report, key) => (
                  <Col md="4" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <LatestTranaction />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Order Details Modal (Preserved) */}
      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className="text-muted mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className="text-muted mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  // onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);

// import PropTypes from "prop-types"
// import React, { useEffect, useState } from "react"
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
//   CardBody,
//   Input,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Table,
// } from "reactstrap"
// import { Link } from "react-router-dom"

// import classNames from "classnames"
// import StackedColumnChart from "./StackedColumnChart"
// import { getChartsData as onGetChartsData } from "../../store/actions"

// import modalimage1 from "../../assets/images/product/img-7.png"
// import modalimage2 from "../../assets/images/product/img-4.png"

// import WelcomeComp from "./WelcomeComp"
// import MonthlyEarning from "./MonthlyEarning"
// import SocialSource from "./SocialSource"
// import ActivityComp from "./ActivityComp"
// import TopCities from "./TopCities"
// import LatestTranaction from "./LatestTranaction"

// //Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb"

// //i18n
// import { withTranslation } from "react-i18next"

// //redux
// import { useSelector, useDispatch } from "react-redux"
// import axios from "axios"

// const Dashboard = props => {
//   const [modal, setmodal] = useState(false)
//   const [subscribemodal, setSubscribemodal] = useState(false)
//   const [registrationCount, setRegistrationCount] = useState(0)
//   const [easyCount, setEasyCount] = useState(0)
//   const [intermediateCount, setIntermediateCount] = useState(0)
//   const [hardCount, setHardCount] = useState(0)

//   const { chartsData } = useSelector(state => ({
//     chartsData: state.Dashboard.chartsData,
//   }))

//   const ordsInstance = axios.create()

//   function fetchDashboardMetrics() {
//     fetch("http://192.168.0.127:8080/ords/lms/user/registration-count")
//       // fetch("http://192.168.0.117:8080/ords/dev/user/registration-count")
//       .then(response => {
//         if (!response.ok) throw new Error("Network response was not ok")
//         return response.json()
//       })
//       .then(data => {
//         console.log("API Data Received:", data)
//         if (data.items && data.items.length > 0) {
//           const item = data.items[0]

//           setRegistrationCount(item.registrationcount || 0)
//           setEasyCount(item.easycount || 0)
//           setIntermediateCount(item.intermediatecount || 0)
//           setHardCount(item.hardcount || 0)
//         }
//       })
//       .catch(error => {
//         console.error("Fetch Error:", error)
//       })
//   }

//   useEffect(() => {
//     fetchDashboardMetrics()
//   }, [])

//   const reports = [
//     {
//       title: "Registration",
//       iconClass: "bx-user-plus",
//       description: registrationCount,
//     },
//     { title: "Easy", iconClass: "bx-star", description: easyCount },
//     {
//       title: "Intermediate",
//       iconClass: "bx-medal",
//       description: intermediateCount,
//     },
//     { title: "Hard", iconClass: "bx-trophy", description: hardCount },
//   ]

//   useEffect(() => {
//     setTimeout(() => {
//       setSubscribemodal(true)
//     }, 2000)
//   }, [])

//   const [periodData, setPeriodData] = useState([])
//   const [periodType, setPeriodType] = useState("yearly")

//   useEffect(() => {
//     setPeriodData(chartsData)
//   }, [chartsData])

//   const onChangeChartPeriod = pType => {
//     setPeriodType(pType)
//     dispatch(onGetChartsData(pType))
//   }

//   const dispatch = useDispatch()
//   useEffect(() => {
//     dispatch(onGetChartsData("yearly"))
//   }, [dispatch])

//   //meta title
//   document.title = "Dashboard | Konzeptes "

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           {/* Render Breadcrumb */}
//           <Breadcrumbs
//             title={props.t("Dashboards")}
//             breadcrumbItem={props.t("Dashboard")}
//           />

//           <Row>
//             <Col xl="4">
//               <WelcomeComp />
//             </Col>
//             <Col xl="8">
//               <Row>
//                 {/* Reports Render */}
//                 {reports.map((report, key) => (
//                   <Col md="4" key={"_col_" + key}>
//                     <Card className="mini-stats-wid">
//                       <CardBody>
//                         <div className="d-flex">
//                           <div className="flex-grow-1">
//                             <p className="text-muted fw-medium">
//                               {report.title}
//                             </p>
//                             <h4 className="mb-0">{report.description}</h4>
//                           </div>
//                           <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
//                             <span className="avatar-title rounded-circle bg-primary">
//                               <i
//                                 className={
//                                   "bx " + report.iconClass + " font-size-24"
//                                 }
//                               ></i>
//                             </span>
//                           </div>
//                         </div>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </Col>
//           </Row>

//           <Row>
//             <Col lg="12">
//               <LatestTranaction />
//             </Col>
//           </Row>
//         </Container>
//       </div>

//       {/* Order Details Modal (Preserved) */}
//       <Modal
//         isOpen={modal}
//         role="dialog"
//         autoFocus={true}
//         centered={true}
//         className="exampleModal"
//         tabIndex="-1"
//         toggle={() => {
//           setmodal(!modal)
//         }}
//       >
//         <div>
//           <ModalHeader
//             toggle={() => {
//               setmodal(!modal)
//             }}
//           >
//             Order Details
//           </ModalHeader>
//           <ModalBody>
//             <p className="mb-2">
//               Product id: <span className="text-primary">#SK2540</span>
//             </p>
//             <p className="mb-4">
//               Billing Name: <span className="text-primary">Neal Matthews</span>
//             </p>

//             <div className="table-responsive">
//               <Table className="table table-centered table-nowrap">
//                 <thead>
//                   <tr>
//                     <th scope="col">Product</th>
//                     <th scope="col">Product Name</th>
//                     <th scope="col">Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th scope="row">
//                       <div>
//                         <img src={modalimage1} alt="" className="avatar-sm" />
//                       </div>
//                     </th>
//                     <td>
//                       <div>
//                         <h5 className="text-truncate font-size-14">
//                           Wireless Headphone (Black)
//                         </h5>
//                         <p className="text-muted mb-0">$ 225 x 1</p>
//                       </div>
//                     </td>
//                     <td>$ 255</td>
//                   </tr>
//                   <tr>
//                     <th scope="row">
//                       <div>
//                         <img src={modalimage2} alt="" className="avatar-sm" />
//                       </div>
//                     </th>
//                     <td>
//                       <div>
//                         <h5 className="text-truncate font-size-14">
//                           Hoodie (Blue)
//                         </h5>
//                         <p className="text-muted mb-0">$ 145 x 1</p>
//                       </div>
//                     </td>
//                     <td>$ 145</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2">
//                       <h6 className="m-0 text-end">Sub Total:</h6>
//                     </td>
//                     <td>$ 400</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2">
//                       <h6 className="m-0 text-end">Shipping:</h6>
//                     </td>
//                     <td>Free</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2">
//                       <h6 className="m-0 text-end">Total:</h6>
//                     </td>
//                     <td>$ 400</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           </ModalBody>
//           <ModalFooter>
//             <Button
//               type="button"
//               color="secondary"
//               onClick={() => {
//                 setmodal(!modal)
//               }}
//             >
//               Close
//             </Button>
//           </ModalFooter>
//         </div>
//       </Modal>
//     </React.Fragment>
//   )
// }

// Dashboard.propTypes = {
//   t: PropTypes.any,
//   chartsData: PropTypes.any,
//   onGetChartsData: PropTypes.func,
// }

// export default withTranslation()(Dashboard)
