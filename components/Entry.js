import React, { Component } from 'react';
import { machineIdSync } from 'node-machine-id';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { loginUser } from '../state/Auth/actions';
import { getSettings } from '../state/SortForms/actions';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    display: 'block',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  noSetting: {
    display: 'flex',
    justifyContent: 'center'
  }
});

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    let machineId = machineIdSync({ original: true });
    this.props.getSettings(machineId);
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }
  signIn() {
    const { email, password } = this.state;
    this.props.loginUser({ email, password });
  }
  render() {
    const { classes, user, loading, noSettings } = this.props;
    if (noSettings) {
      return (
        <div className={classes.noSetting}>
          <h5>
            This machine is not configured. Please contact IT support to add the
            machine ID to Firestore.
          </h5>
        </div>
      );
    }
    if (user) {
      return <Redirect to='/scaleUI' />;
    }
    return (
      <div>
        <h3>Please sign in.</h3>
        <TextField
          className={classes.textField}
          label='Email'
          margin='normal'
          variant='outlined'
          onChange={this.onEmailChange}
          value={this.state.email}
        />
        <TextField
          className={classes.textField}
          label='Password'
          margin='normal'
          variant='outlined'
          onChange={this.onPasswordChange}
          value={this.state.password}
        />
        {this.props.loading ? (
          <CircularProgress className={classes.progress} />
        ) : (
          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            onClick={this.signIn}
          >
            Login
          </Button>
        )}
        <div style={{ color: 'red' }}>{this.props.error}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, error, loading } = state.auth;
  const { noSettings } = state.sortForms;
  return { user, error, loading, noSettings };
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    { loginUser, getSettings }
  )
)(Entry);
