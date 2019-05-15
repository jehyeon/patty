chrome.runtime.onInstalled.addListener(function() {
  // for test
  // extension 설치 시 storage sync에 {color: "#3aa757"} 저장 
  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log("The color is green.");
  // });

  // for test
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  //   chrome.declarativeContent.onPageChanged.addRules([{
  //     conditions: [new chrome.declarativeContent.PageStateMatcher({
  //         pageUrl: {hostEquals: 'developer.chrome.com'},
  //       })
  //     ], 
  //       actions: [new chrome.declarativeContent.ShowPageAction()]
  //   }]);
  // });
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    translateThis(request.before, sendResponse);
    return true;
});


function translateThis(wantToTranslate, sendResponse) {
  // 언어 설정은 추후 update
  const source = "en";
  const target = "ko";
  const format = "html";
  const apiKey = "AIzaSyBuSU19mIptUkH0-8OHFpoRjOMieyy1o5Q";

  $.ajax({
    type: "POST",
    data: "&source=" + source + "&target=" + target + "&format=" + format + "&q=" + wantToTranslate,
    url: "https://www.googleapis.com/language/translate/v2?key=" + apiKey,
    success: function(response) {
      // console.log(response.data.translations[0].translatedText); 
      sendResponse({response: response.data.translations[0].translatedText});
    }
  });
}