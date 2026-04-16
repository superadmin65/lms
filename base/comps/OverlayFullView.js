import React from 'react';
import styled from 'styled-components';
//import { isSmallScreen } from 'utils';

const isSmallScreen = () => false;

const OverlayWrapper = styled.div`
  opacity: 0;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  transform: translateX(1200px);
  border-left: 1px solid var(--darkColor);
  background-color: rgba(160, 160, 160, 0.7);
  transition: all 0.4s;
  color: #2d3237;
  &.active {
    transform: translateX(0);
    opacity: 1 !important;
  }

  & > .content {
    pointer-events: auto;
    right: 50px;
    top: 25px;
    /*width: calc(100vw - 100px);*/
    height: calc(100vh - 50px);
    position: absolute;
    background-color: var(--lightColor);
    box-shadow: 0 2px 1px 1px rgba(140, 150, 160, 0.5);
    display: flex;
    flex-direction: column;
    transition: width 0.4s;
    & > .title {
      font-size: 24px;
      font-family: 'Avenir-Medium', sans-serif;
      border-bottom: 1px solid #eee;
      background-color: var(--darkColor);
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
    }

    & > .body {
      flex-grow: 1;
    }

    @media only screen and (max-width: 600px) {
      right: 0;
      top: 0;
      height: auto;
      overflow-y: scroll;
    }
  }

  & .overlayClose {
    cursor: pointer;
  }

  @media print {
    display: none;
  }
`;

class OverlayFullView extends React.Component {
  constructor() {
    super();
    this.dragPanel = null;
    this.rootBox = {};
    this.dragOffset = null;
  }

  render() {
    const { title, children, onClose, ...otherProps } = this.props;
    return (
      <OverlayWrapper {...otherProps}>
        <div className="content">
          <div className="title">
            <div>{title}</div>
            <div>
              {onClose && (
                <span className="overlayClose icon-times" onClick={onClose}>
                  ×
                </span>
              )}
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </OverlayWrapper>
    );
  }
}

export default OverlayFullView;
