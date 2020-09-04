import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Redux
import { connect } from "react-redux";

// MUI
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

//Custom Components
import MyButton from "../../util/MyButton";
import PostTuturu from "../tuturu/PostTuturu";
import Notifications from "../layout/Notifications";

//Icons
import HomeIcon from "@material-ui/icons/Home";

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <ToolBar className="nav-container">
          {authenticated ? (
            <Fragment>
              <PostTuturu />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon color="secondary" />
                </MyButton>
              </Link>

              <Notifications />
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </ToolBar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Navbar);
