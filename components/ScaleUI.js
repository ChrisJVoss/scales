/*eslint no-console: ["error", { allow: ["error", "log"] }] */
import React, { Component } from 'react';
import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import ScaleDisplay from './ScaleDisplayCard';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

/*
const styles = theme => {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: [125, 125, 125],
    gridTemplateRows: [250, 250, 250]
  }
};
*/

class ScaleUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parser: new Readline({ delimiter: '\r\n' }),
      scalePorts: {},
      unitOfMeasurement: 'lb',
      bucketSwaps: {},
      jobs: [
        {
          jobId: '12345',
          part1: 2,
          part2: 4,
          part3: 18,
          part4: 13,
          total: 37,
          units: 'lb'
        }
      ],
      currentJob: 'someString'
    };
    this.zeroOut = this.zeroOut.bind(this);
    this.jobCompleteClick = this.jobCompleteClick.bind(this);
    this.sendNetWeight = this.sendNetWeight.bind(this);
    this.sendGrossWeight = this.sendGrossWeight.bind(this);
    this.sendTareWeight = this.sendTareWeight.bind(this);
    this.unitSelector = this.unitSelector.bind(this);
    this.swapBucket = this.swapBucket.bind(this);
    this.convertToCorrectUnits = this.convertToCorrectUnits.bind(this);
  }
  componentDidMount() {
    this.helper();
  }

  async helper() {
    const allPorts = await SerialPort.list();
    let filteredPorts = {};
    allPorts.forEach(port => {
      if (port.manufacturer === 'FTDI') {
        filteredPorts[port.serialNumber] = Object.assign(
          {
            portPath: new SerialPort(port.comName, { lock: false })
          },
          port
        );
      }
    });
    this.setState({ scalePorts: filteredPorts });
    this.startCollecting();
  }

  startCollecting() {
    for (let scale in this.state.scalePorts) {
      let path = this.state.scalePorts[scale].portPath;
      path.pipe(new Readline({ delimiter: '\r\n' })).on('data', data => {
        console.log(data);
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

  jobCompleteClick() {
    if (this.state.stable === 'indicatorUnstable') {
      alert('Please wait till the scale is stable');
      return;
    }
    let jobs = this.state.jobs.slice();
    const job = {
      jobId: Math.floor(Math.random() * 100000),
      total: 0,
      units: this.state.unitOfMeasurement
    };
    for (let scale in this.state.scalePorts) {
      let swappedWeight = this.state.bucketSwaps[scale] || [0];
      const weight =
        parseFloat(this.state.scalePorts[scale].scaleData, 10) +
          swappedWeight.slice().reduce((acc, cV) => acc + cV) || 0;
      job[scale] = weight;
      job.total += weight;
      this.state.scalePorts[scale].portPath.write(
        Buffer.from([0x5a, 0xd, 0xa])
      );
    }
    jobs.push(job);
    console.log(this.state.bucketSwaps);
    this.setState({ jobs, bucketSwaps: {} });
  }

  zeroOut() {
    console.log(this.state);
    console.log(this.state.jobs);
    /*
    this.state.scalePorts.A9076Y4J.portPath.write(
      Buffer.from([0x5a, 0xd, 0xa])
    );
    console.log(this.state.scalePorts);
    */
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

  swapBucket(scale) {
    if (this.state.stable === 'indicatorUnstable') {
      alert('Please wait till the scale is stable');
      return;
    }
    let bucket = Object.assign({}, this.state.bucketSwaps);
    let swapWeights = this.state.bucketSwaps[scale] || [];
    bucket[scale] = swapWeights.slice();
    bucket[scale].push(parseFloat(this.state.scalePorts[scale].scaleData, 10));
    this.setState({ bucketSwaps: bucket });
    console.log(bucket);
  }

  convertToCorrectUnits(scaleData, correctUnit, scale, units) {
    let weight = 0;
    if (units === '  ' + correctUnit) {
      return scaleData;
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
    return weight.toFixed(2);
  }

  renderScales() {
    const scaleList = [];
    for (let scale in this.state.scalePorts) {
      let wrongUnit = false;
      let weight =
        this.state.scalePorts[scale].sign +
          this.state.scalePorts[scale].scaleData || 0.0;
      if (
        this.state.scalePorts[scale].scaleData &&
        this.state.scalePorts[scale].units.slice(2) !==
          this.state.unitOfMeasurement
      ) {
        wrongUnit = true;
      }
      scaleList.push(
        <ScaleDisplay
          weight={weight}
          units={this.state.unitOfMeasurement}
          wrongUnit={wrongUnit ? ' Check Units' : null}
          scaleName={scale}
          key={scale}
          swapBucket={this.swapBucket}
          indicator={this.state.scalePorts[scale].stable}
        />
      );
    }
    return scaleList;
  }

  render() {
    return (
      <div>
        <h1>Scale System</h1>
        <Grid container spacing={16}>
          {this.renderScales()}
        </Grid>
        <button onClick={this.zeroOut}>Tare/Zero</button>
        <button onClick={this.jobCompleteClick}>Complete Job</button>
        <button onClick={this.sendNetWeight}>Send Net Weight</button>
        <button onClick={this.sendGrossWeight}>Send Gross Weight</button>
        <button onClick={this.sendTareWeight}>Send Tare Weight</button>
        <select
          id='unitSelect'
          onChange={this.unitSelector}
          defaultValue={this.state.unitOfMeasurement}
        >
          <option value='lb'>Pounds</option>
          <option value='kg'>Kilograms</option>
        </select>
      </div>
    );
  }
}

export default ScaleUI;
