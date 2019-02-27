/**
 * note:
 * 進行：
 * 被連線方反向連線以傳送資訊
 * 
 * 待完成：
 * 對話顯示改用<div><p></p></div>
 * 保留先前對話文字
 * 搭配資料庫保存對話內容
 * 影像傳輸
 * ice架構（stun turn server）
 */


/**
 * Variable for elements
 */
var startBut = document.getElementById('startButton');
var connectBut = document.getElementById('connectButton');
var stopBut = document.getElementById('stopButton');
var sendBut = document.getElementById('sendButton');
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var textSend = document.getElementById('textSend');
var textReceived = document.getElementById('textReceived');
var showId = document.getElementById("showId");

/**
 * Variables
 */
var localStream;
var remoteStream;
var peer;
var conn;
var userid;
var destId;

var connectedPeers = {};

/**
 * Setup buttons
 */
stopBut.disabled = true;
connectBut.disabled = true;

startBut.onclick = start;
stopBut.onclick = stop;
connectBut.onclick = startConnect;
sendBut.onclick = send;

/**
 * Setup textarea
 */
textReceived.readOnly = "true";

/**
 * Register to peerjs server
 */
userid = prompt("please input your id");
peer = new Peer(userid, {
    label: 'chat', 
    host:'192.168.1.217', 
    port: '3001', 
    path: '/',
    debug: 3,
    config: {'iceServers': [
        { url: 'stun:192.168.1.217'},
        { url: 'turn:192.168.1.217', credential: 'j1i5m9m6y921', username: 'gmmy'}
    ]}
});
peer.on('open', function(id){
    showId.innerHTML = "My id is " + id + ".";
});
peer.on('error', function(err){
    alert(err);
    window.location.reload()
});

/**
 * Await connections from others
 */
peer.on('connection', connect);
peer.on('error', function(err){
    alert(err);
});

/**
 * Handle a connection object.
 */
function connect(c){
    c.on('data', function(data){
       textReceived.value = data;
    });
    c.on('close', function(){
        alert(destId + ' has left the chat.');
        delete connectedPeers[c.peer];
    });
    connectedPeers[c.peer] = 1;
}

/**
 * Get local stream 
 */
function gotStream(stream){
    localVideo.srcObject = stream;
    window.localStream = localStream = stream;
    connectBut.disabled = false;
}

function start(){
    startBut.disabled = true;

    navigator.mediaDevices.getUserMedia({
        audio:false,
        video: true
    }).then(gotStream).catch(function(e){
        alert('getUserMedia() error: ' + e.name);
    });
}

/**
 * Stop stream
 */
function stop(){
    peer.destroy();
    stopBut.disabled = true;
    startBut.disabled = false;
    connectBut.disabled = false;
}

/**
 * Start connecting someone
 */
function startConnect(){
    //var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
    
    stopBut.disabled = false;
    connectBut.disabled = true;

    destId = prompt("please input the destination id.");
    
    
    conn = peer.connect(destId, {
        lable: 'chat',
    });
    conn.on('open', function(){
        connect(conn);
    });
    conn.on('error', function(err){
        alert(err);
    });
       
    connectedPeers[destId] = 1;

    navigator.getUserMedia({video: true, audio: true}, function(stream) {
        var call = peer.call(destId, stream);
        call.on('stream', function(remoteStream) {
            remoteVideo.srcObject = remoteStream;
            window.remoteStream = remoteStream;
            
        });
    }, function(err) {
    console.log('Failed to get local stream' ,err);
    });
}

/**
 * Send message
 */
function send(){
    console.log("send");
    conn.send(textSend.value);
    textSend.value = '';
}

/**
 * destroy peer before window closed
 */
window.onunload = window.onbeforeunload = function(e){
    if(!!peer && !peer.destroyed){
        peer.destroy();
    }
};

peer.on('call', function(call) {
  navigator.getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function(remoteStream) {
        remoteVideo.srcObject = remoteStream;
        window.remoteStream = remoteStream;
        stopBut.disabled = false;
        connectBut.disabled = true;
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});