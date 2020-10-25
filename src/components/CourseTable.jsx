import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "react-query";

//components
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

// helpers
import request from "../utils/services";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const headerCells = [
  { display: "Facultad", accessor: "faculty_id" },
  { display: "Código", accessor: "code" },
  { display: "Nombre", accessor: "name" },
  { display: "Ciclo", accessor: "semester" },
  { display: "Creditos", accessor: "credits" },
];

const getCourses = () => {
  return request("/courses");
};

export default function CourseTable() {
  const { isLoading: isCoursesLoading, data: courses } = useQuery(
    "courses",
    getCourses
  );
  const classes = useStyles();

  if (isCoursesLoading) return null;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {headerCells.map((headerCell, index) => (
              <TableCell align={index === 0 ? "left" : "right"}>
                {headerCell.display}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.name}>
              {headerCells.map((headerCell, index) => (
                <TableCell align={index === 0 ? "left" : "right"}>
                  {course[headerCell.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
