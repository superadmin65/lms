import styled from "styled-components";
import { Button, ButtonBar } from "base/comps";
import { publicPath } from "../../utils";

const Styled = styled.div`
  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    max-width: 100%;
    background: var(--l);
    color: #a6b0cf;
    gap: 20px;
    padding: 5px;
  }

  .card {
    border: 1px solid white;
    box-shadow: var(--shadow);
    margin-top: 20px;
    max-width: 230px;
    color: #2b7d10;
    padding: 15px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: #dbf7c3;
    transition: 0.3s ease;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-8px);
  }

  .label {
    font-size: 1.75rem;
    color: #2b7d10;
    text-align: center;
    font-family: "Poppins", sans-serif;
  }
  .subLabel {
    margin-bottom: 5px;
    font-size: 1.25rem;
    color: #2b7d10;
    text-align: center;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
  }

  .desc {
    flex-grow: 1;
    font-size: 0.8rem;
    text-align: center;
    font-family: "Poppins", sans-serif;
  }

  h1 {
    font-size: 2.4rem;
    margin: 0 auto 8px;
    padding-top: 20px;
    font-weight: 800;
    text-align: center;
    background: var(--l);
    color: #2b7d10;
    text-shadow: 2px 2px 5px rgba(93, 185, 98, 0.5);
  }

  button {
    position: absolute;
    background: #0b8a1c;
    border-radius: 10px;
    border: none;
    color: white;
    padding: 5px 30px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  button:hover {
    transform: scale(1.15);
  }

  .cardIcon {
  }
  .imageDiv {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
`;

export default function SubCards(props) {
  console.log("SubCards", props.toc.list);
  return (
    <Styled>
      <div style={{ paddingBottom: "40px", backgroundColor: "var(--l)" }}>
        <h1>{props.toc.label}</h1>
        <div className="cards">
          {console.log(props.toc.list)}
          <div></div>

          {props.toc.list.map((item, i) => (
            <div
              className="card"
              onClick={() => {
                console.log("🔥 TAB CLICKED:", i);
                console.log("👉 onSelect function:", props.onSelect);
                props.onSelect(i);
              }}
            >
              <div className="imageDiv">
                {item.icon && (
                  <img
                    className="cardIcon"
                    src={publicPath("/" + item.icon)}
                    style={{ width: "200px", height: "120px" }}
                  />
                )}
              </div>
              <div>
                {(() => {
                  const parts = item.label.split(" - ");
                  return (
                    <>
                      <div className="label">{parts[0]}</div>
                      <div className="subLabel"> {parts[1]}</div>
                    </>
                  );
                })()}
              </div>

              <div className="desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Styled>
  );
}
