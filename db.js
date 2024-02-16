import mongoose from "mongoose";
import colors from "@colors/colors";
import colors from "@colors/colors";

let DB_URL = process.env.DB_URL || "mongodb://localhost:27017/express-mongoose";

module.exports = async () => {
    try {
        await mongoose.connect(
            DB_URL, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
            (error) => {
                if (error) return new Error("Failed to connect to database".red.bold);
                console.log(colors.cyan("Connected to database".cyan.bold));
            }
        )
    }
    catch (error) {
        console.log(colors.red.bold("Error connecting to database".magenta.bold), error);
    }
}
   