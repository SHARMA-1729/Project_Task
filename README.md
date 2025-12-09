# Retail Sales Management System

A full-stack Retail Sales Dashboard built with **React + Vite**, **Node.js + Express**, and **PostgreSQL (Supabase)**.  
It supports full-text search, multi-select filters, sorting, and pagination on a large sales dataset.

This project was designed for the TruEstate SDE Intern Assignment.

---

## 🚀 Live Demo

### Frontend (Vercel)
https://your-frontend-url.vercel.app

### Backend (Railway)
https://projecttask-production.up.railway.app

> Replace the above link with your actual deployed frontend link.

---

## 🧰 Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express

### Database
- PostgreSQL (Supabase)

### Deployment
- Vercel (Frontend)
- Railway (Backend)
- Supabase (Database Hosting)

---

## ⭐ Features

- 🔍 **Full-text search** on customer name & phone number  
- 🎯 **Multi-select filters**: region, gender, age range, product category, tags, payment method  
- 📅 **Date range filtering**  
- ↕️ **Sorting**: date, quantity, customer name  
- 📄 **Pagination** system (page, limit, total count)  
- 📊 **Sales summary cards**  
- ⚡ Optimized API queries using PostgreSQL indexes  

---

## 📁 Project Structure

root/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── routes/
│ │ └── index.js
│ ├── package.json
│ └── README.md
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── hooks/
│ │ └── main.jsx
│ ├── package.json
└── README.md
