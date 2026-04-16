import React from "react";
import moment from "moment";
import { Badge } from "reactstrap";

// Displays raw number ID
export const UserId = cell => (
  <span className="text-body fw-bold">{cell.value}</span>
);

// Shows Parent Name with Salutation
export const ParentName = ({ value, salutation }) => (
  <div className="text-capitalize">
    <span className="text-muted me-1">{salutation}.</span>
    {value}
  </div>
);

// Shows Child Name
export const ChildName = cell => (
  <span style={{ fontSize: "12px" }}>{cell.value}</span>
);

// Separated Contact Columns
export const MobileCol = cell => (
  <span className="text-muted">{cell.value}</span>
);
export const EmailCol = cell => <span className="text-muted">{cell.value}</span>;

// Date formatter
export const DateCol = cell => (
  <span className="text-muted">
    {cell.value ? moment(cell.value).format("DD MMM YYYY") : ""}
  </span>
);

// User Level Badge logic
export const UserLevel = cell => {
  const rawLevel = cell.value ? cell.value.trim().toLowerCase() : "";
  const displayLevel = rawLevel
    ? rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1)
    : "";

  let badgeColor = "warning";
  if (rawLevel === "easy") badgeColor = "success";
  if (rawLevel === "hard") badgeColor = "danger";
  if (rawLevel === "intermediate") badgeColor = "primary";

  return (
    <Badge className={"font-size-11 badge-soft-" + badgeColor} pill>
      {displayLevel}
    </Badge>
  );
};
