//console.log("JS")

function makeDraggable(evt) {
  var svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  var rect1 = document.getElementById('rect1');
  var rect2 = document.getElementById('rect2');
  var cxn = document.getElementById('connection');
  var path = document.getElementById('path6');
  function updateConnection(){
    var x1 = parseFloat(rect1.getAttributeNS(null, 'x'));
    var y1 = parseFloat(rect1.getAttributeNS(null, 'y'));
    var x2 = parseFloat(rect2.getAttributeNS(null, 'x'));
    var y2 = parseFloat(rect2.getAttributeNS(null, 'y'));
  
    // Half widths and half heights
    var w1 = parseFloat(rect1.getAttributeNS(null, 'width')) / 2;
    var h1 = parseFloat(rect1.getAttributeNS(null, 'height')) / 2;
    var w2 = parseFloat(rect2.getAttributeNS(null, 'width')) / 2;
    var h2 = parseFloat(rect2.getAttributeNS(null, 'height')) / 2;
  
    // Center coordinates
    var cx1 = x1 + w1;
    var cy1 = y1 + h1;
    var cx2 = x2 + w2;
    var cy2 = y2 + h2;
  
    // Distance between centers
    var dx = cx2 - cx1;
    var dy = cy2 - cy1;

    if (!dx) {
      p1 = [cx1, y1 + h2 * 2];
      p2 = [cx1, y2];
      //console.log(p1)
      //console.log(p2)
    } else {
      p1 = getIntersection(dx, dy, cx1, cy1, w1, h1);
      p2 = getIntersection(-dx, -dy, cx2, cy2, w2, h2);
    }
  
    cxn.setAttributeNS(null, 'x1', p1[0]);
    cxn.setAttributeNS(null, 'y1', p1[1]);
    cxn.setAttributeNS(null, 'x2', p2[0]);
    cxn.setAttributeNS(null, 'y2', p2[1]);

    var startX=0
    var startY=0
    var endX=0
    var endY=0
    // if(p1[0]>=p2[0]){
    //   startX=p1[0]
    //   startY=p1[1]
    //   endY=p2[0]
    //   endY=p2[1]
    // }
    if(p1[1]<=p2[1]){
      startX=p1[0]
      startY=p1[1]
      endX=p2[0]
      endY=p2[1]
      console.log("y")
    }else if(p1[1]>=p2[1]){
      startX=p2[0]
      startY=p2[1]
      endX=p1[0]
      endY=p1[1]
    }


    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    // for further calculations which ever is the shortest distance
    var delta  =  deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);
    var arc1 = 0; var arc2 = 1;
    if (startX > endX) {
        arc1 = 1;
        arc2 = 0;
    }
    path.setAttributeNS(null,"d",  "M"  + startX + " " + startY +
    " V" + (startY + delta) +
    " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
    " H" + (endX - delta*signum(deltaX)) + 
    " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
    " V" + endY );

  }
  function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}

  updateConnection();

  
function getIntersection(dx, dy, cx, cy, w, h) {
  if (Math.abs(dy / dx) < h / w) {
    // Hit vertical edge of box1
    return [cx + (dx > 0 ? w : -w), cy + dy * w / Math.abs(dx)];
   } else {
    // Hit horizontal edge of box1
    return [cx + dx * h / Math.abs(dy), cy + (dy > 0 ? h : -h)];
    }
  };
  
  

  var selectedElement, offset,transform;
  function startDrag(evt) {
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      offset = getMousePosition(evt);
      // Get all the transforms currently on this element
      var transforms = selectedElement.transform.baseVal;
      // Ensure the first transform is a translate transform
      if (transforms.length === 0 ||
          transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        // Create an transform that translates by (0, 0)
        var translate = svg.createSVGTransform();
        translate.setTranslate(0, 0);
        // Add the translation to the front of the transforms list
        selectedElement.transform.baseVal.insertItemBefore(translate, 0);
      }
      // Get initial translation amount
      transform = transforms.getItem(0);
      //offset.x -= transform.matrix.e;
      //offset.y -= transform.matrix.f;
      offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
      offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
      
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);
     // transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
      selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
      selectedElement.setAttributeNS(null, "y", coord.y - offset.y);
      updateConnection()
    }
  }

  function endDrag(evt) {
    selectedElement = null;
  }

  function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

}

//https://gist.github.com/alojzije/11127839
//https://stackoverflow.com/questions/50252070/svg-draw-connection-line-between-two-rectangles