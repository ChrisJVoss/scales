import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { loginUser } from '../state/Auth/actions';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
    const { classes, user, loading } = this.props;
    if (user) {
      console.log(user);
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
        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={this.signIn}
        >
          Login
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, error, loading } = state.auth;
  return { user, error, loading };
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    { loginUser }
  )
)(Entry);
