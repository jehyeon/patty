const box = $('table.box');
// Storage 업데이트 시
chrome.storage.onChanged.addListener(function(changes, namespace) {
    
    const lastIndex = changes.data.newValue.length - 1;
    const before = Object.keys(changes.data.newValue[lastIndex]);
    const after = changes.data.newValue[lastIndex][before];
    
    const update = $("<tr><td class='before'>" + before + "</td><td class='after'>" + after + "</td></tr>");

    console.log(update);
    box.append(update);
});

