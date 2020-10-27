import React, { useState } from "react";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";

// Components
import IconButton from "@material-ui/core/IconButton";
import TuneIcon from "@material-ui/icons/Tune";
import Popover from "@material-ui/core/Popover";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";

// Helpers
import { getSections } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormGroup-root": {
      paddingLeft: "10px",
    },
  },
}));

export default function SettingsPopover({ course, onCourseChange }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [localCourse, setLocalCourse] = useState(course);

  const handleToggleSection = (sectionIndex) => {
    setLocalCourse((prevLocalCourse) => {
      const localCourseDup = JSON.parse(JSON.stringify(prevLocalCourse));
      let section = localCourseDup.sections[sectionIndex];
      section.selected = !section.selected;
      return localCourseDup;
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onCourseChange(localCourse);
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
        className={classes.root}
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
        <FormGroup row>
          {localCourse.sections.map((section, sectionIndex) => (
            <FormControlLabel
              key={section.id}
              control={
                <Checkbox
                  checked={section.selected}
                  onChange={() => handleToggleSection(sectionIndex)}
                  inputProps={{ "aria-label": "primary checkbox" }}
                  color="primary"
                />
              }
              label={section.code}
            />
          ))}
        </FormGroup>
      </Popover>
    </div>
  );
}
