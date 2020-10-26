import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

//components
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  root: {
    width: "800px",
    height: "438px",
    "& .MuiTableCell-root": {
      border: "1.33px solid #e0e0e0",
    },
    "& .day-header-cell,.hour-header-cell ": {
      backgroundColor: "#D5F5E3",
    },
  },
});

const hours = (() => {
  let hoursArr = [];
  for (let index = 0; index < 24; index++) {
    const hour = (index + 7) % 24;
    hoursArr.push(`${hour < 10 ? 0 : ""}${hour}:00`);
  }
  return hoursArr;
})();

const days = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];

export default function WeekScheduler() {
  const classes = useStyles();

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table stickyHeader size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">{""}</TableCell>
            {days.map((day, index) => (
              <TableCell className={"day-header-cell"} key={day} align="center">
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {hours.map((hour) => (
            <TableRow key={hour}>
              <TableCell className={"hour-header-cell"} align="center">
                {hour}
              </TableCell>
              {days.map((day, index) => (
                <TableCell className={"day-cell"} key={day} align="center">
                  {""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
