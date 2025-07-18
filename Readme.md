# 📚 BookNest — Where Stories Nestle

BookNest is a full-stack MERN application designed as a book store platform, enabling admins, sellers, and users to interact seamlessly. It offers features like book listing, order management, wishlist tracking, and secure authentication — all integrated into a polished UI powered by React and Express.

---

## 🚀 Live Demo

👉 [BookNest on Render](https://bookenest-where-strories-nestle.onrender.com/)

> You can test admin and seller login via `/api/alogin` and `/api/slogin` with demo credentials.

---

## 🧰 Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Express + Node.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** Basic login/register (optional JWT)  
- **Deployment:** Render (server & client merged)  
- **Styling:** Custom CSS + Animations  
- **Uploads:** Multer (served at `/api/uploads`)

---

## 📁 Folder Structure

```
BookNest/
├── backend/                        # Express + MongoDB backend
│   ├── db/                         # Database schemas
│   │   ├── Admin/                 # Admin model
│   │   ├── Users/                # User model, Wishlist, Orders
│   │   └── Seller/               # Seller & item models
│   ├── uploads/                   # Book images (via multer)
│   ├── dist/                      # React frontend build
│   ├── server.js                  # Main backend entry point
│   └── .env                       # Environment variables (Mongo URI)
├── frontend/                      # React + Vite frontend
│   ├── src/                       # App components
│   ├── vite.config.js             # Proxy setup to backend
│   ├── index.html                 # HTML root
│   └── package.json               # Frontend dependencies
└── README.md                      # Project documentation
```
---

## ⚙️ Setup & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Mahabub-3301/BookeNest-Where-Strories-Nestle.git
cd BookNest
```

2. Backend Setup
```
cd backend
npm install
# Add .env with MONGO_URI and other secrets
node server.js
```
3. Frontend Setup
```
cd frontend
npm install
npm run dev      # Development mode
npm run build    # Creates /dist folder for production
```
4. Merge Frontend with Backend
Copy dist/ into backend/ and serve via Express:
```
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```
🔐 API Routes
```
## 🔐 API Routes

| Method | Route                         | Description                  |
|--------|-------------------------------|------------------------------|
| POST   | `/api/alogin`                 | Admin login                  |
| POST   | `/api/asignup`                | Admin signup                 |
| GET    | `/api/users`                  | Get all users                |
| DELETE | `/api/userdelete/:id`         | Delete user by ID            |
| DELETE | `/api/userorderdelete/:id`    | Delete user order by ID      |
| DELETE | `/api/useritemdelete/:id`     | Delete seller's item by ID   |
| POST   | `/api/slogin`                 | Seller login                 |
| POST   | `/api/ssignup`                | Seller signup                |
| GET    | `/api/sellers`                | Get all sellers              |
| DELETE | `/api/sellerdelete/:id`       | Delete seller by ID          |
| GET    | `/api/orders`                 | Get all orders               |
| GET    | `/api/uploads/:filename`      | Access uploaded book image   |
```


✨ Features
📦 Realistic book seeding with image links

🌐 Proxy integration for seamless dev experience

🛡️ Secure backend endpoints with Express

📸 File uploads via Multer

👨‍💼 Admin management of users and sellers

🎨 Dynamic UI with smooth CSS transitions

💾 MongoDB for scalable data handling
