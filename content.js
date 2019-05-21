const debugMode = true;

// css
const bubble_css = {
  'position': 'absolute',
  'margin-top': '-2em',
  'padding': '10px',
  'height': '1em',
  'line-height': '1em',
  'border-radius': '20px',
  'background': 'black',
  'color': 'white',
  'font-size': '12pt',
  'z-index': 9999
};

const dragged_css = {
  'background-color': 'gray',
  'color': 'white'
};

var target;
var originText = target;
var dragging = false;

$('*').mouseup(function(e) {
  e.stopPropagation();      // 여러 번 호출되는 것을 prevent (* selctor is one or more elements)

  // window.getSelection().toString().length < 500 인 경우
  if (window.getSelection && window.getSelection().toString().length > 1) {

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

    
    bubbleUp(dragged);

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

function bubbleUp(dragged) {

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
        console.log('response is ' + response.response);
      }
      
      target.html(originText.replace(dragged, "<span class='bubble'>" + response.response + "</span>"  
        + "<span class='dragged'>" + dragged + "</span>"));

      $('span.bubble').css(bubble_css);
      $('span.dragged').css(dragged_css);

      // dragged가 온전하지 못한 문장일 경우 수정 필요
      addItem(dragged, response.response);
      
    } else {
      if (debugMode) {
        console.log('No reponse')
      }
    }
  });
}