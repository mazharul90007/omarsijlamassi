# GraySpaceLiving

**Live link:** [Click Here](http://172.252.13.71:5003)

**Postman API Documentation:** [Click Here](https://documenter.getpostman.com/view/45896185/2sB2xECp7P)

---

## 🚀 Features

- **User Registration & Authentication**
  - Register, verify email via OTP, login, logout, refresh tokens
  - Password reset and change with OTP
  - Profile management and soft delete
  - Profile picture upload

- **Journals**
  - Create, update, delete, and fetch journals (per user)
  - Fetch all journals by date
  - Journals are linked to users

- **AI Integration**
  - POST endpoint to send data to an external AI reflection API

- **Security**
  - JWT-based authentication
  - CORS configuration
  - Input validation with Zod

- **Database**
  - MongoDB (via Prisma ORM)
  - Models: User, Journal

## 🛠 Tech Stack

- Node.js, Express
- TypeScript
- Prisma ORM (MongoDB)
- Zod (validation)
- JWT (authentication)
- Multer (file uploads)
- Nodemailer (email/OTP)
- Vercel (deployment)

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd grayspaceliving
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root with the following (example):

```
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/grayspaceliving?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
MAIL=your_email@example.com
MAIL_PASS=your_email_password
BASE_URL_SERVER=http://localhost:5000
BASE_URL_CLIENT=http://localhost:3000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
BCRYPT_SALT_ROUNDS=10
PORT=5000
NODE_ENV=development
```

### 4. Database Setup

- The project uses MongoDB via Prisma.
- Update `prisma/schema.prisma` if you need to change models.
- Run:
  ```bash
  pnpm prisma generate
  ```

### 5. Build and Run Locally

```bash
pnpm build
pnpm start
```

Or for development with hot reload:

```bash
pnpm dev
```

---

## 📚 API Endpoints

### Auth

- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/logout` — Logout (requires auth)
- `POST /api/v1/auth/refresh-token` — Refresh access token

### User

- `POST /api/v1/user/register` — Register
- `POST /api/v1/user/verify-otp` — Verify email OTP
- `GET /api/v1/user/profile` — Get profile (requires auth)
- `PATCH /api/v1/user/profile` — Update profile (requires auth)
- `DELETE /api/v1/user/profile` — Soft delete user (requires auth)
- `PATCH /api/v1/user/profile-picture` — Update profile picture (requires auth, multipart/form-data)
- `DELETE /api/v1/user/profile-picture` — Delete profile picture (requires auth)
- Password and reset endpoints (see routes for details)

### Journal

- `POST /api/v1/journal/` — Create journal (requires auth)
- `GET /api/v1/journal/` — Get all journals for user (requires auth)
- `GET /api/v1/journal/by-date?date=YYYY-MM-DD` — Get all journals for user by date (requires auth)
- `GET /api/v1/journal/:id` — Get single journal by ID (requires auth)
- `PATCH /api/v1/journal/:id` — Update journal (requires auth)
- `DELETE /api/v1/journal/:id` — Delete journal (requires auth)

### AI

- `POST /api/v1/ai/` — Send data to external AI reflection API

---

## 🖼 File Uploads

- Profile pictures are stored in `public/uploads/profile-pictures/`.
- Access via `/uploads/profile-pictures/<filename>`.

---

## ☁️ Deployment

## 📝 Scripts

- `pnpm dev` — Start in development mode (hot reload)
- `pnpm build` — Build TypeScript and generate Prisma client
- `pnpm start` — Start the built app
- `pnpm prisma generate` — Generate Prisma client

---

## 📄 License

ISC

---

**Feel free to customize this README for your project's needs!**
