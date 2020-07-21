import React, { Component } from "react";
import axios from "axios";

//MUI Components
import Grid from "@material-ui/core/Grid";

import Tuturu from "../components/Tuturu";

class home extends Component {
  state = {
    tuturus: null,
  };
  async componentDidMount() {
    try {
      let res = await axios.get("/tuturus");
      console.log(res.config.baseURL);
      console.log(res.config.url);
      console.log(res.config.socketPath);

      this.setState({
        tuturus: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    let recentScreamsMarkup = this.state.tuturus ? (
      this.state.tuturus.map((tuturu) => <Tuturu key={tuturu.tuturuId} tuturu={tuturu} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <div>Profile here </div>
        </Grid>
      </Grid>
    );
  }
}

export default home;
