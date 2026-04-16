import styled from 'styled-components';

const ButtonBar = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.align === 'left' ? 'flext-start' : 'flex-end'};
  margin: 20px 0;
  align-items: flex-start;
  & > * {
    margin-left: 20px;
  }
  flex-wrap: wrap;
  align-items: center;
  @media print {
    display: none;
  }

  @media screen and (max-width: 500px) {
    /*display: none;*/
  }
`;

export default ButtonBar;
