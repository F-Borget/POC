# POC

## Subject

Application de saisie de temps

Réalisation d’une application web permettant la saisie, la consultation, l’édition des temps dans une entreprise de développement.

## User stories

- En tant qu’utilisateur, on peut se connecter via un Login / Password (les profils supportés sont Admin, Manager, User)
- En tant que User, on peut saisir ses temps, à la granularité de l’heure (choix projet + temps)
- En tant que User, on peut éditer un compte-rendu mensuel (export PDF)
- En tant que Manager, on peut consulter les temps saisis par les Users qui lui sont rattachés
- En tant que Manager, on peut éditer les compte-rendus mensuels des Users qui lui sont rattachés (export PDF)
- En tant que Manager, on peut saisir des projets
- En tant que Manager, on peut saisir de nouveaux Users qui lui seront rattachés
- En tant qu’Admin, on peut changer le statut d’un User (Manager / Admin)
- En tant qu’Admin, on peut changer l’affectation d’un User (changement de Manager)
- En tant qu’utilisateur non authentifié je ne peux pas solliciter l’API (excepté pour m’authentifier)
- En tant que User, on peut saisir son CRA en mode déconnecté (avec les projets sur lesquels on a déjà imputé). La synchro se fera automatiquement lorsque l’on retrouvera du réseau.

## Creating a PDF in Java
- PDFBox seems to be the best  
- iText is good too but a little too complex for simple PDF generation  

## Calendar in Angular
Angular Calendar and Luxon
https://www.youtube.com/watch?v=VNIXByHTvd8
School Project  

## Libraries

For this project we will use theses library for the authentication:  
JWT (JSON Web Tokens)  
Backend : Spring Security avec JWT  
Frontend : @auth0/angular-jwt  
Database : MySQL

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

## Set up the database

For easier deployement, we shared some files locatged in MySQL folder for running a MySQL container.
```bash
cd MySQL
docker build -t my-mysql .
docker run -d --name mysql-container -p 3306:3306 my-mysql
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

You are ready to try our web app !