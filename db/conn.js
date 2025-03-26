// const mongoose = require("mongoose");

// mongoose.set("strictQuery", true);

// mongoose
//   .connect(
//     "mongodb://127.0.0.1:27017/rikcapital",
//     // "mongodb+srv://rikcapital:rikcapital@rikcapital.eb7pg.mongodb.net/rik-capital",

//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000,
//     }
//   )
//   .then(() => console.log("✅ Database Connected Successfully"))
//   .catch((err) => console.error("❌ Database Connection Failed", err));

require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch((err) => console.error("❌ Database Connection Failed", err));
