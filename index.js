function main (){
        var no=0;
        var SVG="http://www.w3.org/2000/svg";
        var pathContainer = document.getElementById('pathContainer');//存放path的容器
        var container = document.getElementById('interface-editor');//
        function findParent(node,filter){

            if(filter(node))return node;
            var ret=null;
            while (node.parentNode) {
              if(filter(node.parentNode)){
                ret = node.parentNode;
                break;
              }
              node = node.parentNode;
            }
            return ret;
        }

        function LineManager(){

          this.data = {};
        }

        LineManager.prototype = {
          findPathsByID:function(id){
            if(this.data[id]){
              return this.data[id].paths
            }else{
              return [];
            }
          },
          findPathByID:function(paths,id){
            var ret = null;
            for (var i = 0; i < paths.length; i++) {
              var path = paths[i];
              if(path.pathID==id){
                ret = path
                break;
              }
            }
            return ret;
          },
          drawPath:function(id,disx,disy){
            // debugger;
            var paths = this.findPathsByID(id);
            if(paths.length){
              for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                // console.log(path);
                var s = path.s;
                var e = path.e;
                var isS = path.isS;
                var pathID = path.pathID;

                if(isS){
                  line({
                    text:document.getElementById("text_"+pathID),
                    path:document.getElementById(pathID),
                    x1:s.x+disx,
                    y1:s.y+disy,
                    x2:e.x,
                    y2:e.y
                  })

                }else{
                  line({
                    text:document.getElementById("text_"+pathID),
                    path:document.getElementById(pathID),
                    x1:s.x,
                    y1:s.y,
                    x2:e.x+disx,
                    y2:e.y+disy
                  })
                }

              }
            }
          },
          updatePath:function(id,disx,disy){
            var paths = this.findPathsByID(id);
            if(paths.length){
              for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var s = path.s;
                var e = path.e;
                var isS = path.isS;
                var pathID = path.pathID;
                var relationID = path.relationID;

                if(isS){
                  s.x+=disx
                  s.y+=disy
                }else{
                  e.x+=disx;
                  e.y+=disy;
                }
                //同步修改相关联节点
                var pathRelation = this.findPathByID(this.findPathsByID(relationID),pathID);
                pathRelation.s = s;
                pathRelation.e = e;

              }
            }
          },
          push:function(opt){
            var id = opt.id;
            var data = opt.data;
            if(!this.data[id])this.data[id]={paths:[]};

            this.data[id]["paths"].push(data)
          },
          delByID:function(opt){
            var beginID = opt.beginID;
            var endID = opt.endID;
            var pathID = opt.pathID;
            var beginPaths = this.data[beginID]["paths"];
            var endPaths = this.data[endID]["paths"];

            var beginDotID,endDotID;
            var beginDotIDNo,endDotIDNo;
            for (var i = 0; i < beginPaths.length; i++) {
              var beginPath = beginPaths[i];

              if(beginPath.pathID==pathID){
                beginDotID = beginPath.dotID;
                this.data[beginID]["paths"].splice(i,1);
                beginPaths=this.data[beginID]["paths"];
               break;
              }
            }
            for (var i = 0; i < endPaths.length; i++) {
              var endPath = endPaths[i];
              if(endPath.pathID==pathID){
                endDotID = endPath.dotID;
                this.data[endID]["paths"].splice(i,1);
                endPaths=this.data[endID]["paths"];
                break;
              }
            }
            var isHasBeginDot,isHasEndDot;
            for (var i = 0; i < beginPaths.length; i++) {
              var beginPath = beginPaths[i];
              if(beginPath.dotID==beginDotID){
                isHasBeginDot = true;
                break
              }
            }
            for (var i = 0; i < endPaths.length; i++) {
              var endPath = endPaths[i];
              if(endPath.dotID==endDotID){
                isHasEndDot = true;
                break
              }
            }
            return {
              begin:{
                id:beginDotID,
                isHas:isHasBeginDot
              },
              end:{
                id:endDotID,
                isHas:isHasEndDot
              }
            }
          }
        }
        var lineManager = new LineManager();
        window.lineManager = lineManager;

        /*
        {
          'id':{
              paths:[{
                  s:{
                      x:,
                      y:
                  },
                  e:{
                    x:,
                    y
                  },
                  pos:{}
                  isS:true,
                  pathID:
              }]
          }
        }
        */
        var util = {
            "hasClass":function hasClass(obj, cls) {
              if(!obj)return;
              // console.log(obj);
              if(!obj.className)return null;
              if(!obj.className.match)return null;
               return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
           },
           "addClass":function addClass(obj, cls) {
               if (!this.hasClass(obj, cls)) obj.className += " " + cls;
           },
           "removeClass":function removeClass(obj, cls) {
               if (this.hasClass(obj, cls)) {
                   var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                   obj.className = obj.className.replace(reg, ' ');
               }
           }
        }
        //获取元素的纵坐标
        function getTop(e){
          var offset=e.offsetTop;
          if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
          return offset;
        }
        //获取元素的横坐标
        function getLeft(e){
          var offset=e.offsetLeft;
          if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
          return offset;
        }

        function createSvgElement(type){
          return document.createElementNS(SVG,type);
        }
        //获取鼠标位置，返回{x,y}
        function getMouseXY(e){
            var x=0, y=0;
            if(e.pageX||e.pageY){
                x = e.pageX;
                y = e.pageY;
            }else if(e.clientX||e.clientY){
                x = e.clientX +
                    document.documentElement.scrollLeft +
                    document.body.scrollLeft;
                y = e.clientY +
                    document.documentElement.scrollTop +
                    document.body.scrollTop;
            }
            return {x:x,y:y};
        }

        var dragOption = {
          disX:0,
          disY:0,
          elem:null,
          dragging:false,
          boundary:10

        }
        function dragOptionRest(){
          dragOption = {
            disX:0,
            disY:0,
            elem:null,
            dragging:false,
            boundary:10

          }
        }
        function dragBegin(e){
          dragOption.dragging = true;
          dragOption.elem = e.target.parentNode;
          var parent = findParent(dragOption.elem,function(node){
            if(util.hasClass(node,'patch')){
              return true;
            }else{
              return  false;
            }
          });
          dragOption.parentID = parent.getAttribute("id");
          var mouseXY = getMouseXY(e);

          dragOption.disX = mouseXY.x - dragOption.elem.offsetLeft;   // 鼠标横坐标 - div1的left
          dragOption.disY = mouseXY.y - dragOption.elem.offsetTop;
          dragOption.oleft = dragOption.elem.offsetLeft;
          dragOption.otop = dragOption.elem.offsetTop;

        }
        function dragMove(e){
          // var evnt = e || event;
          var mouseXY = getMouseXY(e);
           var x = mouseXY.x - dragOption.disX;
           var y = mouseXY.y - dragOption.disY;
           var window_width  = container.offsetWidth  - dragOption.elem.offsetWidth-dragOption.boundary;
           var window_height = container.offsetHeight - dragOption.elem.offsetHeight-dragOption.boundary;

           x = ( x < dragOption.boundary ) ? dragOption.boundary : x;                          // 当div1到窗口最左边时
           x = ( x > window_width ) ? window_width : x;    // 当div1到窗口最右边时
           y = ( y < dragOption.boundary ) ? dragOption.boundary : y;                          // 当div1到窗口最上边时
           y = ( y > window_height ) ? window_height : y;  // 当div1到窗口最下边时

           dragOption.elem.style.left = x + "px";
           dragOption.elem.style.top  = y + "px";
           dragOption.disx = x-dragOption.oleft;
           dragOption.disy= y-dragOption.otop;

           lineManager.drawPath(dragOption.parentID,x-dragOption.oleft,y-dragOption.otop)

        }
        function dragEnd(e){
          lineManager.updatePath(dragOption.parentID,dragOption.disx,dragOption.disy)
          dragOption.dragging = false;
          dragOptionRest();
        }
        var dragDotOption = {
          x1:0,
          y1:0,
          x2:0,
          y2:0,
          // sxy:0,
          // exy:0,

          line:document.getElementById('link-line'),
          pathline:document.getElementById('path-line'),
          numberOfCurves:1,
          // pathString:'',
          // SVG:"http://www.w3.org/2000/svg",
          currPath:null,
          beginDom:null,
          endDom:null,
          draggingDot:false
        }
        function dragDotOptionRest(){
          dragDotOption = {
            x1:0,
            y1:0,
            x2:0,
            y2:0,
            // sxy:0,
            // exy:0,

            line:document.getElementById('link-line'),
            pathline:document.getElementById('path-line'),
            numberOfCurves:1,
            // pathString:'',
            // SVG:"http://www.w3.org/2000/svg",
            currPath:null,
            beginDom:null,
            endDom:null,
            draggingDot:false
          }
        }
        function dragBeginDot(e){
          dragDotOption.draggingDot = true;
          dragDotOption.beginDom = e.target;
          dragDotOption.hasorange = util.hasClass(dragDotOption.beginDom,'orange');
          // console.log('-------',getLeft(beginDom));
          dragDotOption.currPath=createSvgElement('path');
          dragDotOption.currPath.setAttribute('fill', "none");
          dragDotOption.currPath.setAttribute('stroke', "orange");//rgba(229, 219, 61, 0.498039)
          dragDotOption.currPath.setAttribute('stroke-width', "2px");
          dragDotOption.currPath.setAttribute('style', "-webkit-tap-highlight-color: rgba(0, 0, 0, 0);");
          dragDotOption.currPath.setAttribute('opacity',0.5);
          dragDotOption.currText=createSvgElement('circle');


          // <circle cx="10" cy="10" r="7" version="1.1" xmlns="http://www.w3.org/1999/xhtml" fill="transparent" stroke="#7AB02C" style="" stroke-width="3"></circle>

          dragDotOption.currText.setAttribute('fill','orange');
          dragDotOption.currText.setAttribute('stroke','orange');
          dragDotOption.currText.setAttribute('opacity',0.6);

          dragDotOption.currText.setAttribute('r','4');
          dragDotOption.currText.setAttribute('className',"circle");
          // dragDotOption.currText.setAttribute('fill','orange');
          // dragDotOption.currText.setAttribute('width','30px');
          // dragDotOption.currText.setAttribute('height','30px');
          pathContainer.appendChild(dragDotOption.currPath);
          pathContainer.appendChild(dragDotOption.currText);
          dragDotOption.currText.onclick=function(){
              console.log(this.getAttribute('id'));
              var id = this.getAttribute('id');
              var pathID = id.replace('text_','');
              pathContainer.removeChild(document.getElementById(pathID));

              pathContainer.removeChild(this);
              dragDotOption.currText = null;
              var ids = id.split("$")[0].split("_");
              var ret = lineManager.delByID({
                beginID:ids[1],
                endID:ids[2],
                pathID:pathID
              })


              if(!ret.begin.isHas){
                util.removeClass(document.getElementById(ret.begin.id),'orange')
                util.addClass(document.getElementById(ret.begin.id),'white')
              }
              if(!ret.end.isHas){
                util.removeClass(document.getElementById(ret.end.id),'orange')
                util.addClass(document.getElementById(ret.end.id),'white')
              }

          }
          dragDotOption.currText.onmouseover=function(){
            var id = this.setAttribute('opacity',1);
          }
          dragDotOption.currText.onmouseout=function(){
            var id = this.setAttribute('opacity',0.6);
          }


          if(!util.hasClass(dragDotOption.beginDom,'orange')){
            util.addClass(dragDotOption.beginDom,'orange')
            util.removeClass(dragDotOption.beginDom,'white')

          }

          // line.style.display = 'block';
          // line.setAttribute('x1', getLeft(beginDom) + 3);
          // line.setAttribute('y1', getTop(beginDom) + 3);
          // line.setAttribute('x2', getLeft(beginDom) + 3);
          // line.setAttribute('y2', getTop(beginDom) + 3);
          dragDotOption.x1=getLeft(dragDotOption.beginDom)+ 3;
          dragDotOption.y1=getTop(dragDotOption.beginDom)+ 3;
        }

        function line(opt){
          var path = opt.path;
          var text = opt.text;
          var x1 = opt.x1;
          var y1 = opt.y1;
          var x2 = opt.x2;
          var y2 = opt.y2;

          var sxy = x1 + "," + y1;
          var exy = x2 + "," + y2;

          // Create Raphael canvas
          var width = Math.max(x2, x1) + 15; // 15 px padding to make sure nothing is clipped
          var height = Math.max(y2, y1) + 15;

          var controlPoint1 = x2 + "," + y1;
          var controlPoint2 = x1 + "," + y2;
          var pathString;
          // if (dragDotOption.numberOfCurves == 0) {
          //   pathString = "M" + sxy + " " + "Q" + exy + " " + exy;
          // }
          // if (dragDotOption.numberOfCurves == 1) {
          //   pathString = "M" + sxy + " " + "Q" + controlPoint1 + " " + exy;
          // }
          // if (dragDotOption.numberOfCurves == 2) {
            pathString = "M" + sxy + " " + "C" + controlPoint1 + " " + controlPoint2 + " " + exy;
          // }
          // var controlPoint2 = (x1+(x2-x1)/2) + "," + (y1+(y2-y1)/2);
          // var controlPoint1 = (y1+(y2-y1)/2) + "," + (x1+(x2-x1)/2);
          // pathString = "M" + sxy + " " + "C" + controlPoint1 + " " + controlPoint2 + " " + exy;
          // <path d="M 224 85.33333333333334 C 114.5 52.66666666666667 114.5 52.66666666666667 5 0 " transform="translate(0,3)" pointer-events="visibleStroke" version="1.1" xmlns="http://www.w3.org/1999/xhtml" fill="none" stroke="#5c96bc" style="" stroke-width="2"></path>

          path.setAttribute("d",pathString);
          text.setAttribute("cx",(x1+(x2-x1)/2));
          text.setAttribute("cy",(y1+(y2-y1)/2));

        }

        function dragMoveDot(e){
          var mouseXY = getMouseXY(e);
          dragDotOption.x2 = mouseXY.x;
          dragDotOption.y2 = mouseXY.y;
          line({
            text:dragDotOption.currText,
            path:dragDotOption.currPath,
            x1:dragDotOption.x1,
            y1:dragDotOption.y1,
            x2:dragDotOption.x2,
            y2:dragDotOption.y2,

          })
        }
        function dragEndDot(e){
          dragDotOption.draggingDot = false;
          dragDotOption.endDom = e.target
          if (!util.hasClass(dragDotOption.endDom,'dot')) {
            if (dragDotOption.currPath) {
              pathContainer.removeChild(dragDotOption.currPath)
              pathContainer.removeChild(dragDotOption.currText)
              dragDotOption.currPath = null;
              if(!dragDotOption.hasorange){
                util.removeClass(dragDotOption.beginDom,'orange')
                util.addClass(dragDotOption.beginDom,'white')
              }


            }
          }else {
            if(!util.hasClass(dragDotOption.endDom,'orange')){
              util.addClass(dragDotOption.endDom,'orange')
              util.removeClass(dragDotOption.endDom,'white')
            }
            var parentEnd = findParent(dragDotOption.endDom,function(node){
              if(util.hasClass(node,'patch')){
                return true;
              }else{
                return  false;
              }
            });
            var parentBegin = findParent(dragDotOption.beginDom,function(node){
              if(util.hasClass(node,'patch')){
                return true;
              }else{
                return  false;
              }
            });
            var endID = parentEnd.getAttribute('id');
            var beginID = parentBegin.getAttribute('id');


            var id = beginID+"_"+endID+"$"+(new Date)*1;

            var beginDotID = dragDotOption.beginDom.getAttribute('data-reactid')
            //
            // if(!beginDotID){
            //   beginDotID = (++no);
            //   dragDotOption.beginDom.setAttribute('id',beginDotID)
            // }
            var endDotID = dragDotOption.endDom.getAttribute('data-reactid')
            if(!dragDotOption.beginDom.getAttribute('id')){
              dragDotOption.beginDom.setAttribute('id',beginDotID)
            }
            if(!dragDotOption.endDom.getAttribute('id')){
              dragDotOption.endDom.setAttribute('id',endDotID)
            }
            // if(!endDotID){
            //   endDotID = (++no);
            //   dragDotOption.endDom.setAttribute('id',endDotID)
            // }
            // console.log(dragDotOption.endDom);

            dragDotOption.currPath.setAttribute('id',id)
            dragDotOption.currText.setAttribute('id',"text_"+id)
            lineManager.push(
              {
                id:beginID,
                data:{
                  s:{
                      x:dragDotOption.x1,
                      y:dragDotOption.y1
                  },
                  e:{
                    x:dragDotOption.x2,
                    y:dragDotOption.y2
                  },
                  isS:true,
                  pathID:id,
                  relationID:endID,
                  dotID:beginDotID
                }
              }
            )
            lineManager.push(
              {
                id:endID,
                data:{
                  s:{
                      x:dragDotOption.x1,
                      y:dragDotOption.y1
                  },
                  e:{
                    x:dragDotOption.x2,
                    y:dragDotOption.y2
                  },
                  isS:false,
                  pathID:id,
                  relationID:beginID,
                  dotID:endDotID
                }
              }
            )
            // console.log(lineManager);
            dragDotOptionRest()

          //   dragDotOption.endDom
          //   if(lineManager.data[])
          //   {
          //     'id':{
          //         paths:[{
          //             s:{
          //                 x:,
          //                 y:
          //             },
          //             e:{
          //               x:,
          //               y
          //             },
          //             isS:true,
          //             pathID:
          //         }]
          //     }
          //
          // }
          /*
          {
              moduleID:{
                dotID:{
                  s:{
                      x:,
                      y:
                  },
                  e:{
                    x:,
                    y
                  },
                  isS:true,
                  pathID:
               },

            }
          }
          */
          }
        }


        document.onmousedown = function(e) {
          // console.log(e.target);
            if (util.hasClass(e.target,'dot')) {
                dragBeginDot(e);
            }
            if (util.hasClass(e.target,'draggable')) {
                dragBegin(e);
            }

            document.onmousemove = function(e) {
                if (dragDotOption.draggingDot) {
                  dragMoveDot(e);
                }else if(dragOption.dragging){
                  dragMove(e)
                }


            }

        }
        document.onmouseup = function(e) {
          if (dragDotOption.draggingDot) {
            dragEndDot(e);
          }else if(dragOption.dragging){
            dragEnd(e)
          }
          document.onmousemove = null;
       }
      //  document.onclick = function(e) {
       //
      //    if (e.target.tagName=="circle") {
      //         alert(1)
      //    }
       //
      //  }
    };
