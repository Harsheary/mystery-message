import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export default async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log('Already connection to database')
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '') 

        connection.isConnected = db.connections[0].readyState   //just assigning the connection verification number to connection object declared above of type ConnectionObject


    } catch (error) {
        console.log("Database connection failed", error)

        process.exit(1)
    }
}