import styled, { css } from 'styled-components';
import React, { useEffect, useRef } from 'react';
import Svg from 'components/Svg';
const InputWrapper = styled.div`
  margin: 10px 0;

  ${(props) =>
    props.sameLine &&
    css`
      display: flex;
      margin-right: 20px;
    `} & input, textarea {
    border: none;
    outline: none;
    border-bottom: 1px solid ${(props) => (props.error ? '#f00' : '#ccc')};
    padding: 2px 5px;
    background-color: white;
    display: block;
    width: 100%;
  }

  & textarea {
    max-height: 250px;
  }

  & label {
    display: block;
    margin-bottom: 5px;
    margin-right: 10px;
  }

  & .errorLable {
    font-size: 0.8rem;
    margin-top: 5px;
    color: #de1c1c;
  }
`;

const Input = ({ error, label, sameLine, ...otherProps }) => (
  <InputWrapper sameLine={sameLine} error={error} style={otherProps.style}>
    {!!label && <label htmlFor={label}>{label}</label>}
    <div style={{ width: otherProps.width || '' }}>
      <input id={label} type="text" {...otherProps} />
      {error && <label className="errorLable">{error}</label>}
    </div>
  </InputWrapper>
);

export const TextArea = ({ error, label, sameLine, ...otherProps }) => {
  const inputRef = useRef(null);
  /*
  useEffect(() => {
    const dom = inputRef.current;
    dom.style.height = `${dom.scrollHeight}px`;
  });
  */
  return (
    <InputWrapper sameLine={sameLine} error={error} style={otherProps.style}>
      {!!label && <label htmlFor={label}>{label}</label>}
      <textarea id={label} ref={inputRef} {...otherProps} />
      {error && <label className="errorLable">{error}</label>}
    </InputWrapper>
  );
};

export const FileUpload = ({ error, iconOnly, label, ...otherProps }) => (
  <div>
    {
      <label
        htmlFor="fileUpload"
        className={iconOnly ? '' : 'button is-primary'}
      >
        {iconOnly ? <Svg id="upload" /> : label}
      </label>
    }
    <div>
      <input
        id="fileUpload"
        style={{ display: 'none' }}
        type="file"
        {...otherProps}
      />
      {error && <label className="errorLable">{error}</label>}
    </div>
  </div>
);
export default Input;
