import React, { Component, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import EditIcon from "@material-ui/icons/Edit";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

//MUI components
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import ToolTip from "@material-ui/core/ToolTip";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

//Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

import dayjs from "dayjs";

const styles = (theme) => ({
  ...theme.profileStyle,
});

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  render() {
    const {
      classes,
      user: {
        credentials: { userHandle, createdAt, profileImageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let ProfileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={profileImageUrl} alt="profile" className="profile-image" />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <ToolTip title="Edit profile picture" placement="top">
                <IconButton onClick={this.handleEditPicture} className="button">
                  <EditIcon color="primary" />
                </IconButton>
              </ToolTip>
            </div>
            <div className="profile-details">
              <MuiLink component={Link} to={`/users/${userHandle}`} color="primary" variant="h5">
                @{userHandle}
              </MuiLink>
              <hr />
              {bio && <Typography variant="body2">{bio}</Typography>}
              <hr />
              {location && (
                <Fragment>
                  <LocationOn color="primary" />
                  <span>{location}</span>
                </Fragment>
              )}
              <hr />
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
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please login again
          </Typography>
          <div className={classes.buttons}>
            <Button variant="contained" color="primary" component={Link} to="/login">
              Login
            </Button>
            <Button variant="contained" color="secondary" component={Link} to="/signup">
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <p>loading...</p>
    );

    return ProfileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapActionsToProps = { logoutUser, uploadImage };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
