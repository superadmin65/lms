import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getPos, setStyles } from 'utils';

const blink = keyframes`
0% {
    background-color: orange;
  }
  100% {
    background-color: white;
  }
`;

const Wrapper = styled.div`
  position: relative;
  user-select: none;
  touch-action: none;
  font-size: 0.8rem !important;
  color: var(--darkColor);
  transform-origin: left top;
  margin: 10px auto;
  background-color: white;

  .hint {
    position: absolute;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    border-radius: 50%;
    background-color: #f663e7;
    animation: ${blink} 0.6s linear infinite alternate;
  }

  & .tablewrap {
    border: 1px solid #aaa;
    box-sizing: border-box;
    position: absolute;
  }

  span {
    display: inline-block;
    box-sizing: border-box;
    padding: 0px;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    font-size: 1.3em;
    overflow: hidden;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    cursor: default;
    text-align: center;
    vertical-align: middle;
    &.selected {
      background-color: #fbb;
    }
    padding-top: 8px;

    &.mid {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.small {
      width: 30px;
      height: 30px;
      border-width: 1px;
      font-size: 20px;
    }

    &.large {
      width: 60px;
      height: 60px;
      border-width: 4px;
      font-size: 30px;
    }
  }

  .selector {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid red;
    position: absolute;
    margin: 4px 0;
    left: 0;
    top: 0;
    display: none;
    pointer-events: none;
  }

  .completedOnes {
    position: absolute;
    .selector {
      background-color: orange;
      border: 1pt solid white;
    }
  }
  @media print {
    & .tablewrap {
      box-shadow: none;
    }
  }

  @media screen and (max-width: 500px) {
    margin: 0 auto;
  }
`;

export default function WordSearchTable(props) {
  const tableRef = useRef(null);
  const selectorRef = useRef(null);
  const noOfRows = props.table.length;
  const noOfCols = props.table[0].length;
  let size = props.size || 40;
  let width = props.table[0].length * size;
  let scale = 1;
  if (window.innerWidth < width) {
    scale = window.innerWidth / width;
    size = size * scale;
  }

  useEffect(() => {
    tableRef.current.addEventListener('mousedown', onMouseDown);
    tableRef.current.addEventListener('touchstart', onMouseDown);
    if (scale !== 1) {
      tableRef.current.style.transform = `scale(${scale})`;
    }

    return () => {
      if (tableRef && tableRef.current) {
        tableRef.current.removeEventListener('mousedown', onMouseDown);
        tableRef.current.removeEventListener('touchstart', onMouseDown);
      }
    };
  });
  const bw = 2;
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.active === false) {
      return;
    }

    let box = tableRef.current.getBoundingClientRect();
    box = { x: box.left, y: box.top };
    let pos = getPos(e);
    let initY = Math.floor((pos.y - box.y) / size);
    let initX = Math.floor((pos.x - box.x) / size);
    if (initX >= noOfCols || initY >= noOfRows) {
      return;
    }

    let finalX = initX;
    let finalY = initY;
    let obj = getSelectorStyle(initX, initY, finalX, finalY, size);
    setStyles(selectorRef.current, obj);
    const onMouseMove = (e) => {
      const pos = getPos(e);
      finalY = Math.floor((pos.y - box.y) / size);
      finalX = Math.floor((pos.x - box.x) / size);
      if (
        finalY >= noOfRows ||
        finalX >= noOfCols ||
        finalY < 0 ||
        finalX < 0
      ) {
        return;
      }

      let obj = getSelectorStyle(initX, initY, finalX, finalY, size);
      setStyles(selectorRef.current, obj);
    };

    const onMouseUp = (e) => {
      let obj = getSelectorStyle(initX, initY, finalX, finalY, size, true);
      let length = Math.max(
        Math.abs(obj.finalX - obj.initX),
        Math.abs(obj.finalY - obj.initY)
      );
      if (props.allowSingleSelect || length > 0) {
        props.onSelectWord([obj.initX, obj.initY, obj.finalX, obj.finalY]);
      }

      if (!props.createMode) {
        setStyles(selectorRef.current, { display: 'none' });
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
  };
  return (
    <Wrapper
      ref={tableRef}
      size={size}
      style={{
        width: noOfCols * size + 2,
        height: noOfRows * size + 2
      }}
    >
      <div
        className="completedOnes"
        style={{ width: noOfCols * size + 2, height: noOfRows * size + 2 }}
      >
        {props.words.map((item, i) => (
          <span
            className="selector"
            style={{
              ...getSelectorStyle(...item.marker, size),
              backgroundColor: props.colors ? props.colors[i] : 'orange'
            }}
          />
        ))}
      </div>
      {props.hint && (
        <span
          className="hint"
          style={{ left: props.hint[0] * size, top: props.hint[1] * size }}
        />
      )}
      <div className="tablewrap">
        {[...Array(noOfRows)].map((e, i) => {
          return (
            <div key={i} style={{ display: 'flex', fontSize: props.fontSize }}>
              {[...Array(noOfCols)].map((e, j) => {
                let id = i + '~' + j;

                return (
                  <span key={id} id={id} className="mid">
                    {props.table[i][j]}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      <span
        ref={selectorRef}
        className="selector"
        style={props.pos ? getSelectorStyle(...props.pos, size) : {}}
      />
    </Wrapper>
  );
}

function getSelectorStyle(initX, initY, finalX, finalY, size, isMouseUp) {
  let angle = Math.atan2(initY - finalY, finalX - initX) * (180 / Math.PI);
  angle = 360 - angle;
  angle = Math.round(angle / 45) * 45;

  let diffX = Math.abs(finalX - initX);
  let diffY = Math.abs(finalY - initY);

  let len;
  if (angle % 90 == 0) {
    len = Math.max(diffX, diffY);
    if (len == diffX) {
      finalY = initY;
    } else {
      finalX = initX;
    }
    len *= size;
    len += size;
  } else {
    let diag = Math.sqrt(2 * size * size);
    len = Math.min(diffX, diffY);

    if (len == diffX) {
      finalY = initY + ((finalY - initY) / Math.abs(finalY - initY)) * diffX;
    } else {
      finalX = initX + ((finalX - initX) / Math.abs(finalX - initX)) * diffY;
    }
    len *= diag;
    len += diag;
    len += 2;
    len = len - size / 2;
  }

  if (isMouseUp) {
    return { initX, initY, finalX, finalY };
  }

  let styles = {
    display: 'block',
    width: `${len}px`,
    height: `${size - 10}px`,
    left: `${initX * size}px`,
    top: `${initY * size}px`,
    transform: `rotate(${angle}deg)`,
    borderRadius: `${size / 2}px`,
    transformOrigin: `${(size - 1) / 2}px ${(size - 9) / 2}px`
  };
  return styles;
}
