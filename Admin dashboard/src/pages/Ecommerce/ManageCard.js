import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
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
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";

import TableContainer from "../../components/Common/TableContainer";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import GlobalLoader from "../../components/Common/GlobalLoader";

// ✅ IMPORT DYNAMIC ENDPOINTS
// import { get, post, del } from "../../helpers/api_helper";
// import {
//   GET_CONFIG,
//   POST_MANAGE_CARD,
//   UPLOAD_ICON,
//   UPLOAD_BG,
// } from "../../helpers/url_helper";
import { get, post, del, axiosApi } from "../../helpers/api_helper";
import {
  GET_CONFIG,
  POST_MANAGE_CARD,
  UPLOAD_ICON,
  UPLOAD_BG,
  GET_CARD_ICON,
  GET_CARD_BG,
} from "../../helpers/url_helper";

function ManageCards() {
  document.title = "Manage Cards | Konzeptes";

  // --- STATE ---
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [cardList, setCardList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Force image refresh state
  const [imgVersion, setImgVersion] = useState(Date.now());

  // Files
  const [iconFile, setIconFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);

  const iconInputRef = useRef(null);
  const bgInputRef = useRef(null);

  // --- 1. FETCH DATA ---
  const fetchCards = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const json = await get(GET_CONFIG);

      let list = [];
      if (json.items && json.items.length > 0) {
        const rawList = json.items[0].list;
        list =
          typeof rawList === "string" ? JSON.parse(rawList) : rawList || [];
      }
      setCardList(list);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(true);
  }, []);

  // --- 2. DELETE ---
  const handleDeleteCard = async () => {
    if (cardData && cardData.id) {
      setDeleteModal(false);
      setLoading(true);
      try {
        await del(`${POST_MANAGE_CARD}?id=${encodeURIComponent(cardData.id)}`);
        Swal.fire("Deleted!", "Card removed.", "success");
        fetchCards();
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- 3. HELPER: IMAGE URL ---
  // const getImageUrl = (id, type) => {
  //   if (!id) return null;
  //   const endpoint = type === "icon" ? "image/icon" : "image/bg";

  //   // ✅ PULL DIRECTLY FROM ENV
  //   const envUrl =
  //     process.env.REACT_APP_API_URL || "http://localhost:8080/ords";
  //   const baseUrl = envUrl.endsWith("/lms") ? envUrl : `${envUrl}/lms`;

  //   return `${baseUrl}/v1/konzeptes/${endpoint}/${id}?t=${imgVersion}`;
  // };
  const getImageUrl = (id, type) => {
    if (!id) return null;
    const endpoint = type === "icon" ? GET_CARD_ICON : GET_CARD_BG;
    const baseUrl = axiosApi.defaults.baseURL;
    return `${baseUrl}${endpoint}/${id}?t=${imgVersion}`;
  };

  // --- 4. FILE SELECT ---
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "icon") {
        setIconFile(file);
        setIconPreview(url);
      } else {
        setBgFile(file);
        setBgPreview(url);
      }
    }
  };

  // --- 5. FORMIK (SUBMIT) ---
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: cardData?.id || "",
      label: cardData?.label || "",
      smLabel: cardData?.smLabel || "",
    },
    validationSchema: Yup.object({
      label: Yup.string().required("Please Enter Title"),
      smLabel: Yup.string().required("Please Enter Sub-Label"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const idToSend = isEdit ? values.id : null;

        // ✅ USE DYNAMIC POST FOR TEXT DATA
        const result = await post(POST_MANAGE_CARD, {
          id: idToSend,
          label: values.label,
          smLabel: values.smLabel,
        });

        // ✅ FIX: If editing, use the ID we already have. If new, grab the ID from the result.
        const savedId = isEdit ? values.id : result.id || result.items?.[0]?.id;

        if (!savedId) {
          console.error("Backend Response:", result);
          throw new Error("No ID returned from server");
        }

        // ✅ GET BASE URL FOR UPLOADS
        // const envUrl =
        //   process.env.REACT_APP_API_URL || "http://localhost:8080/ords";
        // const baseUrl = envUrl.endsWith("/lms") ? envUrl : `${envUrl}/lms`;

        // // ✅ UPLOAD IMAGES
        // if (iconFile) {
        //   await fetch(`${baseUrl}${UPLOAD_ICON}/${savedId}`, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": iconFile.type,
        //       Authorization: localStorage.getItem("accessToken"),
        //     },
        //     body: iconFile,
        //   });
        // }

        // if (bgFile) {
        //   await fetch(`${baseUrl}${UPLOAD_BG}/${savedId}`, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": bgFile.type,
        //       Authorization: localStorage.getItem("accessToken"),
        //     },
        //     body: bgFile,
        //   });
        // }

        // ✅ UPLOAD IMAGES USING AXIOS HELPER
        const uploadPromises = [];

        if (iconFile) {
          uploadPromises.push(
            axiosApi.post(`${UPLOAD_ICON}/${savedId}`, iconFile, {
              headers: { "Content-Type": iconFile.type },
            }),
          );
        }

        if (bgFile) {
          uploadPromises.push(
            axiosApi.post(`${UPLOAD_BG}/${savedId}`, bgFile, {
              headers: { "Content-Type": bgFile.type },
            }),
          );
        }

        if (uploadPromises.length > 0) await Promise.all(uploadPromises);

        // E. SUCCESS
        setImgVersion(Date.now());
        Swal.fire(isEdit ? "Updated!" : "Added!", "Success", "success");
        fetchCards();
        toggle();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Operation failed", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  // --- 6. MODAL ---
  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setCardData(null);
      setIsEdit(false);
      setIsView(false);
      setIconFile(null);
      setBgFile(null);
      setIconPreview(null);
      setBgPreview(null);
      validation.resetForm();
    }
  };

  const handleAddClick = () => {
    setCardData(null);
    setIsEdit(false);
    setIsView(false);
    setModal(true);
  };

  const handleEditClick = (row) => {
    setCardData(row);
    setIsEdit(true);
    setIsView(false);
    setModal(true);
  };

  const handleViewClick = (row) => {
    setCardData(row);
    setIsEdit(false);
    setIsView(true);
    setModal(true);
  };

  const onClickDelete = (row) => {
    setCardData(row);
    setDeleteModal(true);
  };

  // --- 7. COLUMNS ---
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", width: 50 },
      {
        Header: "Icon",
        disableSortBy: true,
        Cell: (cellProps) => (
          <img
            src={getImageUrl(cellProps.row.original.id, "icon")}
            alt="icon"
            height="40"
            width="40"
            style={{
              objectFit: "contain",
              background: "#eee",
              borderRadius: "4px",
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
        ),
      },
      {
        Header: "BG",
        disableSortBy: true,
        Cell: (cellProps) => (
          <img
            src={getImageUrl(cellProps.row.original.id, "bg")}
            alt="bg"
            height="40"
            width="40"
            style={{ objectFit: "cover", borderRadius: "4px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        ),
      },
      { Header: "Title", accessor: "label" },
      { Header: "Sub-Label", accessor: "smLabel" },
      {
        Header: "Action",
        disableSortBy: true,
        Cell: (cellProps) => (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Link
              to="#"
              className="text-primary border p-1 rounded"
              style={{ borderColor: "#ced4da" }}
              onClick={() => handleViewClick(cellProps.row.original)}
            >
              <i className="mdi mdi-eye font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-success border p-1 rounded"
              style={{ borderColor: "#ced4da" }}
              onClick={() => handleEditClick(cellProps.row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-danger border p-1 rounded"
              style={{ borderColor: "#f46a6a" }}
              onClick={() => onClickDelete(cellProps.row.original)}
            >
              <i className="mdi mdi-delete font-size-18" />
            </Link>
          </div>
        ),
      },
    ],
    [imgVersion, cardList],
  );

  return (
    <React.Fragment>
      <GlobalLoader loading={loading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCard}
        onCloseClick={() => setDeleteModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Exercise Management"
            breadcrumbItem="Manage Cards"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={cardList}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    handleOrderClicks={handleAddClick}
                    addButtonLabel="Add Card"
                    customPageSize={10}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal isOpen={modal} toggle={toggle} centered={true} size="lg">
            <ModalHeader toggle={toggle}>
              {isView
                ? "View Details"
                : isEdit
                ? "Edit Details"
                : "Add New Card"}
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
                      <Label>Title (Label)</Label>
                      <Input
                        name="label"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.label || ""}
                        invalid={
                          validation.touched.label && validation.errors.label
                        }
                        readOnly={isView}
                      />
                      {validation.touched.label && validation.errors.label && (
                        <FormFeedback>{validation.errors.label}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-3">
                      <Label>Sub-Label (English)</Label>
                      <Input
                        name="smLabel"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.smLabel || ""}
                        invalid={
                          validation.touched.smLabel &&
                          validation.errors.smLabel
                        }
                        readOnly={isView}
                      />
                      {validation.touched.smLabel &&
                        validation.errors.smLabel && (
                          <FormFeedback>
                            {validation.errors.smLabel}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <Row>
                      {/* ICON BOX */}
                      <Col xs={6} className="text-center">
                        <Label>Icon</Label>
                        <div
                          className="border p-2 rounded d-flex align-items-center justify-content-center bg-light"
                          style={{
                            height: "120px",
                            cursor: isView ? "default" : "pointer",
                          }}
                          onClick={() =>
                            !isView && iconInputRef.current.click()
                          }
                        >
                          {iconPreview ? (
                            <img
                              src={iconPreview}
                              alt="Preview"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : cardData?.id ? (
                            <img
                              src={getImageUrl(cardData.id, "icon")}
                              alt="Icon"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ) : (
                            <div className="text-muted">Upload</div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={iconInputRef}
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "icon")}
                        />
                      </Col>

                      {/* BG BOX */}
                      <Col xs={6} className="text-center">
                        <Label>Background</Label>
                        <div
                          className="border p-2 rounded d-flex align-items-center justify-content-center bg-light"
                          style={{
                            height: "120px",
                            cursor: isView ? "default" : "pointer",
                          }}
                          onClick={() => !isView && bgInputRef.current.click()}
                        >
                          {bgPreview ? (
                            <img
                              src={bgPreview}
                              alt="Preview"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : cardData?.id ? (
                            <img
                              src={getImageUrl(cardData.id, "bg")}
                              alt="BG"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ) : (
                            <div className="text-muted">Upload</div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={bgInputRef}
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "bg")}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <div className="text-end mt-4">
                  <Button color="secondary" className="me-2" onClick={toggle}>
                    Close
                  </Button>
                  {!isView && (
                    <Button type="submit" color="success">
                      {isEdit ? "Update" : "Submit"}
                    </Button>
                  )}
                </div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ManageCards;
