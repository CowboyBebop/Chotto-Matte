import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";

//MUI Components
import Grid from "@material-ui/core/Grid";

import Tuturu from "../components/Tuturu";
import Profile from "../components/Profile";

import { connect } from "react-redux";
import { getTuturus } from "../redux/actions/dataActions";

class home extends Component {
  componentDidMount() {
    this.props.getTuturus();
  }
  render() {
    const { tuturus, loading } = this.props.data;

    let recentTuturusMarkup = !loading ? (
      tuturus.map((tuturu) => <Tuturu key={tuturu.tuturuId} tuturu={tuturu} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentTuturusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getTuturus: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getTuturus })(home);
