import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

//Other components
import MyButton from "../../util/MyButton";

//MUI components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

//Icons
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

//Redux
import { connect } from "react-redux";
import { deleteTuturu } from "../../redux/actions/dataActions";

const styles = {
  deleteButton: {
    position: "absolute",
    left: "92.5%",
    top: "5%",
  },
};

class DeleteTuturu extends Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  deleteTuturu = () => {
    this.props.deleteTuturu(this.props.tuturuId);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete Tuturu Post"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutlineIcon color="secondary" />
        </MyButton>

        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
          <DialogTitle> Are you sure you want to delete this post?</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteTuturu} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteTuturu.propTypes = {
  deleteTuturu: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  tuturuId: PropTypes.string.isRequired,
};

export default connect(null, { deleteTuturu })(withStyles(styles)(DeleteTuturu));
