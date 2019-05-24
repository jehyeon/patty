const debugMode = true;

const box = $('table.box');

// 버튼 이벤트 추가
$('button.cancel').click(function() {
  window.close();
});

// temporary
$('button.deleteModeOn').click(function() {
  console.log('Delete mode on!');
  addDeleteButton($('table.box tr'));
  // 클릭 시 text 변경 (Delete off -> Delete on)
  // Delete mode on 일 때 새로 아이템을 추가할 경우 mode off 시키기
});

$('button.setting').click(function() {
  chrome.runtime.openOptionsPage()
});


// Init
// 시작 시 storage.sync 에서 데이터를 가져오고 popup.html에 update
if (debugMode) {
  console.log('First get datas');
}
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
    console.log('new.length: ' + changes.data.newValue.length + ', old.lenght: ' + changes.data.oldValue.length);
  }

  // 항목이 추가된 경우에만 append
  if (changes.data.newValue.length > changes.data.oldValue.length) {
    const last = changes.data.newValue.length - 1;
    if (debugMode) {
        console.log('Add -> ' + changes.data.newValue[last].before + ', ' + changes.data.newValue[last].after);
    }
    const update = $("<tr><td class='before'>" + changes.data.newValue[last].before 
      + "</td><td class='after'>" + changes.data.newValue[last].after + "</td></tr>");
  
    box.append(update);
  }
});

function addDeleteButton(target) {
  target.append("<td class='delete'>x</td>")

  // Delete button event
  $('td.delete').click(function() {

    if (debugMode) {
      console.log($(this).parent().html(), $(this).parent().index());
    }

    // sync에서 데이터 삭제
    const data = {
      msg: 'DELETE',
      data: {
        index: $(this).parent().index()
      }
    };

    if (debugMode) {
      console.log('send' + JSON.stringify(data));
    }
    chrome.runtime.sendMessage(data)

    // popup.html에서 항목 삭제
    $(this).parent().remove();
  });
}