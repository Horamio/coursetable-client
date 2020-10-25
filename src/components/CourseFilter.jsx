import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "react-query";

// Components
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";

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

const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function CourseFilter({ onParamsChange = () => {} }) {
  const classes = useStyles();
  const [college, setCollege] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [speciality, setSpeciality] = useState(null);
  const [semester, setSemester] = useState("");

  const collegesQuery = useQuery("colleges", () => getColleges());
  const facultiesQuery = useQuery("faculties", () =>
    getFaculties(college && college.id)
  );
  const specialitiesQuery = useQuery("specialities", () =>
    getSpecialities(college && college.id, faculty && faculty.id)
  );

  const onCollegeChange = (event, newValue) => {
    setCollege(newValue);
    setFaculty(null);
    setSpeciality(null);
    setSemester("");
  };

  const onFacultyChange = (event, newValue) => {
    setFaculty(newValue);
    setSpeciality(null);
    setSemester("");
  };

  const onSpecialityChange = (event, newValue) => {
    setSpeciality(newValue);
    setSemester("");
  };

  const onSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  useEffect(() => {
    onParamsChange(college, faculty, speciality, semester);
  }, [
    JSON.stringify(college),
    JSON.stringify(faculty),
    JSON.stringify(speciality),
    JSON.stringify(semester),
  ]);

  useEffect(() => {
    facultiesQuery.refetch();
    specialitiesQuery.refetch();
  }, [JSON.stringify(college)]);

  useEffect(() => {
    specialitiesQuery.refetch();
  }, [JSON.stringify(faculty)]);

  if (
    collegesQuery.isLoading ||
    facultiesQuery.isLoading ||
    specialitiesQuery.isLoading
  )
    return null;

  return (
    <Paper className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off">
        <div>
          <Autocomplete
            id="combo-box-college"
            value={college}
            onChange={onCollegeChange}
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
            value={faculty}
            onChange={onFacultyChange}
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
            value={speciality}
            onChange={onSpecialityChange}
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
          <TextField
            id="combo-box-speciality"
            select
            label="Ciclo"
            value={semester}
            onChange={onSemesterChange}
            variant="outlined"
            size="small"
            margin="normal"
          >
            <MenuItem value={""}>{"Todos"}</MenuItem>
            {semesters.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </form>
    </Paper>
  );
}
