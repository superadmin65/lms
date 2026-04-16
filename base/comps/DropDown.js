import React from 'react';
import DropDownMini from '../core/DropDownMini';
import InputWrap from './InputWrap';

export default function DropDown(props) {
  return (
    <InputWrap label={props.label} sameLine={props.sameLine || false}>
      <DropDownMini
        width={props.width || 200}
        options={props.options}
        onChange={props.onChange}
        value={props.value}
        disabled={props.disabled}
      />
    </InputWrap>
  );
}
