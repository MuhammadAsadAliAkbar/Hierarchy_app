# 🏢 Employee Hierarchy Management System

Complete full-stack application for managing organizational hierarchy with interactive **Tree View**.

## Hierarchy Structure

```
CEO
 └── Manager
      └── Project Manager
           └── Team Lead
                ├── Junior
                ├── Associate
                └── Intern
```

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | **React 18 + Vite** + Tailwind CSS + Lucide    |
| Backend     | **Node.js + Express.js + MongoDB** (Mongoose)  |
| Analytics   | **Python FastAPI**                              |

## Features

- ✅ Interactive **Org Tree View** (expand/collapse)
- ✅ Employee CRUD with hierarchy validation
- ✅ Role-based reporting rules (who can report to whom)
- ✅ Circular hierarchy prevention
- ✅ Auto re-assign subordinates on delete
- ✅ Dashboard stats by designation/department
- ✅ Python org-health analytics
- ✅ JWT Authentication
- ✅ Seed data with sample company hierarchy

## Project Structure

```
hierarchy-management-system/
├── backend/           # Express API (port 5001)
├── frontend/          # React + Vite (port 5173)
├── python-service/    # FastAPI analytics (port 8001)
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running
- Python 3.10+

### 1. Backend
```bash
cd backend
npm install
# Edit .env if needed (MongoDB URI)
npm run seed          # Load sample hierarchy + admin user
npm run dev
```

**Demo login:** `admin@hierarchy.com` / `admin123`

### 2. Python Analytics (optional)
```bash
cd python-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Hierarchy Rules (enforced by API)

| Role            | Can report to                          |
|-----------------|----------------------------------------|
| CEO             | (none – top level, only one allowed)   |
| Manager         | CEO                                    |
| Project Manager | Manager, CEO                           |
| Team Lead       | Project Manager, Manager               |
| Junior          | Team Lead, Project Manager             |
| Associate       | Team Lead, Project Manager             |
| Intern          | Team Lead, Junior, Associate, PM       |

## API Highlights

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/employees/tree     | Full nested org tree     |
| GET    | /api/employees          | Flat list + filters      |
| POST   | /api/employees          | Create (with validation) |
| GET    | /api/employees/stats    | Counts by role/dept      |
| GET    | /api/analytics/org-health | Python insights        |

## Seed Data Includes

- 1 CEO
- 2 Managers
- 2 Project Managers
- 3 Team Leads
- Juniors, Associates, Interns (15 employees total)

---

Built for learning full-stack hierarchy management with tree visualization.
# Hierarchy_app
