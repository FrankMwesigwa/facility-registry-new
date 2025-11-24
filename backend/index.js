import express from 'express';
import cors from "cors";
import path from 'path';
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import setupSwagger from "./swagger.js";
import { connectPool, connectSequelize, pool, sequelize } from './config/db.js';

const app = express()
dotenv.config();

setupSwagger(app);

app.use(express.json({ limit: "100mb" }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Disable ETag to avoid 304 Not Modified on API JSON responses
app.set('etag', false);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

import Levels from './routes/levels.js'
import Units from './routes/units.js';
import apiRoutes from './routes/index.js';
import AdminUnits from './routes/adminunits.js'
import HealthService from './routes/healthservice.js';
import FacilityRequests from './routes/facilityRequests.js'
import Systems from './routes/systems.js'
import Mfl from './routes/mfl.js'
import TestWebhook from './routes/testwebhook.js'
import FacilityIDs from './routes/facilityid.js'

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path}`);
  console.log('📝 Request body:', req.body);
  console.log('🆔 Request params:', req.params);
  next();
});

app.use("/api", apiRoutes);
app.use("/api/units", Units);
app.use("/api/levels", Levels);
app.use("/api/adminunits", AdminUnits);
app.use("/api/services", HealthService);
app.use("/api/facilityrequests", FacilityRequests);
app.use("/api/systems", Systems);
app.use("/api/mfl", Mfl);
app.use("/api/test", TestWebhook);
app.use("/api/ids", FacilityIDs);

// Use defaults if env vars are missing to avoid 'undefined' output
const PORT = Number(process.env.PORT) || 9000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
  console.log(`🚀Server started Successfully on port ${PORT} in ${NODE_ENV}`);
  await connectPool();
  await connectSequelize();
  sequelize.sync({ force: false }).then(() => {
    console.log("✅Synced database successfully...");
  });
});
