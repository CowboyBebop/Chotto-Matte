import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

//MUI components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

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

export class Tuturu extends Component {
  render() {
    const {
      classes,
      tuturu: { userHandle, body, createdAt, profileImageUrl, tuturuId, likeCount, commentCount },
    } = this.props;
    return (
      <Card className={classes.card}>
        <Avatar
          src={profileImageUrl}
          title="Profile image"
          className={classes.image}
          variant="circle"
        />
        <CardContent className={classes.content}>
          <Typography variant={"h5"} component={Link} to={`/users/${userHandle}`} color="primary">
            {userHandle}
          </Typography>
          <Typography variant={"body2"} color={"textSecondary"}>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant={"body1"} color={"textPrimary"}>
            {body}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Tuturu);
