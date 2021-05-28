# tracklabs-assignment
Coding Assignment for TrakLabs Bootcamp 

## Tech stack
- Express JS
- PostgreSQL
- Node JS

#### To init the Database, run the following SQL Commands

1. Creating the DB

```
CREATE DATABASE trakinvest;
```
2. Add the `uuid-ossp` extension

```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
3. Create `departments` table
```
CREATE TABLE IF NOT EXISTS departments( id uuid NOT NULL DEFAULT uuid_generate_v4(), name VARCHAR(100) NOT NULL, created_on DATE NOT NULL, PRIMARY KEY (id) );
```
4. Create `employees` table

```
CREATE TABLE IF NOT EXISTS employees( id uuid NOT NULL DEFAULT uuid_generate_v4(), email VARCHAR(100) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL,department uuid DEFAULT NULL, created_on DATE NOT NULL, PRIMARY KEY (id), FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL );
```

- Clone the repository
- Navigate to the directory
- Run `npm i`
- Run `npm start`

##### You're ready to use the APIs
