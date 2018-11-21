import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { getSortForms, setDate } from '../state/SortForms/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PrintIcon from '@material-ui/icons/Print';
import BackIcon from '@material-ui/icons/ArrowBack';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

const styles = theme => ({
  '@media print': {
    root: {
      width: '100%',
      height: '100%'
    },
    noPrint: {
      display: 'none'
    }
  },
  header: { fontWeight: 700, color: 'black' },
  noPrint: {
    marginTop: 15,
    marginBottom: 15,
    marginRight: 10
  }
});

class ReportGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goBack: false
    };
    this.onBackClick = this.onBackClick.bind(this);
    this.createRows = this.createRows.bind(this);
  }

  componentDidMount() {}

  onBackClick() {
    this.setState({ goBack: true });
  }

  createRows(sortForms) {
    console.log(sortForms);
    return sortForms.map(form => {
      return (
        <TableRow key={form.BoxId}>
          <TableCell numeric>{form.BoxId}</TableCell>
          <TableCell>{form.SortedBy}</TableCell>
          <TableCell numeric>
            {form.Contents.Alkaline ? form.Contents.Alkaline : 0}
          </TableCell>
          <TableCell numeric>
            {form.Contents.NiCd ? form.Contents.NiCd : 0}
          </TableCell>
          <TableCell numeric>
            {form.Contents['Ni-MH'] ? form.Contents['Ni-MH'] : 0}
          </TableCell>
          <TableCell numeric>
            {form.Contents['Li-Ion'] ? form.Contents['Li-Ion'] : 0}
          </TableCell>
          <TableCell numeric>
            {form.Contents.Lithium ? form.Contents.Lithium : 0}
          </TableCell>
          <TableCell numeric>
            {form.Contents.Lead ? form.Contents.Lead : 0}
          </TableCell>
          <TableCell numeric>
            {form.Contents.Other ? form.Contents.Other : 0}
          </TableCell>
          <TableCell numeric>{form.TotalWeight}</TableCell>
          <TableCell numeric>{form.CellPhoneCount}</TableCell>
        </TableRow>
      );
    });
  }
  render() {
    console.log(this.props.forms);
    const { classes } = this.props;
    if (this.state.goBack) {
      return <Redirect to='/scaleUI' />;
    }
    return (
      <div>
        <Button className={classes.noPrint} onClick={this.onBackClick}>
          <BackIcon />
        </Button>
        <Button className={classes.noPrint} onClick={() => window.print()}>
          <PrintIcon />
        </Button>
        <TextField
          id='date1'
          label='From Date'
          type='date'
          value={this.props.dateStart}
          onChange={event =>
            this.props.setDate('dateStart', event.target.value)
          }
          className={classes.noPrint}
        />
        <TextField
          id='date2'
          label='To Date'
          type='date'
          value={this.props.dateEnd}
          onChange={event => this.props.setDate('dateEnd', event.target.value)}
          className={classes.noPrint}
        />
        <Button
          className={classes.noPrint}
          color='primary'
          variant='contained'
          onClick={() =>
            this.props.getSortForms(this.props.dateStart, this.props.dateEnd)
          }
        >
          Get Forms
        </Button>
        <Typography style={{ float: 'right' }}>Units: lbs</Typography>
        <Table padding='dense' className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell numeric className={classes.header}>
                C2R
              </TableCell>
              <TableCell className={classes.header}>Sorted By</TableCell>
              <TableCell numeric className={classes.header}>
                Alk
              </TableCell>
              <TableCell numeric className={classes.header}>
                NiCd
              </TableCell>
              <TableCell numeric className={classes.header}>
                Ni-MH
              </TableCell>
              <TableCell numeric className={classes.header}>
                Li-Ion
              </TableCell>
              <TableCell numeric className={classes.header}>
                Lithium
              </TableCell>
              <TableCell numeric className={classes.header}>
                SSLA
              </TableCell>
              <TableCell numeric className={classes.header}>
                Other
              </TableCell>
              <TableCell numeric className={classes.header}>
                Total
              </TableCell>
              <TableCell numeric className={classes.header}>
                Cell Phones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.createRows(this.props.forms)}</TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { forms, dateStart, dateEnd } = state.sortForms;
  console.log(forms);
  return { forms, dateStart, dateEnd };
};

export default compose(
  withRouter,
  withStyles(styles, { theme }),
  connect(
    mapStateToProps,
    { getSortForms, setDate }
  )
)(ReportGenerator);
