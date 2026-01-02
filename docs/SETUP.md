# 🐣 Beginner Setup Guide

Welcome! If this is your first time setting up a dashboard, **READ THIS CAREFULLY**. Skipping steps will break everything.

---

## ⚡ The Easy Way (Automated Script)

If you are on Linux or Pterodactyl Panel, we have a magic script for you.

1.  Open your terminal.
2.  Run this command:
    ```bash
    npm run setup
    ```
3.  **Wait** for it to finish.
4.  **IMPORTANT**: It will create a `.env` file for you if one doesn't exist. **YOU MUST EDIT THIS FILE** with your database and Discord details.
5.  After editing `.env` and saving, run `npm start`.

---

## 🛠️ The Manual Way (Step-by-Step)

If the script doesn't work or you are on Windows, follow these steps.

### ✅ Phase 1: Install the Tools

Before you touch any code, you need three programs installed on your computer.

1.  **Node.js (LTS Version)**
    *   Download: [nodejs.org](https://nodejs.org/)
    *   *Why?* This runs the server code.
2.  **Git**
    *   Download: [git-scm.com](https://git-scm.com/downloads)
    *   *Why?* This downloads the project files.
3.  **VS Code (Visual Studio Code)**
    *   Download: [code.visualstudio.com](https://code.visualstudio.com/)
    *   *Why?* The best editor to read and change the code.

> **Verification:** Open your terminal (Command Prompt or PowerShell) and type `node -v`. If it prints a number like `v18.x.x` or `v20.x.x`, you are good.

---

### 📥 Phase 2: Get the Code

1.  Open a folder on your computer where you want the project.
2.  Right-click and select **"Open in Terminal"** (or Git Bash).
3.  Type this command and hit Enter:
    ```bash
    git clone https://github.com/kenndeclouv/kythia-dashboard.git
    ```
4.  Go into the folder:
    ```bash
    cd kythia-dashboard
    ```
5.  **Install the libraries** (This takes a few minutes):
    ```bash
    npm install
    ```
    *(If it gets stuck, be patient. If it errors, check your internet).*

---

### ⚙️ Phase 3: The Configuration File (Vital!)

**THIS IS WHERE 90% OF PEOPLE FAIL. DO NOT SKIP.**

1.  Find the file named `example.env`.
2.  **Rename** it to simply `.env`. (Yes, just `.env`, nothing else).
3.  Open `.env` in VS Code.

You need to fill in these lines. If you leave them blank, **it will not work**.

#### 1. Database
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
```
*   Replace `USER` with your MySQL user (usually `root`).
*   Replace `PASSWORD` with your MySQL password.
*   Replace `DATABASE_NAME` with your database name.

#### 2. Discord Application
Go to [Discord Developer Portal](https://discord.com/developers/applications).
1.  New Application -> Name it.
2.  **Copy "Application ID"** -> Paste only into `DISCORD_CLIENT_ID` in `.env`.
3.  **Reset Secret** -> Copy it -> Paste into `DISCORD_CLIENT_SECRET`.
4.  **OAuth2 Tab**: Add Redirect URI: `http://localhost:3001/api/auth/callback/discord`

---

### 🚀 Phase 4: Start it up!

1.  **Setup Database**:
    Type this in terminal:
    ```bash
    npm run migrate
    ```
    *Success?* Green checks. *Error?* Check Phase 3 again.

2.  **Run the Server**:
    Type this:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Go to `http://localhost:3001`.

---

## 🚨 It's broken!
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for help.
