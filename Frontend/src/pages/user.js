import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import axios from "axios";

//Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

//MUI components
import Grid from "@material-ui/core/Grid";

//Custom Components
import Tuturu from "../components/tuturu/Tuturu";
import StaticProfile from "../components/profile/StaticProfile";
import TuturuSkeleton from "../util/TuturuSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";

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
    tuturuIdParam: null,
  };
  componentDidMount() {
    const userHandle = this.props.match.params.userHandle;
    const tuturuId = this.props.match.params.tuturuId;

    if (tuturuId) this.setState({ tuturuIdParam: tuturuId });

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
    const { tuturuIdParam } = this.state;

    const tuturusMarkup = loading ? (
      <TuturuSkeleton />
    ) : tuturus === null ? (
      <p>No tuturus from this user</p>
    ) : !tuturuIdParam ? (
      tuturus.map((tuturu) => <Tuturu key={tuturu.tuturuId} tuturu={tuturu} />)
    ) : (
      tuturus.map((tuturu) => {
        if (tuturu.tuturuId !== tuturuIdParam)
          return <Tuturu key={tuturu.tuturuId} tuturu={tuturu} />;
        else return <Tuturu key={tuturu.tuturuId} tuturu={tuturu} openDialog />;
      })
    );

    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {tuturusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
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
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(withStyles(styles)(user));
