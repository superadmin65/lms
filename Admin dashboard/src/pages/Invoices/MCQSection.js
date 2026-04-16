import React from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import { FieldArray } from "formik";

const MCQSection = ({ index, validation }) => {
  const currentQuestion = validation.values.questions[index];

  return (
    <>
      <div className="mb-3">
        <Label className="fw-bold">Question Text</Label>
        <Input
          type="text"
          placeholder="Enter question"
          {...validation.getFieldProps(`questions.${index}.question`)}
          invalid={
            validation.touched.questions?.[index]?.question &&
            !!validation.errors.questions?.[index]?.question
          }
        />
      </div>

      <hr />
      <Label className="text-primary fw-bold mb-3">
        Options (Select the radio button for the correct answer)
      </Label>

      <FieldArray
        name={`questions.${index}.answers`}
        render={arrayHelpers => (
          <Row>
            {/* {currentQuestion.answers.map((answer, ansIdx) => { */}
            {(currentQuestion.answers || ["", "", "", ""]).map(
              (answer, ansIdx) => {
                const isSelected =
                  currentQuestion.correct_answer === ansIdx.toString();

                return (
                  <Col md={6} key={ansIdx} className="mb-3">
                    <div
                      className={`d-flex align-items-center p-2 border rounded shadow-sm ${
                        isSelected ? "border-primary bg-light" : "bg-white"
                      }`}
                      // Clicking the container also selects the radio
                      onClick={() =>
                        validation.setFieldValue(
                          `questions.${index}.correct_answer`,
                          ansIdx.toString()
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="form-check mb-0">
                        <input
                          type="radio"
                          className="form-check-input"
                          // UNIQUE NAME PER QUESTION INDEX
                          name={`question_group_${index}`}
                          checked={isSelected}
                          onChange={() => {
                            // This is the critical fix
                            validation.setFieldValue(
                              `questions.${index}.correct_answer`,
                              ansIdx.toString()
                            );
                          }}
                          style={{ width: "18px", height: "18px" }}
                        />
                      </div>

                      <Input
                        name={`questions.${index}.answers.${ansIdx}`}
                        value={answer}
                        placeholder={`Option ${ansIdx + 1}`}
                        onChange={validation.handleChange}
                        // Stop propagation so typing doesn't trigger the div's onClick
                        onClick={e => e.stopPropagation()}
                        className="border-0 bg-transparent flex-grow-1"
                      />

                      {/* {currentQuestion.answers.length > 1 && ( */}
                      {(currentQuestion.answers || []).length > 1 && (
                        <Button
                          color="link"
                          className="text-danger p-0 ms-2"
                          onClick={e => {
                            e.stopPropagation();
                            arrayHelpers.remove(ansIdx);
                            // if (isSelected)
                            //   validation.setFieldValue(
                            //     `questions.${index}.correct_answer`,
                            //     "0"
                            //   )
                            if (isSelected)
                              validation.setFieldValue(
                                `questions.${index}.correct_answer`,
                                "0"
                              );
                          }}
                        >
                          <i className="mdi mdi-close-circle fs-4" />
                        </Button>
                      )}
                    </div>
                  </Col>
                );
              }
            )}

            <Col xs={12}>
              <Button
                color="success"
                outline
                size="sm"
                type="button"
                onClick={() => arrayHelpers.push("")}
              >
                + Add Option
              </Button>
            </Col>
          </Row>
        )}
      />
    </>
  );
};

export default MCQSection;
