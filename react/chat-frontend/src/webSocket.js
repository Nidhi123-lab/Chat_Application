import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const SOCKET_URL = 'http://localhost:8080/ws'

export function connectSocket(onMessageReceived){
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    stompClient.connect({},()=>{
        stompClient.subscribe('/topic/group/',(message)=>{
            onMessageReceived(JSON.parse(message.body));
        });

        stompClient.subscribe('/queue/chat/',(message)=>{
            onMessageReceived(JSON.parse(message.body));
        });
    });
    return stompClient;
}

export function sendMessage(stompClient,message){
    stompClient.send('/app/send',{}, JSON.stringify(message));
}