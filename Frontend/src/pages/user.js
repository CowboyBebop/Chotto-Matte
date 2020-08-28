import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import axios from "axios";

//Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

//MUI components
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Custom Components
import Tuturu from "../components/tuturu/Tuturu";
import StaticProfile from "../components/profile/StaticProfile";

const styles = (theme) => ({
  ...theme.TuturuStyle,
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  textField: {
    margin: "10px auto 10px auto",
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "8%",
  },
  expandButton: {
    position: "absolute",
    left: "90%",
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
  },
});

class user extends Component {
  state = {
    profile: null,
  };
  componentDidMount() {
    const userHandle = this.props.match.params.userHandle;

    this.props.getUserData(userHandle);
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { tuturus, loading } = this.props.data;

    const tuturusMarkup = loading ? (
      <p>Loading stuff</p>
    ) : tuturus === null ? (
      <p>No tuturus from this user</p>
    ) : (
      tuturus.map((tuturu) => <Tuturu key={tuturu.tuturuId} tuturu={tuturu} />)
    );

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {tuturusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading stuff</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(withStyles(styles)(user));
