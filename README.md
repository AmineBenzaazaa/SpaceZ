# Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone https://github.com/Akpughe/simple-nodejs-express-boilterplate.git
cd simple-nodejs-express-boilterplate
```

Install the dependencies:

```bash
npm install
```

## Commands

Running locally:

```bash
nodemon app.js 
```
or

```bash
npm start
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--data\           # Data repository
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--app.route.js    # Parent route file
 |--app.js          # Express app
 
