import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

//components
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({});

export default function CourseTable({
  isLoading,
  courses,
  headerCells = [],
  change,
  onRemoveCourse,
  onCourseChange,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
  }, [change]);

  if (isLoading || !courses) return null;

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {headerCells.map((headerCell, index) => (
              <TableCell
                key={headerCell.accessor}
                align={index === 0 ? "left" : "right"}
              >
                {headerCell.display}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((course) => (
              <TableRow key={course.name}>
                {headerCells.map((headerCell, index) => (
                  <TableCell
                    key={headerCell.accessor}
                    align={index === 0 ? "left" : "right"}
                  >
                    {(() => {
                      if (headerCell.accessor === "settings") {
                        const Component = course[headerCell.accessor];
                        return <Component onCourseChange={onCourseChange} />;
                      }
                      if (headerCell.accessor === "remove") {
                        const Component = course[headerCell.accessor];
                        return (
                          <Component onClick={() => onRemoveCourse(course)} />
                        );
                      }
                      return course[headerCell.accessor];
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={courses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
