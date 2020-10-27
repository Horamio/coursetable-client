import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "react-query";

// Components
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

// Helpers
import {
  getColleges,
  getCourses,
  getFaculties,
  getSpecialities,
} from "../utils";

const useStyles = makeStyles((theme) => ({
  inputRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "8px",
  },
}));

const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function CourseFilter({
  onParamsChange = () => {},
  onAddCourse = () => {},
}) {
  const classes = useStyles();
  const [college, setCollege] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [speciality, setSpeciality] = useState(null);
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState(null);

  const collegesQuery = useQuery("colleges", () => getColleges());
  const facultiesQuery = useQuery("faculties", () =>
    getFaculties(college && college.id)
  );
  const specialitiesQuery = useQuery("specialities", () =>
    getSpecialities(college && college.id, faculty && faculty.id)
  );
  const coursesQuery = useQuery("courses", () =>
    getCourses(
      college && college.id,
      faculty && faculty.id,
      speciality && speciality.id,
      semester
    )
  );

  const onCollegeChange = (event, newValue) => {
    setCollege(newValue);
    setFaculty(null);
    setSpeciality(null);
    setSemester("");
    setCourse(null);
  };

  const onFacultyChange = (event, newValue) => {
    setFaculty(newValue);
    setSpeciality(null);
    setSemester("");
    setCourse(null);
  };

  const onSpecialityChange = (event, newValue) => {
    setSpeciality(newValue);
    setSemester("");
    setCourse(null);
  };

  const onSemesterChange = (event) => {
    setSemester(event.target.value);
    setCourse(null);
  };

  const onCourseChange = (event, newValue) => {
    setCourse(newValue);
  };

  useEffect(() => {
    onParamsChange(college, faculty, speciality, semester, course);
  }, [
    JSON.stringify(college),
    JSON.stringify(faculty),
    JSON.stringify(speciality),
    JSON.stringify(semester),
    JSON.stringify(course),
  ]);

  useEffect(() => {
    facultiesQuery.refetch();
    specialitiesQuery.refetch();
    coursesQuery.refetch();
  }, [JSON.stringify(college)]);

  useEffect(() => {
    specialitiesQuery.refetch();
    coursesQuery.refetch();
  }, [JSON.stringify(faculty)]);

  useEffect(() => {
    coursesQuery.refetch();
  }, [JSON.stringify(speciality), semester]);

  if (
    collegesQuery.isLoading ||
    facultiesQuery.isLoading ||
    specialitiesQuery.isLoading ||
    coursesQuery.isLoading
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
        </div>
        <div className={classes.inputRow}>
          <TextField
            id="combo-box-semester"
            select
            label="Ciclo"
            value={semester}
            onChange={onSemesterChange}
            variant="outlined"
            style={{ width: "10ch" }}
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
          <Autocomplete
            id="combo-box-course"
            value={course}
            onChange={onCourseChange}
            options={coursesQuery.data}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option) => option.id === course.id}
            style={{ width: "25ch" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Curso"
                variant="outlined"
                size="small"
                margin="normal"
              />
            )}
          />
        </div>
        <div className={classes.alignRight}>
          <Button
            onClick={(e) => onAddCourse(course)}
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Agregar
          </Button>
        </div>
      </form>
    </Paper>
  );
}
