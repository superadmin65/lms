import React from 'react';
import styled from 'styled-components';

const OverlayWrapper = styled.div`
  opacity: 0;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  background: rgba(
    0,
    0,
    0,
    ${(props) => (props.bgOpacity ? props.bgOpacity : 0)}
  );
  z-index: 100;
  transform: scale(0);
  transition: all 0.2s;
  color: #2d3237;
  &.active {
    transform: scale(1);
    opacity: 1 !important;
  }

  & .overlayContent {
    pointer-events: auto;
    left: ${(props) => `${props.left || 400}px`};
    top: ${(props) => `${props.top || 300}px`};
    width: ${(props) => `${props.width || 400}px`};
    height: ${(props) => (props.height ? `${props.height}px` : 'auto')};
    overflow-y: auto;
    position: absolute;
    background-color: ${(props) => props.bgColor || 'white'};
    box-shadow: 0 2px 1px 1px rgba(140, 150, 160, 0.5);

    @media (max-width: 500px) {
      left: 0;
      top: 100px;
      width: 100%;
    }
  }

  .background {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    /* filter: blur(1rem);*/
    background-color: #bbbbbb;
    opacity: 0.3;
    pointer-events: auto;
  }

  .body {
    padding: ${(props) => props.padding || '10px'};
    background-color: ${(props) => props.bgColor || 'white'};
  }

  & .overlayClose {
    cursor: pointer;
  }

  & .title {
    font-size: 24px;
    font-family: 'Avenir-Medium', sans-serif;
    border-bottom: 1px solid #eee;
    background-color: var(--darkColor2);
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }

  @media print {
    display: none;
  }
`;

class Overlay extends React.Component {
  constructor() {
    super();
    this.dragPanel = null;
    this.rootBox = {};
    this.dragOffset = null;
  }
  panelDragStart = (e) => {
    e.preventDefault();
    this.dragPanel = e.currentTarget.parentNode;
    this.dragOffset = {
      x: e.clientX - this.dragPanel.getBoundingClientRect().left,
      y: e.clientY - this.dragPanel.getBoundingClientRect().top
    };
    this.rootBox = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    document.addEventListener('mousemove', this.panelDragMove);
    document.addEventListener('mouseup', this.panelDragStop);
  };

  panelDragMove = (e) => {
    let x = e.clientX - this.dragOffset.x;
    if (x < this.rootBox.left) x = this.rootBox.left;
    if (
      x >
      this.rootBox.left +
        this.rootBox.width -
        this.dragPanel.getBoundingClientRect().width
    ) {
      x =
        this.rootBox.left +
        this.rootBox.width -
        this.dragPanel.getBoundingClientRect().width;
    }

    let y = e.clientY - this.dragOffset.y + window.scrollY;
    if (y < this.rootBox.top) y = this.rootBox.top;
    if (
      y >
      this.rootBox.top +
        this.rootBox.height -
        this.dragPanel.getBoundingClientRect().height
    ) {
      y =
        this.rootBox.top +
        this.rootBox.height -
        this.dragPanel.getBoundingClientRect().height;
    }
    this.dragPanel.style.left = `${x}px`;
    this.dragPanel.style.top = `${y - window.scrollY}px`;
  };

  panelDragStop = (e) => {
    document.removeEventListener('mousemove', this.panelDragMove);
    document.removeEventListener('mouseup', this.panelDragStop);
  };

  render() {
    const { title, children, onClose, ...otherProps } = this.props;
    return (
      <OverlayWrapper {...otherProps}>
        <div
          className="background"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
        <div className="overlayContent">
          <div className="title" onMouseDown={this.panelDragStart}>
            <div>{title}</div>
            {onClose && (
              <div className="overlayClose icon-times" onClick={onClose}>
                ×
              </div>
            )}
          </div>
          <div className="body">{children}</div>
        </div>
      </OverlayWrapper>
    );
  }
}

export default Overlay;
