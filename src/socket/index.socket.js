import ChatEventEnum from "../enums/chatEvents.enums";
const User = require("../models/user.models.js");

const jwt = require("jsonwebtoken");


const initializeSocketIO = (io) => {

    // to check authToken from cookies
    io.use(async (socket, next) => {
        const authToken = socket.handshake.headers?.cookie?.token || socket.handshake?.auth?.token;

        if (!authToken) {

            socket.disconnect(true); // to disconnect the user if he is invalid
            return response_404(res, "No token provided");
        }
    
        try {
            const decoded = jwt.verify(authToken, process.env.JWT_KEY);
            // console.log(decoded._id);
            // return;
    
            const user = await User.findById(decoded._id);
    
            if (!user) {
                return response_404(res, "User not found");
            }
    
            socket.user = user;
         
            next();
        } catch (err) {
            socket.disconnect(true);
            return response_500(res, "Internal Server Error", err);
        }
    });


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
