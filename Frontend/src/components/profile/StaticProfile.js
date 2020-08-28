import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";

//Redux
import { connect } from "react-redux";
import { getTuturu, clearErrors } from "../../redux/actions/dataActions";

//MUI components
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";

//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import EditIcon from "@material-ui/icons/Edit";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

const styles = (theme) => ({
  ...theme.TuturuStyle,
  paper: {
    padding: 20,
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle",
      },
      "& a": {
        color: "#00bcd4",
      },
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0",
    },
  },
});

const StaticProfile = (props) => {
  const {
    classes,
    profile: { userHandle, createdAt, profileImageUrl, bio, website, location },
  } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={profileImageUrl} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <MuiLink component={Link} to={`/users/${userHandle}`} color="primary" variant="h5">
            @{userHandle}
          </MuiLink>
          <hr />
          {bio && <Typography variant="body2">{bio}</Typography>}
          <hr />
          {location && (
            <Fragment>
              <LocationOn color="primary" /> <span>{location}</span>
              <hr />
            </Fragment>
          )}
          {website && (
            <Fragment>
              <LinkIcon color="primary" />
              <a href={website} target="_blank" rel="noopener noreferrer">
                {" "}
                {website}
              </a>
              <hr />
            </Fragment>
          )}
          <CalendarToday color="primary" />{" "}
          <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
        </div>
      </div>
    </Paper>
  );
};

StaticProfile.propTypes = {
  getTuturu: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  tuturuId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  tuturu: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  tuturu: state.data.tuturu,
  UI: state.UI,
});

export default connect(mapStateToProps, { getTuturu, clearErrors })(
  withStyles(styles)(StaticProfile)
);
