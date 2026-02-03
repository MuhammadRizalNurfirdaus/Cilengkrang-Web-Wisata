-- Cilengkrang Web Wisata - PostgreSQL Initialization Script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cilengkrang_web_wisata TO cilengkrang_user;

-- Note: Prisma will handle the actual table creation via migrations
-- This file is for any initial setup that needs to happen before Prisma runs
