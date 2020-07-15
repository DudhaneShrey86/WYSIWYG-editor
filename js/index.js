function execCmd(command){
  editorframe.document.execCommand(command, false, null);
}
function execCmdWithArg(command, arg){
  editorframe.document.execCommand(command, false, arg);
}

// function insert(){
//   execCmdWithArg('insertImage', '.././darkback.jpg');
//   execCmd('insertParagraph');
// }
function insertimage(){
  var parent = editorframe.window.getSelection().getRangeAt(0);
  if(parent.endContainer.nodeName == 'DIV'){
    parent.endContainer.remove();
  }
  var str = '<p class="some" onclick="removeimage(this);"></p><img src=".././darkback.jpg" />';
  execCmdWithArg('insertHTML', str);
  execCmd('insertParagraph');
}

//////enabling editing mode
function editmode(){
  editorframe.document.designMode = 'On';
}
function appendcss(){
  var nodecss = editorframe.document.createElement('STYLE');
  var textnodecss = `
  .some{
    position: relative;
  }
  .some::before{
    content: '';
    position: absolute;
    right: 10px;
    top: 10px;
    width: 20px;
    height: 20px;
    background: red;
    z-index: 10;
  }
  img{
    display: block;
    width: 100%;
    margin: 10px 0;
  }
  `;
  var nodejs = editorframe.document.createElement('SCRIPT');
  var textnodejs = `
  function removeimage(t){
    t.nextSibling.remove();
    t.remove();
  }
  `;

  var textnodecss = document.createTextNode(textnodecss);
  nodecss.appendChild(textnodecss);
  editorframe.document.getElementsByTagName("head")[0].appendChild(nodecss);
  var textnodejs = document.createTextNode(textnodejs);
  nodejs.appendChild(textnodejs);
  editorframe.document.getElementsByTagName("head")[0].appendChild(nodejs);
}

function showfocus(event){
  if(event.which == 8){
    var parent = editorframe.window.getSelection().getRangeAt(0);
    if(parent.endContainer.previousElementSibling != null){
      var lastelement = parent.endContainer.previousElementSibling;
      if(lastelement.nodeName == "IMG"){
        event.preventDefault();
        lastelement.previousSibling.remove();
        lastelement.remove();
      }
      else{
        //////////here
        // event.preventDefault();
        var divelement = parent.endContainer.previousElementSibling;
        if(parent.endContainer.nodeName == 'BODY'){

        }
        else if(divelement.lastElementChild){
          if(divelement.lastElementChild.nodeName == "IMG"){
            event.preventDefault();
            divelement.remove();
          }
        }
      }
    }
  }
}
function removeimage(t){
  console.log(t);
}

var x = new MutationObserver(function(e){
  if(e[0].removedNodes[0]){
    var removedelement = e[0].removedNodes[0];
    if(removedelement.nodeName == "IMG"){
      var pelements = editorframe.document.getElementsByClassName('some');
      for(var p of pelements){
        if(p.nextSibling.nodeName != "IMG"){
          p.remove();
        }
      }
    }
  }
});
x.observe(editorframe.document.getElementsByTagName('body')[0], {childList: true});

editmode();
appendcss();
editorframe.document.addEventListener("keydown", showfocus);
