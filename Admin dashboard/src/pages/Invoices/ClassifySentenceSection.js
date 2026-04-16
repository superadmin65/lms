import React from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import { FieldArray } from "formik";

const ClassifySentenceSection = ({ index, validation }) => {
  const currentQuestion = validation.values.questions[index];

  return (
    <>
      {/* Hindi Word */}
      <div className="mb-3">
        <Label className="fw-bold">Hindi Word</Label>
        <Input
          type="text"
          placeholder="Enter Hindi word (e.g. शेर)"
          {...validation.getFieldProps(`questions.${index}.word`)}
        />
      </div>

      <hr />

      <Label className="text-primary fw-bold mb-3">
        Options (Select correct synonym)
      </Label>

      <FieldArray
        name={`questions.${index}.options`}
        render={(arrayHelpers) => (
          <Row>
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected =
                currentQuestion.correct_answer === optIdx.toString();

              return (
                <Col md={6} key={optIdx} className="mb-3">
                  <div
                    className={`d-flex align-items-center p-2 border rounded shadow-sm ${
                      isSelected ? "border-primary bg-light" : "bg-white"
                    }`}
                    onClick={() =>
                      validation.setFieldValue(
                        `questions.${index}.correct_answer`,
                        optIdx.toString()
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      className="form-check-input me-2"
                      name={`question_group_${index}`}
                      checked={isSelected}
                      onChange={() =>
                        validation.setFieldValue(
                          `questions.${index}.correct_answer`,
                          optIdx.toString()
                        )
                      }
                    />

                    <Input
                      name={`questions.${index}.options.${optIdx}`}
                      value={opt}
                      placeholder={`Option ${optIdx + 1}`}
                      onChange={validation.handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="border-0 bg-transparent flex-grow-1"
                    />

                    {currentQuestion.options.length > 1 && (
                      <Button
                        color="link"
                        className="text-danger p-0 ms-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          arrayHelpers.remove(optIdx);
                        }}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </Col>
              );
            })}

            <Col xs={12}>
              <Button
                color="success"
                outline
                size="sm"
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

export default ClassifySentenceSection;