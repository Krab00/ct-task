-- Create database if not exists (though MYSQL_DATABASE env var should handle this)
CREATE DATABASE IF NOT EXISTS warehouse;

-- Grant specific privileges to wh_user on warehouse database
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX ON warehouse.* TO 'wh_user'@'%';
FLUSH PRIVILEGES;