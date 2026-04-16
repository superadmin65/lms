import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/users/avatar-1.jpg";

// ✅ IMPORT DYNAMIC HELPERS
import { post } from "../../helpers/api_helper";
import { POST_USER_PROFILE } from "../../helpers/url_helper";

const UserProfile = () => {
  document.title = "Profile | LMS Dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load initial data from localStorage
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    if (authUser.email) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
      setMobile(authUser.mobile || "");
      setOriginalEmail(authUser.email || "");
    }
  }, []);

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (success || errorMsg) {
      const timer = setTimeout(() => {
        setSuccess("");
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, errorMsg]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: name || "",
      useremail: email || "",
      usermobile: mobile || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your User Name"),
      useremail: Yup.string()
        .email("Invalid email format")
        .required("Please Enter Your Email"),
      usermobile: Yup.string()
        .matches(/^[0-9]+$/, "Mobile number must contain only digits")
        .min(10, "Minimum 10 digits required")
        .required("Please Enter Your Mobile Number"),
    }),

    onSubmit: async (values) => {
      if (
        values.username === name &&
        values.useremail === email &&
        values.usermobile === mobile
      ) {
        setSuccess("");
        setErrorMsg("No changes detected. Update a field first.");
        return;
      }

      try {
        setLoading(true);
        setSuccess("");
        setErrorMsg("");

        const payload = {
          old_email: originalEmail,
          name: values.username,
          new_email: values.useremail,
          mobile: values.usermobile,
        };

        //  USE DYNAMIC POST CALL
        const data = await post(POST_USER_PROFILE, payload);

        if (data.status === "SUCCESS") {
          const authData = JSON.parse(localStorage.getItem("authUser") || "{}");
          const updatedUser = {
            ...authData,
            name: values.username,
            email: values.useremail,
            mobile: values.usermobile,
          };
          localStorage.setItem("authUser", JSON.stringify(updatedUser));

          setName(values.username);
          setEmail(values.useremail);
          setMobile(values.usermobile);
          setOriginalEmail(values.useremail);
          setSuccess("Profile updated successfully");
        } else {
          setErrorMsg(data.message || "Update failed");
        }
      } catch (error) {
        console.error("Profile Update Error:", error);
        setErrorMsg("Server error: Check if ORDS is running.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Konzeptes" breadcrumbItem="Profile" />

          {success && (
            <div className="alert alert-success text-center shadow-sm">
              {success}
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger text-center shadow-sm">
              {errorMsg}
            </div>
          )}

          <Row>
            {/* LEFT SECTION: Basic Information Card (Width adjusted to lg=6) */}
            <Col lg={6}>
              <Card className="h-100 overflow-hidden shadow-sm border-0">
                <CardBody className="p-0">
                  <Row className="g-0 h-100">
                    <Col
                      md={5}
                      className="text-white text-center p-4 d-flex flex-column justify-content-center align-items-center"
                      style={{ backgroundColor: "#2e7d32" }}
                    >
                      <div className="mb-3">
                        <img
                          src={avatar}
                          alt="profile"
                          className="avatar-lg rounded-circle img-thumbnail border-0 shadow"
                        />
                      </div>
                      <h5 className="text-white mb-1">{name}</h5>
                      <p className="text-white-50 small mb-0">Administrator</p>
                    </Col>

                    <Col md={7} className="p-4 bg-white">
                      <h5 className="card-title mb-0">Basic Information</h5>
                      <hr className="my-3" />

                      <div className="profile-info-list">
                        <div className="mb-3">
                          <p className="text-muted mb-1 font-size-12 fw-bold text-uppercase">
                            <i className="mdi mdi-email-outline me-1"></i> Email
                            Address
                          </p>
                          <h6 className="font-size-14 text-dark mb-0">
                            {email}
                          </h6>
                        </div>

                        <div className="mb-3">
                          <p className="text-muted mb-1 font-size-12 fw-bold text-uppercase">
                            <i className="mdi mdi-phone-outline me-1"></i> Phone
                            Number
                          </p>
                          <h6 className="font-size-14 text-dark mb-0">
                            {mobile || "N/A"}
                          </h6>
                        </div>

                        <div className="mb-3">
                          <p className="text-muted mb-1 font-size-12 fw-bold text-uppercase">
                            <i className="mdi mdi-account-star-outline me-1"></i>{" "}
                            Designation
                          </p>
                          <h6 className="font-size-14 text-dark mb-0">
                            LMS Administrator
                          </h6>
                        </div>

                        <div className="mb-0"></div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* RIGHT SECTION: Edit Profile Information (Width adjusted to lg=6) */}
            <Col lg={6}>
              <Card className="h-100 shadow-sm border-0">
                <CardBody>
                  <h5 className="card-title mb-4">Edit Profile Information</h5>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label font-size-12">
                        Admin Name
                      </Label>
                      <Input
                        name="username"
                        type="text"
                        className="bg-light border-0"
                        onChange={validation.handleChange}
                        value={validation.values.username}
                        invalid={
                          validation.touched.username &&
                          !!validation.errors.username
                        }
                      />
                      <FormFeedback>{validation.errors.username}</FormFeedback>
                    </div>

                    <div className="mb-3">
                      <Label className="form-label font-size-12">
                        Email Address
                      </Label>
                      <Input
                        name="useremail"
                        type="email"
                        className="bg-light border-0"
                        onChange={validation.handleChange}
                        value={validation.values.useremail}
                        invalid={
                          validation.touched.useremail &&
                          !!validation.errors.useremail
                        }
                      />
                      <FormFeedback>{validation.errors.useremail}</FormFeedback>
                    </div>

                    <div className="mb-3">
                      <Label className="form-label font-size-12">
                        Mobile Number
                      </Label>
                      <Input
                        name="usermobile"
                        type="text"
                        className="bg-light border-0"
                        onChange={validation.handleChange}
                        value={validation.values.usermobile}
                        invalid={
                          validation.touched.usermobile &&
                          !!validation.errors.usermobile
                        }
                      />
                      <FormFeedback>
                        {validation.errors.usermobile}
                      </FormFeedback>
                    </div>

                    <div className="text-center mt-4">
                      <Button
                        type="submit"
                        color="success"
                        disabled={loading}
                        className="w-30 py-2 shadow-sm"
                        style={{ backgroundColor: "#2e7d32", border: "none" }}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;

// import React, { useState, useEffect } from "react"
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Button,
//   Label,
//   Input,
//   FormFeedback,
//   Form,
// } from "reactstrap"

// // Formik Validation
// import * as Yup from "yup"
// import { useFormik } from "formik"

// // Import Breadcrumb
// import Breadcrumb from "../../components/Common/Breadcrumb"
// import avatar from "../../assets/images/users/avatar-1.jpg"

// const UserProfile = () => {
//   document.title = "Profile | LMS Dashboard"

//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [mobile, setMobile] = useState("")
//   const [originalEmail, setOriginalEmail] = useState("")
//   const [success, setSuccess] = useState("")
//   const [errorMsg, setErrorMsg] = useState("")
//   const [loading, setLoading] = useState(false)

//   // ✅ Load initial data from localStorage
//   useEffect(() => {
//     const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
//     if (authUser.email) {
//       setName(authUser.name || "")
//       setEmail(authUser.email || "")
//       setMobile(authUser.mobile || "")
//       setOriginalEmail(authUser.email || "")
//     }
//   }, [])

//   // ✅ Auto-hide alerts after 5 seconds
//   useEffect(() => {
//     if (success || errorMsg) {
//       const timer = setTimeout(() => {
//         setSuccess("")
//         setErrorMsg("")
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [success, errorMsg])

//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       username: name || "",
//       useremail: email || "",
//       usermobile: mobile || "",
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Please Enter Your User Name"),
//       useremail: Yup.string()
//         .email("Invalid email format")
//         .required("Please Enter Your Email"),
//       usermobile: Yup.string()
//         .matches(/^[0-9]+$/, "Mobile number must contain only digits")
//         .min(10, "Minimum 10 digits required")
//         .required("Please Enter Your Mobile Number"),
//     }),

//     onSubmit: async values => {
//       if (
//         values.username === name &&
//         values.useremail === email &&
//         values.usermobile === mobile
//       ) {
//         setSuccess("")
//         setErrorMsg("No changes detected. Update a field first.")
//         return
//       }

//       try {
//         setLoading(true)
//         setSuccess("")
//         setErrorMsg("")

//         const payload = {
//           old_email: originalEmail,
//           name: values.username,
//           new_email: values.useremail,
//           mobile: values.usermobile,
//         }

//         const response = await fetch(
//           "http://192.168.0.127:8080/ords/lms/user-api/profile",
//           //  "http://192.168.0.117:8080/ords/lms/user-api/profile",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }
//         )

//         const data = await response.json()

//         if (data.status === "SUCCESS") {
//           const authData = JSON.parse(localStorage.getItem("authUser") || "{}")
//           const updatedUser = {
//             ...authData,
//             name: values.username,
//             email: values.useremail,
//             mobile: values.usermobile,
//           }
//           localStorage.setItem("authUser", JSON.stringify(updatedUser))

//           setName(values.username)
//           setEmail(values.useremail)
//           setMobile(values.usermobile)
//           setOriginalEmail(values.useremail)
//           setSuccess("Profile updated successfully")
//         } else {
//           setErrorMsg(data.message || "Update failed")
//         }
//       } catch (error) {
//         console.error("Profile Update Error:", error)
//         setErrorMsg("Server error: Check if ORDS is running.")
//       } finally {
//         setLoading(false)
//       }
//     },
//   })

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumb title="Konzeptes" breadcrumbItem="Profile" />

//           {success && (
//             <div className="alert alert-success text-center shadow-sm">
//               {success}
//             </div>
//           )}
//           {errorMsg && (
//             <div className="alert alert-danger text-center shadow-sm">
//               {errorMsg}
//             </div>
//           )}

//           <Row>
//             {/* LEFT SECTION: Basic Information Card (Width adjusted to lg=6) */}
//             <Col lg={6}>
//               <Card className="h-100 overflow-hidden shadow-sm border-0">
//                 <CardBody className="p-0">
//                   <Row className="g-0 h-100">
//                     <Col
//                       md={5}
//                       className="text-white text-center p-4 d-flex flex-column justify-content-center align-items-center"
//                       style={{ backgroundColor: "#2e7d32" }}
//                     >
//                       <div className="mb-3">
//                         <img
//                           src={avatar}
//                           alt="profile"
//                           className="avatar-lg rounded-circle img-thumbnail border-0 shadow"
//                         />
//                       </div>
//                       <h5 className="text-white mb-1">{name}</h5>
//                       <p className="text-white-50 small mb-0">Administrator</p>
//                     </Col>

//                     <Col md={7} className="p-4 bg-white">
//                       <h5 className="card-title mb-0">Basic Information</h5>
//                       <hr className="my-3" />

//                       <div className="profile-info-list">
//                         <div className="mb-3">
//                           <p className="text-muted mb-1 font-size-12 fw-bold text-uppercase">
//                             <i className="mdi mdi-email-outline me-1"></i> Email
//                             Address
//                           </p>
//                           <h6 className="font-size-14 text-dark mb-0">
//                             {email}
//                           </h6>
//                         </div>

//                         <div className="mb-3">
//                           <p className="text-muted mb-1 font-size-12 fw-bold text-uppercase">
//                             <i className="mdi mdi-phone-outline me-1"></i> Phone
//                             Number
//                           </p>
//                           <h6 className="font-size-14 text-dark mb-0">
//                             {mobile || "N/A"}
//                           </h6>
//                         </div>

//                         <div className="mb-3">
//                           <p className="text-muted mb-1 font-size-12 fw-bold text-uppercase">
//                             <i className="mdi mdi-account-star-outline me-1"></i>{" "}
//                             Designation
//                           </p>
//                           <h6 className="font-size-14 text-dark mb-0">
//                             LMS Administrator
//                           </h6>
//                         </div>

//                         <div className="mb-0"></div>
//                       </div>
//                     </Col>
//                   </Row>
//                 </CardBody>
//               </Card>
//             </Col>

//             {/* RIGHT SECTION: Edit Profile Information (Width adjusted to lg=6) */}
//             <Col lg={6}>
//               <Card className="h-100 shadow-sm border-0">
//                 <CardBody>
//                   <h5 className="card-title mb-4">Edit Profile Information</h5>
//                   <Form
//                     onSubmit={e => {
//                       e.preventDefault()
//                       validation.handleSubmit()
//                     }}
//                   >
//                     <div className="mb-3">
//                       <Label className="form-label font-size-12">
//                         Admin Name
//                       </Label>
//                       <Input
//                         name="username"
//                         type="text"
//                         className="bg-light border-0"
//                         onChange={validation.handleChange}
//                         value={validation.values.username}
//                         invalid={
//                           validation.touched.username &&
//                           !!validation.errors.username
//                         }
//                       />
//                       <FormFeedback>{validation.errors.username}</FormFeedback>
//                     </div>

//                     <div className="mb-3">
//                       <Label className="form-label font-size-12">
//                         Email Address
//                       </Label>
//                       <Input
//                         name="useremail"
//                         type="email"
//                         className="bg-light border-0"
//                         onChange={validation.handleChange}
//                         value={validation.values.useremail}
//                         invalid={
//                           validation.touched.useremail &&
//                           !!validation.errors.useremail
//                         }
//                       />
//                       <FormFeedback>{validation.errors.useremail}</FormFeedback>
//                     </div>

//                     <div className="mb-3">
//                       <Label className="form-label font-size-12">
//                         Mobile Number
//                       </Label>
//                       <Input
//                         name="usermobile"
//                         type="text"
//                         className="bg-light border-0"
//                         onChange={validation.handleChange}
//                         value={validation.values.usermobile}
//                         invalid={
//                           validation.touched.usermobile &&
//                           !!validation.errors.usermobile
//                         }
//                       />
//                       <FormFeedback>
//                         {validation.errors.usermobile}
//                       </FormFeedback>
//                     </div>

//                     <div className="text-center mt-4">
//                       <Button
//                         type="submit"
//                         color="success"
//                         disabled={loading}
//                         className="w-30 py-2 shadow-sm"
//                         style={{ backgroundColor: "#2e7d32", border: "none" }}
//                       >
//                         {loading ? "Updating..." : "Update Profile"}
//                       </Button>
//                     </div>
//                   </Form>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   )
// }

// export default UserProfile
