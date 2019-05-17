chrome.runtime.onInstalled.addListener(function() {
  // extension 설치 시 storage sync에 {data: []} 저장 
  chrome.storage.sync.set({data: []}, function () {
    // console.log('Made data storage');
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // console.log('*** background receive message ***')
    // console.log(request.msg);
    // console.log(request.data);
    // console.log('from');
    // console.log(sender);
    // console.log('**********************************')

    if (request.msg === 'translateThis') {
      translateThis(request.data.before, sendResponse);
    }

    if (request.msg === 'add') {
      chrome.storage.sync.get(['data'], function (response) {
        let added = {};
        added[request.data.before] = request.data.after;

        // console.log('Add to ');
        // console.log(added);
        
        chrome.storage.sync.set({data: [...response.data, added]}, function() {
          // console.log('Update data');
          // console.log([...response.data, added]);
        })
      });
    }

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