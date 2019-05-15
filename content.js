// for test
const bubble = $('<span />');
const bubble_css = {
  'position': 'absolute',
  'margin-top': '-1.5em',
  'background': 'red',
  'border': '1px solid red',
  'border-radius': '5px',
  'z-index': 9999
};

// 항상 동작
// 번역 모드 on 인 경우 
$('*').mouseup(function(e) {
  e.stopPropagation();      // 여러 번 호출되는 것을 prevent (* selctor is one or more elements)

  if (window.getSelection) {
    // window.getSelection().toString().length < 500 인 경우
    // console.log('raw');
    // console.log(window.getSelection());
    const draged = window.getSelection().toString();
    
    const target = $(this);
    const text = target.html();
    // + 여러 영역 드래그 시 처음 문단만 쪼개는 기능 
    // + 온전하지 못한 문장 시 삭제하기 
    // ex. 'Simple one-time requests' -> 'ple one-time reque' -> 'one-time'

    // Text 터치 시 POST 하지 않도록 temp condtion
    // window.getSelection이 아닌 정확히 드래그 할 때만 동작하도록 수정 필요
    if (window.getSelection().toString().length > 2) {
      chrome.runtime.sendMessage({before: draged}, function(response) {
        if (response) {
          console.log('response is ' + response.response);
          bubble.text(response.response).css(bubble_css);
          target.prepend(bubble);
          // target.html(text.replace(draged, response.response));
        } else {
          console.log('No reponse')
        }
      });
    }
    // translateThis(window.getSelection());
    // 드래그 시 해당 pos 상단에 option 창 띄우기 (translate, save)
  }
});