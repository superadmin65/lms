import { useEffect, useState } from "react";

export default function OnlyBigScreen(props) {
  const [state, setState] = useState({
    loading: true,
    smallScreen: false,
  });

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < (props.minSize || 900)) {
        setState({ loading: false, smallScreen: true });
      } else {
        setState({ loading: false, smallScreen: false });
      }
    };

    checkScreen();

    // Optional: update on resize (important for responsiveness)
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [props.minSize]);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {state.smallScreen && (
        <div
          style={{
            margin: 10,
            padding: 10,
            backgroundColor: "#fff3cd",
            color: "#856404",
            textAlign: "center",
            fontSize: "14px",
            borderRadius: "5px",
          }}
        ></div>
      )}

      {props.children}
    </>
  );
}

// import { useEffect, useState } from 'react';

// export default function OnlyBigScreen(props) {
//   const [state, setState] = useState({
//     loading: true,
//     smallScreen: false
//   });

//   useEffect(() => {
//     //taken from isSmallScreen() function
//     if (window.innerWidth < (props.minSize || 900)) {
//       setState({ ...state, smallScreen: true, loading: false });
//     } else {
//       setState({ ...state, smallScreen: false, loading: false });
//     }
//   }, []);

//   if (state.loading) {
//     return <div>Loading...</div>;
//   }
//   if (state.smallScreen) {
//     return (
//       <div style={{ margin: 15, color: 'red' }}>
//         Sorry. This page is available only for big screen. Kindly check this in
//         laptop or PC.
//       </div>
//     );
//   }
//   return props.children;
// }
