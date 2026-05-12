import http from "node:http"  
import 'dotenv/config'

import { Server } from "socket.io"
import { createExpress } from "./app/app.js";

async function main (){
    try {        
        const PORT: number = Number(process.env.PORT) || 3000;
        const httpServer = http.createServer(createExpress());
    
        const io = new Server();
        io.attach(httpServer);

        httpServer.listen(PORT, () => {
            console.log(`Server Started at ${PORT}`)
        })
    } catch (error) {
        console.error(`Server Crasher`, error)
    }
}

main()
