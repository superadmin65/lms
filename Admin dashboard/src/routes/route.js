import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const Authmiddleware = (props) => {
  const location = useLocation(); // Use the hook to get the current location

  if (!localStorage.getItem("authUser")) {
    return (
      <Navigate
        // to="/admin/login"
        to="/login"
        // Pass only the pathname string, NOT the whole object
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;

// import React from "react"
// import { Navigate } from "react-router-dom"

// const Authmiddleware = props => {
//   if (!localStorage.getItem("authUser")) {
//     return (
//       <Navigate
//         // to={{ pathname: "/admin/login", state: { from: props.location } }}
//         to="/admin/login"
//         state={{ from: location }}
//         replace
//       />
//     )
//   }
//   return <React.Fragment>{props.children}</React.Fragment>
// }

// export default Authmiddleware
