import { ConfigService } from "@nestjs/config";
import { Configuration } from "../config/config.service";
import { CaseModel } from "../schemas/caseSchema";
import mongoose from "mongoose";
import { db } from "../seeders/db";
import { sql } from "drizzle-orm";



