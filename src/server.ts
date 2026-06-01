
import app from "./app";
import config from "./config";
import { initDB } from "./db";

const port = config.ports_server;

const main = () => {
    app.listen(port, () => {
        initDB()
        console.log(`Example app listening on port ${port}`);
    });
}

main()