const debugMode = true;

const box = $('table.box');

// 버튼 이벤트 추가
$('button.cancel').click(function() {
  window.close();
});

// temporary
$('button.deleteModeOn').click(function() {
  console.log('Delete mode on!');
});

$('button.setting').click(function() {
  console.log('Go setting view');
});


// Init
// 시작 시 storage.sync 에서 데이터를 가져오고 popup.html에 update
chrome.storage.sync.get(['data'], function (response) {
  if (debugMode) {
    console.log(response);
  }
  
  if (response.data.length > 0) {
    response.data.map(data => {
      const item = $("<tr><td class='before'>" + data.before + "</td><td class='after'>" + data.after + "</td></tr>");
      box.append(item);
    });
  }
});

// Storage 업데이트 시 마지막에 항목 추가
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (debugMode) {
    console.log(changes);
  }
  const last = changes.data.newValue.length - 1;
  const update = $("<tr><td class='before'>" + changes.data.newValue[last].before 
    + "</td><td class='after'>" + changes.data.newValue[last].after + "</td></tr>");

  box.append(update);
});

