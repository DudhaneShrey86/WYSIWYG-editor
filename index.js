editorframe.document.designMode = "on";

function insertimage(){
  var str = "<p class='some' onclick='removeimage(this)'></p><img src='darkback.jpg' />";
  execCommandWithArg('insertHTML', str);
  execCommand('insertParagraph');
}

function execCommand(command){
  editorframe.document.execCommand(command, false, null);
}
function execCommandWithArg(command, arg){
  editorframe.document.execCommand(command, false, arg);
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

var x = new MutationObserver(function(e){
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
    else if(removedelement.classList.contains('some')){
      var imgelements = editorframe.document.getElementsByTagName('img');
      for(var img of imgelements){
        if(img.previousElementSibling == null || !img.previousElementSibling.classList.contains('some')){
          img.remove();
        }
      }
    }
  });
});

function checkimage(){
  if(event.which == 8){
    var parent = editorframe.window.getSelection().getRangeAt(0);
    if(parent.endContainer.children){
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
          if(lastelement.children[0].classList.contains("some")){
            event.preventDefault();
            lastelement.remove();
          }
        }
      }
    }
  }
}


x.observe(editorframe.document.getElementsByTagName('body')[0], {childList: true});
editorframe.document.addEventListener("keydown", checkimage);
appendcss();
