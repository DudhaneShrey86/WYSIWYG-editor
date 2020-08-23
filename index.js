editorframe.document.designMode = "on";

var editorbody = editorframe.document.getElementsByTagName("body")[0];
var editorhead = editorframe.document.getElementsByTagName("head")[0];
var undoflag;
var redoflag;

function insertImage(imglink){
  var str = "<p class='some'></p><img src='"+imglink+"' />";
  execCmdWithArg('insertHTML', str);
  execCmd('insertParagraph');
}

function execCmd(command){
  editorframe.document.execCommand(command, false, null);
  checkButtons();
}
function execCmdWithArg(command, arg){
  editorframe.document.execCommand(command, false, arg);
  checkButtons();
}

function appendCss(){
  var nodecss = editorframe.document.createElement('STYLE');
  var textnodecss = `
  body{
    margin: 0;
  }
  body.blank::after{
    content: 'Enter note here';
    z-index: 1;
    color: #808080;
    width: 100%;
    height: 100%;
  }
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
    background-image: url('close.png');
    background-size: contain;
    z-index: 10;
  }
  img{
    display: block;
    width: 100%;
    margin: 10px 0;
    max-height: 230px;
    object-fit: cover;
    object-position: center;
  }
  h3{
    margin: 5px auto;
  }
  `;
  var nodejs = editorframe.document.createElement('SCRIPT');
  var textnodejs = `
  function removeImage(t){
    t.nextSibling.remove();
    t.remove();
  }
  document.addEventListener("click", function(event){
    if(event.target && event.target.className == "some"){
      removeImage(event.target);
    }
  });
  `;
  var textnodecss = document.createTextNode(textnodecss);
  nodecss.appendChild(textnodecss);
  editorhead.appendChild(nodecss);
  var textnodejs = document.createTextNode(textnodejs);
  nodejs.appendChild(textnodejs);
  editorhead.appendChild(nodejs);
  editorbody.classList.add("blank");
}

var x = new MutationObserver(function(e){
  if(editorbody.innerHTML == ""){
    editorbody.classList.add("blank");
  }
  else{
    editorbody.classList.remove("blank");
  }
  var removedelements = e[0].removedNodes;
  removedelements.forEach((removedelement, i) => {
    if(removedelement.nodeName == "IMG"){
      var pelements = editorframe.document.getElementsByClassName('some');
      for(var p of pelements){
        if(p.nextElementSibling == null || p.nextElementSibling.nodeName != "IMG"){
          p.remove();
        }
      }
    }
    else if(removedelement.classList && removedelement.classList.contains('some')){
      var imgelements = editorframe.document.getElementsByTagName('img');
      for(var img of imgelements){
        if(img.previousElementSibling == null || !img.previousElementSibling.classList.contains('some')){
          img.remove();
        }
      }
    }
  });
});

function checkForImage(){
  if(event.which == 8){
    var parent = editorframe.window.getSelection().getRangeAt(0);
    if(parent.endContainer.children && parent.endContainer.children[0]){
      if(parent.endContainer.children[0].classList.contains("some")){
        event.preventDefault();
        parent.endContainer.remove();
      }
    }
    if(parent.endContainer.previousElementSibling != null){
      var lastelement = parent.endContainer.previousElementSibling;
      if(lastelement.nodeName == "IMG"){
        event.preventDefault();
        lastelement.previousSibling.remove();
        lastelement.remove();
      }
      else if(lastelement.nodeName == "DIV"){
        if(lastelement){
          if(lastelement.children[0] && lastelement.children[0].classList.contains("some")){
            event.preventDefault();
            lastelement.remove();
          }
        }
      }
    }
  }
  checkButtons();
}

////////////new functions here///////////////
function setPadding(left, top, right, bottom){
  editorbody.style.padding = top+'px '+right+'px '+bottom+'px '+left+'px';
}

function setTextColor(mode){
  if(mode == 0){
    editorbody.style.setProperty('color', 'black');
  }else{
    editorbody.style.setProperty('color', 'white');
  }
}

function getHTML(){
  var str = String(editorbody.innerHTML);
  return str;
}
function setHTML(htmlstr){
  editorbody.innerHTML = htmlstr;
}

function setBold(){
  execCmd('bold');
}

function setItalic(){
  execCmd('italic');
}

function setUnderline(){
  execCmd('underline');
}

function setAlignLeft(){
  execCmd('justifyLeft');
}

function setAlignRight(){
  execCmd('justifyRight');
}

function setAlignCenter(){
  execCmd('justifyCenter');
}

function setUnorderedList(){
  execCmd('insertUnorderedList');
}

function setOrderedList(){
  execCmd('insertOrderedList');
}

function setTextSize(){
  execCmdWithArg('formatBlock', 'H3');
}

function undo(){
  execCmd('undo');
}

function redo(){
  execCmd('redo');
}

function checkButtons(){
  undoflag = false;
  redoflag = false;
  if(editorframe.document.queryCommandEnabled("undo")){
    undoflag = true;
  }
  if(editorframe.document.queryCommandEnabled("redo")){
    redoflag = true;
  }
  // calls your java function here
  // JSAction.checkButtons(undoflag, redoflag);
}

x.observe(editorframe.document.getElementsByTagName('body')[0], {childList: true});
editorframe.document.addEventListener("keydown", checkForImage);
appendCss();
checkButtons();
