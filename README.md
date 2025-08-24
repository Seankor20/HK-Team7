# HK-Team7 Homework Manager

## Overview
HK-Team7 is a web application for teachers and students to manage, create, and complete homework assignments. It features PDF-based question generation, real-time chat, and Supabase integration for authentication and storage.

## Features
- Teacher/NGO/Admin roles for homework management
- Create homework assignments with title, description, due date, and optional PDF upload
- Automatic question generation from uploaded PDFs (with images and explanations)
- Edit and submit generated questions
- Student view for tracking and completing homework
- Real-time chat and leaderboard
- Supabase backend for authentication, storage, and database
- Flask backend for PDF/image/video processing

## Tech Stack
- Frontend: React (TypeScript, Vite, Tailwind CSS)
- Backend: Flask (Python)
- Database & Auth: Supabase

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+
- Supabase account (for your own deployment)

### Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Seankor20/HK-Team7.git
   cd HK-Team7
   ```
2. **Install frontend dependencies:**
   ```sh
   npm install
   ```
3. **Install backend dependencies:**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
4. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the `backend/` folder and fill in your Supabase credentials.
   - Ensure `.env` is NOT committed to git (already in .gitignore).

### Running the App
**Frontend:**
```sh
npm run dev
```
**Backend (Flask):**
```sh
cd backend
python app.py
```

The frontend runs on [http://localhost:5173](http://localhost:5173) and the backend on [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Folder Structure
- `src/` - React frontend code
- `backend/` - Flask backend code
- `public/` - Static assets
- `README.md` - Project documentation

## License
MIT
