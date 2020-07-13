function execCmd(command){
  editorframe.document.execCommand(command, false, null);
}
function execCmdWithArg(command, arg){
  editorframe.document.execCommand(command, false, arg);
}
function insert(){
  execCmdWithArg('insertImage', '.././darkback.jpg');
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
  var textnode = document.createTextNode("img{display: block;width: 100%;margin: 10px 0px;}");
  node.appendChild(textnode);
  editorframe.document.getElementsByTagName("head")[0].appendChild(node);
}


editmode();
appendcss();
