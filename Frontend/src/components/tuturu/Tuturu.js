import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";

//Custom components
import MyButton from "../../util/MyButton";
import DeleteTuturu from "./DeleteTuturu";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

//MUI components
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";

//Icons
import ChatIcon from "@material-ui/icons/Chat";
import CloseIcon from "@material-ui/icons/Close";

//Redux
import { connect } from "react-redux";
import { getTuturu, clearErrors } from "../../redux/actions/dataActions";

//dayjs plugin
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

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
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
  },
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
  content: {},
  TuturuPostCardIcon: {
    padding: 7,
  },
  userHandleText: {
    margin: "0 10 0 0 ",
  },
});

class Tuturu extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
  };

  componentDidMount() {
    if (this.props.openDialog && !this.state.open) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    let oldPath = window.location.pathname;

    const {
      tuturu: { tuturuId, userHandle: tuturuUserHandle },
    } = this.props;
    console.log(tuturuId);
    const newPath = `/users/${tuturuUserHandle}/tuturu/${tuturuId}`;

    if (oldPath === newPath) oldPath = `/users/${tuturuUserHandle}`;

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    this.props.getTuturu(tuturuId);
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
        userHandle: tuturuUserHandle,
        tuturuId,
        body,
        createdAt,
        likeCount,
        commentCount,
        profileImageUrl,
      },
      user: {
        authenticated,
        credentials: { userHandle },
      },
      UI: { loading },
      comments: comments,
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
            @{tuturuUserHandle}
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

    const deleteButton =
      authenticated && tuturuUserHandle === userHandle ? (
        <DeleteTuturu tuturuId={tuturuId} />
      ) : null;

    return (
      <Fragment>
        <Card className={classes.card}>
          <CardActionArea onClick={this.handleOpen}>
            <Grid container>
              <Grid item xs={1}>
                <Avatar
                  src={profileImageUrl}
                  title="Profile image"
                  className={classes.image}
                  variant="circle"
                />
              </Grid>
              <Grid item xs={11}>
                <CardContent className={classes.content}>
                  <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                    <Grid container spacing={1} wrap="nowrap">
                      <Grid item>
                        <Typography
                          variant={"body1"}
                          component={Link}
                          to={`/users/${tuturuUserHandle}`}
                          color="primary"
                          className={classes.userHandleText}
                        >
                          {tuturuUserHandle}
                        </Typography>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant={"body1"} color={"textSecondary"}>
                          {dayjs(createdAt).fromNow()}
                        </Typography>
                      </Grid>
                      <Grid item>{deleteButton}</Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant={"body1"} color={"textPrimary"}>
                        {body}
                      </Typography>
                    </Grid>
                    <Grid container alignItems="center">
                      <Grid item xs={2}>
                        <LikeButton tuturuId={tuturuId} />
                        <span>{likeCount} Likes</span>
                      </Grid>
                      <Grid item xs={10}>
                        <MyButton tip="comments" btnClassName={classes.TuturuPostCardIcon}>
                          <ChatIcon color="primary" />
                        </MyButton>
                        <span>{commentCount} Comments </span>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>
            </Grid>
          </CardActionArea>
        </Card>
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

Tuturu.propTypes = {
  user: PropTypes.object.isRequired,
  tuturu: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  getTuturu: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  tuturuId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  UI: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (store) => ({
  user: store.user,
  comments: store.data.tuturu.comments,
  UI: store.UI,
});

export default connect(mapStateToProps, { getTuturu, clearErrors })(withStyles(styles)(Tuturu));
