# Yashmart Backend

This is the Django backend for the Yashmart project. Follow the instructions below to set up the project on your local machine.

## Prerequisites

Make sure you have the following installed on your system:
- **Python 3.11+**
- **PostgreSQL** (for the database)

---

## 🚀 A-to-Z Local Setup Guide

### 1. Open the Backend Directory
Open your terminal and navigate to the backend directory:
```bash
cd backend
```

### 2. Create a Virtual Environment
It is best practice to run your Python projects inside a virtual environment to manage dependencies securely.
```bash
python -m venv venv
```

### 3. Activate the Virtual Environment
Before installing dependencies or running the server, you must activate the virtual environment.

- **On Windows (Command Prompt or PowerShell):**
  ```bash
  venv\Scripts\activate
  ```
- **On macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```
*(You should see `(venv)` appear at the beginning of your terminal prompt).*

### 4. Install Dependencies
Install all required Python packages (like Django, psycopg2, python-decouple, etc.):
```bash
pip install -r requirements.txt
```

---

## ⚙️ Environment Variables (.env Setup)

This project uses `python-decouple` to manage environment variables securely. You must create a `.env` file in the root of the `backend` directory (the same directory where `manage.py` is located).

1. Create a file named exactly **`.env`**.
2. Copy and paste the following template into the file and update the values to match your local setup:

```ini
# Security Warning: Keep the secret key secret in production!
SECRET_KEY=your-very-secret-django-key

# Set to False in production
DEBUG=True

# Allowed hosts (comma-separated, no spaces)
ALLOWED_HOSTS=127.0.0.1,localhost

# =========================
# PostgreSQL Database Setup
# =========================
DB_NAME=yashmart
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

> **Important:** Never commit your real `.env` file to version control. It has already been added to `.gitignore`.

---

## 🗄️ Database Setup & Migrations

Before running the server, you need to set up the database.

1. Open **pgAdmin** (or use the `psql` command line) and create a new PostgreSQL database named `yashmart` (or whatever you set in your `.env` file).
2. Run Django migrations to create the necessary tables in your new database:
```bash
python manage.py migrate
```

---

## 🏃‍♂️ Running the Development Server

Start the local Django development server:
```bash
python manage.py runserver
```

You can now access the API at `http://127.0.0.1:8000/`.

### Creating an Admin User
To access the Django Admin panel at `http://127.0.0.1:8000/admin/`, create a superuser:
```bash
python manage.py createsuperuser
```
*(Follow the prompts to enter your email and password).*
