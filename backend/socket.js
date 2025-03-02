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

    // notiff
    socket.on("send-notification", (data) => {
        const { adminIds, message, link } = data;

        adminIds.forEach((adminId) => {
            const adminSocket = USERS.get(adminId);
            if (adminSocket) {
                adminSocket.emit("push-notification", { message, link });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}