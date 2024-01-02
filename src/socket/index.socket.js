import ChatEventEnum from "../enums/chatEvents.enums";
import isAuthorized from "../middlewares/auth.middleware";

const initializeSocketIO = (io ) => {

    // to check authToken from cookies
    io.engine.use(isAuthorized);


    io.on("connection", (socket)=>{
        console.debug("🚀 Socket connected", socket.id);

        socket.on(ChatEventEnum.CONNECTED_EVENT,() =>{})

        socket.on(ChatEventEnum.DISCONNECT_EVENT, ()=>{
            console.debug("🚀 Socket disconnected", socket.id);
        })

        socket.on(ChatEventEnum.JOIN_CHAT_EVENT, () => {
        })

        socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, () => {
        })

        socket.on(ChatEventEnum.NEW_CHAT_EVENT, () => {
        })

        socket.on(ChatEventEnum.SOCKET_ERROR_EVENT, () => {
        })

        socket.on(ChatEventEnum.STOP_TYPING_EVENT, () => {
        })

        socket.on(ChatEventEnum.TYPING_EVENT, () => {
        })




    })
};

const emitSocketEvent = (req, roomId, event, payload) => {};

module.exports = {
    initializeSocketIO,
    emitSocketEvent,
};
