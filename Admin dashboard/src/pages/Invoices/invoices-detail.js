import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik, FormikProvider, FieldArray } from "formik";
import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  Input,
  Label,
  Button,
  Spinner,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MCQSection from "./MCQSection";
import MatchBySection from "./MatchBySection";
import CompleteWordSection from "./CompleteWordSection";
import SequenceSection from "./SequenceSection";
import ClassifySentenceSection from "./ClassifySentenceSection";
import WordSearchSection from "./WordSearchSection";
import Swal from "sweetalert2";

// HELPERS
import { get, post } from "../../helpers/api_helper";
import { GET_CARDS_CONFIG, SAVE_ACTIVITY } from "../../helpers/url_helper";

const commonInputStyle = {
  height: "38px",
  display: "flex",
  alignItems: "center",
};

function InvoicesDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state?.editData || null;
  const isEdit = !!editData;
  const isViewOnly = editData?.readOnly || false;

  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);

  // Fetch Topics/Cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const json = await get(GET_CARDS_CONFIG);
        let cardList = [];
        if (json.items && json.items.length > 0) {
          const rawList = json.items[0].list;
          cardList =
            typeof rawList === "string" ? JSON.parse(rawList) : rawList || [];
        }
        setCards(cardList);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoadingCards(false);
      }
    };
    fetchCards();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: editData?.id || null,
      card_id: editData?.card_id || "",
      label: editData?.label || "",
      type: editData?.activity_type || editData?.type || "", // Support both naming conventions
      btn_label: editData?.btn_label || "Fill Up by Drag",
      title: "",

      // Activity Specific Structures
      questions: [{ text: "", answer: "" }], // Shared by Match and Classify
      options: ["", ""],
      lang: "hi",

      // complete word specific
      completeWords: [
        {
          word: "",
          question: "",
          correct: "",
          options: ["", ""],
        },
      ],

      // WordSearch specific
      wordList: [""],
      generatedTable: [],
      generatedWords: [],
      rows: 8,
      cols: 8,

      // Sequence specific
      sequenceText: "",
    },

    onSubmit: async (values) => {
      if (isViewOnly) return;

      const type = values.type?.trim().toLowerCase();
      let apiPayload = null;

      try {
        switch (type) {
          case "match": {
            // 1. Transform Array into the "*answer*" format string for the player
            const formattedText = values.questions
              .filter((q) => q.text.trim() !== "" && q.answer.trim() !== "")
              .map((q) => `${q.text.trim()} *${q.answer.trim()}*`)
              .join("\n");

            const data_json = {
              dashWidth: 70,
              bgData: {
                imgWidth: 928,
                top: 20,
                left: 300,
                width: 600,
                bgImg: "konzeptes/comprehension.jpg",
                imgHeight: 700,
                height: 650,
              },
              fontSize: "1rem",
              text: formattedText,
              title: values.title,
            };

            apiPayload = {
              activity_id: isEdit ? editData.id : "",
              card_id: values.card_id,
              label: values.label,
              type: "matchByDragDrop", // Backend identifier
              btn_label: values.btn_label,
              data_json: JSON.stringify(data_json),
            };
            break;
          }

          case "mcq": {
            const dataJsonObj = {
              title: values.title,
              questions: values.questions.map((q) => {
                const correctIdx = parseInt(q.correct_answer);
                const formattedOptions = q.answers.map((ans, idx) =>
                  idx === correctIdx ? `*${ans.trim()}*` : ans.trim(),
                );
                return {
                  qText: q.question,
                  options: formattedOptions.join("\n"),
                };
              }),
            };

            apiPayload = {
              activity_id: isEdit ? values.id : null,
              card_id: Number(values.card_id),
              label: values.label,
              type: "mcq",
              btn_label: "MCQ",
              data_json: JSON.stringify(dataJsonObj),
            };
            break;
          }

          case "completeword": {
            apiPayload = {
              activity_id: isEdit ? values.id : null,
              card_id: Number(values.card_id),
              label: values.label,
              type: "completeWord",
              btn_label: "Find the Word",
              data_json: JSON.stringify({
                title: values.title,
                lang: values.lang,
                completeWords: values.completeWords,
              }),
            };
            break;
          }

          case "sequence": {
            apiPayload = {
              activity_id: isEdit ? values.id : null,
              card_id: Number(values.card_id),
              label: values.label,
              type: "sequence",
              btn_label: "Jumbled",
              data_json: JSON.stringify({
                title: values.title,
                lang: values.lang,
                text: values.sequenceText,
              }),
            };
            break;
          }

          case "classifysentence": {
            const textData = values.questions
              .map((q) => {
                const opts = q.options.map((opt, idx) =>
                  idx.toString() === q.correct_answer
                    ? `*${opt.trim()}`
                    : opt.trim(),
                );
                return `${q.word} | ${q.word} | ${opts.join(",")}`;
              })
              .join("\n");

            apiPayload = {
              activity_id: isEdit ? values.id : null,
              card_id: Number(values.card_id),
              label: values.label,
              type: "classifySentence",
              btn_label: "Pick the Right Option",
              data_json: JSON.stringify({
                title: values.title,
                text: textData,
              }),
            };
            break;
          }

          case "wordsearch": {
            apiPayload = {
              activity_id: isEdit ? values.id : null,
              card_id: Number(values.card_id),
              label: values.label,
              type: "wordsearch",
              btn_label: "Word Search",
              data_json: JSON.stringify({
                title: values.title,
                words: values.generatedWords,
                table: values.generatedTable,
                lang: "en",
                showWords: true,
              }),
            };
            break;
          }

          default:
            Swal.fire("Error", "Invalid activity type", "error");
            return;
        }

        const result = await post(SAVE_ACTIVITY, apiPayload);

        if (["success", "inserted", "updated"].includes(result?.status)) {
          Swal.fire("Success", "Saved!", "success").then(() =>
            navigate("/invoices-list"),
          );
        } else {
          Swal.fire("Error", "Unexpected response from server", "error");
        }
      } catch (error) {
        console.error("Submit Error:", error);
        Swal.fire("Error", error.message, "error");
      }
    },
  });

  // Handle Loading existing data for Edit mode

  // useEffect(() => {
  //   if (isEdit && editData) {
  //     let parsedData = {};
  //     try {
  //       parsedData =
  //         typeof editData.data_json === "string"
  //           ? JSON.parse(editData.data_json)
  //           : editData.data_json;
  //     } catch (e) {
  //       console.error("Parse error", e);
  //     }

  //     if (parsedData && parsedData.text) {

  //       // Specifically for MatchBy: Convert "*word*" string back into UI array
  //       const lines = parsedData.text
  //         .split("\n")
  //         .filter((l) => l.trim() !== "");
  //       const reconstructedQuestions = lines.map((line) => {
  //         const match = line.match(/(.*)\s*\*(.*)\*/);
  //         return {
  //           text: match ? match[1].trim() : line,
  //           answer: match ? match[2].trim() : "",
  //         };
  //       });

  //       validation.setValues({
  //         ...validation.initialValues, // Reset to base
  //         id: editData.id,
  //         label: editData.label || "",
  //         btn_label: editData.btn_label || "Fill Up by Drag",
  //         type: editData.activity_type || "match",
  //         title: parsedData.title || "",
  //         questions:
  //           reconstructedQuestions.length > 0
  //             ? reconstructedQuestions
  //             : [{ text: "", answer: "" }],
  //         card_id: editData.card_id || "",
  //       });
  //     }
  //   }
  // }, [editData]);

  useEffect(() => {
    if (isEdit && editData) {
      let parsedData = {};
      try {
        parsedData =
          typeof editData.data_json === "string"
            ? JSON.parse(editData.data_json)
            : editData.data_json;
      } catch (e) {
        console.error("Parse error", e);
      }

      if (parsedData) {
        const activityType = editData.activity_type || editData.type || "";

        // 1. Reconstruct Match Questions if applicable
        let reconstructedMatch = [{ text: "", answer: "" }];
        if (parsedData.text && activityType === "match") {
          const lines = parsedData.text
            .split("\n")
            .filter((l) => l.trim() !== "");
          reconstructedMatch = lines.map((line) => {
            const match = line.match(/(.*)\s*\*(.*)\*/);
            return {
              text: match ? match[1].trim() : line,
              answer: match ? match[2].trim() : "",
            };
          });
        }

        // 2. Set Values for ALL types to prevent "undefined" errors
        validation.setValues({
          ...validation.initialValues, // Ensures completeWords: [{...}] exists
          id: editData.id,
          label: editData.label || "",
          btn_label: editData.btn_label || "Fill Up by Drag",
          type: activityType,
          card_id: editData.card_id || "",
          title: parsedData.title || "",

          // Populate specific fields if they exist in the DB
          questions: reconstructedMatch,
          completeWords: parsedData.completeWords || [
            { word: "", question: "", correct: "", options: ["", ""] },
          ],
          sequenceText:
            parsedData.text && activityType === "sequence"
              ? parsedData.text
              : "",
          // Wordsearch data
          generatedTable: parsedData.table || [],
          generatedWords: parsedData.words || [],
        });
      }
    }
  }, [editData]);

  return (
    <div className="page-content">
      <Breadcrumbs
        title="Exercise Management"
        breadcrumbItem={
          isViewOnly
            ? "View Activity"
            : isEdit
            ? "Edit Activity"
            : "Add New Activity"
        }
      />

      <FormikProvider value={validation}>
        <Form onSubmit={validation.handleSubmit}>
          {/* Section 1: Configuration */}
          <Card className="mb-3">
            <CardBody
              style={{
                pointerEvents: isViewOnly ? "none" : "auto",
                opacity: isViewOnly ? 0.9 : 1,
              }}
            >
              <h5 className="card-title mb-4">1. Configuration</h5>
              <Row>
                <Col md={4}>
                  <Label>Select Card (Topic)</Label>
                  {loadingCards ? (
                    <Spinner size="sm" color="primary" className="ms-2" />
                  ) : (
                    <Input
                      type="select"
                      style={commonInputStyle}
                      {...validation.getFieldProps("card_id")}
                    >
                      <option value="">-- Choose a Card --</option>
                      {cards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </Input>
                  )}
                </Col>
                <Col md={4}>
                  <Label>Activity Type</Label>
                  <Input
                    type="select"
                    style={commonInputStyle}
                    {...validation.getFieldProps("type")}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="mcq">MCQ (Multiple Choice)</option>
                    <option value="match">Match the Pairs (Drag & Drop)</option>
                    <option value="completeword">Complete Word</option>
                    <option value="sequence">Sequence</option>
                    <option value="classifysentence">
                      Pick the Right Option
                    </option>
                    <option value="wordsearch">Word Search</option>
                  </Input>
                </Col>
                <Col md={4}>
                  <Label>Activity Label</Label>
                  <Input
                    type="text"
                    style={commonInputStyle}
                    {...validation.getFieldProps("label")}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Section 2: Content Data */}
          <Card className="mb-3">
            <CardBody
              style={{
                pointerEvents: isViewOnly ? "none" : "auto",
                opacity: isViewOnly ? 0.9 : 1,
              }}
            >
              <h5 className="card-title mb-4">2. Content Data</h5>
              <div className="mb-4">
                <Label>Instruction Title</Label>
                <Input
                  type="text"
                  {...validation.getFieldProps("title")}
                  placeholder="e.g. Select the correct answer"
                />
              </div>
              <hr />

              {/* Dynamic Sections Based on Type */}
              {validation.values.type === "mcq" && (
                <FieldArray name="questions">
                  {({ push, remove }) => (
                    <>
                      {validation.values.questions.map((_, index) => (
                        <div
                          key={index}
                          className="p-3 mb-3 border rounded bg-light"
                        >
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="m-0 text-primary">
                              Question {index + 1}
                            </h6>
                            {!isViewOnly && (
                              <Button
                                color="danger"
                                size="sm"
                                outline
                                onClick={() => remove(index)}
                              >
                                <i className="mdi mdi-delete"></i>
                              </Button>
                            )}
                          </div>
                          <MCQSection index={index} validation={validation} />
                        </div>
                      ))}
                      {!isViewOnly && (
                        <Button
                          color="success"
                          onClick={() =>
                            push({
                              question: "",
                              answers: ["", "", "", ""],
                              correct_answer: "0",
                            })
                          }
                        >
                          + Add Question
                        </Button>
                      )}
                    </>
                  )}
                </FieldArray>
              )}

              {validation.values.type === "match" && (
                <MatchBySection validation={validation} />
              )}
              {validation.values.type === "completeword" && (
                <CompleteWordSection validation={validation} />
              )}
              {validation.values.type === "sequence" && (
                <SequenceSection validation={validation} />
              )}
              {validation.values.type === "wordsearch" && (
                <WordSearchSection
                  values={validation.values}
                  setFieldValue={validation.setFieldValue}
                />
              )}

              {validation.values.type === "classifysentence" && (
                <FieldArray name="questions">
                  {({ push, remove }) => (
                    <>
                      {validation.values.questions.map((_, index) => (
                        <div
                          key={index}
                          className="p-3 mb-3 border rounded bg-light"
                        >
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="m-0 text-primary">
                              Question {index + 1}
                            </h6>
                            {!isViewOnly && (
                              <Button
                                color="danger"
                                size="sm"
                                outline
                                onClick={() => remove(index)}
                              >
                                <i className="mdi mdi-delete"></i>
                              </Button>
                            )}
                          </div>
                          <ClassifySentenceSection
                            index={index}
                            validation={validation}
                          />
                        </div>
                      ))}
                      {!isViewOnly && (
                        <Button
                          color="success"
                          onClick={() =>
                            push({
                              word: "",
                              options: ["", ""],
                              correct_answer: "0",
                            })
                          }
                        >
                          + Add Question
                        </Button>
                      )}
                    </>
                  )}
                </FieldArray>
              )}

              {!validation.values.type && (
                <div className="text-center p-5 border rounded bg-light text-muted">
                  Please select an <strong>Activity Type</strong> to start
                  adding content.
                </div>
              )}
            </CardBody>
          </Card>

          {/* Form Actions */}
          <div className="d-flex justify-content-end gap-2 mb-5">
            <Button
              color="secondary"
              onClick={() => navigate("/invoices-list")}
            >
              {isViewOnly ? "Close" : "Cancel"}
            </Button>
            {!isViewOnly && (
              <Button color="primary" type="submit">
                {isEdit ? "Update Activity" : "Create Activity"}
              </Button>
            )}
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default InvoicesDetail;
