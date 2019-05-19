// for test
const bubble = $('<span/>');
const bubble_css = {
  'position': 'absolute',
  'margin-top': '-2em',
  'background': 'black',
  'color': 'white',
  'font-size': '12pt',
  'height': '1em',
  'line-height': '1em',
  'padding': '10px',
  'border-radius': '20px',
  'z-index': 9999
};
var target;
var originText = target;
var dragging = false;
// 항상 동작
// 번역 모드 on 인 경우 
$('*').mouseup(function(e) {
  e.stopPropagation();      // 여러 번 호출되는 것을 prevent (* selctor is one or more elements)

  console.log(window.getSelection().toString()); 
  if (window.getSelection && window.getSelection().toString().length > 1) {
    // window.getSelection().toString().length < 500 인 경우
    // console.log('raw');
    // console.log(window.getSelection());
    if (dragging == true) {
      // target.html(originText);
      $('span.dragged').remove();
      dragging = false;
    }
    dragging = true;
    const dragged = window.getSelection().toString();
    
    target = $(this);
    originText = target.html();

    console.log(dragged);

    // Text 터치 시 POST 하지 않도록 temp condtion
    // window.getSelection이 아닌 정확히 드래그 할 때만 동작하도록 수정 필요
    // after -> translate(dragged) 로 수정해야 함
    chrome.runtime.sendMessage(
      {
        msg: 'add',
        data: {
          before: dragged,
          after: dragged
        }
      }
    );

    // chrome.runtime.sendMessage(data, function(response) {
    //   if (response) {
    //     // console.log('response is ' + response.response);
    //     // bubble.text(response.response).css(bubble_css);
        
    //     target.html(originText.replace(dragged, "<span class='dragged'>" + response.response + "</span>"  + dragged));
    //     $('span.dragged').css(bubble_css);

    //   } else {
    //     // console.log('No reponse')
    //   }
    // });
  }
});
