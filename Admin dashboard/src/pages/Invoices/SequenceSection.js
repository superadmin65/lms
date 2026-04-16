import React from "react";
import { Row, Col, Input, Label, FormFeedback } from "reactstrap";

const SequenceSection = ({ validation }) => {
  return (
    <>
      {/* Instructions */}
      <div className="mb-3">
        <Label className="fw-bold">
          Sentences (Each line will be one question)
        </Label>
        <Input
          type="textarea"
          rows="8"
          placeholder={`Example:
        मैं रोज़ दूध पीता हूँ।`}
          //   {...validation.getFieldProps("text")}
          {...validation.getFieldProps("sequenceText")}
          invalid={
            validation.touched.sequenceText && !!validation.errors.sequenceText
          }
        />
        {validation.touched.sequenceText &&
          !!validation.errors.sequenceText && (
            <FormFeedback>{validation.errors.sequenceText}</FormFeedback>
          )}
      </div>
    </>
  );
};

export default SequenceSection;
