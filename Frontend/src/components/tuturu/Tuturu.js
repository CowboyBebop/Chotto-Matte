import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";

//Custom components
import MyButton from "../../util/MyButton";
import DeleteTuturu from "./DeleteTuturu";
import TuturuDialog from "./TuturuDialog";
import LikeButton from "./LikeButton";

//MUI components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

//Icons
import ChatIcon from "@material-ui/icons/Chat";

//Redux
import { connect } from "react-redux";

//dayjs plugin
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    margin: 10,
    height: 50,
    width: 50,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Tuturu extends Component {
  render() {
    const {
      classes,
      tuturu: {
        userHandle: tuturuUserHandle,
        body,
        createdAt,
        profileImageUrl,
        tuturuId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { userHandle },
      },
    } = this.props;
    const deleteButton =
      authenticated && tuturuUserHandle === userHandle ? (
        <DeleteTuturu tuturuId={tuturuId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <Avatar
          src={profileImageUrl}
          title="Profile image"
          className={classes.image}
          variant="circle"
        />
        <CardContent className={classes.content}>
          <Typography
            variant={"h5"}
            component={Link}
            to={`/users/${tuturuUserHandle}`}
            color="primary"
          >
            {tuturuUserHandle}
          </Typography>
          {deleteButton}
          <Typography variant={"body2"} color={"textSecondary"}>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant={"body1"} color={"textPrimary"}>
            {body}
          </Typography>
          <LikeButton tuturuId={tuturuId} />
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments </span>
          <TuturuDialog
            tuturuId={tuturuId}
            userHandle={tuturuUserHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Tuturu.propTypes = {
  user: PropTypes.object.isRequired,
  tuturu: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(withStyles(styles)(Tuturu));
