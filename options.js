const debugMode = true;

// When the options view opens, set options
// It is recommended to set select name and option value of option.html
// equal to key and value of storage.options
chrome.storage.sync.get(['options'], function (response) {
    if (debugMode) { 
        console.log('Get [options] from storage:');
        console.log(response);
    }
    for (var key in response.options) {
        if (debugMode) { 
            console.log('key is ' + key);
            console.log('value is ' + response.options[key]);
        }
        setSelected(key, response.options[key]);
    }
});

// Set selectName's select to optionValue
function setSelected(selectName, optionValue) {
    if (debugMode) { console.log('Updated selected'); }
    $('select[name=' + selectName + ']').val(optionValue)
}

// When select's option changed
$('select').change(function (e) {
    let update = {};
    let selectName = $(e.target).attr('name');
    let optionSelected = $(e.target).find('option:selected').val();    
    update[selectName] = optionSelected;
    
    chrome.storage.sync.get(['options'], function (response) {
        const reAssign = Object.assign(response.options, update);
        if (debugMode) { 
            console.log('reAssign ');
            console.log(reAssign);
        }
        chrome.storage.sync.set({options: reAssign});
    });
});