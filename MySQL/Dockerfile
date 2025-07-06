FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=admin1234
ENV MYSQL_DATABASE=Startup_POC

# Copy the initialization script to the container
COPY init.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306
