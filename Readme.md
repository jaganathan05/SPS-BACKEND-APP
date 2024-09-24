
# Stone Paper Scissors Game - Backend

## Overview

This backend application serves as the API for the Stone Paper Scissors game, allowing users to register, log in, create games, join existing games, and store game states in a database.

## Features

- **User Registration**: Users can register with their name, email, and password.
- **User Authentication**: Users can log in to receive a token for secure access.
- **Game Management**: Users can create new games or join existing ones using a game ID.
- **Game Logic**: Handles the core game mechanics for a 2-player Stone Paper Scissors game with six rounds.
- **Database Storage**: Stores user and game data securely.

## Technologies Used

- Node.js
- Express.js
- MongoDB (for database)
- Mongoose (for MongoDB object modeling)
- JWT (for user authentication)

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or cloud instance)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jaganathan05/SPS-BACKEND-APP.git
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```plaintext
     PORT=4000
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```

4. Start the server:
   ```bash
   npm start
   ```

### API Endpoints

#### User Registration

- **Endpoint**: `POST /register`
- **Request Body**:
  ```json
  {
      "name": "User Name",
      "email": "user@example.com",
      "password": "userpassword"
  }
  ```

- **Response**:
  - **201 Created**: User successfully registered
  - **400 Bad Request**: Validation errors or user already exists

#### User Login

- **Endpoint**: `POST /login`
- **Request Body**:
  ```json
  {
      "email": "user@example.com",
      "password": "userpassword"
  }
  ```

- **Response**:
  - **200 OK**: Returns user token and name
  - **401 Unauthorized**: Invalid credentials

#### Create Game

- **Endpoint**: `POST /create`
- **Headers**: 
  - `Authorization: Bearer <token>`

- **Response**:
  - **201 Created**: Game successfully created, returns game ID
  - **401 Unauthorized**: Invalid token

#### Join Game

- **Endpoint**: `POST /join`
- **Request Body**:
  ```json
  {
      "gameId": "abc123"
  }
  ```

- **Headers**: 
  - `Authorization: Bearer <token>`

- **Response**:
  - **200 OK**: User successfully joined game
  - **404 Not Found**: Game ID not found

#### Submit Move

- **Endpoint**: `POST /move`
- **Request Body**:
  ```json
  {
      "gameId": "abc123",
      "move": "stone" // or "paper", "scissors"
  }
  ```

- **Headers**: 
  - `Authorization: Bearer <token>`

- **Response**:
  - **200 OK**: Move successfully submitted
  - **401 Unauthorized**: Invalid token

#### Fetch Game States

- **Endpoint**: `GET /games`
- **Response**:
  - **200 OK**: Returns a list of finished games with their details

## Conclusion

This backend provides the necessary functionality for a Stone Paper Scissors game, allowing users to register, log in, and participate in games securely. 

