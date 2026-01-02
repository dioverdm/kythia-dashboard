# 🆘 Troubleshooting & Common Issues

If you are stuck or seeing red text (errors) in your terminal, check this page first!

## 🛑 Basics: "It says command not found!"

**Error:** `npm: command not found` or `node: command not found`
**Solution:** You did not install Node.js.
1.  Go to [nodejs.org](https://nodejs.org/).
2.  Download the **LTS Version** (Long Term Support).
3.  Install it.
4.  Restart your terminal/computer.

**Error:** `git: command not found`
**Solution:** You don't have Git.
1.  Download Git from [git-scm.com](https://git-scm.com/downloads).
2.  Install it (click Next, Next, Next...).
3.  Restart your terminal.

---

## 🔒 Authentication Issues

**Error:** `[next-auth]` Error or "Sign in with Discord" fails.
**Solution:**
1.  Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2.  Click your app -> **OAuth2** tab.
3.  Look at **Redirects**. It MUST be exactly:
    `http://localhost:3001/api/auth/callback/discord`
    (or whatever your domain is if on a VPS).
4.  Make sure `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` in your `.env` file match exactly what is on the website.

---

## 🐘 Database Issues

**Error:** `P1001: Can't reach database server`
**Solution:**
1.  Is MySQL running? (Open XAMPP or your database tool and check).
2.  Is your password correct?
    *   Open `.env`.
    *   Look at `DATABASE_URL="mysql://root:password@localhost:3306/kythia_dashboard"`.
    *   Replace `root` with your username.
    *   Replace `password` with your REAL database password.
    *   Replace `kythia_dashboard` with the name of a database that actually exists.

---

## 🤖 Bot Connection Issues

**Error:** Dashboard works, but settings don't save or "Failed to fetch".
**Solution:**
1.  Is your Bot running? (The dashboard needs the bot to be online to talk to it).
2.  Check the `API_SECRET`.
    *   In Dashboard `.env`: `API_SECRET="abc"`
    *   In Bot `.env`: `API_SECRET="abc"`
    *   **They must be identical.**

---

## ⚠️ "I installed everything but it's still broken"

1.  **Delete `node_modules` folder**.
2.  Delete `package-lock.json` (or `bun.lockb`).
3.  Run `npm install` again.
4.  Run `npx prisma generate`.
5.  Try again.
