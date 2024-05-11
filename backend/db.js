import { MongoClient } from 'mongodb';
import env from "dotenv";
env.config();


const uri = process.env.MONGODB_URI;

let dbConnection

const connectionToDb= (cb) =>{
    MongoClient.connect(uri)
        .then((client) => {
            dbConnection=client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
}
const getDb = () => dbConnection

export { connectionToDb, getDb }
