// 일단 'h1'에서만 정보 가져오기
$('h1').mouseup(function() {
  if (window.getSelection) {
    alert(window.getSelection());
  }
});