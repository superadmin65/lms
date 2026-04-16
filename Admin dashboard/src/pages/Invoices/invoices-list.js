import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";

// ✅ IMPORT YOUR DYNAMIC API HELPERS
import { get, del } from "../../helpers/api_helper";
import { GET_ACTIVITY_LIST, DELETE_ACTIVITY } from "../../helpers/url_helper";

const InvoicesList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // ✅ USE DYNAMIC GET, but ask Axios to return raw text so we can clean it first
      const rawTextResponse = await get(GET_ACTIVITY_LIST, {
        transformResponse: [(data) => data],
      });

      console.log("1. RAW API RESPONSE:", rawTextResponse);

      // Clean invisible line breaks/tabs that corrupt JSON
      let cleanJsonText = rawTextResponse.replace(/[\r\n\t]+/g, "");
      console.log("2. CLEANED JSON TEXT:", cleanJsonText);

      const parsedResponse = JSON.parse(cleanJsonText);
      console.log("3. SUCCESSFULLY PARSED JSON:", parsedResponse);

      const apiItems = parsedResponse.items || parsedResponse || [];

      const processedData = apiItems.map((item) => {
        // let parsedBody = {};
        // try {
        //   if (item.data_json && typeof item.data_json === "string") {
        //     parsedBody = JSON.parse(item.data_json);
        //   } else if (typeof item.data_json === "object") {
        //     parsedBody = item.data_json;
        //   }
        // } catch (e) {
        //   console.error(`JSON Parse Error for ID ${item.id}:`, e);
        // }

        let parsedBody =
          item.data_json && typeof item.data_json === "object"
            ? item.data_json
            : {};

        // let displayPreview = "No Content";
        // if (item.activity_type === "match") {
        //   displayPreview = parsedBody.text?.substring(0, 50) + "...";
        // } else if (
        //   item.activity_type === "sequence" ||
        //   item.activity_type === "completeWord"
        // ) {
        //   displayPreview =
        //     parsedBody.text?.split("\n")[0].substring(0, 50) + "...";
        // } else if (parsedBody.questions && parsedBody.questions.length > 0) {
        //   const first = parsedBody.questions[0];
        //   displayPreview = first.qText || first.question || "MCQ Content";
        // }
        let displayPreview = "No Content";

        if (item.activity_type === "match") {
          displayPreview = parsedBody?.text
            ? parsedBody.text.substring(0, 50) + "..."
            : "No Content";
        } else if (
          item.activity_type === "sequence" ||
          item.activity_type === "completeWord"
        ) {
          if (parsedBody?.text) {
            const firstLine = parsedBody.text.split("\n")[0] || "";
            displayPreview = firstLine.substring(0, 50) + "...";
          } else {
            displayPreview = "No Content";
          }
        } else if (parsedBody?.questions?.length > 0) {
          const first = parsedBody.questions[0];
          displayPreview = first?.qText || first?.question || "MCQ Content";
        }

        return {
          id: item.id,
          card_id: item.card_id,
          label: item.label,
          type: item.activity_type,
          btnLabel: item.btn_label,
          // title: parsedBody.title || item.label,
          title: parsedBody?.title || item.label,
          display_question: displayPreview,
          full_details: parsedBody,
        };
      });

      setData(processedData);
    } catch (error) {
      console.error("🔥 DASHBOARD CRASHED:", error);
      Swal.fire(
        "Error",
        "Failed to parse API data. Open F12 Console for details.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this activity!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ DYNAMIC DELETE REQUEST
          await del(`${DELETE_ACTIVITY}/${id}`);

          Swal.fire("Deleted!", "Activity has been removed.", "success");
          loadData();
        } catch (err) {
          console.error("DELETE ERROR:", err);
          Swal.fire("Error", "Network or CORS block detected.", "error");
        }
      }
    });
  };

  const handleAction = (rowData, isReadOnly = false) => {
    let questionsForForm = [];
    let matchTextForForm = rowData.full_details?.text || "";

    if (rowData.type === "mcq" && rowData.full_details?.questions) {
      questionsForForm = rowData.full_details.questions.map((q) => {
        let rawOptionsArray =
          typeof q.options === "string"
            ? q.options.split("\n")
            : Array.isArray(q.options)
            ? q.options
            : [];
        const correctIndex = rawOptionsArray.findIndex((opt) =>
          String(opt).trim().startsWith("*"),
        );
        const cleanOptions = rawOptionsArray.map((opt) =>
          String(opt).replace(/\*/g, "").trim(),
        );
        while (cleanOptions.length < 4) cleanOptions.push("");

        return {
          question: q.qText || q.question || "",
          answers: cleanOptions.slice(0, 4),
          correct_answer: correctIndex > -1 ? correctIndex.toString() : "0",
        };
      });
    }

    const editDataPayload = {
      id: rowData.id,
      card_id: rowData.card_id,
      label: rowData.label,
      type: rowData.type,
      btnLabel: rowData.btnLabel,
      data: {
        title: rowData.title || rowData.full_details?.title || "",
        text: matchTextForForm,
        questions:
          questionsForForm.length > 0
            ? questionsForForm
            : [
                {
                  question: "",
                  answers: ["", "", "", ""],
                  correct_answer: "0",
                },
              ],
      },
      readOnly: isReadOnly,
    };

    navigate("/invoices-detail", { state: { editData: editDataPayload } });
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Card", accessor: "card_id" },
      { Header: "Label", accessor: "label" },
      { Header: "Type", accessor: "type" },
      { Header: "Preview", accessor: "display_question" },
      {
        Header: "Action",
        Cell: (cellProps) => {
          const rowData = cellProps.row.original;
          return (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <Link
                to="#"
                className="text-primary border p-1 rounded"
                style={{ borderColor: "#ced4da" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleAction(rowData, true);
                }}
              >
                <i className="mdi mdi-eye font-size-18" />
              </Link>
              <Link
                to="#"
                className="text-success border p-1 rounded"
                style={{ borderColor: "#ced4da" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleAction(rowData, false);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" />
              </Link>
              <Link
                to="#"
                className="text-danger border p-1 rounded"
                style={{ borderColor: "#f46a6a" }}
                onClick={() => handleDelete(rowData.id)}
              >
                <i className="mdi mdi-delete font-size-18" />
              </Link>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Activity Management" />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="card-title">Activity List</h4>
                    <Button
                      color="primary"
                      onClick={() => navigate("/invoices-detail")}
                    >
                      <i className="mdi mdi-plus me-1" /> Add New Activity
                    </Button>
                  </div>
                  {loading ? (
                    <div className="d-flex justify-content-center py-5">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={data}
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
    </React.Fragment>
  );
};

export default InvoicesList;
