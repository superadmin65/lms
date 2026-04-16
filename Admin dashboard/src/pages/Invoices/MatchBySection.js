import React from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import { FieldArray } from "formik";

const WordFillSection = ({ validation }) => {
  return (
    <>
      <Label className="fw-bold text-primary mb-3">
        Add Questions (Fill in the blanks)
      </Label>

      <FieldArray
        name="questions"
        render={(arrayHelpers) => (
          <>
            {validation.values.questions.map((q, index) => (
              <div key={index} className="p-3 mb-3 border rounded bg-light">
                {/* Question Text */}
                <Label>Question</Label>
                <Input
                  type="text"
                  placeholder="Enter sentence"
                  {...validation.getFieldProps(`questions.${index}.text`)}
                />

                {/* Answer */}
                <Label className="mt-2">Correct Answer</Label>
                <Input
                  type="text"
                  placeholder="Enter correct answer"
                  {...validation.getFieldProps(`questions.${index}.answer`)}
                />

                {/* Remove */}
                <Button
                  color="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              color="success"
              size="sm"
              onClick={() => arrayHelpers.push({ text: "", answer: "" })}
            >
              + Add Question
            </Button>
          </>
        )}
      />

      <hr />

      {/* OPTIONS SECTION */}
      <Label className="fw-bold text-primary">Options Pool</Label>

      <FieldArray
        name="options"
        render={(arrayHelpers) => (
          <Row>
            {validation.values.options.map((opt, i) => (
              <Col md={4} key={i} className="mb-2">
                <Input
                  value={opt}
                  placeholder="Option"
                  onChange={(e) =>
                    validation.setFieldValue(`options.${i}`, e.target.value)
                  }
                />
              </Col>
            ))}

            <Col xs={12}>
              <Button
                size="sm"
                color="success"
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

export default WordFillSection;

// import React from "react";
// import { Label } from "reactstrap";

// const MatchBySection = ({ validation }) => {
//   const textValue = validation.values.matchText || "";

//   const getHighlightedText = (text) => {
//     const parts = text.split(/(\*.*?\*)/g);
//     return parts.map((part, i) =>
//       part.startsWith("*") && part.endsWith("*") ? (
//         <span key={i} style={{ backgroundColor: "#d1e7ff", color: "#0056b3", fontWeight: "bold", borderRadius: "3px", padding: "0 2px" }}>
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   return (
//     <div className="p-3 border rounded bg-light">
//       <div className="mb-3">
//         <Label className="fw-bold text-primary">Activity Content (Sentences or Paragraph)</Label>
//         <div style={{ position: "relative", minHeight: "200px", border: "1px solid #ced4da", borderRadius: "4px", backgroundColor: "#fff", overflow: "hidden" }}>
//           {/* The Backdrop (Highlights) */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               padding: "12px",
//               whiteSpace: "pre-wrap",
//               wordWrap: "break-word",
//               color: "transparent", // Hide the actual text in the background
//               pointerEvents: "none",
//               fontSize: "15px",
//               lineHeight: "1.6",
//               zIndex: 1
//             }}
//           >
//             {getHighlightedText(textValue)}
//           </div>

//           {/* The Actual Textarea */}
//           <textarea
//             name="matchText"
//             value={textValue}
//             onChange={validation.handleChange}
//             placeholder="Paste text here and use *word* to create a blank..."
//             style={{
//               position: "relative",
//               width: "100%",
//               minHeight: "200px",
//               padding: "12px",
//               fontSize: "15px",
//               lineHeight: "1.6",
//               background: "transparent",
//               border: "none",
//               outline: "none",
//               color: "#495057",
//               zIndex: 2,
//               resize: "vertical",
//               fontFamily: "inherit",
//               display: "block"
//             }}
//           />
//         </div>
//         <small className="text-muted mt-2 d-block">
//           Highlighted words will appear as draggable options in the exercise.
//         </small>
//       </div>
//     </div>
//   );
// };

// export default MatchBySection;

/////////////////////////////////////////////////////
// import React from "react";
// import { Label, Input } from "reactstrap";

// const MatchBySection = ({ validation }) => {
//   return (
//     <div className="p-3 border rounded bg-light">
//       <div className="mb-3">
//         <Label className="fw-bold text-primary">Activity Content (Sentences or Paragraph)</Label>
//         <Input
//           type="textarea"
//           name="matchText"
//           rows="12"
//           value={validation.values.matchText || ""}
//           onChange={validation.handleChange}
//           placeholder="Type your sentences here... Use *word* for blanks."
//           style={{ fontSize: "15px", lineHeight: "1.6" }}
//         />
//         {/* <small className="text-muted mt-2 d-block">
//           Example: जो बीमारों का इलाज करता है *डॉक्टर*
//         </small> */}
//       </div>
//     </div>
//   );
// };

// export default MatchBySection;
