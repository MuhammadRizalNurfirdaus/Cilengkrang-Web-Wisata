#!/bin/bash
# Database Setup Script for Cilengkrang Wisata
# Run this with: sudo bash setup_db.sh

echo "Creating database cilengkrang_wisata..."
mariadb -u root <<EOF
CREATE DATABASE IF NOT EXISTS cilengkrang_wisata CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Create a user for the application (optional, can use root with unix_socket)
CREATE USER IF NOT EXISTS 'cilengkrang'@'localhost' IDENTIFIED BY 'cilengkrang123';
GRANT ALL PRIVILEGES ON cilengkrang_wisata.* TO 'cilengkrang'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database cilengkrang_wisata created successfully!' AS Status;
SHOW DATABASES LIKE 'cilengkrang_wisata';
EOF

echo ""
echo "Database setup complete!"
echo "Update your .env file with:"
echo 'DATABASE_URL="mysql://cilengkrang:cilengkrang123@localhost:3306/cilengkrang_wisata"'
