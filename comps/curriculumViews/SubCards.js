import styled from "styled-components";
import { Button, ButtonBar } from "base/comps";
import { publicPath } from "../../utils";

const Styled = styled.div`
  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1400px;
  }

  .card {
    border: 1px solid #999;
    box-shadow: var(--shadow);
    margin: 20px;
    max-width: 400px;
    padding: 20px 20px 40px 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .label {
    text-align: center;
    margin-bottom: 15px;
  }

  .desc {
    flex-grow: 1;
  }

  h1 {
    text-align: center;
  }

  button {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .cardIcon {
    margin-top: -20px;
    margin-bottom: 20px;
  }
`;

export default function SubCards(props) {
  console.log("SubCards", props.toc.list);
  return (
    <Styled>
      <h1>{props.toc.label}</h1>
      <div className="cards">
        {props.toc.list.map((item, i) => (
          <div className="card" style={item.style || {}}>
            <div className="label">
              {item.labelPrefix && (
                <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                  {item.labelPrefix}
                </span>
              )}
              {item.label}
              {item.altLabel ? ` ( ${item.altLabel} ) ` : ""}
            </div>
            <div style={{ display: "flex" }}>
              <div className="desc">{item.desc}</div>
              {item.icon && (
                <img
                  className="cardIcon"
                  src={publicPath("/" + item.icon)}
                  style={props.toc.iconStyle || {}}
                />
              )}
            </div>
            {/* <Button primary onClick={() => props.onSelect(i)}>
              Start
            </Button> */}
            <button
              onClick={() => {
                console.log("🔥 BUTTON CLICKED:", i);
                console.log("👉 onSelect function:", props.onSelect);
                props.onSelect(i);
              }}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </Styled>
  );
}
