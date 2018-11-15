/*eslint no-console: ["error", { allow: ["error", "log"] }] */
import { machineIdSync } from 'node-machine-id';
import React, { Component } from 'react';
import firebase from 'firebase';
import SerialPort from 'serialport';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import {
  uploadBox,
  swapBucket,
  createPail,
  mergeBoxIntoPails,
  createDrum,
  getPails,
  setDate
} from '../state/SortForms/actions';
import Readline from '@serialport/parser-readline';
import ScaleDisplay from './ScaleDisplayCard';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

/*
wrapper: {
  display: 'grid',
  gridTemplateColumns: [125, 125, 125],
  gridTemplateRows: [250, 250, 250]
}
*/

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  barCode: { margin: 10, width: '100%', maxWidth: 350, paddingRight: 10 },
  rootModal: {
    width: 150,
    height: 150,
    transform: `translate(-50%, -50%)`
  }
});

class ScaleUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machineId: '',
      parser: new Readline({ delimiter: '\r\n' }),
      scalePorts: {},
      unitOfMeasurement: 'lb',
      bucketSwaps: {},
      boxes: [],
      date: null,
      chemistries: [
        'NiCd',
        'Li-Ion',
        'Ni-MH',
        'Lead',
        'Alkaline',
        'Lithium',
        'Other'
      ],
      pailToSwap: '',
      chemToSwap: '',
      goToReport: false,
      boxId: '',
      scanDrumModalOpen: false,
      drumId: ''
    };
    this.zeroOut = this.zeroOut.bind(this);
    this.boxCompleteClick = this.boxCompleteClick.bind(this);
    this.sendNetWeight = this.sendNetWeight.bind(this);
    this.sendGrossWeight = this.sendGrossWeight.bind(this);
    this.sendTareWeight = this.sendTareWeight.bind(this);
    this.unitSelector = this.unitSelector.bind(this);
    this.swapBucket = this.swapBucket.bind(this);
    this.convertToCorrectUnits = this.convertToCorrectUnits.bind(this);
    this.goToForms = this.goToForms.bind(this);
    this.onboxIdChange = this.onboxIdChange.bind(this);
    this.zeroAllScales = this.zeroAllScales.bind(this);
    this.createPailsClick = this.createPailsClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleDrumIdChange = this.handleDrumIdChange.bind(this);
    this.submitPailSwap = this.submitPailSwap.bind(this);
  }
  componentDidMount() {
    this.helper();
    let machineId = machineIdSync({ original: true });
    this.setState(
      { machineId },
      this.props.getPails(machineId, this.state.chemistries)
    );
  }

  componentWillUnmount() {
    for (let scale in this.state.scalePorts) {
      let path = this.state.scalePorts[scale].portPath;
      path.close();
    }
  }

  async helper() {
    const allPorts = await SerialPort.list();
    let filteredPorts = {};
    console.log(allPorts);
    allPorts.forEach(port => {
      if (
        port.manufacturer === 'FTDI' ||
        port.manufacturer === 'Prolific Technology Inc.'
      ) {
        filteredPorts[port.locationId] = Object.assign(
          {
            portPath: new SerialPort(port.comName, { lock: false })
          },
          port
        );
      }
    });
    this.setState({
      scalePorts: filteredPorts
    });
    this.startCollecting();
  }

  startCollecting() {
    for (let scale in this.state.scalePorts) {
      let path = this.state.scalePorts[scale].portPath;
      path.pipe(new Readline({ delimiter: '\r\n' })).on('data', data => {
        let scalePorts = Object.assign({}, this.state.scalePorts);
        scalePorts[scale].scaleData = this.convertToCorrectUnits(
          data.slice(7, 13),
          this.state.unitOfMeasurement,
          scale,
          data.slice(13, 17)
        );
        scalePorts[scale].units = data.slice(13, 17);
        scalePorts[scale].stable =
          data.slice(1, 2) === 'S' ? 'indicatorStable' : 'indicatorUnstable';
        scalePorts[scale].sign = data.slice(6, 7) === '+' ? '+' : '-';
        this.setState({ scalePorts });
      });
    }
  }

  boxCompleteClick() {
    if (this.state.stable === 'indicatorUnstable') {
      alert('Please wait till the scale is stable');
      return;
    }
    if (this.state.boxId === '') {
      alert('Please scan the container');
      return;
    }
    let boxes = this.state.boxes.slice();
    const box = {
      BoxId: this.state.boxId.slice(11, 23),
      Contents: {},
      TotalWeight: 0,
      Unit: this.state.unitOfMeasurement,
      SortedBy: this.props.user.user.uid,
      SortedOn: new firebase.firestore.Timestamp(
        Date.parse(new Date()) / 1000,
        0
      )
    };
    let totalWeight = 0;
    let count = 0;
    for (let scale in this.state.scalePorts) {
      let swappedWeight = this.state.bucketSwaps[scale] || [0];
      const weight =
        parseFloat(this.state.scalePorts[scale].scaleData) +
        swappedWeight.slice().reduce((acc, cV) => acc + cV);
      console.log(weight);
      if (weight && weight !== 0) {
        box.Contents[this.state.chemistries[count]] = parseFloat(
          weight.toFixed(2)
        );

        totalWeight += weight;
      }
      count++;
    }
    box.TotalWeight = parseFloat(totalWeight.toFixed(2));
    boxes.push(box);
    this.props.uploadBox(box);
    this.props.mergeBoxIntoPails(box, this.props.pails);
    this.setState({ boxes, bucketSwaps: {}, boxId: '' });
    this.zeroAllScales();
  }

  zeroAllScales() {
    for (let scale in this.state.scalePorts) {
      let written = this.state.scalePorts[scale].portPath.write(
        Buffer.from([0x5a, 0xd, 0xa]),
        'utf8',
        error => console.log('err: ', error)
      );
    }
    for (let scale in this.state.scalePorts) {
      let written = this.state.scalePorts[scale].portPath.write(
        Buffer.from([0x5a, 0xd, 0xa]),
        'utf8',
        error => console.log('err: ', error)
      );
    }
  }

  zeroOut() {
    console.log(this.state);
    console.log(this.props);
    this.zeroAllScales();
  }

  goToForms() {
    this.setState({ goToReport: true });
  }

  sendNetWeight() {
    this.state.scalePorts.A9076Y4J.portPath.write(
      Buffer.from([0x4e, 0xd, 0xa])
    );
    console.log('NetWeight');
  }

  sendGrossWeight() {
    this.state.scalePorts.A9076Y4J.portPath.write(
      Buffer.from([0x47, 0xd, 0xa])
    );
    console.log('GrossWeight');
  }

  sendTareWeight() {
    this.state.scalePorts.A9076Y4J.portPath.write(
      Buffer.from([0x54, 0xd, 0xa])
    );
    console.log('TareWeight');
  }

  unitSelector() {
    let unit = document.getElementById('unitSelect').value;
    this.setState({ unitOfMeasurement: unit });
  }

  createPailsClick() {
    this.props.createPail(this.state.chemistries, this.state.machineId);
  }

  swapBucket(chemistry, pails) {
    if (this.state.stable === 'indicatorUnstable') {
      alert('Please wait till the scale is stable');
      return;
    }
    this.setState({
      scanDrumModalOpen: true,
      pailToSwap: pails[chemistry],
      chemToSwap: chemistry
    });
    console.log('SwapBucket', pails[chemistry], this.state.drumId);
    // this.props.swapBucket(pails[chemistry], this.state.drumId);
  }

  convertToCorrectUnits(scaleData, correctUnit, scale, units) {
    let weight = 0;
    if (units === '  ' + correctUnit) {
      return parseFloat(scaleData);
    }
    if (units === '  oz' && correctUnit === 'lb') {
      weight = parseFloat(scaleData, 10) / 16;
    }
    if (units === '  oz' && correctUnit === 'kg') {
      weight = parseFloat(scaleData, 10) / 35.274;
    }
    if (units === 'lboz' && correctUnit === 'lb') {
      let oz = parseFloat(scaleData.slice(4, 6), 10);
      let lb = parseFloat(scaleData.slice(0, 3), 10);
      weight = lb + oz / 16;
    }
    if (units === 'lboz' && correctUnit === 'kg') {
      let oz = parseFloat(scaleData.slice(4, 6), 10);
      let lb = parseFloat(scaleData.slice(0, 3), 10);
      weight = lb / 2.205 + oz / 16 / 2.205;
    }
    if (units === '  lb' && correctUnit === 'kg') {
      weight = parseFloat(scaleData, 10) / 2.205;
    }
    if (units === '  kg' && correctUnit === 'lb') {
      weight = parseFloat(scaleData, 10) * 2.205;
    }
    return parseFloat(weight.toFixed(2));
  }

  onboxIdChange(event) {
    this.setState({ boxId: event.target.value });
  }

  submitPailSwap() {
    if (this.state.drumId === '') {
      alert('Please enter a drum identification number.');
      return;
    }
    let boxes = this.state.boxes.slice();
    boxes.forEach(box => {
      delete box.Contents[this.state.chemToSwap];
    });
    console.log(boxes);
    this.props.swapBucket(
      this.state.pailToSwap,
      this.state.drumId,
      this.state.machineId
    );
    this.setState({
      scanDrumModalOpen: false,
      drumId: '',
      pailToSwap: '',
      chemToSwap: '',
      boxes
    });
  }

  handleOpen() {
    this.setState({ scanDrumModalOpen: true });
  }

  handleClose() {
    this.setState({ scanDrumModalOpen: false });
  }

  handleDrumIdChange(event) {
    this.setState({ drumId: event.target.value });
  }

  renderScales() {
    let count = 0;
    const scaleList = [];
    for (let scale in this.state.scalePorts) {
      let wrongUnit = false;
      let weight = this.state.scalePorts[scale].scaleData || 0.0;
      if (
        this.state.scalePorts[scale].scaleData &&
        this.state.scalePorts[scale].units.slice(2) !==
          this.state.unitOfMeasurement
      ) {
        wrongUnit = true;
      }

      let boxWeight = parseFloat(
        this.state.boxes.reduce((acc, cV) => {
          return acc + cV.Contents[this.state.chemistries[count]];
        }, 0)
      );
      let totalWeight = boxWeight;
      if (this.state.scalePorts[scale].sign === '+') {
        totalWeight += weight;
      }
      if (this.state.scalePorts[scale].sign === '-') {
        totalWeight -= weight;
      }
      totalWeight = totalWeight.toFixed(2);
      if (totalWeight === 'NaN') {
        totalWeight = '0.0';
      }
      scaleList.push(
        <ScaleDisplay
          weight={weight}
          sign={this.state.scalePorts[scale].sign || ''}
          units={this.state.unitOfMeasurement}
          wrongUnit={wrongUnit ? ' Check Units' : null}
          scaleName={this.state.chemistries[count]}
          key={scale}
          swapBucket={this.swapBucket.bind(
            this,
            this.state.chemistries[count],
            this.props.pails
          )}
          indicator={this.state.scalePorts[scale].stable}
          totalWeight={totalWeight || '0.0'}
        />
      );
      count++;
    }
    return scaleList;
  }

  render() {
    const { classes } = this.props;
    if (this.state.goToReport) {
      return <Redirect to='/report' />;
    }
    return (
      <div>
        <Modal open={this.state.scanDrumModalOpen}>
          <Paper
            style={{
              width: '50%',
              height: 150,
              transform: `translate(50%, 50%)`
            }}
          >
            <div style={{ margin: 15, textAlign: 'center' }}>
              <h4>Please scan the drum.</h4>
              <TextField
                value={this.state.drumId}
                onChange={this.handleDrumIdChange}
                label='Drum ID'
                variant='outlined'
                autoFocus
              />
              <Button
                className={classes.button}
                color='primary'
                onClick={this.submitPailSwap}
              >
                Submit
              </Button>
            </div>
          </Paper>
        </Modal>
        <h1>Scale System</h1>
        <TextField
          label='Bar Code'
          variant='outlined'
          className={classes.barCode}
          onChange={this.onboxIdChange}
          value={this.state.boxId}
          autoFocus
        />
        <div>
          <Grid container spacing={16}>
            {this.renderScales()}
          </Grid>
          <Button
            className={classes.button}
            color='primary'
            onClick={this.zeroOut}
          >
            Tare/Zero All Scales
          </Button>
          <Button
            className={classes.button}
            color='secondary'
            onClick={this.goToForms}
          >
            Print Forms
          </Button>
          <Button
            className={classes.button}
            color='primary'
            onClick={this.boxCompleteClick}
          >
            Complete Box
          </Button>

          <TextField
            id='date'
            label='Form Date'
            type='date'
            value={this.props.date}
            onChange={event => this.props.setDate(event.target.value)}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { fetching, pails, date } = state.sortForms;
  const { user } = state.auth;
  return { fetching, user, pails, date };
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    {
      uploadBox,
      swapBucket,
      createPail,
      mergeBoxIntoPails,
      createDrum,
      getPails,
      setDate
    }
  )
)(ScaleUI);

/*

<select
  id='unitSelect'
  onChange={this.unitSelector}
  defaultValue={this.state.unitOfMeasurement}
>
  <option value='lb'>Pounds</option>
  <option value='kg'>Kilograms</option>
</select>
<button onClick={this.boxCompleteClick}>Complete Job</button>
<button onClick={this.sendNetWeight}>Send Net Weight</button>
<button onClick={this.sendGrossWeight}>Send Gross Weight</button>
<button onClick={this.sendTareWeight}>Send Tare Weight</button>
----------------------------------------------------------------------
*/
