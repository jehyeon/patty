// Storage 업데이트 시
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log(changes);
});
