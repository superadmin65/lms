import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { getPos, setStyles } from 'utils';
const Wrapper = styled.div`
  position: relative;
  user-select: none;
  touch-action: none;
  font-size: 0.8rem !important;
  color: var(--darkColor);
  transform-origin: left top;
  margin: 10px auto;
  background-color: white;

  & .tablewrap {
    border: 1px solid #aaa;
    box-sizing: border-box;
    position: absolute;
  }

  span {
    display: inline-block;
    box-sizing: border-box;
    padding: 0px;
    width: 40px;
    height: 40px;
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
    position: absolute;
    background-color: var(--lightHColor);
    left: 0;
    top: 0;
    display: none;
    pointer-events: none;
  }

  .activeCell {
    width: 40px;
    height: 40px;
    position: absolute;
    background-color: var(--mediumColor);
    left: 0;
    top: 0;
    display: none;
    pointer-events: none;
  }

  .completedOnes {
    position: absolute;
    .selector {
      background-color: #ff87e0;
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

export default function CrosswordTable(props) {
  const tableRef = useRef(null);
  const noOfRows = props.table.length;
  const noOfCols = props.table[0].length;
  let size = 40;
  let width = props.table[0].length * 40;
  let scale = 1;
  if (window.innerWidth < width) {
    scale = window.innerWidth / width;
    size = size * scale;
  }

  useEffect(() => {
    if (scale !== 1) {
      tableRef.current.style.transform = `scale(${scale})`;
    }
  });
  const bw = 2;
  const onMouseDown = (e) => {
    if (props.active === false) {
      return;
    }
    let box = tableRef.current.getBoundingClientRect();
    box = { x: box.left, y: box.top };
    let pos = getPos(e);
    let initY = Math.floor((pos.y - box.y) / size);
    let initX = Math.floor((pos.x - box.x) / size);
    props.onSelect({ x: initX, y: initY });
  };

  return (
    <Wrapper
      ref={tableRef}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      style={{ width: noOfCols * 40 + 2, height: noOfRows * 40 + 2 }}
    >
      <span
        className="selector"
        style={props.selected ? getSelectorStyle(props.selected) : {}}
      />
      <span
        className="activeCell"
        style={props.pos ? getActiveCell(props.pos) : {}}
      />
      <div className="tablewrap">
        {[...Array(noOfRows)].map((e, i) => {
          return (
            <div key={i}>
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
    </Wrapper>
  );
}

function getActiveCell(pos) {
  return {
    display: 'block',
    left: pos.x * 40,
    top: pos.y * 40
  };
}

function getSelectorStyle({ marker, direction, word }) {
  const length = word.length;
  let size = 40;
  let x, y, width, height;
  switch (direction) {
    case 'across':
      x = marker.x;
      y = marker.y;
      height = 1;
      width = length;
      break;
    case 'down':
      x = marker.x;
      y = marker.y;
      height = length;
      width = 1;
      break;
    case 'across2':
      x = marker.x - length + 1;
      y = marker.y;
      height = 1;
      width = length;
      break;
    case 'down2':
      x = marker.x;
      y = marker.y - length + 1;
      height = length;
      width = 1;
      break;
  }
  return {
    left: x * size,
    top: y * size,
    width: width * size,
    height: height * size,
    display: 'block'
  };
}
