import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import InputComponent from './Components/Input.Component';

class App extends Component {
  render() {
    let greetings = 'Welcome to React';
    const tableHeader = ['Company','Contact','Country'];
    const tableContent = [['Alfreds Futterkiste', 'Maria Anders', 'Germany'],
    ['Centro comercial Moctezuma', 'Francisco Chang', 'Germany'],
    ['Ernst Handel', 'Roland Mendel', 'Austria'],
    ['Island Trading', 'Helen Bennett', 'UK'],
    ['Laughing Bacchus Winecellars', 'Yoshi Tannamuri', 'Canada'],
    ['Magazzini Alimentari Riuniti', 'Giovanni Rovelli', 'Italy']
    ];
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{greetings}</h2>
        </div>
        <InputComponent tableHeader={tableHeader} tableContent={tableContent}/>
      </div>
    );
  }
}

export default App;
