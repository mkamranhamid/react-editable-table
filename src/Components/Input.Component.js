import React, { Component } from 'react';
import './Input.Component.css';
//import './Input.Component.css';

class InputComponent extends Component {
  constructor(props){
    super(props)
    this.preSearchData = null;
    this.handleHeaderClick = this.handleHeaderClick.bind(this)
    this.handleEditBodyDoubleClick = this.handleEditBodyDoubleClick.bind(this)
    this.saveEditedField = this.saveEditedField.bind(this)
    this.toggleSearchBox = this.toggleSearchBox.bind(this)
    this.searchText = this.searchText.bind(this)
  }
  static propTypes = {
    tableHeader: React.PropTypes.arrayOf(
      React.PropTypes.string
    ),
    tableContent: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(
        React.PropTypes.string
      )
    )
  }
  state = {
    data: this.props.tableContent,
    sortBy:null,
    descending:false,
    edit: {
        row: null,
        cell: null,
      },
    search: false
  }
  handleHeaderClick(e){
    var column = e.target.cellIndex;
    var data = Array.from(this.state.data);
    var descending = this.state.sortby === column && !this.state.descending;
    data.sort(function (a, b) {
      return descending ? (a[column] < b[column] ? 1 : -1):(a[column] > b[column] ? 1 : -1);
    });
    this.setState({
      data: data,
      sortBy:column,
      descending:descending
    });
  }
  saveEditedField(e) {
    e.preventDefault();
    var input = e.target.firstChild;
    var data = Array.from(this.state.data);
    data[this.state.edit.row][this.state.edit.cell] = input.value;
    this.setState({
      edit: null, // done editing
      data: data,
    });
  }

  handleEditBodyDoubleClick(e){
    this.setState({
      edit: {
        row: +e.target.dataset.row,
        cell: e.target.cellIndex,
      }
    });
  }
  toggleSearchBox(){
    var searchResult = this.state.search?false:true;
    if(searchResult){
      this.preSearchData = this.state.data;
    }
    this.setState({
      search: searchResult
    })
  }
  searchText(e) {
    var searchWord = e.target.value.toLowerCase();
    var columnToSearch = +e.target.dataset.idx;
    console.log(searchWord)
    if (searchWord.length <= 0) {
      this.setState({ data: this.preSearchData });
      return;
    }
    var searchResult = this.state.data.filter((d) => {
      return (d[columnToSearch].toLowerCase().indexOf(searchWord) > -1)
    })
    console.log(searchResult)
    this.setState({ data: searchResult });
  }
  download(format, ev) {
    console.log(format);
    var contents = format === 'json'
      ? JSON.stringify(this.state.data)
      : this.state.data.reduce(function (result, row) {
        return result
          + row.reduce(function (rowresult, cell, idx) {
            return rowresult
              + '"'
              + cell.replace(/"/g, '""')
              + '"'
              + (idx < row.length - 1 ? ',' : '');
          }, '')
          + "\n";
      }, '');
    var URL = window.URL || window.webkitURL;
    var blob = new Blob([contents], { type: 'text/' + format });
    ev.target.href = URL.createObjectURL(blob);
    ev.target.download = 'data.' + format;
  }
  
  render() {
      const tHead = this.props.tableHeader.map((d,i)=>{
        if (this.state.sortBy === i) {
          d += this.state.descending ? ' \u2191' : ' \u2193'
        }
        if (this.state.search) {
            return <td key={i}><input type='text' onChange={this.searchText} data-idx={i} /></td>
        }
        return <td key={i}>{d}</td>
      },this)
      const tBody = this.state.data.map((arrofnames,i)=>{
        var tBodyContent = arrofnames.map((d,ind)=>{
          var content = d;
          var edit = this.state.edit;
          if (edit && edit.row === i && edit.cell === ind) {
            return <td key={ind}><form onSubmit={this.saveEditedField} key={ind+1}><input type='text' key={ind} defaultValue={content} /></form></td>
          }
          return <td key={ind} data-row={i}>{d}</td>
        })
        return <tr key={i}>{tBodyContent}</tr>
      })
    return (
      <div className="App">
      <button onClick={this.toggleSearchBox}>{this.state.search?'Done Search':'Search'}</button>
      <a href='data.json' onClick={this.download.bind(this,'json')}>Export JSON</a>
      <a href='data.csv' onClick={this.download.bind(this,'csv')}>Export CSV</a> 
       <table>
       <thead onClick={this.handleHeaderClick}><tr>{tHead}</tr></thead>
        <tbody onDoubleClick={this.handleEditBodyDoubleClick}>{tBody}</tbody>
       </table>
      </div>
    );
  }
}

export default InputComponent;
