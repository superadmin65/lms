import React from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import { FieldArray } from "formik";

const CompleteWordSection = ({ validation }) => {
  return (
    <>
      <Label className="fw-bold text-primary mb-3">
        Complete Word Questions
      </Label>

      <FieldArray
        name="completeWords"
        render={(arrayHelpers) => (
          <>
            {validation.values.completeWords.map((item, index) => (
              <div key={index} className="p-3 mb-3 border rounded bg-light">
                {/* Word */}
                <Label>Word</Label>
                <Input
                  placeholder="e.g. school"
                  {...validation.getFieldProps(`completeWords.${index}.word`)}
                />

                {/* Question */}
                <Label className="mt-2">Question (with blank)</Label>
                <Input
                  placeholder="_ठशाला"
                  {...validation.getFieldProps(
                    `completeWords.${index}.question`,
                  )}
                />

                {/* Correct */}
                <Label className="mt-2">Correct Answer</Label>
                <Input
                  placeholder="ठ"
                  {...validation.getFieldProps(
                    `completeWords.${index}.correct`,
                  )}
                />

                {/* Options */}
                <Label className="mt-2">Options</Label>
                <FieldArray
                  name={`completeWords.${index}.options`}
                  render={(optHelpers) => (
                    <Row>
                      {item.options.map((opt, i) => (
                        <Col md={3} key={i} className="mb-2">
                          <Input
                            value={opt}
                            placeholder={`Option ${i + 1}`}
                            onChange={(e) =>
                              validation.setFieldValue(
                                `completeWords.${index}.options.${i}`,
                                e.target.value,
                              )
                            }
                          />
                        </Col>
                      ))}

                      <Col xs={12}>
                        <Button
                          size="sm"
                          color="success"
                          onClick={() => optHelpers.push("")}
                        >
                          + Add Option
                        </Button>
                      </Col>
                    </Row>
                  )}
                />

                {/* Remove */}
                <Button
                  color="danger"
                  size="sm"
                  className="mt-3"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              color="success"
              onClick={() =>
                arrayHelpers.push({
                  word: "",
                  question: "",
                  correct: "",
                  options: ["", ""],
                })
              }
            >
              + Add Question
            </Button>
          </>
        )}
      />
    </>
  );
};

export default CompleteWordSection;

// import React from "react"
// import { Label, Input } from "reactstrap"

// const CompleteWordSection = ({ validation }) => {
//   return (
//     <div className="p-3 border rounded bg-light">

//       {/* <div className="mb-3">
//         <Label className="fw-bold text-primary">Language</Label>
//         <Input
//           type="select"
//           name="lang"
//           value={validation.values.lang || "hi"}
//           onChange={validation.handleChange}
//         >
//           <option value="hi">Hindi</option>
//           <option value="en">English</option>
//         </Input>
//       </div> */}

//       <div className="mb-3">
//         <Label className="fw-bold text-primary">
//           Words Data (Pipe Format)
//         </Label>
//         <Input
//           type="textarea"
//           name="completeWordText"
//           rows="10"
//           value={validation.values.completeWordText || ""}
//           onChange={validation.handleChange}
//           placeholder={`Format:
// word|correct|question|options

// Example:
// school|पाठशाला|_ठशाला|पा,शा,ठा,ला`}
//           style={{ fontSize: "14px", lineHeight: "1.5" }}
//         />
//       </div>

//     </div>
//   )
// }

// export default CompleteWordSection
