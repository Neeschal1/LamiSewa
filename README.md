# 🚀 LamiSewa

LamiSewa is a modern relationship and matrimonial matchmaking platform designed to connect individuals based on preferences, compatibility, and intelligent matching. It provides real-time communication, profile verification, and AI-assisted matchmaking to make finding meaningful connections easier, safer, and smarter.

---

## ✨ Features

- Smart Matchmaking System – Suggests compatible profiles based on preferences and behavior
- Real-time Chat System – Instant messaging between matched users
- Voice & Video Calls – Integrated communication features for deeper connection 
- Profile Verification System – Ensures authenticity of user identities
- Advanced Search & Filters – Filter users by age, location, interests, education, and more
- Media Sharing – Send images, voice notes, and attachments in chats
- Like & Follow System – Express interest and build connections
- AI-based Match Suggestions (Future) – Intelligent profile recommendations based on user behavior

---

## 🛠️ Tech Stack

- Frontend: React Native (JavaScript / TypeScript-ready)
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: JWT-based authentication (stored securely in the user's device)
- Real-time Features: WebSockets (planned / optional integration)
- AI Integration: LangChain / Hugging Face (where required)
---

## 📁 Project Structure
  LamiSewa
   - client/       # React Native App
   - server/       # Django REST API
   - README.md
   - LICENCE

---
### Clone repository

```bash
git clone https://github.com/Neeschal1/lamisewa.git

```
## ⚙️ Backend Setup (Django)

### 1. Create Virtual Environment

```bash
python -m venv env
source env/bin/activate   # mac/linux
env\Scripts\activate      # windows
```
### 2. Install Dependencies

```bash
pip install -r requirements.txt
```
### 3. Setup Environment Variables

```bash
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_NAME=your_db
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
```
### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```
### 5. Start Server

```bash
python manage.py runserver 0.0.0.0:8000
```
0.0.0.0 makes your Django server accessible from any device in the same network (not just localhost) and 8000 is the port number where the server runs and can be changed if needed.

---
## 📱 Frontend Setup (React Native)
### 1. Navigate to client
```bash
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run app
  - For Android
```bash
npm run android
```
  - For iOS
```bash
npm run ios
```
  - For Physical Device
```bash
npx expo start
```

---
### For API Endpoints, run the server and add /docs in the URL to activate entire URL documentations.
---


## Author
Developed by Nischal Pokhrel
