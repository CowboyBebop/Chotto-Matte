import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import axios from "axios";

//MUI Components
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TotoroImage from "../images/TotoroUmbrella.png";
import { Link } from "react-router-dom";

const styles = (theme) => ({
  ...theme.customStyles,
});

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
      let res = await axios.post(
        "https://europe-west3-chotto-matte.cloudfunctions.net/api/login",
        userData
      );

      localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);

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
          <img src={TotoroImage} alt="app icon" className={classes.totoroImage} />
          <Typography variant="h3" className={classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && <CircularProgress size={30} className={classes.progress} />}
            </Button>
          </form>
          <small>
            Dont have an account? sign up{" "}
            <Link to="/signup" color="primary">
              here
            </Link>
          </small>
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
