// 항상 동작

// 일단 'h1'에서만 정보 가져오기
$('h1').mouseup(function() {
  if (window.getSelection) {
    // alert(window.getSelection());
    // for test ->
    translateThis(window.getSelection());
    // 드래그 시 해당 pos 상단에 option 창 띄우기 (translate, save)
  }
});

function translateThis(wantToTranslate) {
  // 언어 설정은 추후 update
  const source = 'en';
  const target = 'ko';
  const format = 'html';
  const apiKey = '********';

  $.ajax({
    type: 'POST',
    data: '&source=' + source + '&target=' + target + '&format=' + format + '&q=' + wantToTranslate,
    url: 'https://www.googleapis.com/language/translate/v2?key=' + apiKey,
    success:function(response) {
      alert(response);
      // DOM 조작
    }
  });
}

