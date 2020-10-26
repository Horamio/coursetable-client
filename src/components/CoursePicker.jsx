import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useQuery } from "react-query";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from "@material-ui/icons/Tune";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

// Helpers
import { getCourses } from "../utils";

const StyledCoursePicker = styled.div`
  width: 400px;
`;

const headerCells = [
  { display: "Curso", accessor: "codeName" },
  { display: "Ciclo", accessor: "semester" },
  { display: "Créditos", accessor: "credits" },
  { display: "Sección", accessor: "settings" },
];

const formatCourses = (courses) => {
  return courses.map((course) => ({
    codeName: `${course.name} (${course.code})`,
    settings: <SettingsPopover />,
    ...course,
  }));
};

export default function CoursePicker() {
  const [params, setParams] = useState([]);

  const {
    isLoading: isCoursesLoading,
    data: courses,
    refetch,
  } = useQuery("courses", () => getCourses(...params));

  const onParamsChange = (college, faculty, speciality, semester) => {
    const collegeId = college && college.id;
    const facultyId = faculty && faculty.id;
    const specialityId = speciality && speciality.id;

    setParams(() => [collegeId, facultyId, specialityId, semester]);
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);

  if (isCoursesLoading) return null;

  return (
    <StyledCoursePicker>
      <CourseFilter onParamsChange={onParamsChange} />
      <div className="table-container">
        <CourseTable
          isLoading={isCoursesLoading}
          courses={formatCourses(courses)}
          headerCells={headerCells}
        />
      </div>
    </StyledCoursePicker>
  );
}

function SettingsPopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton onClick={handleClick} edge="end" aria-label="comments">
        <TuneIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography>The content of the Popover.</Typography>
      </Popover>
    </div>
  );
}
