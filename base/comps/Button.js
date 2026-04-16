import React from 'react';
import styled, { css, keyframes } from 'styled-components';
//import Loader from "../libs/SpinKit";

const Loader = <div>...</div>;

const ring = keyframes`
0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled('button')`
  background-color: var(--lightHColor);
  border-width: 2px;
  color: #363636;
  cursor: pointer;
  justify-content: center;
  padding: calc(0.5em - 2px) 1em;
  text-align: center;
  margin-left: auto;
  white-space: nowrap;
  border-radius: 3px;
  border-color: transparent;
  box-shadow: var(--shadow);
  ${(props) =>
    props.primary &&
    css`
      background-color: var(--darkColor);

      color: #fff;
    `}
  ${(props) =>
    props.secondary &&
    css`
      background-color: var(--mediumColor);
      color: #fff;

      a {
        color: white;
      }
    `}
  .updating {
    display: none;
  }

  &.callInProg {
    .updating {
      display: inline-block;
      position: relative;
      width: 20px;
      height: 20px;
      margin-left: 15px;

      div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        margin: 1px;
        border: 2px solid #fff;
        border-radius: 50%;
        animation: ${ring} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
      }

      div:nth-child(1) {
        animation-delay: -0.45s;
      }
      div:nth-child(2) {
        animation-delay: -0.3s;
      }
      div:nth-child(3) {
        animation-delay: -0.15s;
      }
    }
  }
`;

export const ProgButton = ({ children, updating, ...props }) => {
  return (
    <StyledButton {...props} ref={props.innerRef}>
      {children}
      <div className="updating">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </StyledButton>
  );
};

const Button = ({ children, updating, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
