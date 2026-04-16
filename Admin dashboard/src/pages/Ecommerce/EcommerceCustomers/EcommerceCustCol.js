// // import React from "react"
// // import { Link } from "react-router-dom"
// // import moment from "moment"
// // import { Badge } from "reactstrap"

// // // Displays user ID with a link style
// // const CustId = cell => (
// //   <Link to="#" className="text-body fw-bold">
// //     {cell.value ? cell.value : ""}
// //   </Link>
// // )

// // // Shows Parent Name with Salutation prefix
// // const UserName = cell => {
// //   const { salutation, parent_name } = cell.row.original
// //   return (
// //     <div className="text-muted">
// //       <span className="me-1">{salutation ? `${salutation}.` : "Mr."}</span>
// //       {parent_name}
// //     </div>
// //   )
// // }

// // // Child Name in the light blue badge style
// // const ChildName = cell => <span className="text-muted">{cell.value}</span>

// // // Combines Phone and Green Email
// // const PhoneEmail = cell => {
// //   const { mobile, email } = cell.row.original
// //   return (
// //     <div>
// //       <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
// //         {mobile}
// //       </p>
// //       <p className="mb-0 text-primary" style={{ fontSize: "12px" }}>
// //         {email}
// //       </p>
// //     </div>
// //   )
// // }

// // // Date formatter
// // const JoiningDate = cell => (
// //   <span className="text-muted">
// //     {cell.value ? moment(cell.value).format("DD MMM YYYY") : ""}
// //   </span>
// // )

// // // Level badge with colored logic
// // const LevelBadge = cell => {
// //   const level = cell.value ? cell.value.trim().toLowerCase() : ""
// //   const displayLevel = level
// //     ? level.charAt(0).toUpperCase() + level.slice(1)
// //     : ""

// //   let badgeColor = "primary" // Default for Easy
// //   if (level === "hard") badgeColor = "danger"
// //   if (level === "intermediate") badgeColor = "success"

// //   return (
// //     <Badge className={"font-size-11 badge-soft-" + badgeColor} pill>
// //       {displayLevel}
// //     </Badge>
// //   )
// // }

// // export { CustId, UserName, PhoneEmail, ChildName, JoiningDate, LevelBadge }
// import React from "react"
// import { Link } from "react-router-dom"
// import moment from "moment"
// import { Badge } from "reactstrap"

// // Displays user ID with a link style
// export const CustId = cell => (
//   <Link to="#" className="text-body fw-bold">
//     {cell.value ? cell.value : ""}
//   </Link>
// )

// // Shows Parent Name with Salutation prefix
// export const UserName = cell => {
//   const { salutation, parent_name } = cell.row.original
//   return (
//     <div className="text-muted">
//       <span className="me-1">{salutation ? `${salutation}.` : "Mr."}</span>
//       {parent_name}
//     </div>
//   )
// }

// // Plain Child Name (Color removed)
// export const ChildName = cell => (
//   <span className="text-muted">{cell.value}</span>
// )

// // Separate Contact Columns
// export const MobileCol = cell => (
//   <span className="text-muted">{cell.value}</span>
// )
// export const EmailCol = cell => <span className="text-muted">{cell.value}</span>

// // Date formatter
// export const JoiningDate = cell => (
//   <span className="text-muted">
//     {cell.value ? moment(cell.value).format("DD MMM YYYY") : ""}
//   </span>
// )

// // Level badge logic
// export const LevelBadge = cell => {
//   const level = cell.value ? cell.value.trim().toLowerCase() : ""
//   const displayLevel = level
//     ? level.charAt(0).toUpperCase() + level.slice(1)
//     : ""

//   let badgeColor = "primary"
//   if (level === "hard") badgeColor = "danger"
//   if (level === "intermediate") badgeColor = "success"
//   if (level === "easy") badgeColor = "info"

//   return (
//     <Badge className={"font-size-11 badge-soft-" + badgeColor} pill>
//       {displayLevel}
//     </Badge>
//   )
// }
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Badge } from "reactstrap";

// Displays user ID with a link style
export const CustId = cell => (
  <Link to="#" className="text-body fw-bold">
    {cell.value ? cell.value : ""}
  </Link>
);

// Shows Parent Name with Salutation prefix
export const UserName = cell => {
  const { salutation, parent_name } = cell.row.original;
  return (
    <div className="text-muted text-capitalize">
      <span className="me-1">{salutation ? `${salutation}.` : "Mr."}</span>
      {parent_name}
    </div>
  );
};

// Plain Child Name (Color/Badge removed)
export const ChildName = cell => (
  <span className="text-muted">{cell.value}</span>
);

// Separate Contact Columns
export const MobileCol = cell => (
  <span className="text-muted">{cell.value}</span>
);

export const EmailCol = cell => <span className="text-muted">{cell.value}</span>;

// Date formatter
export const JoiningDate = cell => (
  <span className="text-muted">
    {cell.value ? moment(cell.value).format("DD MMM YYYY") : ""}
  </span>
);

// Level badge logic
export const LevelBadge = cell => {
  const level = cell.value ? cell.value.trim().toLowerCase() : "";
  const displayLevel = level
    ? level.charAt(0).toUpperCase() + level.slice(1)
    : "";

  let badgeColor = "primary";
  if (level === "hard") badgeColor = "danger";
  if (level === "intermediate") badgeColor = "success";
  if (level === "easy") badgeColor = "info";

  return (
    <Badge className={"font-size-11 badge-soft-" + badgeColor} pill>
      {displayLevel}
    </Badge>
  );
};
