import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

//profile image
import defaultProfileImg from "../images/DefaultImg.png";

//MUI components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";

const styles = (theme) => ({
  image: {
    margin: 10,
    height: 50,
    width: 50,
  },
  card: {
    display: "flex",
    marginBotton: 20,
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25,
  },
  handleDiv: {
    width: 60,
    height: 18,
    backgroundColor: "#00bcd4",
    marginBottom: 7,
  },
  dateDiv: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0, 0.3)",
    marginBottom: 10,
  },
  fullLineDiv: {
    height: 15,
    width: "90%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10,
  },
  halfLineDiv: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10,
  },
});

const TuturuSkeleton = (props) => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((item, index) => (
    <Card className={classes.card} key={index}>
      <Avatar
        src={defaultProfileImg}
        title="Profile template image"
        className={classes.image}
        variant="circle"
      />
      <CardContent className={classes.cardContent}>
        <div className={classes.handleDiv} />
        <div className={classes.dateDiv} />
        <div className={classes.fullLineDiv} />
        <div className={classes.fullLineDiv} />
        <div className={classes.halfLineDiv} />
      </CardContent>
    </Card>
  ));
  return (
    <Fragment>
      <div>{content}</div>
    </Fragment>
  );
};

TuturuSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TuturuSkeleton);
