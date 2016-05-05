var Switch = React.createClass({
  getInitialState: function() {
    return this.props.results||{
      title:"Switch",
      results:{
        inputs:[
          {
            text:"Flip",
            value:""
          },
          {
            text:"Turn On",
            value:""
          },
          {
            text:"Turn Off",
            value:""
          }
        ],
        outputs:[
          {
            text:"On / Off",
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
      "left":"400px",
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
        <h3 className="draggable"> Switch</h3>
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
