import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
import { Input, Select } from 'base/comps';
import { setLocalItem, getLocalItem, publicPath } from 'utils';
import Svg from 'components/Svg';

const Styled = styled.div`
  background-color: var(--l2);
  color: var(--darkColor);
  position: relative;
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

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  .gradeLabel {
    font-size: 1.5rem;
    line-height: 1rem;
    margin: 10px;
    text-decoration: underline;
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

  .view {
    position: relative;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }

  .tocHeader {
    display: flex;
    padding: 2px 20px;
    background-color: var(--lightHColor);
    justify-content: space-between;
    align-items: center;

    &.disable {
      background-color: var(--lightColor);
      color: gray;
    }
    .caption {
      font-size: 0.8rem;
      font-weight: bold;
    }
  }

  .otherTopics {
    .subject {
      padding: 10px;
      font-weight: bold;
    }

    h3 {
      text-align: center;
      text-decoration: underline;
    }

    li .item {
      padding: 5px 10px;
      // background-color: white;
      margin: 10px 10px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      width: 400px;
      /*
      box-shadow: var(--shadow);
      border-radius: 15px;
      */
      border-bottom: 1px solid var(--mediumColor);

      .imgIcon {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-right: 10px;
      }

      .main {
        flex-grow: 1;
      }

      .sno {
        margin-right: 15px;
        padding: 5px;
        background-color: var(--darkColor2);
        min-width: 35px;
        text-align: center;
        border-radius: 50%;
        color: white;
      }

      a {
        display: inline-block;
      }

      .captionBar {
        display: flex;
        padding-right: 5px;
        .caption {
          flex-grow: 1;
          cursor: pointer;
        }
      }
    }
  }
  .infoBar {
    font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .score {
      font-weight: bold;
      font-style: italic;
      padding: 5px 10px;
    }
  }

  .progress {
    display: inline-block;
    width: 100px;
    border: 1px solid var(--lightHColor);
    height: 7px;
    margin-right: 10px;
    .bar {
      background-color: var(--darkColor2);
      height: 7px;
    }
  }

  .favorites {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    font-size: 0.8rem;
    text-decoration: underline;
  }

  .noStars {
    padding: 10px;
    font-style: italic;
    padding-top: 40px;
  }

  .group {
    display: flex;
    flex-wrap: wrap;
  }

  .filterWrap {
    display: flex;
    padding-right: 50px;
  }

  @media only screen and (max-width: 800px) {
    .otherTopics li .item {
      width: 350px;
    }

    .tocHeader {
      flex-direction: column;
    }
  }
`;

/*
export const subjectList = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'math',
    
  },
  {
    value: 'english',
    
  },
  {
    value: 'general',
   
  },
  {
    value: 'vocabulary',
   
  },
  {
    value: 'grammar',
    
  },
  {
    value: 'reading',
    
  },
  {
    value: 'science',
    
  },
  {
    value: 'social',
   
  },
  {
    value: 'gk',
   
  }
];
*/

export default function PIconView(props) {
  const router = useRouter();
  let { data } = props;

  const [state, setState] = useState({
    loading: true,
    showFavorites: false
  });

  useEffect(() => {
    let config = getLocalItem('config', {});
    let masterProgress = getLocalItem('masterProgress', {});
    setState((s) => ({
      ...s,
      config,
      masterProgress,
      selectedGrade: config.selectedGrade || 'all',
      selectedSubject: config.selectedSubject || 'all',
      isSearch: !!config.searchText,
      searchText: config.searchText || '',
      favorites: config.favorites || [],
      loading: false
    }));
  }, []);
  if (state.loading) {
    return <div>Loading...</div>;
  }
  let sGrade = state.selectedGrade;
  let sSub = state.selectedSubject;
  if (state.searchText.length >= 3) {
    sGrade = 'all';
    sSub = 'all';
  }

  let iAmMember = true;

  let subjectList = data.list.map(({ id, label }) => ({ id, label }));

  subjectList = [
    {
      id: 'all',
      label: 'All'
    },
    ...subjectList
  ];

  var isSubjectPicker = true;
  if (data.list.length === 1) {
    isSubjectPicker = false;
  }
  var isGradePicker = !!data.grades;
  let gradeList = [];
  if (isGradePicker) {
    gradeList = [
      {
        id: 'all',
        label: 'All'
      },
      ...data.grades
    ];
  }
  let filteredSubject = subjectList;
  let matches = sGrade.match(/(\d+)/);
  let gradeNo = (matches && +matches[0]) || 0;
  if (isSubjectPicker && sGrade !== 'all') {
    filteredSubject = subjectList.filter((subject) => {
      if (subject.id === 'all') {
        return true;
      }
      let list = data.list.find((item) => item.id === subject.id).list;
      list = list.filter((item) => {
        if (!item.grade) {
          return false;
        }
        let range = item.grade.split('-').map((no) => +no);
        let bool;
        if (range.length === 1) {
          bool = range[0] === gradeNo;
        } else {
          bool = range[0] <= gradeNo && range[1] >= gradeNo;
        }
        return bool;
      });

      return list.length !== 0;
    });
  }

  let subjects;
  if (sSub === 'all' || state.showFavorites) {
    subjects = filteredSubject.slice(1, subjectList.length);
  } else {
    if (filteredSubject.length === 2) {
      subjects = filteredSubject.slice(1, subjectList.length);
    } else {
      subjects = filteredSubject.filter((item) => item.id === sSub);
    }
  }
  const haveSearchBar = isGradePicker || isSubjectPicker;
  if (haveSearchBar && state.searchText.length >= 3) {
    for (let i = 0; i < subjects.length; i++) {
      let list = data.list.find((item) => item.id === subjects[i].id).list;
      list = list.filter(
        (item) => item.label.toLowerCase().indexOf(state.searchText) !== -1
      );
      subjects[i].list = list;
    }
  } else {
    for (let i = 0; i < subjects.length; i++) {
      let list = data.list.find((item) => item.id === subjects[i].id).list;
      if (isGradePicker && sGrade !== 'all' && !state.showFavorites) {
        list = list.filter((item) => {
          let range = item.grade.split('-').map((no) => +no);
          let bool;
          if (range.length === 1) {
            bool = range[0] === gradeNo;
          } else {
            bool = range[0] <= gradeNo && range[1] >= gradeNo;
          }
          return bool;
        });
      }
      if (state.showFavorites) {
        list = list.filter((item) => {
          let bool = state.favorites.indexOf(item.id) !== -1;
          return bool;
        });
      }
      subjects[i].list = list;
    }
  }

  const handleFilterChange = (value, type) => {
    let config = { ...state.config };
    let newState;
    if (type === 'selectedGrade') {
      newState = {
        ...state,
        [type]: value,
        selectedSubject: 'all',
        showFavorites: false
      };

      config[type] = value;
      config.selectedSubject = 'all';
    } else {
      newState = {
        ...state,
        [type]: value,
        showFavorites: false
      };
      config[type] = value;
    }
    setState({ ...newState, config });
    setLocalItem('config', config);
  };

  const handleItemClick = (item) => {
    if (state.searchText.length >= 3) {
      setLocalItem('config', { ...state.config, searchText: state.searchText });
    }
    router.push(`/p/${item.id}`);
    // router.push(`/playlist?id=${item.id}`);
  };

  subjects = subjects.filter((item) => item.list.length !== 0);

  return (
    <Styled>
      <div className={`tocHeader ${state.showFavorites ? 'disable' : ''}`}>
        <h2 style={{ marginBottom: 20, textDecoration: 'underline' }}>
          All Playlists
        </h2>
        {(isGradePicker || isSubjectPicker) && (
          <div className="filterWrap">
            <div style={{ width: 200 }}>
              <div className="caption">Class / Grade</div>
              <Select
                width="130px"
                options={gradeList}
                value={state.selectedGrade}
                bgColor="inherit"
                onChange={(e) => {
                  handleFilterChange(e.id, 'selectedGrade');
                }}
              />
            </div>
            <div style={{ width: 200 }}>
              <div>
                <div className="caption">Subject</div>
                <Select
                  width="180px"
                  options={filteredSubject}
                  value={state.selectedSubject}
                  bgColor="inherit"
                  onChange={(e) => handleFilterChange(e.id, 'selectedSubject')}
                />
              </div>
            </div>
            <Input
              value={state.searchText}
              label="Search"
              autofocus
              style={{
                backgroundColor:
                  state.searchText.length >= 3 ? 'var(--h2)' : 'var(--h)',
                borderBottom: '1px solid var(--d)'
              }}
              onChange={(e) =>
                setState({
                  ...state,
                  searchText: e.target.value.toLowerCase().trim()
                })
              }
            />
            {state.searchText.length >= 3 && (
              <div
                style={{
                  color: 'var(--h2)',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  marginLeft: 10,
                  marginTop: 10,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const config = { ...state.config, searchText: '' };
                  setLocalItem('config', config);
                  setState({ ...state, searchText: '' });
                }}
              >
                ❌
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`view subjectWrap ${state.showGradePick ? '' : 'goLeft'}`}
      >
        <div
          className="favorites"
          onClick={() =>
            setState({ ...state, showFavorites: !state.showFavorites })
          }
        >
          {state.showFavorites ? `Show All` : `Show Favorites`}
        </div>

        {subjects.map((subject) => (
          <div className="otherTopics" key={subject.id}>
            {subjects.length > 1 ? (
              <div className="subject">{subject.label}</div>
            ) : (
              <div className="subject"> </div>
            )}
            <ul style={{ marginBottom: 20 }}>
              {subject.list.map((item, i) => (
                <li key={item.id || i}>
                  <div onClick={() => handleItemClick(item)} className="item">
                    <div className="sno">{i + 1}</div>
                    <div className="main">
                      <div className="captionBar">
                        <div className="caption">{item.label} </div>
                        {
                          /*!item.locked ||*/ iAmMember && (
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                let { favorites } = state;
                                if (favorites.indexOf(item.id) === -1) {
                                  favorites = [...favorites, item.id];
                                } else {
                                  favorites = favorites.filter(
                                    (id) => id !== item.id
                                  );
                                }
                                const config = { ...state.config, favorites };
                                setState({ ...state, favorites });
                                setLocalItem('config', config);
                              }}
                            >
                              <Svg
                                id="star"
                                color={
                                  state.favorites.indexOf(item.id) === -1
                                    ? '#bbb'
                                    : 'orange'
                                }
                              />
                            </div>
                          )
                        }
                      </div>
                      {state.masterProgress[item.id] && (
                        <div className="infoBar">
                          <div>
                            <span className="progress">
                              <div
                                className="bar"
                                style={{
                                  width:
                                    state.masterProgress[item.id].progress + '%'
                                }}
                              ></div>
                            </span>
                            {state.masterProgress[item.id].progress}%
                          </div>
                          <div className="score">
                            Score: {state.masterProgress[item.id].score}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {subjects.length === 0 &&
        (state.showFavorites ? (
          <div className="noStars">
            Your playlist favorites is empty. Click on the star in playlists to
            make them your favorites.
          </div>
        ) : (
          <div className="noStars">
            Presently, there is no playlist in the selected category.
          </div>
        ))}
    </Styled>
  );
}

function getIcon(item) {
  //if (!item.img) {
  return <Svg id="target" />;
  //}
  /*
  if (item.img.indexOf('.') === -1) {
    return <Svg id="target" />;
  } else {
    return (
      <img
        className="imgIcon"
        alt="icon"
        src={publicPath(`/img/icons/${item.img}`)}
      />
    );
  }*/
}
