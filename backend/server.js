const app = require('./app');
const connectDatabase = require('./config/database')
const dotenv = require('dotenv');
const cloudinary = require("cloudinary");

//Handling Caught Exception
process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`);
    console.log("Shuting down the server due to Handling Caught Exception");
    process.exit(1);
})
//config

dotenv.config({path:"backend/config/config.env"});

connectDatabase(); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });//this should always be come after calling dotenv.config();

const PORT =  4000;
const Server = app.listen(PORT, ()=>{                                 // ydi unhandled promise rejection type aaata hai to us time server ko exit
    console.log(`Server is working on http://localhost:${PORT}`)     // krne ke liye isse ek variable me store kr diye hai ... 
});

// console.log(youtube);  -- // ye ek error dega and is type ke error ko bolte hai uncaught error..


//unhandled Promise Rejection  -- iska kaam jb koi rejection handle na ho tb ex-- ydi hmara mongodb kisi kaarn bss connect
                              // nhi ho paaya to isse hmm handle nhi kr paayenge to that's why we use this prmise rejection.. ydi rejection ho to ye wala error show krna..

    process.on("unhandledRejection",(err)=>{
        console.log(`error: ${err.message}`);
        console.log("Shuting down the server due to Unhandled promise Rejection");

        Server.close(()=>{
            process.exit(1);
        });
    });
