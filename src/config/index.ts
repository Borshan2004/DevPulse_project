
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path:path.join(process.cwd(),".env"),
})

const config = {
    ports_server : process.env.PORT,
    conection_string:process.env.CONECTIONSTRING as string,
    secret_token :process.env.SECRET,
    cors_origin:process.env.CORS_ORIGIN
}

export default config;