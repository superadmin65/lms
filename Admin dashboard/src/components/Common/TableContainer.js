import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input } from "reactstrap";
import { DefaultColumnFilter } from "./filters";
import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter";

// --- Global Filter Component ---
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Fragment>
      <div className="search-box d-inline-block">
        <div className="position-relative">
          <label htmlFor="search-bar-0" className="sr-only">
            Search this table
          </label>
          <input
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            id="search-bar-0"
            type="text"
            className="form-control"
            placeholder={`${count} records...`}
            value={value || ""}
          />
          <i className="bx bx-search-alt search-icon"></i>
        </div>
      </div>
      {isJobListGlobalFilter && <JobListGlobalFilter />}
    </Fragment>
  );
}

// --- Main Table Container Component ---
const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isJobListGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  className,
  addButtonLabel,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize || 10,
        sortBy: [{ desc: true }],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
  );

  // Improved sorting indicator using MDI icons
  const generateSortingIndicator = (column) => {
    return column.isSorted ? (
      column.isSortedDesc ? (
        <i className="mdi mdi-arrow-down ms-1" />
      ) : (
        <i className="mdi mdi-arrow-up ms-1" />
      )
    ) : (
      ""
    );
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>
      {/* --- Row 1: Add New Staff Button (Right Aligned) --- */}
      <Row className="mb-2">
        <Col sm="12">
          <div className="text-sm-end">
            {isAddOptions && (
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />

                {addButtonLabel || "Add Staff"}
              </Button>
            )}
            {isAddUserList && (
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" /> Create New
                User
              </Button>
            )}
            {isAddCustList && (
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" /> New Customers
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* --- Row 2: Entries (Left) and Search (Right) --- */}
      <Row className="mb-4 align-items-center">
        {/* Left: Show Entries */}
        <Col md={6}>
          <div className="d-flex align-items-center">
            <span className="me-2 text-nowrap">Show</span>
            <select
              className="form-select"
              style={{ width: "auto" }}
              value={pageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ms-2 text-nowrap">entries</span>
          </div>
        </Col>

        {/* Right: Global Search */}
        <Col md={6}>
          <div className="d-flex justify-content-end">
            {isGlobalFilter && (
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
                isJobListGlobalFilter={isJobListGlobalFilter}
              />
            )}
          </div>
        </Col>
      </Row>

      {/* --- Table Section --- */}
      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div className="mb-2" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-5">
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* --- Pagination Section --- */}
      <Row className="justify-content-md-end justify-content-center align-items-center mt-2">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isGlobalFilter: PropTypes.bool,
  isJobListGlobalFilter: PropTypes.bool,
  isAddOptions: PropTypes.bool,
  isAddUserList: PropTypes.bool,
  handleOrderClicks: PropTypes.func,
  handleUserClick: PropTypes.func,
  handleCustomerClick: PropTypes.func,
  isAddCustList: PropTypes.bool,
  customPageSize: PropTypes.number,
  className: PropTypes.string,
};

export default TableContainer;

// import React, { Fragment } from "react"
// import PropTypes from "prop-types"
// import {
//   useTable,
//   useGlobalFilter,
//   useAsyncDebounce,
//   useSortBy,
//   useFilters,
//   useExpanded,
//   usePagination,
// } from "react-table"
// import { Table, Row, Col, Button, Input } from "reactstrap"
// import { DefaultColumnFilter } from "./filters"
// import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter"

// // --- Global Filter Component ---
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
//   isJobListGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length
//   const [value, setValue] = React.useState(globalFilter)
//   const onChange = useAsyncDebounce(value => {
//     setGlobalFilter(value || undefined)
//   }, 200)

//   return (
//     <Fragment>
//       <div className="search-box d-inline-block">
//         <div className="position-relative">
//           <label htmlFor="search-bar-0" className="sr-only">
//             Search this table
//           </label>
//           <input
//             onChange={e => {
//               setValue(e.target.value)
//               onChange(e.target.value)
//             }}
//             id="search-bar-0"
//             type="text"
//             className="form-control"
//             placeholder={`${count} records...`}
//             value={value || ""}
//           />
//           <i className="bx bx-search-alt search-icon"></i>
//         </div>
//       </div>
//       {isJobListGlobalFilter && <JobListGlobalFilter />}
//     </Fragment>
//   )
// }

// // --- Main Table Container Component ---
// const TableContainer = ({
//   columns,
//   data,
//   isGlobalFilter,
//   isJobListGlobalFilter,
//   isAddOptions,
//   isAddUserList,
//   handleOrderClicks,
//   handleUserClick,
//   handleCustomerClick,
//   isAddCustList,
//   customPageSize,
//   className,
// }) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state,
//     preGlobalFilteredRows,
//     setGlobalFilter,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn: { Filter: DefaultColumnFilter },
//       initialState: {
//         pageIndex: 0,
//         pageSize: customPageSize || 10,
//         sortBy: [{ desc: true }],
//       },
//     },
//     useGlobalFilter,
//     useFilters,
//     useSortBy,
//     useExpanded,
//     usePagination
//   )

//   const generateSortingIndicator = column => {
//     return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
//   }

//   const onChangeInSelect = event => {
//     setPageSize(Number(event.target.value))
//   }

//   const onChangeInInput = event => {
//     const page = event.target.value ? Number(event.target.value) - 1 : 0
//     gotoPage(page)
//   }

//   return (
//     <Fragment>
//       {/* Top Section: Entries, Search, and Add Buttons */}
//       <Row className="mb-4 align-items-center">
//         {/* Left: Show Entries */}
//         <Col md={4}>
//           <div className="d-flex align-items-center">
//             <span className="me-2 text-nowrap">Show</span>
//             <select
//               className="form-select"
//               style={{ width: "auto" }}
//               value={pageSize}
//               onChange={onChangeInSelect}
//             >
//               {[10, 20, 30, 40, 50].map(size => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <span className="ms-2 text-nowrap">entries</span>
//           </div>
//         </Col>

//         {/* Middle: Global Search */}
//         <Col md={4} className="d-flex justify-content-center">
//           {isGlobalFilter && (
//             <GlobalFilter
//               preGlobalFilteredRows={preGlobalFilteredRows}
//               globalFilter={state.globalFilter}
//               setGlobalFilter={setGlobalFilter}
//               isJobListGlobalFilter={isJobListGlobalFilter}
//             />
//           )}
//         </Col>

//         {/* Right: Action Buttons */}
//         <Col md={4} className="text-end">
//           {isAddOptions && (
//             <Button
//               type="button"
//               color="success"
//               className="btn-rounded mb-0 me-2"
//               onClick={handleOrderClicks}
//             >
//               <i className="mdi mdi-plus me-1" /> Add New Staff
//             </Button>
//           )}
//           {isAddUserList && (
//             <Button
//               type="button"
//               color="primary"
//               className="btn mb-0 me-2"
//               onClick={handleUserClick}
//             >
//               <i className="mdi mdi-plus-circle-outline me-1" /> Create New User
//             </Button>
//           )}
//           {isAddCustList && (
//             <Button
//               type="button"
//               color="success"
//               className="btn-rounded mb-0 me-2"
//               onClick={handleCustomerClick}
//             >
//               <i className="mdi mdi-plus me-1" /> New Customers
//             </Button>
//           )}
//         </Col>
//       </Row>

//       {/* Table Section */}
//       <div className="table-responsive react-table">
//         <Table bordered hover {...getTableProps()} className={className}>
//           <thead className="table-light table-nowrap">
//             {headerGroups.map(headerGroup => (
//               <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map(column => (
//                   <th key={column.id}>
//                     <div className="mb-2" {...column.getSortByToggleProps()}>
//                       {column.render("Header")}
//                       {generateSortingIndicator(column)}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>

//           <tbody {...getTableBodyProps()}>
//             {page.map(row => {
//               prepareRow(row)
//               return (
//                 <Fragment key={row.getRowProps().key}>
//                   <tr>
//                     {row.cells.map(cell => (
//                       <td key={cell.id} {...cell.getCellProps()}>
//                         {cell.render("Cell")}
//                       </td>
//                     ))}
//                   </tr>
//                 </Fragment>
//               )
//             })}
//           </tbody>
//         </Table>
//       </div>

//       {/* Pagination Section */}
//       <Row className="justify-content-md-end justify-content-center align-items-center mt-2">
//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button
//               color="primary"
//               onClick={() => gotoPage(0)}
//               disabled={!canPreviousPage}
//             >
//               {"<<"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={previousPage}
//               disabled={!canPreviousPage}
//             >
//               {"<"}
//             </Button>
//           </div>
//         </Col>
//         <Col className="col-md-auto d-none d-md-block">
//           Page{" "}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>
//         </Col>
//         <Col className="col-md-auto">
//           <Input
//             type="number"
//             min={1}
//             style={{ width: 70 }}
//             max={pageOptions.length}
//             defaultValue={pageIndex + 1}
//             onChange={onChangeInInput}
//           />
//         </Col>
//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
//               {">"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={() => gotoPage(pageCount - 1)}
//               disabled={!canNextPage}
//             >
//               {">>"}
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Fragment>
//   )
// }

// TableContainer.propTypes = {
//   columns: PropTypes.array.isRequired,
//   data: PropTypes.array.isRequired,
//   isGlobalFilter: PropTypes.bool,
//   isJobListGlobalFilter: PropTypes.bool,
//   isAddOptions: PropTypes.bool,
//   isAddUserList: PropTypes.bool,
//   handleOrderClicks: PropTypes.func,
//   handleUserClick: PropTypes.func,
//   handleCustomerClick: PropTypes.func,
//   isAddCustList: PropTypes.bool,
//   customPageSize: PropTypes.number,
//   className: PropTypes.string,
// }

// export default TableContainer
