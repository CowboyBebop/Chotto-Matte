import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";

//Other components
import MyButton from "../util/MyButton";
import DeleteTuturu from "./DeleteTuturu";

//MUI components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

//Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

//Redux
import { connect } from "react-redux";
import { likeTuturu, unlikeTuturu } from "../redux/actions/dataActions";

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
  likedTuturu = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find((like) => like.tuturuId === this.props.tuturu.tuturuId)
    )
      return true;
    else return false;
  };

  likeTuturu = () => {
    this.props.likeTuturu(this.props.tuturu.tuturuId);
  };
  unlikeTuturu = () => {
    this.props.unlikeTuturu(this.props.tuturu.tuturuId);
  };
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
    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="login">
          <FavoriteBorderIcon />
        </Link>
      </MyButton>
    ) : this.likedTuturu() ? (
      <MyButton tip="Unlike" onClick={this.unlikeTuturu}>
        <Link to="login">
          <FavoriteIcon />
        </Link>
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeTuturu}>
        <Link to="login">
          <FavoriteBorderIcon />
        </Link>
      </MyButton>
    );
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
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments </span>
        </CardContent>
      </Card>
    );
  }
}

Tuturu.propTypes = {
  likeTuturu: PropTypes.func.isRequired,
  unlikeTuturu: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  tuturu: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeTuturu,
  unlikeTuturu,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Tuturu));
