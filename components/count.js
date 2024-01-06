import React, { Component } from "react";
import Clock from "./clock";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { deadline: "January, 20, 2024 11:50:00 AM" };
  }
  render() {
    return (
      <div>
        <h1 style={{textAlign: "center", fontSize: "20px", marginBottom: "10px", color: "whitesmoke"}}>PRESALE COUNTDOWN</h1>
        <Clock deadline={this.state.deadline} />
      </div>
    );
  }
}
export default App;
