import { useEffect, useState } from 'react';

export default function OnlyBigScreen(props) {
  const [state, setState] = useState({
    loading: true,
    smallScreen: false
  });

  useEffect(() => {
    //taken from isSmallScreen() function
    if (window.innerWidth < (props.minSize || 900)) {
      setState({ ...state, smallScreen: true, loading: false });
    } else {
      setState({ ...state, smallScreen: false, loading: false });
    }
  }, []);

  if (state.loading) {
    return <div>Loading...</div>;
  }
  if (state.smallScreen) {
    return (
      <div style={{ margin: 15, color: 'red' }}>
        Sorry. This page is available only for big screen. Kindly check this in
        laptop or PC.
      </div>
    );
  }
  return props.children;
}
