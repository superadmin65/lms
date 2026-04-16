import React from 'react';
import styled from 'styled-components';

const Styled = styled.div`
  pointer-events: auto;
  left: ${(props) => `${props.left || 400}px`};
  top: ${(props) => `${props.top || 300}px`};
  width: ${(props) => `${props.width || 400}px`};
  height: ${(props) => (props.height ? `${props.height}px` : 'auto')};
  overflow-y: auto;
  position: absolute;
  background-color: #f6f6f8;
  box-shadow: 0 2px 1px 1px rgba(140, 150, 160, 0.5);
  z-index: 1;
  .body {
    background-color: white;
    min-height: 100px;
    max-height: 400px;
  }

  & .overlayClose {
    cursor: pointer;
  }

  & .title {
    font-size: 16px;
    font-family: 'Avenir-Medium', sans-serif;
    border-bottom: 1px solid #eee;
    background-color: #038193;
    color: white;
    padding: 3px 10px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
`;

class Popup extends React.Component {
  constructor() {
    super();
    this.dragPanel = null;
    this.rootBox = {};
    this.dragOffset = null;
    this.parentRect = {};
  }

  panelDragStart = (e) => {
    e.preventDefault();
    this.dragPanel = e.currentTarget.parentNode;
    this.parentRect = document
      .getElementById('canvasParent')
      .getBoundingClientRect();
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
    let x = e.clientX - this.dragOffset.x; // - this.parentRect.left;
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

    let y = e.clientY - this.dragOffset.y + window.scrollY; // - this.parentRect.top;
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
      <Styled {...otherProps}>
        <div
          className={`title ${this.props.smallTitle ? 'small' : ''}`}
          onMouseDown={this.panelDragStart}
        >
          <div>{title}</div>
          {onClose && (
            <div className="overlayClose icon-times" onClick={onClose}>
              ×
            </div>
          )}
        </div>
        <div className="body">{children}</div>
      </Styled>
    );
  }
}

export default Popup;
