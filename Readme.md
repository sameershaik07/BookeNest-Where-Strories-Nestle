📚 BookNest: Where Stories Nestle
Welcome to BookNest, a full-stack book store application built with the powerful MERN Stack (MongoDB, Express.js, React, Node.js). This platform offers seamless integration between frontend and backend, enabling users to explore, purchase, and manage books with ease.

🚀 Live Demo
📍 BookNest on Render (For testing, login via /api/alogin or /api/slogin using demo credentials)

🏗️ Tech Stack
Frontend: React + Vite

Backend: Node.js + Express

Database: MongoDB (via Mongoose)

Auth: JWT (optional), basic login/register

UI Enhancements: CSS animations for smooth interactions

File Uploads: Multer with static /api/uploads

📁 Folder Structure
BookNest/
├── backend/
│   ├── db/               # All schemas: Admin, Users, Seller, Wishlist
│   ├── uploads/          # File storage (served statically)
│   ├── server.js         # Main Express server
│   └── .env              # MongoDB URI & Secrets
├── frontend/
│   ├── src/              # React components
│   ├── vite.config.js    # Proxy to backend during development
│   └── dist/             # Build served via Express
🔧 Setup Instructions
1. Clone the repo
bash
git clone https://github.com/Mahabub-3301/BookeNest-Where-Strories-Nestle.git
cd BookNest
2. Backend
bash
cd backend
npm install
# Add your .env file with MONGO_URI
node server.js
3. Frontend
bash
cd frontend
npm install
npm run dev     # For development
npm run build   # Creates production-ready dist folder
4. Deployment
Copy dist/ into backend/

Add static route in Express:

js
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
🔒 Admin & Seller Routes
Method	Route	Purpose
POST	/api/alogin	Admin Login
POST	/api/asignup	Admin Signup
POST	/api/slogin	Seller Login
POST	/api/ssignup	Seller Signup
GET	/api/users	Get all users
DELETE	/api/userdelete/:id	Delete user by ID
GET	/api/orders	List all orders
💡 Features
Scalable database schema with realistic book seeding

Clean Axios integration with /api proxy via Vite

File upload using Multer for seller book listings

Admin control over users, sellers, orders

Frontend/backend fully decoupled for ease of deployment