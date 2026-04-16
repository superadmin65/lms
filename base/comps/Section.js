import styled from "styled-components";
import React from "react";

const SectionWrapper = styled.div`
  margin: 10px;
  padding: 15px;
  & h2 {
    font-size: 24px;
    letter-spacing: 0;
    display: block;
    margin-bottom: 15px;
    font-weight: normal;
    font-family: var(--font1);
  }

  .sec-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > .sectionBody {
    background: white;
    height: auto;
    box-shadow: 0 2px 1px 1px rgba(140, 150, 160, 0.5);
    border-radius: 3px;
    padding: 20px 0;
    margin-bottom: 25px;
    margin-left: 2px;
    padding: 20px;
    min-width: 300px;

    @media print {
      box-shadow: none;
    }
  }

  label {
    font-weight: bold;
    font-size: 0.8rem;
  }
  /*
  @media screen and (max-width: 500px) {
    padding: 0;
    margin: 10px 0;
    & > .sectionBody {
      box-shadow: none;
      padding: 10px 5px;
      width: 100%;
    }
  }*/
`;

const Section = ({ title, style, children, btnBar }) => (
  <SectionWrapper>
    <div className='sec-head'>
      <h2>{title}</h2>
      {btnBar}
    </div>

    <div className='sectionBody' style={style}>
      {children}
    </div>
  </SectionWrapper>
);

export default Section;
