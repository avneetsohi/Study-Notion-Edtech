const { default: mongoose } = require("mongoose");

require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{console.log("DB connected successfully")})
    .catch((error)=>{
        console.log("DB CONNECTION FAILED");
        console.error(error);
        process.exit(1);
    })
}  



