editorframe.document.designMode = "on";

var editorbody = editorframe.document.getElementsByTagName("body")[0];
var editorhead = editorframe.document.getElementsByTagName("head")[0];

function insertImage(imglink){
  var str = "<p class='some' onclick='removeImage(this)'></p><img src='"+imglink+"' />";
  execCmdWithArg('insertHTML', str);
  execCmd('insertParagraph');
}

function execCmd(command){
  editorframe.document.execCommand(command, false, null);
}
function execCmdWithArg(command, arg){
  editorframe.document.execCommand(command, false, arg);
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

function undo(){
 execCmd('undo');
}

function redo(){
 execCmd('redo');
}

x.observe(editorframe.document.getElementsByTagName('body')[0], {childList: true});
editorframe.document.addEventListener("keydown", checkForImage);
document.getElementById("gethtmlbutton").onclick = function(){
  document.getElementById("resultdiv").innerText = getHTML();
};
document.getElementById("sethtmlbutton").onclick = function(){
  setHTML('<h3>this is a header h3</h3><div>Now this is a normal paragraph, nothing else</div><div>Heres an image</div><p class="some" onclick="removeImage(this)"></p><img src="darkback.jpg"><div><br></div>');
};
appendCss();
