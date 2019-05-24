const debugMode = true;

// Extensions installed 시 동작
chrome.runtime.onInstalled.addListener(function() {
  // extension 설치 시 storage sync에 {data: []} 저장 
  chrome.storage.sync.set({data: []}, function () {
    if (debugMode) {
      console.log('Made data storage');
    }
  });
});

// event listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (debugMode) {
      // Message Infos
      console.log('*** background receive message ***')
      console.log(request.msg);
      console.log(request.data);
      console.log('from');
      console.log(sender);
      console.log('**********************************')
    }

    // Action 처리
    switch (request.msg) {
      case 'TRANSLATE':
        translateThis(request.data.before, sendResponse);
        break;
      case 'ADD':
        // sync['data'] 가져온 뒤 update 후 다시 set
        chrome.storage.sync.get(['data'], function (response) {
          let added = {
            before: request.data.before,
            after: request.data.after
          };

          if (debugMode) {
            console.log('Add to ');
            console.log(added);
          }
          
          chrome.storage.sync.set({data: [...response.data, added]}, function() {
            if (debugMode) {
              console.log('Updated data');
              console.log([...response.data, added]);
            }
          })
        });
        break;
      case 'DELETE':
        chrome.storage.sync.get(['data'], function (response) {
          const datas = response.data;
          if (debugMode) {
            console.log('before data: ' + JSON.stringify(datas));
            console.log('Delete -> ' + datas[request.data.index]);
          }
          datas.splice(request.data.index,1); // 해당 인덱스 데이터 삭제
          if (debugMode) {
            console.log('after data: ' + JSON.stringify(datas));
          }
          chrome.storage.sync.set({data: datas}, function(response) {
            if (debugMode) {
              console.log('Seted data: ' + JSON.stringify(response));
            }
          });
        });
        break;
    }
    return true;
});


function translateThis(wantToTranslate, sendResponse) {
  // 언어 설정은 추후 update
  const source = "en";
  const target = "ko";
  const format = "html";
  // Need to update config get
  const apiKey = "AIzaSyBuSU19mIptUkH0-8OHFpoRjOMieyy1o5Q";

  $.ajax({
    type: "POST",
    data: "&source=" + source + "&target=" + target + "&format=" + format + "&q=" + wantToTranslate,
    url: "https://www.googleapis.com/language/translate/v2?key=" + apiKey,
    success: function(response) {
      if (debugMode) {
        console.log(response.data.translations[0].translatedText); 
      }
      sendResponse({response: response.data.translations[0].translatedText});
    }
    // Need to update 'error 처리'
  });
}