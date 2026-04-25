import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { getImage, setLocalItem, getLocalItem, publicPath } from 'utils';

import {
  Section,
  Input,
  TextArea,
  Button,
  ButtonBar,
  Select,
  Checkbox,
  Overlay,
  ProgButton,
} from 'base/comps';
const Styled = styled.div`
  padding: 10px;
  // background-color: white;
  color: var(--darkColor);
  position: relative;
  user-select: none;

  max-width: 1024px;
  margin: 0 auto;
  h1 {
    font-size: 1.5rem;
    text-align: center;
    text-decoration: underline;
    font-style: italic;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .card {

    display: flex;
    .img {
      background-size: contain;
      background-repeat: no-repeat;
      margin: 0 auto;
    }

    .label,
    .smLabel {
      text-align: center;
    }

    .hoverdesc {
      position: absolute;
      left: -1000px;
      width: 300px;
      background-color: orange;
      padding: 10px;
      border-radius: 10px;
      color: white;
      top: 100px;
      box-shadow: var(--shadow);
      z-index: 1;
    }

    &:hover .hoverdesc {
      /*left: 0;*/
    }
  }

  .infobar {
    margin: -10px;
    padding: 5px 10px 15px 10px;
    font-size: 0.8rem;
    background-color: var(--darkColor2);
    color: white;

    a:hover {
      color: white;
    }
  }

  .desc {
    position: absolute;
    width: 300px;
    background-color: orange;
    padding: 10px;
    border-radius: 10px;
    color: white;
    top: 100px;
    left: 0;
  }

  .hilight {
    background-color: var(--darkColor2);
    box-shadow: var(--shadow);

    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 2px;
    a {
      color: white;
    }
  }

  .lang-contact {
    font-size: 0.9rem;
  }

  .flex-sb {
    display: flex;
    justify-content: space-around;
  }
`;

const defaultCardStyle = {
  width: 120,
  margin: '25px 0',
  borderRadius: 10,
};

const getIconStyle = (img, data) => {
  let iconStyle = data.iconStyle || {
    width: 80,
    height: 80,
  };

  const imgPath = getImage(`${data.iconsLoc || 'icons'}/${img}.png`);
  const resolveImg = (src) => {
    if (!src) return src;
    if (src.indexOf('http') === 0) return src;
    return publicPath(src.startsWith('/') ? src : `/${src}`);
  };

  iconStyle.backgroundImage = `url(${resolveImg(imgPath)})`;
  return iconStyle;
};

export default function IconView(props) {
  //const {title, menu, onPick} = props;
  let config = {}; //getLocalItem('config', {});

  let defaultGrade;
  const data = props.data;
  if (data.grades) {
    let defaultItem = data.grades.find((item) => item.default === true);
    if (defaultItem) {
      defaultGrade = defaultItem.id;
    }
  }
  let [state, setState] = useState({
    selectedGrade: config.selectedGrade || defaultGrade,
  });
  let menu = data.list;
  if (data.grades) {
    let matches = state.selectedGrade.match(/(\d+)/);
    let gradeNo = (matches && +matches[0]) || 0;
    menu = menu.filter((item) => {
      if (!item.grade) {
        return false;
      }
      let range = item.grade.split('-').map((no) => +no);
      if (range.length === 1) {
        return range[0] === gradeNo;
      } else {
        return range[0] <= gradeNo && range[1] >= gradeNo;
      }

      //item.grade.indexOf(state.selectedGrade) !== -1
    });
  }
  return (
    <Styled>
      <main>
        <div className="flex-sb">
          {data.label && <h1>{data.label}</h1>}
          {data.grades && (
            <Select
              width={150}
              options={data.grades}
              value={state.selectedGrade}
              bgColor="inherit"
              onChange={(e) => {
                config.selectedGrade = e.value;
                config.selectedSubject = 'all';
                setLocalItem('config', config);
                setState({ ...state, selectedGrade: e.value });
              }}
            />
          )}
        </div>

        <div className="topics">
          {menu.map((item) => (
            <div className="card" style={data.cardStyle || defaultCardStyle}>
              <Link href={/*`playlists/grammar`*/ `p/${item.id}`} key={item.id}>
                <div
                  className="img"
                  style={{
                    ...getIconStyle(item.img, data),
                    backgroundImage: `url(${(function () {
                      const imgPath = getImage(
                        `${data.iconsLoc || 'icons'}/${item.img}.png`
                      );
                      if (!imgPath) return imgPath;
                      if (imgPath.indexOf('http') === 0) return imgPath;
                      return publicPath(
                        imgPath.startsWith('/') ? imgPath : `/${imgPath}`
                      );
                    })()})`,
                  }}
                ></div>
                <div className="label" style={data.labelStyle || {}}>
                  {item.label}
                </div>
                {item.smLabel && (
                  <div className="smLabel" style={data.smLabelStyle || {}}>
                    {item.smLabel}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </main>

      {data.appLink && <AppLink appLink={data.appLink} />}
      {data.moreActivities && (
        <div className="hilight">
          <div>
            <Link to={`/${data.moreActivities || 'grade'}`}>
              More Activities
            </Link>
          </div>
        </div>
      )}
    </Styled>
  );
}
