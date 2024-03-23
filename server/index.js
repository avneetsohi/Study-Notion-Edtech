const express= require("express")
const app=express();

const { dbConnect } = require("./config/database");
const routes = require("./routes/Routes");
const cookieParser = require("cookie-parser");
const fileUpload=require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
const cors=require("cors");

require("dotenv").config();

const PORT=process.env.PORT || 3000;


// middlewares
app.use(express.json());

app.use(cookieParser())

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

// routes
app.use("/api/v1",routes)

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`)
})

// mongo db connect
dbConnect();

// cloudinary connection
cloudinaryConnect();

// default route
app.get("/",(req,res)=>{
    res.send("Backend Running")
})

