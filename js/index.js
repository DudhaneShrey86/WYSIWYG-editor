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
function insertsomething(){
  var str = '<p class="some" onclick="removeimage(this);"></p><img src=".././darkback.jpg" />';
  execCmdWithArg('insertHTML', str);
  execCmd('insertParagraph');
}

// function insertimage(t){
//   execCmdWithArg('insertImage', t.value);
//   t.value = "";
// }

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
  editorframe.document.getElementsByTagName("body")[0].appendChild(nodejs);
}

function showfocus(event){
  if(event.which == 8){
    var parent = editorframe.window.getSelection().getRangeAt(0);
    if(parent.endContainer.lastChild != null){
      var lastelement = parent.endContainer.lastElementChild;
      if(lastelement.nodeName == "IMG"){
        lastelement.previousSibling.remove();
      }
      else{
        console.log('no');
      }
    }
  }
}
function removeimage(t){
  console.log(t);
}

editmode();
appendcss();
editorframe.document.addEventListener("keydown", showfocus);
