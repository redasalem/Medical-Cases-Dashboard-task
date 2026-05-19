# 🩺 MedCase Hub — Medical Cases Dashboard

MedCase Hub is a premium web application designed for medical students to study, review, and diagnose clinical cases. The application provides an interactive dashboard with advanced filtering options, secure authentication routes, and detailed case analysis sheets.

---

## ✨ Features

- **🔐 Secure Gatekeeping**: Authenticated route guards checking for JWT validation blocks.
- **📊 Real-time Dashboard**: Fast, responsive layout with live search indexing and difficulty categorizations (Easy, Medium, Hard).
- **📋 Clinical Sheets**: Complete view of medical cases including clinical presentations, patient history, and confidential diagnoses.
- **💫 Modern UX/UI**: Frosted glass effects, responsive layouts, responsive SVG medical branding icons, and dynamic interactions.
- **📡 Server Proxying**: Backend Express API proxy to bypass CORS issues and secure credentials.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript 6
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4 (using new native imports and theme extensions)
- **Icons**: Lucide React
- **Client**: Axios
- **Server/Proxy**: Express, dotenv

---

## 📂 Project Architecture

```text
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx # Route guarding logic
│   ├── pages/
│   │   ├── Login.tsx          # Credentials entry and authentication
│   │   ├── Dashboard.tsx      # Main case listings and filtering
│   │   └── CaseDetails.tsx    # Single case display & diagnosis reports
│   ├── utils/
│   │   └── apiClient.ts       # Axios instance with request/response interceptors
│   ├── App.tsx                # Routing definitions
│   ├── main.tsx               # Entrypoint mounting React
│   └── index.css              # Tailwind global styling configuration
├── server.ts               # Development proxy server + Static production host
├── package.json            # Node dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) installed.

### 📥 Installation

Install dependencies using pnpm:

```bash
pnpm install
```

### ⚙️ Environment Configuration

Create a `.env` file in the root directory and add the following:

```env
VITE_API_BASE_URL=https://testingapi.alrowadit.com
NODE_ENV=development
```

### 💻 Running the Application

To run the application locally alongside the development API proxy server:

```bash
# Compile TypeScript files and start the Express server
npx tsx server.ts
```

Alternatively, to run the Vite dev server standalone:

```bash
pnpm dev
```

### 🏗️ Building for Production

Compile TypeScript checks and build the production bundle:

```bash
pnpm build
```
