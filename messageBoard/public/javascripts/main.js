/**
 * variable for elements
 */
var inputMessage = document.getElementById('inputMessage');
var userName = document.getElementById('userName');
var sendButton = document.getElementById('sendButton');
var clearButton = document.getElementById('clearButton');
var historyMessageTable = document.getElementById('historyMessageTable');
var noMessage = document.getElementById('noMessage');

/**
 * setup button
 */
sendButton.onclick = send;
clearButton.onclick = clear;


/**
 * get messages from server
 */
$.get('/DBdata', function(data){
    showHistoryData(data);
});

/**
 * check text length
 */
function checkText(){
    if(inputMessage.value.length <= 100)
        return true;
    else{
        alert("Message too long.");
        return false;
    }
}

/**
 * check user name length
 */
function checkUserName(){
    if(userName.value.length <= 10)
        return true;
    else{
        alert("Your name is too long.")
        return false;
    }
}


/**
 * send Message
 */
function send(){
    if(checkUserName() === true && checkText() === true)
        return true;
    else
        return false;
}

/**
 * clear message area
 */
function clear(){
    inputMessage.value = '';
}

/**
 * show hostory data
 */
function showHistoryData(data){
    var i = 1;
    if(data.length > 0){
        noMessage.parentNode.removeChild(noMessage);
        for(i; i < data.length; i++){
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            td1.appendChild(document.createTextNode(data[i].user));
            td2.appendChild(document.createTextNode(data[i].message));
            td3.appendChild(document.createTextNode(data[i].date_time));
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            historyMessageTable.appendChild(tr);
        }
    }
}