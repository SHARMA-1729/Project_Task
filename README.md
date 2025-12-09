# Retail Sales Management System

## Overview
A full-stack Retail Sales Management System (React + Vite frontend, Node + Express backend, PostgreSQL on Supabase) that supports advanced search, multi-select filters, sorting and pagination over structured sales data. Built to satisfy the TruEstate SDE intern assignment requirements.

## Live demo
- Frontend (Vercel): https://project-task-<your-suffix>.vercel.app
- Backend (Railway): https://projecttask-production.up.railway.app

> Replace the above demo links with your actual deployed URLs.

## Tech stack
- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express
- Database: PostgreSQL (Supabase)
- Deployment: Vercel (frontend), Railway (backend), Supabase (DB)
- Dev tools: ESLint, Prettier, Nodemon (backend), Vite (frontend)

## Features
- Full-text search (Customer Name, Phone Number) — case-insensitive
- Multi-select & range filters (Region, Gender, Age range, Product category, Tags, Payment method, Date range)
- Sorting (Date desc, Quantity, Customer Name A→Z)
- Pagination (10 items / page, prev/next)
- Filter + search + sort state preserved across pagination
- REST API with endpoints for fetching sales and metadata

## Project structure
root/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── routes/
│ │ ├── utils/
│ │ └── index.js
│ ├── package.json
│ └── README.md
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── routes/
│ │ ├── services/ # axios instance
│ │ ├── hooks/
│ │ └── main.jsx
│ ├── package.json
│ └── README.md
├── docs/
│ └── architecture.md
└── README.md
