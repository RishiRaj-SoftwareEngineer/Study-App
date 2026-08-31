# 📚 StudyHub - Note Sharing & Quiz Platform

StudyHub is a full‑stack (MERN) learning platform built **for students, by students**. It lets users **share study notes**, **create and attempt quizzes**, **track learning activity**, and receive **role‑based dashboards** for students, teachers, and admins.

💻 **GitHub Repository:** [https://github.com/RishiRaj-SoftwareEngineer/Study-App](https://github.com/RishiRaj-SoftwareEngineer/Study-App)
🌐 **Live Website:** [https://study-app-rd4o.onrender.com/](https://study-app-rd4o.onrender.com/)

---

## 📸 Screenshots

<img src="Screenshot/01 Home_Page.png" alt="Home Page" width="700"/>
<img src="Screenshot/02 Signin page.png" alt="Signin Page" width="700"/>
<img src="Screenshot/03 Signup page.png" alt="Signup Page" width="700"/>
<img src="Screenshot/04 Student Dashboard.png" alt="Student Dashboard" width="700"/>
<img src="Screenshot/05 Admin Dashboard.png" alt="Admin Dashboard" width="700"/>
<img src="Screenshot/06 Teacher_Dashboard.png" alt="Teacher Dashboard" width="700"/>
<img src="Screenshot/07 Create Quizzes.png" alt="Create Quizzes" width="700"/>
<img src="Screenshot/08 Feedback_form.png" alt="Feedback Form" width="700"/>
<img src="Screenshot/09 Note Section or Community Forum.png" alt="Note Section / Community Forum" width="700"/>

---

## ✨ Features

### 🔐 Authentication & Users
- Secure signup/login with **JWT** authentication (httpOnly cookie) and protected routes
- Role‑based access: **student**, **teacher**, and **admin**
- Profile management with bio and social links (max 5)

### 📄 Notes Module
- Upload & share notes (PDF, DOC, DOCX)
- Notes linked to a subject
- Manage your own uploads
- **Cloudinary** storage for files

### 🧠 Quiz Module
- Create quizzes with multiple‑choice questions (teachers/admins only)
- Attempt quizzes and get instant scores
- Track attempts and average score

### 📊 Role‑Based Dashboards
- **Student dashboard** — stats, streak, quick actions, recent activity
- **Teacher dashboard** — add/manage quizzes, student progress, quiz performance
- **Admin dashboard** — platform stats, manage users/notes/quizzes, manage feedback

### 💬 Feedback Module
- Students & teachers can submit feedback
- Admins view and delete feedback from a dedicated **Manage Feedback** page

### 📈 Activity & Streak Tracking
- Recent activity timeline (notes, quizzes)
- Daily‑login streak (Duolingo‑style) and highest streak

### 📱 Responsive UI
- Fully responsive, dark‑theme focused UI built with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend**
- React 19 · Vite · Tailwind CSS · Zustand · React Router 7 · axios · react‑toastify · lucide‑react

**Backend**
- Node.js · Express · MongoDB + Mongoose · JWT · Multer + Cloudinary · helmet · express‑rate‑limit

**Deployment**
- Frontend: Firebase Hosting / Vite build
- Backend: Render (or any Node host)

---

## 🚀 Getting Started

### ✅ Prerequisites
- **Node.js** v18+ (tested with v24)
- **MongoDB** (Atlas or local)
- **Git**

### 📥 Clone the Repository
```bash
git clone https://github.com/RishiRaj-SoftwareEngineer/Study-App.git
cd StudyApp
```

### 🔧 Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

**Seed the roles** (required for login to work):
```bash
node scripts/seedRoles.js
```

Start the backend:
```bash
npm run dev
```
Backend runs at **http://localhost:5000** (health check: `GET /health`).

### 🎨 Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
The app runs at **http://localhost:5173**.

> For production builds, `client/.env.production` points `VITE_API_URL` to your deployed API.

---

## 🔑 API Keys & Credentials You Need

Before running, you must provide the following secrets (they are **not** committed):

| Where | Variable | What it is | Where to get it |
|-------|----------|------------|-----------------|
| `backend/.env` | `MONGO_URI` | MongoDB connection string | MongoDB Atlas → cluster → Connect |
| `backend/.env` | `JWT_SECRET` | Secret used to sign JWTs | Generate any long random string |
| `backend/.env` | `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | [cloudinary.com](https://cloudinary.com) dashboard |
| `backend/.env` | `CLOUDINARY_API_KEY` | Cloudinary API key | Cloudinary dashboard |
| `backend/.env` | `CLOUDINARY_API_SECRET` | Cloudinary API secret | Cloudinary dashboard |
| `client/.env` | `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` (dev) |

**Optional (deployment only):**
- Firebase project config in `firebase.json` / `.firebaserc` for hosting.

### 🧑‍🏫 Seed Users / Roles
Run `node scripts/seedRoles.js` once to create the `admin`, `teacher`, and `student` roles.
- Admins are created from the signup flow and then promoted to `admin` via the **Admin → Manage Users** page.

---

## 🧩 Roles & Routing

| Role | Landing route | Permissions |
|------|---------------|-------------|
| Student | `/dashboard` | Browse/upload notes, take quizzes, submit feedback |
| Teacher | `/teacher` | Manage quizzes, view student progress, submit feedback |
| Admin | `/admin` | Manage users, notes, quizzes, and feedback |

Protected routes use `ProtectedRoute` + `RoleGuard` on the client, and `requireRole()` middleware on the backend.

---

## 📁 Project Structure (Simplified)

```
StudyApp/
├── backend/
│   ├── config/          # db.js, cloudinary, swagger
│   ├── middlewares/     # verifyJWT, requireRole, uploads
│   ├── models/          # User, Role, Note, Quiz, UserState, Links, Feedback
│   ├── routes/          # users, notes, quizzes, links, feedback
│   ├── scripts/         # seedRoles.js
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/  # NavBar, dashboard, quiz, notes, feedback
│   │   ├── pages/       # Dashboard, Teacher/Admin dashboards, Admin pages, Feedback
│   │   ├── store/       # Zustand stores
│   │   ├── utils/       # auth, roles, helpers
│   │   └── Route.jsx
│   └── index.html
├── firebase.json
└── README.md
```

---

## 🔌 Key API Endpoints

| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | `/api/users/signup` | public | Register |
| POST | `/api/users/login` | public | Login |
| GET | `/api/users/profile` | auth | Current user |
| GET/POST/PUT/DELETE | `/api/notes` | auth | Notes CRUD |
| GET/POST/PUT/DELETE | `/api/quiz` | auth (create: teacher/admin) | Quizzes |
| GET/POST | `/api/links` | auth | Social links |
| POST | `/api/feedback` | student/teacher | Submit feedback |
| GET/DELETE | `/api/feedback` | admin | Manage feedback |
| GET | `/api/users/admin/stats` | admin | Platform stats |

---

## 🛠️ Troubleshooting

- **`EADDRINUSE` on port 5000** — a previous `node.exe` is still running. Find and stop it:
  ```bash
  netstat -ano | findstr ":5000"
  taskkill /PID <PID> /F
  ```
- **`querySrv ECONNREFUSED ...mongodb.net`** — MongoDB Atlas is unreachable. Confirm your `MONGO_URI` is correct and that your cluster's **Network Access** allows your current IP (or add `0.0.0.0/0`).
- **"Invalid role" / no dashboard on signup** — run `node scripts/seedRoles.js` so the `student` role exists.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 👨‍💻 Author

**Rishi Raj Pandey**
Computer Science Engineering Student · Aspiring Full‑Stack (MERN) Developer

GitHub: [https://github.com/RishiRaj-SoftwareEngineer](https://github.com/RishiRaj-SoftwareEngineer)

---

## ⭐ Feedback

Suggestions or feedback are welcome — open an issue or reach out. If you find this useful, give it a ⭐!

---

> *Built with a focus on real‑world problems, not just tutorials.*
