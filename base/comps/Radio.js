// import styled from "styled-components";
// import React from "react";

// const CheckboxWrapper = styled.div`
//   outline: none;
//   margin: 10px 0;
//   & input[type="checkbox"] {
//     width: 16px;
//     height: 16px;
//     display: inline-block;
//     border-radius: 4px;
//     vertical-align: middle;
//     border: ${props => (props.checked ? "2px solid transparent" : "2px solid #cccccc")};
//     outline: none;
//     transform: scale(1.5);
//   }

//   & .contentWrap {
//     display: inline-block;
//     margin-left: 10px;
//     cursor: pointer;
//   }
// `;

// const Radio = ({ onClick, options, value, name }) => (
//   <div>
//     {options.map((item, i) => (
//       <div onClick={() => onClick(item.value)}>
//         <input
//           type="radio"
//           checked={item.value === value}
//           name={name}
//           value={item.value}
//         />
//         <label>{item.label}</label>
//       </div>
//     ))}
//   </div>
// );

// export default Radio;


import styled from "styled-components";
import React from "react";

const CheckboxWrapper = styled.div`
  outline: none;
  margin: 10px 0;

  & input[type="radio"] {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    transform: scale(1.3);
  }

  & .contentWrap {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
`;

const Radio = ({ onClick, options, value, name }) => (
  <div>
    {options.map((item, i) => (
      <CheckboxWrapper key={i} checked={item.value === value}>
        <input
          type="radio"
          checked={item.value === value}
          name={name}
          value={item.value}
          onChange={() => onClick(item.value)}
        />
        <label>{item.label}</label>
      </CheckboxWrapper>
    ))}
  </div>
);

export default Radio;
