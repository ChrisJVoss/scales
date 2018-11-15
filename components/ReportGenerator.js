import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { getSortForms } from '../state/SortForms/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

import { store } from '../store.js';

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

  componentDidMount() {
    console.log('mounting');
    this.props.getSortForms(this.props.date);
  }

  onBackClick() {
    this.setState({ goBack: true });
  }

  createRows(sortForms) {
    console.log(sortForms);
    return sortForms.map(form => {
      console.log(form, form.JobId);
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
                NiMH
              </TableCell>
              <TableCell numeric className={classes.header}>
                Li-Ion
              </TableCell>
              <TableCell numeric className={classes.header}>
                Li
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
            </TableRow>
          </TableHead>
          <TableBody>{this.createRows(this.props.forms)}</TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { forms, date } = state.sortForms;
  console.log(forms);
  return { forms, date };
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    { getSortForms }
  )
)(ReportGenerator);

/*
data: [
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  },
  {
    referenceID: '123456789',
    sortedBy: 'Voss, C',
    Alk: 15,
    NiCd: 17,
    NiMH: 128,
    LiIon: 14.23,
    Li: 6,
    ssla: 1,
    other: 7,
    unit: 'lb',
    total: 188.23
  }
]
};
*/
