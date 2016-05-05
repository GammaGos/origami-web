var Layer = React.createClass({
  getInitialState: function() {
    return this.props.results||{
      title:"Layer",
      results:{
        inputs:[
          {
            text:"Enable",
            value:"✓"
          },
          {
            text:"Anchor Point",
            value:""
          },
          {
            text:"X Position",
            value:""
          },
          {
            text:"Y Position",
            value:""
          },
          {
            text:"Z Position",
            value:""
          },
          {
            text:"X Rotation",
            value:""
          },
          {
            text:"Y Rotation",
            value:""
          },
          {
            text:"Z Rotation",
            value:""
          },
          {
            text:"Width",
            value:""
          },
          {
            text:"Height",
            value:""
          },
          {
            text:"Image",
            value:""
          },
          {
            text:"Height",
            value:""
          },
          {
            text:"Mask Image",
            value:""
          },
          {
            text:"Color",
            value:""
          },
          {
            text:"Opacity",
            value:""
          },
          {
            text:"Scale",
            value:""
          }
        ],
        outputs:[

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
      "left":"600px",
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

        <h3 className="draggable">Layer</h3>
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
