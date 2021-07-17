const btnBold = document.querySelector("#btn-bold");
const btnItalic = document.querySelector("#btn-italic");
const btnUnderline = document.querySelector("#btn-underline");
const btnLink = document.querySelector("#btn-link");
const btnImg = document.querySelector("#btn-img");
const btnMeme = document.querySelector("#btn-meme");
const btnClose = document.querySelector("#btn-close");

const contentBox = document.querySelector("#content-box");
const content = document.querySelector("#content");
const linkBox = document.querySelector("#link-box");
const btnInsert = document.querySelector("#btn-insert");

let contentHtml,action,link,strMeme;

// function that changes the text settings
function formatText(cmd, value) {
  document.execCommand(cmd, false, value);
  contentBox.focus();
}

// to get link value and insert 
function getLink(actionValue) {
  linkBox.style.display = "block";
  action = actionValue;
}

function insertElement() {
  const linkInput = document.querySelector("#link");
  link = linkInput.value;
  if(linkInput !== ""){
    if(action === "insertImage"){
      content.innerHTML = content.innerHTML + "<br/> &nbsp;";
      setCursorToEnd();
    } 
    formatText(action, link);
    linkInput.value = "";
    content.innerHTML = content.innerHTML + "&nbsp;";
    setCursorToEnd()
  }else{
    alert("Enter link !!")
  }
 
}

// extract meme string and call api
async function getMemeText() {
  contentHtml = content.innerHTML;
  let i1 = contentHtml.indexOf("{{");
  let i2 = contentHtml.indexOf("}}");

  if(i1 !== -1 && i2 !== -1){
     strMeme = contentHtml.substr(i1 + 2, i2 - i1 - 2);
     strMeme = strMeme.split("_").join(" ");
     content.innerHTML = contentHtml.slice(0, i1);
     grab_data();
  }else{
     alert("Enter meme text in proper format: {{meme_text}}")
  }
}

// api functions
function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
  return;
}

function tenorCallback_search(responsetext) {
  var response_objects = JSON.parse(responsetext);
  top_gifs = response_objects["results"];
  content.innerHTML =
    content.innerHTML +
    "<br/>" +
    `<img src="${top_gifs[0]["media"][0]["nanogif"]["url"]}" alt="">` +
    "&nbsp;";
  setCursorToEnd()  
  return;
}

function grab_data() {
  let apikey = "6C74R3PIQDLG";
  let lmt = 8;
  let search_term = strMeme;
  let search_url =
    "https://g.tenor.com/v1/search?q=" +
    search_term +
    "&key=" +
    apikey +
    "&limit=" +
    lmt;
  httpGetAsync(search_url, tenorCallback_search);
  return;
}

// function attached to buttons and event listeners
btnBold.addEventListener("click", () => formatText("bold"));
btnItalic.addEventListener("click", () => formatText("italic"));
btnUnderline.addEventListener("click", () => formatText("underline"));
btnLink.addEventListener("click", () => getLink("createlink"));
btnImg.addEventListener("click", () => getLink("insertImage"));

btnInsert.addEventListener("click", () => insertElement());
btnMeme.addEventListener("click", () => getMemeText());


// SIDE EFFECTS
// change the default behaviour of enter key press
contentBox.addEventListener("keypress", function(e){
  if(e.keyCode === 13){
    e.preventDefault()
    content.innerHTML = content.innerHTML + "<br/> &nbsp;"
    setCursorToEnd()
  }
})

// hide link fields
btnClose.addEventListener("click", () => {
  linkBox.style.display = "none"
})

// set cursor to end of content
function setCursorToEnd() {
  let p = document.getElementById("content");
  let s = window.getSelection();
  let r = document.createRange();
  r.setStart(p.lastChild, 1);
  r.setEnd(p.lastChild, 1);
  s.removeAllRanges();
  s.addRange(r);
}