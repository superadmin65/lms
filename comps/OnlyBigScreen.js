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


