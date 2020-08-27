import React, { Component, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";

//Redux
import { connect } from "react-redux";
import { getTuturu, clearErrors } from "../../redux/actions/dataActions";

//MUI components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Custom Components
import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";
import Comments from "./Comments";

//Icons
import AddIcon from "@material-ui/icons/Add";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import CloseIcon from "@material-ui/icons/Close";
import ChatIcon from "@material-ui/icons/Chat";

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

class TuturuDialog extends Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.props.getTuturu(this.props.tuturuId);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const {
      classes,
      tuturu: {
        tuturuId,
        body,
        createdAt,
        likeCount,
        commentCount,
        profileImageUrl,
        userHandle,
        comments,
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={2}>
        <Grid item sm={5}>
          <img src={profileImageUrl} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton tuturuId={tuturuId} />
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments </span>
        </Grid>
        <Comments comments={comments} />
      </Grid>
    );

    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} tip="Expand tuturu" tipClassName={classes.expandButton}>
          <UnfoldMoreIcon color="primary" />
        </MyButton>
        <Dialog open={this.state.open} onClose={this.handleClose} full fullWidth maxWidth="sm">
          <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
            <CloseIcon />
          </MyButton>
          <hr className={classes.visibleSeparator} />
          <DialogContent>{dialogMarkup}</DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

TuturuDialog.propTypes = {
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
  withStyles(styles)(TuturuDialog)
);
