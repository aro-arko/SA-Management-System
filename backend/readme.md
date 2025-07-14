# SA Management System – Backend

A robust and modular RESTful API built for managing organisational tasks, events, and operations across four interconnected units:

- **Leads Management Unit (LMU)**
- **Event Management Unit (EMU)**
- **Human Resources & Finance (HRF)**
- **Digital and Social Media Marketing (DSMM)**

This system supports **role-based access**, **task management**, **attendance tracking**, and **performance reporting**, developed using a scalable **Node.js + TypeScript** stack with **MongoDB**.

---

## 🔧 Tech Stack

- **Backend Framework:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based role access
- **Validation:** Zod
- **API Design:** RESTful
- **Testing:** Postman
- **Tooling:** Git, VS Code

## 📁 Project Structure

```
src/
├── app/ # Express app initialization logic
├── builder/                    # Custom Query Builders (search, filter, pagination, etc.)
├── config/                     # Environment and server configuration
├── errors/                     # Centralized error handling (Zod, Validation, Auth, etc.)
├── interface/                  # TypeScript interfaces and types for consistent typing
├── middlewares/                # Middleware functions
│ ├── auth.ts                   # JWT-based authentication and role-based access
│ ├── globalErrorHandler.ts     # Catches and handles all errors centrally
│ ├── notFound.ts               # Handles 404 routes
│ └── validateRequest.ts        # Zod-based request validation middleware
├── modules/                    # Feature-based architecture
│ ├── Attendance/               # Attendance handling module
│ │ ├── SignInData/             # Routes, validation, controller for signing in attendance
│ │ └── SignOutData/            # Routes, validation, controller for signing out attendance
│ ├── Auth/                     # Authentication module (register, login)
│ ├── DSMM/                     # Digital & Social Media Marketing Unit
│ │ ├── DSMMMultitasking/       # DSMM multitasking assignments and logic
│ │ └── DSMMTask/               # DSMM tasks creation and updates
│ ├── EMU/                      # Event Management Unit
│ │ ├── EMUMultitasking/        # EMU multitasking-related features
│ │ ├── EMUWeekDayTour/         # Weekly event tour tasks for EMU
│ │ └── FixedTimeEvent/         # Fixed time event creation and tracking
│ ├── HR & Finance/             # HR and Finance Unit
│ │ ├── HR_FinanceTask/         # HR & Finance task assignments and tracking
│ │ └── NewApplications/        # Handling new applications from students/staff
│ ├── LMU/                      # Leads Management Unit
│ │ ├── DataManagement/         # Data entry task creation, update, and reports
│ │ ├── LeadsManagement/        # Creating and managing lead-based tasks
│ │ ├── LMUDataBatch/           # Batch management for lead and data work
│ │ ├── LMULeadsGoals/          # Goals setup and tracking for LMU
│ │ ├── LMUMultitasking/        # Multitasking management and applications
│ │ └── LMUOthers/              # Miscellaneous LMU tasks and other involvements
│ └── User/                     # User model, roles, permissions, and schema
├── routes/                     # Entry points for all routes, organizes all feature modules
├── types/                      # Global custom types and enums
├── utils/                      # Utility functions (e.g., catchAsync, pagination helpers)
├── app.ts                      # Main express app setup and middleware integration
├── server.ts                   # Entry point to run the server
├── .env                        # Environment variables (e.g., DB_URI, JWT_SECRET)
```

## 🚀 Features

✅ **Authentication & Authorization**

- Role-based access control using JWT.
- Secure route protection using custom `auth.ts` middleware.
- Supports multiple roles for precise access management:
  - `coordinator`
  - `head`
  - `lmuAdmin`, `lmuDataLeader`, `lmuMember`
  - `emuAdmin`, `emuMember`
  - `dsmmAdmin`
  - `hrFinanceAdmin`

---

## 📌 Core Modules

### 1. 📅 Attendance Module

- **SignInData & SignOutData**
  - Mark attendance for tasks or events.
  - Sign in and sign out flow with validations.
  - Fetch and manage attendance logs.

---

### 2. 📊 LMU (Leads Management Unit)

- **Leads Management**
  - Create, update, and delete leads-based tasks.
  - Add, track, and manage user activities like WhatsApp, calling, and email.
- **Data Management**
  - Submit and edit detailed task reports.
  - Assign and manage data entry tasks.
- **Goals**
  - Set monthly or batch-wise goals for team members.
  - View and update progress against goals.
- **Multitasking & Others**
  - Apply for multitasking roles across LMU tasks.
  - Admin can update roles or reject/approve applications.

---

### 3. 🎪 EMU (Event Management Unit)

- **Event Handling**
  - Create and manage event-based tasks.
- **Fixed Time Events**
  - Setup timed events for weekly or one-time use.
  - Track sign-in for scheduled events.
- **Multitasking**
  - Assign multitasking responsibilities to EMU members.
  - Update or review ongoing multitasking activities.

---

### 4. 📣 DSMM (Digital & Social Media Marketing)

- **Task Management**
  - Create digital tasks related to marketing and outreach.
- **Multitasking**
  - Manage multitasking roles, applications, and status updates.
  - Allow member participation and assignment updates.

---

### 5. 🧾 HR & Finance

- **Task Handling**
  - Create, update, and delete HR & Finance tasks.
- **Application Management**
  - Handle new application requests from users or admins.
  - View, filter, and update application statuses.

## 🧠 Error Handling

Centralized and consistent error management across the backend.

- ✅ **Global Error Handler** to catch and respond with uniform error structures.
- ✅ **Custom Error Classes** handle:
  - Zod schema validation errors
  - Mongoose validation and cast errors
  - Duplicate key violations (e.g., unique fields like mobile number)
  - Unauthorized or forbidden access attempts

---

## 🔐 Security

Robust authentication and access control system.

- 🔒 JWT-based authentication for login and session management
- 👥 Role-based access enforced via `auth.ts` middleware
- ❌ Expired or invalid JWT tokens return meaningful error responses
- 🚫 Inactive user accounts are restricted from logging in or accessing protected routes

---

## 🧪 API Testing

Simple and standardized testing flow using **Postman**.

- 🔁 All routes follow **RESTful API** principles.
- 📦 Standardized JSON response structure for success and errors.
- 🔐 For protected routes:
  - Use the `Authorization` header
  - Format: `Bearer <your_jwt_token>`

---

## 🛠️ Middleware Summary

| Middleware              | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `auth.ts`               | Protects routes based on assigned user roles               |
| `validateRequest.ts`    | Validates incoming request bodies using Zod schemas        |
| `globalErrorHandler.ts` | Catches and formats all unhandled errors across the system |
| `notFound.ts`           | Returns structured response for undefined API endpoints    |

## 📈 Advanced Utilities

### 🔍 `QueryBuilder.ts`

A reusable query helper used across all list-based GET endpoints.

Supports:

- 🔎 **Search** across defined fields
- 🎯 **Filtering** by query parameters
- 📄 **Pagination** (`page`, `limit`)
- 🧭 **Sorting** (`sortBy`, `sortOrder`)
- 📌 **Field Selection** (`fields`)

Perfect for endpoints like:

- `/all-tasks`
- `/all`
- `/search`
- etc.

---

## 🧑‍💼 Roles and Access Table

| Module           | Coordinator | Head | Admin               | Data Leader        | Member         |
| ---------------- | ----------- | ---- | ------------------- | ------------------ | -------------- |
| **LMU**          | ✅          | ✅   | ✅ (lmuAdmin)       | ✅ (lmuDataLeader) | ✅ (lmuMember) |
| **EMU**          | ✅          | ✅   | ✅ (emuAdmin)       | –                  | ✅ (emuMember) |
| **DSMM**         | ✅          | ✅   | ✅ (dsmmAdmin)      | –                  | –              |
| **HR & Finance** | ✅          | ✅   | ✅ (hrFinanceAdmin) | –                  | –              |

---

## 📦 Installation

```bash
git clone https://github.com/aro-arko/SA-Management-System
cd sa-management-system
npm install
```

## 🌐 Base API URL

```bash
Production: [`https://sa-backend.aro-arko.software/api/v1`](https://sa-backend.aro-arko.software/api/v1)
Development: `http://localhost:5000/api/v1`
```

## 🌱 Environment Variables

Create a `.env` file in the root directory with the following keys:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10

# JWT Configuration
JWT_ACCESS_SECRET=your_very_secure_jwt_secret_key
JWT_ACCESS_EXPIRES_IN=30d
```

## 🚀 Running the Server

Use the following commands based on your environment setup:

```bash
# For development (auto-restarts using ts-node-dev)
npm run start:dev

# For production build
npm run build       # Compile TypeScript to JavaScript
npm run start       # Run the compiled server

# Optional:
npm run start:prod  # Run compiled server using nodemon
```

## 🧹 To-Do / Future Features

- Admin dashboard with visual stats
- Email-based password recovery
- Exporting attendance and lead reports
- Soft delete for tasks and activities

---

## 🤝 Contributors

**Aro Arko**  
_Full Stack Developer, System Architect, and Backend Engineer_  
🔗 [Portfolio Website](https://www.aro-arko.software)
