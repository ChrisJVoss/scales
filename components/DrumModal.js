import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { handleDrumIdChange } from '../state/SortForms/actions';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const styles = {
  root: { margin: 50 }
};

class DrumModal extends Component {
  render() {
    return (
      <Paper className={classes.root}>
        <h3>This is a modal!</h3>
        <TextField
          value={this.props.drumId}
          onChange={event => this.props.handleDrumIdChange(event)}
        />
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  const { drumId } = state.SortForms;
  return { drumId };
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { handleDrumIdChange }
  )
)(DrumModal);
