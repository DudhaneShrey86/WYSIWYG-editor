editorframe.document.designMode = "on";

function insertImage(imglink){
  var str = "<p class='some' onclick='removeImage(this)'></p><img src='"+imglink+"' />";
  execCommandWithArg('insertHTML', str);
  execCommand('insertParagraph');
}

function execCommand(command){
  editorframe.document.execCommand(command, false, null);
}
function execCommandWithArg(command, arg){
  editorframe.document.execCommand(command, false, arg);
}

function appendCss(){
  var nodecss = editorframe.document.createElement('STYLE');
  var textnodecss = `
  body{
    margin: 0;
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
  function removeImage(t){
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

function checkImage(){
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
  editorframe.document.getElementsByTagName('body')[0].style.padding = left+'px '+top+'px '+right+'px '+bottom+'px';
}

function setTextColor(mode){
  if(mode == 0){
    editorframe.document.getElementsByTagName('body')[0].style.setProperty('color', 'black');
  }else{
    editorframe.document.getElementsByTagName('body')[0].style.setProperty('color', 'white');
  }
}

function getHTML(){
  var str = String(editorframe.document.getElementsByTagName('body')[0].innerHTML);
  return str;
}
function setHTML(htmlstr){
  editorframe.document.getElementsByTagName("body")[0].innerHTML = htmlstr;
}


x.observe(editorframe.document.getElementsByTagName('body')[0], {childList: true});
editorframe.document.addEventListener("keydown", checkImage);
document.getElementById("gethtmlbutton").onclick = function(){
  document.getElementById("resultdiv").innerText = getHTML();
};
document.getElementById("sethtmlbutton").onclick = function(){
  setHTML('this is a sample html string.<div>It will be used in setHTML function for now.</div><div>Will leave a 3 line space below this line</div><div><br></div><div><br></div><div><br></div><div>To check if it worked fine.</div><div>Now an image!</div><p class="some" onclick="removeImage(this)"></p><img src="darkback.jpg"><div>Some dummy text next</div><div>And yet again an image</div><div><p class="some" onclick="removeImage(this)"></p><img src="darkback.jpg"></div><div>This is the end</div>');
};
appendCss();
