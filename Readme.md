<p align="center">
  <img src="assets/BookNestLogoW.png" alt="BookNest Logo" width="200" />
</p>

# BookNest

BookNest is a comprehensive book review platform where users can browse books, read and write reviews, and rate their favorite reads. Built with a React frontend and a Node.js backend using Express and MongoDB, BookNest offers a seamless experience for book enthusiasts to connect and share their literary passions.

## 🔗 Links

- **GitHub Repository:** [https://github.com/sameershaik07/BookeNest-Where-Strories-Nestle](https://github.com/sameershaik07/BookeNest-Where-Strories-Nestle)



## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### 📋 Prerequisites

- **Node.js:** Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
- **npm:** Package manager to install dependencies.
- **MongoDB:** Set up a MongoDB database. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based solution.

### 🛠️ Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/sameershaik07/BookeNest-Where-Strories-Nestle.git
cd BookNest-where-stories-nestle
npm install
```
#### 2. Create a ```.env``` file in the root directory and add the following variables:

```bash
MONGODB_URI=mongodb+srv://username:password@booknest.dn5hxsn.mongodb.net/booknest?retryWrites=true&w=majority&appName=booknest
JWT_SECRET=s9F#v8dL!2rX@qWm7zP3
PORT=5000
console.log('JWT_SECRET:', process.env.JWT_SECRET);


```

after that

```bash
npm run dev
```

#### 3. Setup Frontend

```bash
cd ../frontend
npm install
```


now run the frontend

```bash
npm run start
```

## 📚 API Documentation

BookNest's backend is powered by a RESTful API built with Express.js and MongoDB. Below are the key endpoints and their functionalities.


## 📝 Project Structure

```
booknest/
├── backend
│   ├── controllers
│   ├── logs
│   ├── middleware
│   ├── models
│   ├── routes
├── frontend
│   ├── public
│   │   ├── assets
│   ├── src
│   │   ├── admin
│   │   ├── components
│   │   ├── pages
│   │   ├── styles
├── Document
│   │──Readme.md    
├── README.md
├── package-lock.json
└── package.json
```