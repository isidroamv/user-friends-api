# Overview

This project is a simple user API built using Node.js and Express.js. It is a simple CRUD API that allows you to create, read, update, and delete users.


# Run it with Docker

```bash
docker compose up --build
```

# Test CRUD operations

Calculate distance between two users
```bash
curl --location 'localhost:3000/api/users/friends/1/distance/5'
```

Get all users
```bash
curl --location 'localhost:3000/api/users'
```

Create a user
```bash
curl --location --request POST 'localhost:3000/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com"}'
```

Update a user
```bash
curl --location --request PUT 'localhost:3000/api/users/10' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "John Doe Updated",
    "email": "john-updated@example.com"}'
```

Delete a user
```bash
curl --location --request DELETE 'localhost:3000/api/users/10'
```

# Unit test with Docker

```bash
docker-compose run api yarn test
``` 