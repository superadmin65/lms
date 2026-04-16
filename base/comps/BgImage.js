import React from 'react';
import styled from 'styled-components';
import { publicPath } from '../../utils';

const OverlayWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  color: #2d3237;
  display: flex;
  justify-content: center;
  align-items: center;
  & .content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

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
    z-index: -1;
    background-color: #bbbbbb;
    pointer-events: auto;
  }

  .body {
    background-color: white;
  }

  & .closebtn {
    cursor: pointer;
    font-size: 2rem;
    position: absolute;
    color: var(--d);
    top: 0px;
    right: 10px;
    z-index: 100;
  }

  @media print {
    display: none;
  }

  .bgSeg {
    display: flex;
    justify-content: center;
    align-items: center;

    background-size: cover !important;
    background-repeat: no-repeat !important;
  }
`;

class Overlay extends React.Component {
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
        <div
          className="background"
          onClick={(e) => {
            /*  e.stopPropagation();
            e.preventDefault();*/
          }}
        />
        {children}
        {/*
          <div
          className="bgSeg"
          style={
            this.props.winWidth < 600
              ? {
                  background: `url(${publicPath(`/img/bg/mobilebg${Math.floor(
                    Math.random() * 7
                  )}.jpg`)})`,
                  width: `100vw`,
                  height: `100vh`,
                  paddingTop: '50px'
                }
              : {
                  background: `url(${publicPath(`/img/bg/${this.props.bg.bgImg}`)})`,
                  width: `${this.props.bg.imgWidth}px`,
                  height: `${this.props.bg.imgHeight}px`,
                  backgroundPosition: 'center'
                }
          }
        >
          <div className="content">{children}</div>
        </div>
        */}

        {onClose && (
          <div className="closebtn icon-times" onClick={onClose}>
            ×
          </div>
        )}
      </OverlayWrapper>
    );
  }
}

export default Overlay;
