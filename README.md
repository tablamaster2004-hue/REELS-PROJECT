# 🍔 RELLS

Food Reels Platform | React, Node.js, Express, MongoDB, JWT

• Built a full-stack food discovery platform with separate User and Food Partner roles.
• Implemented JWT authentication, OTP email verification, login, registration, and password reset flows.
• Developed food post creation, likes, and saved-post functionality.
• Designed REST APIs and MongoDB schemas for user, partner, and food data.
• Deployed frontend and backend services using Render.

---

## 📌 Features

### 👤 User
- View food items
- Watch food reels (short videos of food)

### 🍽️ Food Partner
- List food items on the platform

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | NODE JS,EXPRESS JS, MONGODB |
| Frontend | HTML,CSS,JAVASCRIPT,REACT |
| Media Storage | [ImageKit.io](https://imagekit.io) |

---

## ☁️ Cloud Service Provider

### ImageKit.io
RELLS uses **ImageKit** to store and deliver images and videos (food reels).

**Install the SDK:**
```bash
npm install @imagekit/nodejs
```

**Basic setup:**
```js
import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
});
```

---

## 🔐 Authentication

The platform uses separate authentication flows for **Users** and **Food Partners**.

APIs to be created:
- `POST /auth/user/register` — Register as a user
- `POST /auth/user/login` — User login
- `POST /auth/partner/register` — Register as a food partner
- `POST /auth/partner/login` — Food partner login

---

## 📁 Project Structure

```
RELLS/
├── BACKEND/          # Server-side logic & APIs
├── FRONTEND/         # Client-side UI
├── IMAGES/           # Image assets
├── VIDEOS/           # Video / reel assets
├── .gitignore        # Excluded files (node_modules, .env)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rells.git

# Navigate into the project
cd rells

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

> ⚠️ Never commit your `.env` file. It is already added to `.gitignore`.

### Run the Project

```bash
npm start
```

---

## 🔒 .gitignore

The following are excluded from version control:
- `.env` — environment secrets
- `node_modules` — dependencies

---

## 📄 License

This project is private. All rights reserved.
