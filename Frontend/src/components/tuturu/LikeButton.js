import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Redux
import { connect } from "react-redux";
import { likeTuturu, unlikeTuturu } from "../../redux/actions/dataActions";

//Other components
import MyButton from "../../util/MyButton";

//Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

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
  TuturuPostCardIcon: {
    padding: 7,
  },
};

class LikeButton extends Component {
  likedTuturu = () => {
    return (
      this.props.user.likes &&
      this.props.user.likes.find((like) => like.tuturuId === this.props.tuturuId)
    );
  };
  likeTuturu = () => {
    this.props.likeTuturu(this.props.tuturuId);
  };
  unlikeTuturu = () => {
    this.props.unlikeTuturu(this.props.tuturuId);
  };

  render() {
    const {
      classes,
      user: { authenticated },
    } = this.props;

    const likeButton = !authenticated ? (
      <Link to="login">
        <MyButton btnClassName={classes.TuturuPostCardIcon} tip="Like">
          <FavoriteBorderIcon />
        </MyButton>
      </Link>
    ) : this.likedTuturu() ? (
      <Link to="login">
        <MyButton
          btnClassName={classes.TuturuPostCardIcon}
          tip="Unlike"
          onClick={this.unlikeTuturu}
        >
          <FavoriteIcon />
        </MyButton>
      </Link>
    ) : (
      <Link to="login">
        <MyButton btnClassName={classes.TuturuPostCardIcon} tip="Like" onClick={this.likeTuturu}>
          <FavoriteBorderIcon />
        </MyButton>
      </Link>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  tuturuId: PropTypes.string.isRequired,
  likeTuturu: PropTypes.func.isRequired,
  unlikeTuturu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeTuturu,
  unlikeTuturu,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(LikeButton));
