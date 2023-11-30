# React Blog App

## Introduction

This project contains a backend and a frontend for a template for blog app.

Its a CRUD system for creating `Posts` and `Comments`.

## Technical Details and Requirements

The database used is **an in memory `postgres` instance. Meaning it is not persistent between server restarts.** So its also not necessary to run a database before running the project.

This project uses `yarn` originally as package manager.

## Running Locally

First run the backend project then frontend.

### Run the Backend

1. Install dependencies.

```
cd backend
yarn install
```
2. Create a `.env` file (or rename `.env.example` to `.env`) inside the `./backend` folder using the `.env.example` as template:


| Env | Description | Values |
| ----------- | ----------- | ----------- |
| PORT | Port which the server will run | Any port number
| DB_TYPE | Database used | Currently only `postgres` allowed
| RUN_SEED_ON_START | Auto populate `Posts` and `Comments` with random values on startup | `true` or `false` (`false` by default)

3. Run the server:

```
yarn start
```

### Run the Frontend

1. Install dependencies.

```
cd backend
yarn install
```

2. Create a `.env` file (or rename `.env.example` to `.env`) inside the `./frontend` folder using the `.env.example` as template:


| Env | Description | Values |
| ----------- | ----------- | ----------- |
| REACT_APP_API_URL | URL for the backend (without the trailling slash) | Example: `http://localhost:3001`

3. Run the frontend.

```
yarn start
```

### Features

* List / Create / Edit / Delete ``Posts``:

```
Post {
	id: string;
	title: string;
	content: string;
	comments: Comment[];
	createdAt: Date;
	updatedAt: Date;
}
```

* List / Create / Edit / Delete `Commments`:

```
Comment {
	id: string;
	content: string;
	userName: string;
	createdAt: Date;
	updatedAt: Date;
}
```

### Running Tests

For both frontend and backed run `yarn test`.

> TODO: Create unit tests and test coverage.

## TODO

* Unit tests
* Improve styles
* Code refactoring (specially frontend)
* Allow other DB (not in-memory)
