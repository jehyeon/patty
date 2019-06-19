const debugMode = true;

importToFonts();

var target;
var originText = target;
var dragging = false;
const addBtnSrc = chrome.extension.getURL('icons/add.svg');

$('*').click(function() {
  // 아무곳 클릭 시 bubble 삭제
  bubbleDown();
});

$('*').mouseup(function(e) {
  // 버튼 동작이 안되기도 함
  e.stopPropagation();      // 여러 번 호출되는 것을 prevent (* selctor is one or more elements)
              
  // window.getSelection().toString().length < 150 인 경우
  if (window.getSelection && window.getSelection().toString().length > 1 
  && window.getSelection().toString().length < 300) {

    // 드래그한 상태에서 다른 text 드래그 시 삭제
    if (dragging == true) {
      bubbleDown();
      dragging = false;
    }

    dragging = true;

    // dragged: 드래그한 element
    const dragged = window.getSelection().toString();

    if (debugMode) {
      console.log('draging: ' + dragged);    
    }
    
    target = $(this);
    originText = target.html();
    
    chrome.storage.sync.get(['activate'], function (response) {
      if (response.activate.mode) {
        translate(dragged); // translate -> bubbleUp action
      }
    });
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

  // 성공적으로 아이템 추가 시 팝업 창 띄우기 (additional)
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
    'font-family': 'Noto Sans KR, sans-serif',
    'margin-top': '-2.8em',
    'padding': '5px 30px 5px 20px',
    'border-radius': '12px',
    // 'background': 'black',
    'background': '#FF5A5A',
    'box-shadow': '2px 5px 6px rgba(193,193,193,0.5)',
    'color': 'white',
    'max-width': '500px',
    // 'font-size': '12pt',
    'font-size': '14pt',
    'font-style': 'normal',
    'white-space': 'nowrap',
    // 'overflow': 'hidden',
    'text-overflow': 'ellipsis',
    'z-index': 9999
  };
  
  const dragged_css = {
    'background-color': 'gray',
    'color': 'white'
  };

  const add_css = {
    'position': 'absolute',
    'top': '50%',
    'right': '10px',
    'margin-top': '-6px',
    'width': '12px',
    'height': '12px',
    'cursor': 'pointer'
  }

  const bubble_tail_css = {
    'position': 'absolute',
    'bottom': '-12px',
    'left': '0px',
    'border-style': 'solid',
    'border-width': '16px',
    'border-color': 'transparent transparent transparent #FF5A5A'
  }

  target.html(originText.replace(_before, 
    "<span class='bubble'>" 
      + _after
      + "<img class='add' />"
    + "<span class='bubble_tail'></span></span>"  
    + "<span class='dragged'>" + _before + "</span>"));

  // css 적용하기
  $('span.bubble').css(bubble_css);
  $('img.add').css(add_css);
  $('span.bubble_tail').css(bubble_tail_css);
  $('span.dragged').css(dragged_css);

  // button 이미지 로드
  $('img.add').attr('src', addBtnSrc);

  // click 이벤트 추가
  $('img.add').click(function() {
    // dragged가 온전하지 못한 문장일 경우 수정 필요
    if (debugMode) {
      console.log(target.children());
    }

    const before = target.children('.dragged').text();
    const after = target.children('.bubble').text();
    
    addItem(before, after);
  });

  // Prevent to drag
  $('span.bubble').on('mousedown mousemove touchstart', function(e) {
    e.preventDefault();
  });
}

function bubbleDown() {
  $('span.bubble').remove();
  $('span.dragged').contents().unwrap();
}

function importToFonts() {
  // Import google web fonts
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Noto+Sans+KR:400&display=swap');
  // Add more fonts here

  document.head.appendChild(link);
}