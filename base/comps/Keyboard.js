import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { langs } from 'utils/langUtils';
import { getLocalItem } from 'utils';

const mlBoard = [
  'ക, ഖ, ഗ, ഘ, ങ',
  'ച, ഛ, ജ, ഝ, ഞ',
  'ട, ഠ, ഡ, ഢ, ണ',
  'ത, ഥ, ദ, ധ, ന, പ, ഫ, ബ, ഭ, മ',
  '✕, യ, ര, ല, വ, ശ, ഷ, സ, ഹ,✅ '
];

const ml2Board = [
  ['⁂ , അ, ആ, ഇ, ഈ', 'ഉ, ഊ, ഋ, എ, ഏ', 'ഐ, ഒ, ഓ, ഔ, അ.'],
  ['⁂ ,  ്,  ാ , ി , ീ ', '  ു , ൂ , ൃ , െ , േ ', '  ൈ , ൊ , ോ , ൌ , ം  '],
  ['⁂ , ൺ, ൻ, ർ, ൽ  ', 'ൾ,  ള , ഴ  , റ ,  റ്റ ', ' ങ്ക , മ്പ ,  ൌ , ഃ , ഽ']
];

const Styled = styled.div`
  // display: flex;
  /*
    position: fixed;
    bottom: 0;*/
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  justify-content: space-around;
  background-color: var(--lightHColor);
  box-shadow: var(--shadow2);
  padding: 5px 0;
  & ol {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  & .row {
    display: flex;
    justify-content: center;

    > div {
      min-width: 30px;
    }
  }

  & li {
    min-width: 40px !important;
  }

  & li,
  & .char {
    cursor: pointer;
    border: 1px solid $darkColor;
    padding: 5px;
    font-size: 1.3rem;
    list-style-type: none;
    text-align: center;
    min-width: 30px;
    background-color: var(--lightbg);
    margin: 2px;
    border: 1px solid gray;
    flex-grow: 1;
    border-radius: 5px;
  }

  .del,
  .space,
  .done {
    font-size: 0.9rem;
  }

  .ch {
    cursor: pointer;
    padding: 4px 0;
    font-size: 1rem;
    list-style-type: none;
    text-align: center;
    width: 35px;
    border: 1px solid white;
    background-color: var(--lightbg);
    flex-grow: 1;
  }
  .mlWrap {
    display: flex;
  }

  .mlLeft {
    flex-grow: 1;
    border: 1px solid gray;
  }

  .mlRight {
    flex-grow: 1;
  }

  .mlDel {
    /*flex-grow: 10;*/
    color: #fd6969;
  }

  @media only screen and (min-width: 700px) {
    max-width: 600px;

    & li {
      min-width: 60px !important;
    }
  }
`;
// prettier-ignore

export default function Keyboard(props) {
  const config = getLocalItem('config', {});
  const keyboardType = config.keyboardType || 'ABCDEF'
  const [state, setState] = useState({ selected: null, togglePos: 0 });
  const lang = langs[props.lang];
  let list;
  if (state.selected === null) {
    list = lang.top;
    if(!list){
      list = [lang.vowels[0], ...lang.consonants, '⁂']
    }
  } else if(state.selected === '⁂'){
    list = lang.mixed.map(item => item.charAt(1));
  } else if (state.selected === lang.vowels[0]) {
    list = lang.vowels;
  } else {
    list = lang.mixed.map(str => state.selected + str.charAt(1));
    list.unshift(state.selected)
  }

  useEffect(() => {
    if(props.lang && props.lang !== 'en'){
      return;
    }
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    }
  });


  const onKeyUp = evt => {
    if(evt.key.length === 1){
      handleClick(evt.key.toUpperCase());
    }else if(evt.key === 'Backspace' || evt.key === 'Delete'){
      //if(!props.singleEntry){
        handleClick('DEL');
      //}
    }
  }

  
  const handleClick = str => {
    if(props.lang === 'ml'){
      if(str === '⁂'){
        setState({...state, togglePos: (state.togglePos + 1) % 3})
        return;
      }
      let selected = props.tempStr || state.selected;
      if(props.onPartial){
        /*
        if(str === '✕'){
          if(selected !== ''){
            selected = selected.substring(0, selected.length-1)
          }
          props.onPartial(selected)
        }else if(str === '✅'){
          if(selected !== ''){
            props.onPick(selected);
          }
          selected = ''
        }else{
          if(selected === '_' || !selected){
            selected = str;
          }else{
            selected = selected += str;
          }
          props.onPartial(selected)
         
        }*/
      }else{
        if(str === '✕'){
          if(!props.singleEntry){
            props.onPick('DEL')
          }
        
        }else if(str === '✅'){
          if(!props.singleEntry){
            props.onPick('DONE')
          }
        }else{
          props.onPick(str);
        }
      }
      setState({...state, selected})
      return;
    }
    let selected = null;
    if(state.selected){
      props.onPick(str);
      selected = null;
    }else{
      if(props.lang === 'en'){
        props.onPick(str);
      }else{
        selected = str;
      }
    }
    setState({...state, selected})
  }

  let rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM' ];

  if(keyboardType === 'QWERTY' && (!props.lang || props.lang === 'en' )){
    return (
      <Styled>
        {
          rows.map(row => (
  <div className='row'>
  {
    row.split('').map(char => (
      <div className="char" onClick={() => handleClick(char)}>{char}</div>
    ))
  }
    </div>
          ))
        } 
        <div className='row'>
        {
            !props.singleEntry && props.lang === 'en' && (
              <div className="space char" onClick={() => handleClick(' ')}>Space</div>
            )
          }
        {(state.selected !== null || !props.singleEntry )&& (
            <div className="del char" onClick={() => {
              if(!state.selected ){
                props.onPick('DEL');
              }else{
                setState({ ...state, selected: null })
              }
              
            }}>DEL</div>
          )}
          {
            !props.singleEntry && (
              <div className='done char' onClick={() => props.onPick('DONE')}>Done</div>
            )
          }
        </div> 
        
      </Styled>
    )
  }
 
  if(props.lang === 'ml'){
    const bottom = mlBoard.slice(3);
    if(props.singleEntry){
      // slicing from string instead of array - but no issue - still working
      bottom[1] = bottom[1].slice(1, bottom[1].length - 2) ;
    }
    return (<Styled>
      <div className='mlWrap'>
      <div className="mlLeft">
      {
        ml2Board[state.togglePos].map(row => (
          <div className='row'>
            {
row.split(',').map(c => c.trim()).map(c => <div className='ch' onClick={() => handleClick(c)}>{c}</div>)
            }
          </div>
      ))}
      </div>
      <div className='mlRight'>
      {
        mlBoard.slice(0, 3).map(row => (
          <div className='row'>
            {
row.split(',').map(c => c.trim()).map(c => <div className='ch' onClick={() => handleClick(c)}>{c}</div>)
            }
          </div>
      ))}
      </div>
      </div>
      <div className='mlBottom'>
      {
       bottom.map(row => (
          <div className='row'>
            {
row.split(',').map(c => c.trim()).map(c => <div onClick={() => handleClick(c)} className={`ch ${c === '✕' ? 'mlDel' : ''}`}>{c}</div>)
            }
          </div>
      ))}
      </div>
        </Styled>)
  }
  
  return (
    <Styled>
      <ol>
        {list.map((str) => (
          <li onClick={() => handleClick(str)}>{str}</li>
        ))}
        {
          !props.singleEntry && props.lang === 'en' && (
            <li className="space" onClick={() => handleClick(' ')}>Space</li>
          )
        }
        {(state.selected !== null || !props.singleEntry )&& (
          <li className="del" onClick={() => {
            if(!state.selected ){
              props.onPick('DEL');
            }else{
              setState({ ...state, selected: null })
            }
            
          }}>DEL</li>
        )}
        {
          !props.singleEntry && (
            <li className='done' onClick={() => props.onPick('DONE')}>Done</li>
          )
        }
      </ol>
    </Styled>
  );
}
