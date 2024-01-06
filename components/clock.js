import React, { Component } from "react";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
  timer;
  componentWillMount() {
    this.getTimeUntil(this.props.deadline);
  }
  componentDidMount() {
    this.timer = setInterval(
      () => this.getTimeUntil(this.props.deadline),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  leading0(num) {
    return num < 10 ? "0" + num : num;
  }
  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    if (time < 0) {
      this.setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({ days, hours, minutes, seconds });
    }
  }
  render() {
    return (
      <div style={{ display: "flex", textAlign: "center", gap: "2px", marginBottom: "1%", padding: "10px", borderBottom: "solid 2px lightgray" }}>
        <div >
          <p style={{ color: "lightgray", padding: "7px", backdropFilter: "blur(50px)", border: "solid 0.1px gray", margin: "2px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "8px", fontSize: "14px" }}>Days</p>{this.leading0(this.state.days)} </div>
        <div>
          <p style={{ color: "lightgray", padding: "7px", backdropFilter: "blur(50px)", border: "solid 0.1px gray", margin: "2px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "8px", fontSize: "14px" }}>Hours</p>
          {this.leading0(this.state.hours)}    
        </div>
        <div>
          <p style={{ color: "lightgray", padding: "7px", backdropFilter: "blur(50px)", border: "solid 0.1px gray", margin: "2px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "8px", fontSize: "14px" }}>Minutes</p>
          {this.leading0(this.state.minutes)}   
        </div>
        <div>
          <p style={{ color: "lightgray", padding: "7px", backdropFilter: "blur(50px)", border: "solid 0.1px gray", margin: "2px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "8px", fontSize: "14px" }}>Seconds</p>
          {this.leading0(this.state.seconds)}
        </div>
      </div>
    );
  }
}
export default Clock;
