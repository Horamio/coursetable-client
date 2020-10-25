import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "react-query";

// Components
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Autocomplete from "@material-ui/lab/Autocomplete";

// Helpers
import { getColleges, getFaculties, getSpecialities } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30ch",
    padding: "20px",
  },
  form: {
    "& .MuiFormControl-root": {
      width: "25ch",
    },
  },
}));

export default function CourseFilter() {
  const classes = useStyles();
  const [college, setCollege] = useState();
  const [faculty, setFaculty] = useState();

  const collegesQuery = useQuery("colleges", () => getColleges());
  const facultiesQuery = useQuery("faculties", () => getFaculties(college));
  const specialitiesQuery = useQuery("specialities", () =>
    getSpecialities(college, faculty)
  );

  if (
    collegesQuery.isLoading ||
    facultiesQuery.isLoading ||
    specialitiesQuery.isLoading
  )
    return null;

  return (
    <Paper className={classes.root}>
      <form noValidate autoComplete="off">
        <div>
          <Autocomplete
            id="combo-box-college"
            options={collegesQuery.data}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Universidad"
                variant="outlined"
                size="small"
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="combo-box-faculty"
            options={facultiesQuery.data}
            getOptionLabel={(option) => option.name}
            style={{ width: "25ch" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Facultad"
                variant="outlined"
                size="small"
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="combo-box-speciality"
            options={specialitiesQuery.data}
            getOptionLabel={(option) => option.name}
            style={{ width: "25ch" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Especialidad"
                variant="outlined"
                size="small"
                margin="normal"
              />
            )}
          />
        </div>
      </form>
    </Paper>
  );
}
