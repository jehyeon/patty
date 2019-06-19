const debugMode = true;

const box = $('table.box');

if (debugMode) {
  console.log('First get datas');
}

// Load 시 popup.html 업데이트
// ['data']
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
// ['activate.text']
chrome.storage.sync.get(['activate'], function (response) {
  if (debugMode) { 
    console.log('update activate button value'); 
    console.log(response);
  }
  $('a.activate_button').html(response.activate.text);
});

// storage ['data']에 추가 시 
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (Object.keys(changes).includes('data')) {
    if (debugMode) {
      console.log(changes);
      console.log('new.length: ' + changes.data.newValue.length + ', old.lenght: ' + changes.data.oldValue.length);
    }
    
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
    }
  }
});

// Prevent to drag
$('body').on('mousedown mousemove touchstart', function(e) {
  e.preventDefault();
});

// 버튼 이미지 추가
const closeBtnSrc = chrome.extension.getURL('icons/close.png');
const menuBtnSrc = chrome.extension.getURL('icons/menu.png');
const settingBtnSrc = chrome.extension.getURL('icons/setting.png');
const exportBtnSrc = chrome.extension.getURL('icons/export.svg');
const deleteBtnSrc = chrome.extension.getURL('icons/delete.png');
$('img.close_button').attr('src', closeBtnSrc);
$('img.menu_button').attr('src', menuBtnSrc);
$('img.setting_button').attr('src', settingBtnSrc);
$('img.export_button').attr('src', exportBtnSrc);
$('img.delete_all_button').attr('src', deleteBtnSrc);

// 이벤트 추가
// 버튼
$('img.close_button').click(function() {
  window.close();
});

$('a.activate_button').click(function() {
  // storage ['activate'] 수정
  if (debugMode) { console.log('Clicked activate button!'); }
  chrome.storage.sync.get(['activate'], function(response) {
    const text = response.activate.mode ?
      'activate off' :
      'activate on';

    chrome.storage.sync.set({activate: {mode: !response.activate.mode, text: text}});
    
    $('a.activate_button').html(text);
  });
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

$('img.export_button').click(function() {
  const data = {
    msg: 'EXPORT'
  };
  chrome.runtime.sendMessage(data);
});

$('img.delete_all_button').click(function() {
  const data = {
    msg: 'DELETE_ALL'
  };
  chrome.runtime.sendMessage(data);
  $('tr.element').remove();
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