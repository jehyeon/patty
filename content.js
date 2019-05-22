const debugMode = true;

var target;
var originText = target;
var dragging = false;

$('*').mouseup(function(e) {
  e.stopPropagation();      // 여러 번 호출되는 것을 prevent (* selctor is one or more elements)

  // window.getSelection().toString().length < 150 인 경우
  if (window.getSelection && window.getSelection().toString().length > 1 
    && window.getSelection().toString().length < 300) {

    // 드래그한 상태에서 다른 text 드래그 시 삭제
    if (dragging == true) {
      $('span.bubble').remove();
      $('span.dragged').contents().unwrap();
      dragging = false;
    }

    dragging = true;

    // dragged: 드래그한 element
    const dragged = window.getSelection().toString();

    if (debugMode) {
      console.log(dragged);    
    }
    
    target = $(this);
    originText = target.html();

    translate(dragged); // translate -> bubbleUp action

  }
});

function addItem(_before, _after) {
  chrome.runtime.sendMessage(
    {
      msg: 'ADD',
      data: {
        before: _before,
        after: _after
      }
    }
  );
}

function translate(dragged) {

  let data = {
    msg: 'TRANSLATE',
    data: {
      before: dragged
    }
  };

  // Translate dragged
  chrome.runtime.sendMessage(data, function(response) {
    if (response) {
      if (debugMode) {
        console.log(response);
      }
      
      bubbleUp(dragged, response.response);

      // dragged가 온전하지 못한 문장일 경우 수정 필요
      addItem(dragged, response.response);

    } else {
      if (debugMode) {
        console.log('No reponse')
      }
    }
  });
}

function bubbleUp(_before, _after) {
  // 매개변수에 target 추가 필요

  const bubble_css = {
    'position': 'absolute',
    'margin-top': '-3em',
    'padding': '10px',
    'height': '20px',
    'border-radius': '20px',
    'background': 'black',
    'color': 'white',
    'font-size': '12pt',
    'max-width': '500px',
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'z-index': 9999
  };
  
  const dragged_css = {
    'background-color': 'gray',
    'color': 'white'
  };

  const url = chrome.runtime.getURL('icons/add.svg');
  console.log(url);

  target.html(originText.replace(_before, "<span class='bubble'>" + _after + "</span>"  
    + "<span class='dragged'>" + _before + "</span>"));

  $('span.bubble').css(bubble_css);
  $('span.dragged').css(dragged_css);
}