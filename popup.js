const debugMode = true;

const box = $('table.box');

// 버튼 이미지 추가
const closeBtnSrc = chrome.extension.getURL('icons/close.png');
const menuBtnSrc = chrome.extension.getURL('icons/menu.png');
const settingBtnSrc = chrome.extension.getURL('icons/setting.png');
const deleteBtnSrc = chrome.extension.getURL('icons/delete.png');
$('img.close_button').attr('src', closeBtnSrc);
$('img.menu_button').attr('src', menuBtnSrc);
$('img.setting_button').attr('src', settingBtnSrc);
$('img.delete_all_button').attr('src', deleteBtnSrc);

// 버튼 이벤트 추가
$('img.close_button').click(function() {
  window.close();
});

$('img.menu_button').click(function() {
  if ($('div.menu').attr('display') == 'off') {
    // Menu on
    $('div.menu').attr('display', 'on');
  } else {
    // Menu off
    $('div.menu').attr('display', 'off');
  }
});

$('img.setting_button').click(function() {
  chrome.runtime.openOptionsPage()
});

// 항목별 삭제 버튼 이벤트는 항목 업데이트 혹은 추가 마다 선언됨

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
      const item = $("<tr class='element'><td class='before'>" + data.before + "</td><td class='after'>" + data.after + "</td></tr>");
      
      // 항목 삭제 버튼 추가
      item.append($("<img class='delete_button pointer'" 
      + "src='" + closeBtnSrc + "' />").click(function() {
        delete_this($(this).parent());
      }));

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
    const update = $("<tr class='element'><td class='before'>" + changes.data.newValue[last].before 
      + "</td><td class='after'>" + changes.data.newValue[last].after + "</td></tr>");
    
    // 항목 삭제 버튼 추가
    update.append($("<img class='delete_button pointer'" 
      + "src='" + closeBtnSrc + "' />").click(function() {
        delete_this($(this).parent());
      }));

    box.append(update);
});

function delete_this (target) {
  console.log("GO");
  console.log(target.html(), target.index());
  const data = {
    msg: 'DELETE',
    data: {
      index: target.index()
    }
  };

  chrome.runtime.sendMessage(data);

  target.remove();
}