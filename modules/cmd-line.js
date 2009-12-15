var CmdLine = (function(){
  var box_id        = '__vimlike_cmd_box';
  var input_box_id  = '__vimlike_cmd_input_box';
  var inputFunction = function(){};

  function createCmdBox(){
    var box = document.createElement('div');
    box.setAttribute('id',box_id);
    document.body.appendChild(box);
  }

  function cmdBoxExist(){
    return !!document.getElementById(box_id);
  }

  function cmdBox() {
    if(!cmdBoxExist()) createCmdBox();
    return document.getElementById(box_id);
  }

  function createInputBox(){
    var box = document.createElement('input');
    box.setAttribute('id',input_box_id);
    box.setAttribute('type','text');
    cmdBox().appendChild(box);
    cmdBox().addEventListener('keydown',inputFunction,false)
  }

  function inputBoxExist(){
    return !!document.getElementById(input_box_id);
  }

  function inputBox() {
    if(!inputBoxExist()) createInputBox();
    return document.getElementById(input_box_id);
  }

  function remove(){
    var div = document.getElementById(box_id);
    if(div) document.body.removeChild(div);
  }

  function set(opt){
    if(opt.inputFunction)
      inputFunction = opt.inputFunction;
    if(opt.title)
      cmdBox().firstChild ? cmdBox().firstChild.data = opt.title : cmdBox().innerHTML = opt.title;
    if(typeof(opt.content) == 'string')
      inputBox().value = opt.content;
  }

  function get(){
    return {
      title         : cmdBoxExist ? cmdBox().firstChild.data : '',
      content       : inputBoxExist ? inputBox().value       : '',
      inputFunction : inputFunction
    };
  }

  return { set : set, get : get, remove : remove };
})()