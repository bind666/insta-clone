import express from "express";
import dbConnect from "./db/dbconnect.js";
import userRouter from "./routes/user.routes.js";
import errorHandler from "./middleware/errorhandler.js";
import config from "./config/config.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


//@All Routes
app.use("/api/v1/user", userRouter)


// @Global Middleware
app.use(errorHandler)


dbConnect().then(() => {
    const PORT = config.PORT
    app.listen(PORT, () => {
        console.log(`server is running at port`, PORT);
    })

}).catch((error) => {
    console.log(`db error!!`, error);
    process.exit(1)
})


