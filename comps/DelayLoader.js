import React, { useState, useEffect } from "react";

export default function DelayLoader(props) {
  const [state, setState] = useState({ isLoading: false });
  useEffect(() => {
    let intervalID;
    if (props.lazyLoad) {
      setState({ ...state, isLoading: true });
      intervalID = setTimeout(
        () => setState({ ...state, isLoading: false }),
        200
      );
    }

    return () => intervalID && clearTimeout(intervalID);
  }, [props.lazyLoad, props.data]);

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  return props.children;
}
