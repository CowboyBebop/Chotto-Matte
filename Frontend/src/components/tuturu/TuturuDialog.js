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

//Custom Components
import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

//Icons
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
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog && !this.state.open) {
      console.log("opened");
      this.handleOpen();
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;

    const { userHandle, tuturuId } = this.props;
    const newPath = `/users/${userHandle}/tuturu/${tuturuId}`;

    if (oldPath === newPath) oldPath = `/users/${userHandle}`;

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    this.props.getTuturu(this.props.tuturuId);
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);

    this.setState({ open: false });
    this.props.clearErrors();
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
        <CommentForm tuturuId={tuturuId} />
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
