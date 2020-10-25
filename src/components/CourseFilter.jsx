import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Components
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function CourseFilter() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <form className={classes.form} noValidate autoComplete="off">
        <div>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={""}
              onChange={() => {}}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            id="standard-required"
            label="Required"
            defaultValue="Hello World"
          />
          <TextField
            disabled
            id="standard-disabled"
            label="Disabled"
            defaultValue="Hello World"
          />
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <TextField
            id="standard-read-only-input"
            label="Read Only"
            defaultValue="Hello World"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="standard-number"
            label="Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField id="standard-search" label="Search field" type="search" />
          <TextField
            id="standard-helperText"
            label="Helper text"
            defaultValue="Default Value"
            helperText="Some important text"
          />
        </div>
      </form>
    </Paper>
  );
}
