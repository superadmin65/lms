import React from "react";
import styled from "styled-components";

const Styled = styled.div`
  background-color: #ddd;
  height: 100vh;

  h3 {
    margin: 10px;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Styled>
          <h3>There is some issue with this activity.</h3>
          <h3>We will fix it soon.</h3>
          <h3>Sorry for the inconvenience!</h3>
        </Styled>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
