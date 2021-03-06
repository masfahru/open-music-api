# OPEN MUSIC API

This project is my submission for Dicoding's Back-end Learning Path. It's not a complete project, but it's a good starting point for learning how to build a RESTful API.

## Technologies

* [Node.js](https://nodejs.org/)
* [Hapi.js](https://hapijs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [JSON Web Tokens](https://jwt.io/)
* [Redis](https://redis.io/)
* [RabbitMQ](https://www.rabbitmq.com/)
* [Nodemailer](https://nodemailer.com/)

## Installation

Make sure your environment has Node.js, PostgreSQL, Redis, and RabbitMQ installed.

1. Clone the repository
2. Install dependencies using `npm install`
3. Create PostgreSQL database for development
4. Modify the `.env.example` file to your needs
5. Rename the `.env.example` file to `.env`
6. Run database migration using `npx node-pg-migrate up`, well make sure your PostgreSQL is up so there won't be any error
7. Start the server using `npm run start-prod`
8. If you want to run the server in development mode, use `npm run start-dev`

## Testing

I have included the test files in the folder `tests`. You can import the test files and run the tests using Postman. 
