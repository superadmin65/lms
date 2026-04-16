import React from "react";
// 1. Add 'screen' to your imports
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  // 2. Remove the destructuring { getByText }
  render(<App />);

  // 3. Use screen.getByText instead
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// import React from "react";
// import { render } from "@testing-library/react";
// import App from "./App";

// test("renders learn react link", () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
