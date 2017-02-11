import React, { Component } from 'react';
import axios from 'axios';
import { map } from 'lodash';


const SEARCH_URL = 'http://swapi.co/api/planets/?search=';
class App extends Component {
  constructor(){
    super();
    this.state = {
      planetResult:{
      },
      maxPop:-1
    }
    this.keyCount = 0;
    this.timerStarted = false;
    this.startCountDown = this.startCountDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.restrictSearch=false;
  }
  startCountDown(){
    let keyPressEraseTime = window.setInterval(() => {
      this.keyCount=0;
      this.restrictSearch= false;
    },1000);
  }
  handleKeyPress(e) {
    if(!this.timerStarted) {
      this.timerStarted= true;
      this.startCountDown();
    }
    this.keyCount++;
    if(this.keyCount > 15){
      e.preventDefault();    
      this.restrictSearch=true;
    }
  }
  fetchData(e) {
    let query = e.target.value;
    if(!this.restrictSearch && query){
      axios.get(SEARCH_URL+query)
        .then(this.handleResult)
        .catch((err) => console.log('errror in fetching' + err))
    }
  }
  handleResult(resp){
    let resultArray = resp.data.results;
    console.log(resultArray);
    let popMap = {}, maxPop=-1;
    resultArray.forEach((e,i) => {
      let pop =  parseInt(e.population);
      pop = isNaN(pop)?0:pop;
      popMap[e.name] = pop
      if(pop > maxPop)
        maxPop = pop;
    })
    this.setState({
      planetResult:popMap,
      maxPop
    })
  }
  render() {
    const { planetResult, maxPop } = this.state;
    return (<div className="container">Enter planet names to fetch population details <br/>
      <input type="text" size="40" onKeyPress={this.handleKeyPress} onKeyUp={this.fetchData} />

     <h2>Planet Results</h2>
     <div>
       {map(planetResult, (k,v) => {
         let widthValue = (k / maxPop) * 100;
         widthValue = (widthValue<1)?"0.4":widthValue;
         widthValue = widthValue+'%';
         let styleClass = {
          width:widthValue
         }
         return <div>{v} with a population of {(k==0)?'unknown':k} <div className="bar" style={styleClass}></div></div>
        }
       )}
     </div>
    </div>);
  }
}

export default App;
