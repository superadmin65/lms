// import styled from 'styled-components';
// import { useState } from 'react';
// import Svg from 'components/Svg';

// const Styled = styled.div`
//   .closeBtn {
//     cursor: pointer;
//     color: red;
//     display: inline-block;
//     margin-left: 10px;
//   }

//   .text {
//     display: inline-block;
//     border-radius: 10px;
//     background-color: var(--h);
//     padding: 3px 10px;
//     text-align: center;
//     min-width: 50px;
//     margin: 0 5px;
//   }

//   input {
//     width: 200px;
//   }
// `;

// export default function Labels(props) {
//   const [state, setState] = useState({
//     editMode: false,
//     typeInProg: ''
//   });

//   const addLabel = () => {
//     if (state.typeInProg.trim().length < 3) {
//       setState({
//         ...state,
//         errorMsg: 'A label should have atleast 3 letters.'
//       });
//       return;
//     }

//     const newList = [...props.list, state.typeInProg];
//     props.update(newList);
//     setState({
//       ...state,
//       editMode: false
//     });
//   };

//   return (
//     <Styled>
//       <div>
//         {<span className="key">{props.label}</span>}
//         {props.list.length === 0 && <span>[Empty]</span>}
//         {props.list.map((item) => (
//           <span className="text">
//             <span>{item}</span>
//             {state.editMode && (
//               <span
//                 className="closeBtn"
//                 onClick={() =>
//                   props.update(props.list.filter((i) => i !== item))
//                 }
//               >
//                 x
//               </span>
//             )}
//           </span>
//         ))}
//         {!state.editMode && (
//           <Svg
//             id="pencil"
//             size="16"
//             color="var(--darkColor)"
//             onClick={(e) => {
//               setState({ ...state, editMode: true, typeInProg: '' });
//             }}
//           />
//         )}
//         {state.editMode && (
//           <>
//             <input
//               type="text"
//               value={state.typeInProg}
//               autoFocus
//               onChange={(e) =>
//                 setState({
//                   ...state,
//                   errorMsg: '',
//                   typeInProg: e.target.value
//                 })
//               }
//               onKeyUp={(e) => {
//                 e.key === 'Enter' && addLabel();
//               }}
//             />
//             <button onClick={addLabel}>Ok</button>
//             <button
//               onClick={() =>
//                 setState({ ...state, editMode: false, errorMsg: '' })
//               }
//             >
//               ❌
//             </button>
//           </>
//         )}
//       </div>
//     </Styled>
//   );
// }


import styled from 'styled-components';
import { useState } from 'react';
import Svg from 'components/Svg';

const Styled = styled.div`
  .closeBtn {
    cursor: pointer;
    color: red;
    display: inline-block;
    margin-left: 10px;
  }

  .text {
    display: inline-block;
    border-radius: 10px;
    background-color: var(--h);
    padding: 3px 10px;
    text-align: center;
    min-width: 50px;
    margin: 0 5px;
  }

  input {
    width: 200px;
  }
`;

export default function Labels(props) {
  const [state, setState] = useState({
    editMode: false,
    typeInProg: '',
    errorMsg: ''
  });

  const list = props.list || [];

  const addLabel = () => {
    if (state.typeInProg.trim().length < 3) {
      setState({ ...state, errorMsg: 'A label should have at least 3 letters.' });
      return;
    }

    const newList = [...list, state.typeInProg];
    props.update(newList);
    setState({ ...state, editMode: false, typeInProg: '' });
  };

  return (
    <Styled>
      <div>
        {props.label && <span className="key">{props.label}</span>}
        {list.length === 0 && <span>[Empty]</span>}
        {list.map((item, index) => (
          <span className="text" key={index}>
            <span>{item}</span>
            {state.editMode && (
              <span
                className="closeBtn"
                onClick={() => props.update(list.filter((i) => i !== item))}
              >
                x
              </span>
            )}
          </span>
        ))}
        {!state.editMode && (
          <Svg
            id="pencil"
            size="16"
            color="var(--darkColor)"
            onClick={() => setState({ ...state, editMode: true, typeInProg: '' })}
          />
        )}
        {state.editMode && (
          <>
            <input
              type="text"
              value={state.typeInProg}
              autoFocus
              onChange={(e) =>
                setState({ ...state, errorMsg: '', typeInProg: e.target.value })
              }
              onKeyUp={(e) => e.key === 'Enter' && addLabel()}
            />
            <button onClick={addLabel}>Ok</button>
            <button onClick={() => setState({ ...state, editMode: false, errorMsg: '' })}>
              ❌
            </button>
          </>
        )}
      </div>
    </Styled>
  );
}
