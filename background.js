const debugMode = true;

const options = {options: {language: 'ko', export: 'text'}};

// Extensions installed 시 동작
chrome.runtime.onInstalled.addListener(function() {
  // extension 설치 시 storage sync에 {data: []} 저장 
  chrome.storage.sync.set({data: []}, function () {
    if (debugMode) {
      console.log('Made data storage');
    }
  });

  chrome.storage.sync.set(options, function () {
    if (debugMode) {
      console.log('Set options to ');
      console.log(options);
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
      console.log(request.data ? request.data : null);
      console.log('from');
      console.log(sender);
      console.log('**********************************')
    }

    // Action 처리
    switch (request.msg) {
      case 'TRANSLATE':
        // ex. language = { source: 'en', target: 'kr' }
        
        // for language data
        chrome.storage.sync.get(['options'], function (response) {
          let language = {};
          language.target = response.options.language;
          language.source = language.target == 'ko' ? 'en' : 'ko';  // ! Need to update

          console.log(language);

          translateThis(language, request.data.before, sendResponse);
        });
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
      case 'DELETE_ALL':
        chrome.storage.sync.set({data: []}, function() {
          if (debugMode) {
            console.log('Delete all datas');
          }
        });
        break;
      case 'EXPORT':
        chrome.storage.sync.get(['options'], function (response) {
          const exportType = response.options.export;

          chrome.storage.sync.get(['data'], function (response) {
            const datas = response.data;

            exporting(exportType, datas);
          });
        });
    }
    return true;
});


function translateThis(language, wantToTranslate, sendResponse) {
  const source = language.source;
  const target = language.target;
  const format = "html";
  const apiKey = "AIzaSyBuSU19mIptUkH0-8OHFpoRjOMieyy1o5Q"; // ! Need to update config get

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
  });
    // Need to update 'error 처리'
}

function exporting(exportType, datas) {
  console.log(exportType, datas);
  // ! Make to be download link
}