const mongoose = require("mongoose");

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("mongodb is on rock....");
  } catch (err) {
    console.log(err.message);
  }
}

ConnectDB();
