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
  var str = '<p class="some"><img src=".././darkback.jpg"></p>';
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
  var node = editorframe.document.createElement('STYLE');
  var textnode = `
  .some::before{
    content: '';
    position: absolute;
    right: 10px;
    top: 20px;
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
  var textnode = document.createTextNode(textnode);
  node.appendChild(textnode);
  editorframe.document.getElementsByTagName("head")[0].appendChild(node);
}

function showfocus(event){
  if(event.which == 8){
    console.log(editorframe.window.getSelection().getRangeAt(0));
  }
}

editmode();
appendcss();
editorframe.document.addEventListener("keydown", showfocus);
