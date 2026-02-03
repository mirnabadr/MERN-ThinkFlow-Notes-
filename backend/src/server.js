import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import noteRoutes from "./routes/noteRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder (works when run from repo root or backend)
dotenv.config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const app = express();
const PORT = process.env.PORT || 5001;

// Path to frontend build (backend/src -> backend -> frontend/dist)
const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");

// CORS must run first so all responses include Access-Control-Allow-Origin
if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: "http://localhost:5173" }));
}

// middleware to parse the request body
app.use(express.json());

app.use(rateLimiter);
app.use("/api/notes", noteRoutes);

// Serve built frontend when dist exists (production or after "npm run build --prefix frontend")
if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
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