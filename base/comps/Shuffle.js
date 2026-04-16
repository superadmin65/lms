// import React, {useRef, useEffect} from 'react';
// import styled from 'styled-components';

// const Styled = styled.div`
//     position: relative;
//     .item2 {
//         position: relative;

//     }
// `

// export default function Shuffle(props) {

//     let offsets;
//     const elRefs = useRef([]);
//     let offsetX;
//     let offsetY;
//     let localX;
//     let localY;
//     let dragIndex;
//     let itemRef;
//     const isVertical = true;

//     useEffect(() => {
//       offsets = [];
//       elRefs.current.forEach((itemRef, i) => {
//         if (itemRef) {
//           const rect = itemRef.getBoundingClientRect();
//           if(isVertical){
//             offsets.push(rect.top + rect.height / 2);
//           }else{
//             offsets.push(rect.left + rect.width / 2);
//           }
//         }
//       });
//     });
//     const onMouseDown = (e,i) => {
//         if(props.review){
//             return;
//         }
//         e.stopPropagation();
//         e.preventDefault();
//         const wrapper = document.querySelector('.wrapper');
//         if(wrapper){
//           wrapper.style.touchAction = "none";
//         }
//        // let i = elRefs.current.findIndex(el => el === e.target);

//         offsetX = e.clientX || e.touches[0].clientX;
//         offsetY = e.clientY || e.touches[0].clientY;
//         dragIndex = i;
//         itemRef = elRefs.current[i];
//         itemRef.style.zIndex = 1;
//         localX = offsetX - e.target.getBoundingClientRect().left;
//         localY = offsetY - e.target.getBoundingClientRect().top;
//         document.addEventListener("mousemove", onMouseMove);
//         document.addEventListener("mouseup", onMouseUp);
//         document.addEventListener("touchmove", onMouseMove);
//         document.addEventListener("touchend", onMouseUp);
//       };
    
//       const onMouseMove = e => {
//         if(isVertical){
//           itemRef.style.left = "20px";
//           itemRef.style.top = `${(e.clientY || e.touches[0].clientY) - offsetY}px`;
//         }else{
//           itemRef.style.left = `${(e.clientX || e.touches[0].clientX) - offsetX}px`;
//           itemRef.style.top = "20px";
//         }
       
//         // itemRef.style.top = `${(e.clientY || e.touches[0].clientY) - offsetY}px`;
//       };
    
//       function onMouseUp(e) {
//         //const rect1 = imgRef.current.getBoundingClientRect();
//         const rect2 = itemRef.getBoundingClientRect();
//         itemRef.style.zIndex = "";
    
//         itemRef.style.left = 0;
//         itemRef.style.top = 0;
//         let pos;
//         if(isVertical){
//           pos = rect2.top + rect2.height / 2;
//         }else{
//           pos = rect2.left + rect2.width / 2;
//         }
//         let ordered = [...Array(offsets.length)].map((item, i) => i);
//         if (offsets[dragIndex] > pos) {
//           for (let i = 0; i < dragIndex; i++) {
//             if (offsets[i] > pos) {
//               const temp = ordered[dragIndex];
//               let answer = [
//                 ...ordered.slice(0, dragIndex),
//                 ...ordered.slice(dragIndex + 1)
//               ];
//               answer = [...answer.slice(0, i), temp, ...answer.slice(i)];
//               props.onRearrange(answer);
//               break;
//             }
//           }
//         } else {
//           for (let i = offsets.length - 1; i > dragIndex; i--) {
//             if (offsets[i] < pos) {
//               const temp = ordered[dragIndex];
//               let answer = [
//                 ...ordered.slice(0, dragIndex),
//                 ...ordered.slice(dragIndex + 1)
//               ];
//               answer = [...answer.slice(0, i), temp, ...answer.slice(i)];
//               props.onRearrange(answer);
//               break;
//             }
//           }
//         }
//         document.removeEventListener("mousemove", onMouseMove);
//         document.removeEventListener("mouseup", onMouseUp);
//         document.removeEventListener("touchmove", onMouseMove);
//         document.removeEventListener("touchend", onMouseUp);
//       }

//     return (<Styled className="wrapper">
//         {
//             props.children.map((item, i) => (
//             <div className="item2" ref={el => (elRefs.current[i] = el)} onMouseDown={e => onMouseDown(e,i)} onTouchStart={e => onMouseDown(e,i)}>
//                 {item}
//             </div>))
//         }
//     </Styled>)

//     return (
//         <Styled>
//             {props.answer.map((item, i) => (
//               <div className="itemWrap">
//             <div
//               ref={el => (elRefs.current[i] = el)}
//               className="item"
//               style={props.style || {}}
//               onMouseDown={e => onMouseDown(e)}
//               onTouchStart={e => onMouseDown(e)}
//             >
//               {item.label || item}
//             </div>
//             {
//               props.review && 
//                 (props.review[i] === item ? (
//                   <span className="tick">✓</span>
//                 ) : (
//                   <span className="cross">✗</span>
//                 ))
//             }
//             </div>
//           ))}
//           {props.children}
//         </Styled>
//     )
// }


import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Styled = styled.div`
  position: relative;

  .itemWrap, .item2 {
    position: relative;
    margin-bottom: 10px;
    cursor: grab;
  }

  .tick {
    color: green;
    margin-left: 10px;
  }

  .cross {
    color: red;
    margin-left: 10px;
  }
`;

export default function Shuffle({ answer = [], children = [], review = [], onRearrange, style }) {
  const elRefs = useRef([]);
  const offsetsRef = useRef([]);
  const itemRef = useRef(null);
  const dragIndexRef = useRef(null);
  const localXYRef = useRef({ x: 0, y: 0 });
  const [isVertical] = useState(true);
  const options = Shuffle([...rawOptions]) || rawOptions;


  // Calculate offsets on mount or children/answer change
  useEffect(() => {
    offsetsRef.current = [];
    elRefs.current.forEach((el) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        offsetsRef.current.push(isVertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2);
      }
    });
  }, [children, answer, isVertical]);

  const onMouseDown = (e, i) => {
    if (!elRefs.current[i]) return;

    e.stopPropagation();
    e.preventDefault();

    itemRef.current = elRefs.current[i];
    dragIndexRef.current = i;

    const rect = itemRef.current.getBoundingClientRect();
    localXYRef.current = {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top,
    };

    itemRef.current.style.zIndex = 1;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!itemRef.current) return;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    if (isVertical) {
      itemRef.current.style.left = '0px';
      itemRef.current.style.top = `${clientY - localXYRef.current.y}px`;
    } else {
      itemRef.current.style.left = `${clientX - localXYRef.current.x}px`;
      itemRef.current.style.top = '0px';
    }
  };

  const onMouseUp = () => {
    if (!itemRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    itemRef.current.style.zIndex = '';
    itemRef.current.style.left = 0;
    itemRef.current.style.top = 0;

    const pos = isVertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;

    const offsets = offsetsRef.current;
    const dragIndex = dragIndexRef.current;
    let ordered = [...Array(offsets.length).keys()];

    if (offsets[dragIndex] > pos) {
      for (let i = 0; i < dragIndex; i++) {
        if (offsets[i] > pos) {
          const temp = ordered[dragIndex];
          let answerArr = [...ordered.slice(0, dragIndex), ...ordered.slice(dragIndex + 1)];
          answerArr = [...answerArr.slice(0, i), temp, ...answerArr.slice(i)];
          onRearrange(answerArr);
          break;
        }
      }
    } else {
      for (let i = offsets.length - 1; i > dragIndex; i--) {
        if (offsets[i] < pos) {
          const temp = ordered[dragIndex];
          let answerArr = [...ordered.slice(0, dragIndex), ...ordered.slice(dragIndex + 1)];
          answerArr = [...answerArr.slice(0, i), temp, ...answerArr.slice(i)];
          onRearrange(answerArr);
          break;
        }
      }
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onMouseMove);
    document.removeEventListener('touchend', onMouseUp);

    itemRef.current = null;
    dragIndexRef.current = null;
  };

  const renderAnswerItems = () =>
    answer.map((item, i) => (
      <div className="itemWrap" key={i}>
        <div
          ref={(el) => (elRefs.current[i] = el)}
          className="item2"
          style={style || {}}
          onMouseDown={(e) => onMouseDown(e, i)}
          onTouchStart={(e) => onMouseDown(e, i)}
        >
          {item.label || item}
        </div>
        {review[i] &&
  (review[i] === item
    ? <span className="tick">✓</span>
    : <span className="cross">✗</span>
  )
}
      </div>
    ));

  const renderChildrenItems = () =>
    children.map((child, i) => (
      <div
        key={i}
        className="item2"
        ref={(el) => (elRefs.current[i] = el)}
        onMouseDown={(e) => onMouseDown(e, i)}
        onTouchStart={(e) => onMouseDown(e, i)}
      >
        {child}
      </div>
    ));

  return <Styled className="wrapper">{answer.length ? renderAnswerItems() : renderChildrenItems()}</Styled>;
}
