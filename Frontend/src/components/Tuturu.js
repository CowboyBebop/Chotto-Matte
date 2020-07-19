import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "react-router-dom/Link";

//MUI components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    height: 100,
    width: 100,
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
        <CardMedia image={profileImageUrl} title="Profile image" className={classes.image} />
        <CardContent className={classes.content}>
          <Typography variant={"h5"} component={Link} to={`/users/${userHandle}`} color="primary">
            {userHandle}
          </Typography>
          <Typography variant={"body2"} color={"textSecondary"}>
            {createdAt}
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
