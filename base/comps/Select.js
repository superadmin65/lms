// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import InputWrap from './InputWrap';
// import Svg from 'components/Svg';
// const Styled = styled.div`
//   width: ${(props) => props.width || '130px'};
//   position: relative;
//   min-height: 35px;
//   .control {
//     display: flex;
//     cursor: pointer;
//     border-bottom: 1px solid #ccc;
//     padding: 3px;
//     .placeholder {
//       flex-grow: 1;
//       overflow: hidden;
//       width: calc(100% -15px);
//       white-space: nowrap;
//       text-overflow: ellipsis;
//     }
//   }
//   .menu {
//     background-color: white;
//     max-height: 400px;
//     overflow-y: auto;
//     position: absolute;
//     top: 0;
//     width: 100%;
//     z-index: 1000;
//     box-shadow: var(--shadow);
//     > div {
//       padding: 5px 7px;
//       cursor: pointer;
//       border-bottom: 1px solid #ccc;
//       &:hover {
//         background-color: var(--lightColor);
//       }

//       &.selected {
//         background-color: var(--lightHColor);
//       }
//     }
//   }
// `;

// export default function Select(props) {
//   const [state, setState] = useState({ open: false });
//   let options = props.options;
//   if (typeof options[0] === 'string') {
//     options = options.map((str) => ({ label: str, value: str }));
//   }
//   let selected = options.find(
//     (option) => option.value === props.value || option.id === props.value
//   );

//   useEffect(() => {
//     document.addEventListener('click', outsideClick);

//     return () => {
//       document.removeEventListener('click', outsideClick);
//     };
//   });

//   const outsideClick = () => setState((state) => ({ ...state, open: false }));
//   return (
//     <InputWrap label={props.label} sameLine={props.sameLine || false}>
//       <Styled
//         width={props.width}
//         tabIndex="0"
//         onBlur={() => {
//           //setState({ ...state, open: false });
//         }}
//       >
//         {!state.open && (
//           <div
//             className="control"
//             onClick={(e) => {
//               e.stopPropagation();
//               setState({ ...state, open: true });
//             }}
//           >
//             <div className="placeholder">
//               {selected ? selected.label : 'Select'}
//             </div>
//             <Svg
//               id="caretDown"
//               size="12"
//               style={{ position: 'absolute', right: 10, top: 10 }}
//             />
//           </div>
//         )}
//         {state.open && (
//           <div className="menu">
//             {options.map((item) => (
//               <div
              
//                 onClick={() => {
//                   props.onChange(item);
//                   setState({ ...state, open: false });
//                 }}
//               >
//                 {item.label}{' '}
//               </div>
//             ))}
//           </div>
//         )}
//         {/*
// <DropDownMini
//             width={props.width || 200}
//             options={props.options}
//             onChange={props.onChange}
//             value={props.value}
//             disabled={props.disabled}
//             />
//             */}
//       </Styled>
//     </InputWrap>
//   );
// }


import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputWrap from './InputWrap';
import Svg from 'components/Svg';

const Styled = styled.div`
  width: ${(props) => props.width || '130px'};
  position: relative;
  min-height: 35px;

  .control {
    display: flex;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
    padding: 3px;

    .placeholder {
      flex-grow: 1;
      overflow: hidden;
      width: calc(100% - 15px);
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .menu {
    background-color: white;
    max-height: 400px;
    overflow-y: auto;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: var(--shadow);

    > div {
      padding: 5px 7px;
      cursor: pointer;
      border-bottom: 1px solid #ccc;

      &:hover {
        background-color: var(--lightColor);
      }

      &.selected {
        background-color: var(--lightHColor);
      }
    }
  }
`;

export default function Select(props) {
  const [state, setState] = useState({ open: false });

  // Convert string array → {label, value}
  let options = props.options;
  if (typeof options[0] === 'string') {
    options = options.map((str) => ({ label: str, value: str }));
  }

  const selected = options.find(
    (option) => option.value === props.value || option.id === props.value
  );

  // --- FIXED: outsideClick must be declared BEFORE useEffect
  const outsideClick = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  // --- FIXED: added dependency array & ensured function exists
  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, []);

  return (
    <InputWrap label={props.label} sameLine={props.sameLine || false}>
      <Styled width={props.width} tabIndex="0">
        {!state.open && (
          <div
            className="control"
            onClick={(e) => {
              e.stopPropagation();
              setState({ ...state, open: true });
            }}
          >
            <div className="placeholder">
              {selected ? selected.label : 'Select'}
            </div>
            <Svg
              id="caretDown"
              size="12"
              style={{ position: 'absolute', right: 10, top: 10 }}
            />
          </div>
        )}

        {state.open && (
          <div className="menu">
            {options.map((item, i) => (
              <div
                key={item.value || item.id || i}   // ✅ FIX: key added
                onClick={() => {
                  props.onChange(item);
                  setState({ ...state, open: false });
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </Styled>
    </InputWrap>
  );
}
