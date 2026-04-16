import React from "react";
import { BeatLoader } from "react-spinners";

const GlobalLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Slight overlay
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BeatLoader color="#008a00" loading={loading} size={15} />
    </div>
  );
};

export default GlobalLoader;
