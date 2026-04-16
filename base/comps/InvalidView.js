import React from 'react';
import styled from 'styled-components';
import { Button, ButtonBar } from './index';

const Styled = styled.div`
  .msg {
    padding: 20px;
    margin: 10px;
    margin-top: 60px;
    background-color: white;
    box-shadow: var(--shadow);
  }
`;

export default function InvalidView(props) {
  return <div>{props.children}</div>;
  /*
  const navigate = useNavigate();
  return (
    <Styled>
      <div className="msg">{props.children}</div>
      <ButtonBar>
        {props.backTo === 'login' && (
          <Button primary onClick={() => navigate('/login', { replace: true })}>
            Back To Login
          </Button>
        )}
        {!props.backTo && (
          <Button primary onClick={() => navigate(-1)}>
            Go Back
          </Button>
        )}
      </ButtonBar>
    </Styled>
  );
  */
}
