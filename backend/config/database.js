const mongoose = require('mongoose');
console.log('DB_URI:', process.env.DB_URI);
const connectDatabase = ( ) =>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
    console.log(`mongodb connected with server ${data.connect.host}`)
})//.catch((err)=>{
// //     console.log(err);  // isko likhne ki koi jrurt nhi hai ... because hmm yese unhandled error ko server.js me handle kr liye hai ...
// // })
} 

module.exports = connectDatabase;




// const mongoose = require('mongoose');
// require('dotenv').config(); // Load environment variables from config.env


// console.log('DB_URI:', process.env.DB_URI);
// const connectDatabase = () => {
//   mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//       console.log(`MongoDB connected with host: ${mongoose.connection.host}`);
//     })
//     .catch((error) => {
//       console.error(`Error connecting to MongoDB: ${error.message}`);
//     });
// };

// module.exports = connectDatabase;
