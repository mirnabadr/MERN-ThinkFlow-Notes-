import express from "express";
import noteRoutes from "./routes/noteRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"; 
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";


dotenv.config({ quiet: true });
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS must run first so all responses include Access-Control-Allow-Origin
if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: "http://localhost:5173" }));
}

// middleware to parse the request body
app.use(express.json());

app.use(rateLimiter);
app.use("/api/notes", noteRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port ", PORT);
    });
})
 
// Endpoint : it is combination of URL and HTTP method that lets the client interact with specific resource. 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Internal Server Error"});
});

/*app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});*/