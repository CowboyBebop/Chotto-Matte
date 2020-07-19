import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import axios from "axios";

//MUI Components
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import TotoroImage from "../images/TotoroUmbrella.png";

const styles = {
  form: {
    textAlign: "center",
  },
  loginImage: {
    height: 150,
    margin: "20px auto 20px auto",
  },
  pageTitle: {
    margin: "10px auto 10px auto",
  },
  textField: {
    margin: "10px auto 10px auto",
  },
  button: {
    marginTop: 10,
  },
};

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {},
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    try {
      let res = await axios.post("/login", userData);

      console.log(res.data);
      this.setState({
        loading: false,
      });
      this.props.history.push("/");
    } catch (err) {
      this.setState({
        errors: err.response.data,
        loading: false,
      });
    }
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={TotoroImage} alt="app icon" className={classes.loginImage} />
          <Typography variant="h3" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              fullWidth
              className={classes.textField}
            ></TextField>
          </form>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              fullWidth
              className={classes.textField}
            ></TextField>
            <Button color="primary" type="submit" variant="contained" className={classes.button}>
              login
            </Button>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

login.propType = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(login);
