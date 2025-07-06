## Subject

Time entry application

Creation of a web application for entering, consulting and editing time in a development company.

## User stories

- As a user, you can log in via Login / Password (supported profiles are Admin, Manager, User).
- As a User, you can enter your times at hourly granularity (choice of project + time).
- As a User, you can edit a monthly report (PDF export)
- As a Manager, you can consult the times entered by the Users assigned to you.
- As a Manager, you can edit the monthly reports of the Users assigned to you (PDF export).
- As a Manager, you can enter projects
- As a Manager, you can enter new Users who will be attached to you.
- As an Admin, you can change the status of a User (Manager / Admin).
- As an Admin, you can change a User's assignment (change of Manager).
- As an unauthenticated User, I cannot request the API (except to authenticate myself).
- As a User, you can enter your CRA in offline mode (with projects you've already assigned to). Synchronization will take place automatically when the network is restored.

## Database

Startup_POC :

**Projets**
| Primary Key | string | Foreign Key | string |
| -- | -- | -- | -- |
| id | color | manager_id | name |

**Work_Sessions**
| Primary Key | LocalDate | LocalTime | LocalTime | Foreign Key | Foreign_key |
| -- | -- | -- | -- | -- | -- |
| Primary Key | date | end_hour | start_hour | user_id | project_id |

**Comptes**
| Primary Key | string | string | Foreign Key | string | string | string |
| -- | -- | -- | -- | -- | -- | -- |
| id | firstname | lastname | manager_id | password | role | username |


# How to Run the Project ?

# MySQL installation and database configuration

## Installer MySQL
Download and install MySQL : https://dev.mysql.com/downloads/installer/
Download and install MySQL Workbench:https://dev.mysql.com/downloads/workbench/

## Configuring MySQL Workbench
Once MySQL Worrbench is open:
1. Click on the `+` to the left of MySQL Connections
2. Keep default settings
3. Name the connection as you wish

## Create the database
In MySQL Workbench, run :
```sql
CREATE DATABASE IF NOT EXISTS Startup_POC
USE Startup_POC;
```

## Configure application
Modify file `Back/src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Startup_POC
spring.datasource.username=root         # user by default
spring.datasource.password=admin1234    # you password
```
## Setup OpenSSL

Install OpenSSL and configure the Path, then run this command in a cmd.
``` bash
openssl rand -base64 32
```
Copy the generated key and paste it in file "JwtUtil.java" in the back, at "SECRET_KEY" variable.

## Run the Back

Then run with Java the file **BackApplication.java** located in *Back/src/main/java/com/poc/back/*

## Run the Front

Assuming you have already installed NodeJS, navigate to Front, and install dependencies by running :
```bash
npm install
```

And then run the server with :
```bash
ng serve
```
## If you want to run the app, you need to creat an admin account first

Go in `Back\src\main\java\com\poc\back\config\WebSecurityConfig.java`and modfie this part :
``` bash
.requestMatchers("/login").permitAll()
.requestMatchers("/me", "/projets", "/calendar", "/work-sessions").authenticated()
.requestMatchers("/register").hasRole("ADMIN")
```  
into : 
``` bash
.requestMatchers("/login","/register").permitAll()
.requestMatchers("/me", "/projets", "/calendar", "/work-sessions").authenticated()
```  
and is Postamn use 
POST http://localhost:8080/register
{
  "username": "admin",
  "password": "admin1234",
  "firstname": "admin",
  "lastname": "admin",
  "role": "ROLE_ADMIN"
}
And then you can connect to an admin account. After that put back the previous WebSecurityConfig to keep it safe 


You are ready to try our web app !

Author :   Flavien BORGET / Clément JACQUET / Corentin Laval / Quentin RABAN 
