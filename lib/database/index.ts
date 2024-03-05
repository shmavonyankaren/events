import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// let cached = (global as any).mongoose || { conn: null, promise: null };
let isConnected = false;

export const connectToDatabase = async () => {
  // if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  // cached.promise =
  //   cached.promise ||
  //   mongoose.connect(MONGODB_URI, {
  //     dbName: "events",
  //     bufferCommands: false,
  //   });

  // cached.conn = await cached.promise;

  // return cached.conn;
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "events",
      bufferCommands: false,
    });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
