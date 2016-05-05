
var Transition = React.createClass({
  getInitialState: function() {
    return this.props.results||{
      title:"Transition",
      results:{
        inputs:[
          {
            text:"Progress",
            value:""
          },
          {
            text:"Start Value",
            value:""
          },
          {
            text:"End Value",
            value:""
          }
        ],
        outputs:[
          {
            text:"Value",
            value:""
          }
        ]
      }
    };
  },
  onMouseOver:function(event){
    event.target.style.borderColor="red"
  },
  onMouseOut:function(){
    event.target.style.borderColor="white"
  },
  render: function() {
    var elementStyle = {
      "top": "40px",
      "position":"absolute",
      "top":"350px",
      "left":"200px",
      "zIndex":100
    };
    var inputs = this.state.results.inputs.map(function(result, i) {
      return (
        <li>
        {result.text}<span className="patch-value" >{result.value}</span>
        <span style={{border:"1px solid white"}} className="dot white" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}></span>
        </li>
      );
    }.bind(this));
    var outputs = this.state.results.outputs.map(function(result, i) {
      return (
        <li>
        {result.text}<span className="patch-value" >{result.value}</span>
        <span style={{border:"1px solid white"}} className="dot white" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}></span>
        </li>
      );
    }.bind(this));
    var id = this.state.title+"*"+(new Date())*1
    var className = "patch "+this.state.title+" draggable"
    return (
      <div className={className} id={id} style={elementStyle}>

        <h3 className="draggable">{this.state.title}</h3>
        <ul className="inputs">

          {inputs}

        </ul>
        <ul className="outputs">

          {outputs}

        </ul>
        <hr></hr>
      </div>
    );
  }
});
