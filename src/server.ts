import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import cookieParser from "cookie-parser";
import { pool } from "./db/connection.js";
import userRoutes from "./routes/user.routes.js"
import todoRoutes from "./routes/todo.routes.js"

dotenv.config({
    path: '.env'
});

const app = express();
let server:any = null;
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: ['http://localhost:5173']
}));

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'fe', 'dist')));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/todos', todoRoutes);

app.use('/*path', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'fe', 'dist', 'index.html'));
});


// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// 404
app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});


async function startServer() {
    try {
        await pool.query('SELECT 1'); // Force connection to verify credentials

        console.log("✅ Database connection successful.");

        // TODO: Put anything that needs to be initialized before the server starts here

        server = app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error:any) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

async function shutdownServer() {
    console.log("🔴 Shutting down server...");

    if (server) {
        server.close(() => {
            console.log("🔴 Server has been shut down.");
        });
    }

    await pool.end();
    process.exit(0);
}

process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);

startServer();

