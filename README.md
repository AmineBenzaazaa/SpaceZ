# SpaceZ

A Node.js / Express REST API for user accounts. It handles sign-up, login with JWT access and refresh tokens, profile updates, and password reset and email verification by emailed codes. When a user registers, the API generates a BSC/EVM wallet with `web3`. It stores the wallet's private key in MongoDB, encrypted with AES-256-CBC, and saves the public address on the user.

## Tech stack

- Node.js, Express 4
- MongoDB with Mongoose 6
- JWT (`jsonwebtoken`) and `bcrypt` for authentication
- Joi for request validation
- Nodemailer for transactional email
- `web3` / `ethers` for wallet generation
- Morgan for HTTP request logging, plus `cors` and `dotenv`

## Project structure

```
app.js              # Express app: CORS, body parsing, logging, route mounting
app.routes.js       # Mounts the routers (GET / health message, /api/user)
config/             # MongoDB connection and security/env configuration
controllers/        # Route handlers
data/               # Repository layer around the Mongoose models
middleware/         # JWT auth, refresh-token auth and role-based auth
models/             # Mongoose models: user, user preference, user wallet, token
routes/             # Express routers
services/           # Business logic (users, email verification, wallet creation)
utils/              # Custom error class and message constants
validations/        # Joi schemas
```

## API

All routes are under `/api/user`:

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/` | Bearer | Get the current user |
| POST | `/signup` | - | Register a user (also creates a wallet) |
| POST | `/username` | - | Check whether a username is available |
| POST | `/login` | - | Log in and receive tokens |
| POST | `/token/refresh` | Refresh token | Issue a new access token |
| POST | `/change-password` | Bearer | Change the password |
| PUT | `/update-profile` | Bearer | Update name, email or phone number |
| POST | `/send-reset-token` | Bearer | Email a password-reset code |
| POST | `/send-verify-token` | Bearer | Email an email-verification code |
| POST | `/forgot-password` | - | Reset the password with a code |
| POST | `/verify-email` | Bearer | Verify the email with a code |

## Getting started

Requirements: Node.js and a running MongoDB instance.

```bash
git clone https://github.com/AmineBenzaazaa/SpaceZ.git
cd SpaceZ
npm install
npm start          # runs node app.js
```

The server listens on `PORT` (default `8000`).

## Environment variables

The app reads these from the environment, or from a `.env` file through `dotenv`:

| Variable | Purpose |
| -------- | ------- |
| `PORT` | HTTP port (default 8000) |
| `CONNECTION_STRING` | MongoDB connection string (default `mongodb://localhost:27017/`) |
| `SECRET` | JWT access-token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh-token secret |
| `ACCESS_TOKEN_EXPIRY_TIME` | Access-token lifetime in seconds |
| `REFRESH_TOKEN_EXPIRY_TIME` | Refresh-token lifetime in seconds |
| `CLIENT_URL` | Frontend URL |
| `BACKEND_URL` | Backend URL |
| `RPC_LINK` | JSON-RPC endpoint of the BSC/EVM node used by `web3` |
| `ENCRYPTION_KEY` | 32-byte hex key used to encrypt wallet private keys |

The SMTP transport is set up in `services/email-verification.service.js`.

## License

GPL-3.0. See [LICENSE.md](LICENSE.md).
