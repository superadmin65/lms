import React from "react";
import { generateWordSearch } from "./wordsearchGenerator";

const WordSearchSection = ({ values, setFieldValue }) => {
  const addWord = () => {
    setFieldValue("wordList", [...values.wordList, ""]);
  };

  const updateWord = (index, value) => {
    const updated = [...values.wordList];
    updated[index] = value;
    setFieldValue("wordList", updated);
  };

  const removeWord = index => {
    const updated = values.wordList.filter((_, i) => i !== index);
    setFieldValue("wordList", updated);
  };

  const generateGrid = () => {
    const cleanWords = values.wordList.filter(w => w.trim() !== "");

    if (cleanWords.length === 0) {
      alert("Add at least one word");
      return;
    }

    const result = generateWordSearch(cleanWords, values.rows, values.cols);

    setFieldValue("generatedTable", result.table);
    setFieldValue("generatedWords", result.words);
  };

  return (
    <div>
      <h5>Words</h5>

      {values.wordList.map((w, i) => (
        <div key={i}>
          <input
            value={w}
            onChange={e => updateWord(i, e.target.value.toUpperCase())}
            placeholder="Enter word"
          />
          <button type="button" onClick={() => removeWord(i)}>
            ❌
          </button>
        </div>
      ))}

      <button type="button" onClick={addWord}>
        + Add Word
      </button>

      <hr />

      <button type="button" onClick={generateGrid}>
        ⚡ Generate Grid
      </button>

      <hr />

      {/* Preview */}
      {values.generatedTable && (
        <div>
          {values.generatedTable.map((row, r) => (
            <div key={r} style={{ display: "flex" }}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  style={{
                    width: 30,
                    height: 30,
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordSearchSection;
