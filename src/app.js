import express from "express";
import bodyParser from "body-parser";

import { sequelize } from "./db/model.js";
import { router } from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/v1", router);

export default app;
