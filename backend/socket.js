const USERS = new Map();

module.exports = (socket) => {
    
    console.log('A user connected');

    socket.on("join", (data) => {
        const { userId } = data;
        USERS.set(userId, socket);
        console.log('User joined:', userId);
    });
    //socket.on : listener
    socket.on("send-chat", (data) => {
        console.log("Message", data)
        const { id } = data;
        const user = USERS.get(id);
        
        
        if (user) {
            //event
            user.emit('push-message', data);
        }
    });

    // notiff-admin
    socket.on("send-notification", (data) => {
        const { adminIds, message, link } = data;

        adminIds
        .map(adminId => USERS.get(adminId))
        .filter(adminSocket => adminSocket)
        .forEach(adminSocket => {
            adminSocket.emit("push-notification", { message, link });
        });
    
    });

    socket.on("send-notification-user", (data) => {

        const { userId, message } = data;
        console.log("User ID", userId, message, ); 
        const userSocket = USERS.get(userId);
        // console.log("User Socket", userSocket);
        if (userSocket) {
        console.log("User ID", userId, message, ); 
            userSocket.emit("push-notification-user", {  message });
            
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}