# Firebase Hosting Deployment Instructions for The Skill Circuit

## Overview
Firebase will host your **Frontend (React)** as a static website.

---

## Prerequisites

1. **Node.js** installed on your computer
2. **Railway backend** already deployed (see railway.readinstructions.md)
3. **Google account** for Firebase

---

## Step 1: Create Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Create a project"**
3. Enter project name: `skill-circuit` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

---

## Step 2: Install Firebase CLI

Open your terminal/command prompt and run:

```bash
npm install -g firebase-tools
```

---

## Step 3: Login to Firebase

```bash
firebase login
```

This will open a browser window to authenticate.

---

## Step 4: Navigate to Frontend Folder

```bash
cd path/to/your/project/frontend
```

---

## Step 5: Set Backend URL

Edit the `.env` file in the frontend folder:

```
REACT_APP_BACKEND_URL=https://your-railway-backend-url.up.railway.app
```

Replace with your actual Railway backend URL.

---

## Step 6: Build the Frontend

```bash
npm install
npm run build
```

This creates a `build` folder with production-ready files.

---

## Step 7: Initialize Firebase

```bash
firebase init hosting
```

When prompted:
1. **Select project:** Choose the Firebase project you created
2. **Public directory:** Type `build`
3. **Single-page app:** Type `y` (Yes)
4. **Overwrite build/index.html:** Type `n` (No)
5. **Set up automatic builds:** Type `n` (No)

---

## Step 8: Deploy to Firebase

```bash
firebase deploy --only hosting
```

---

## Step 9: Get Your Live URL

After deployment, Firebase will show:
```
✔ Deploy complete!

Hosting URL: https://your-project-id.web.app
```

Your frontend is now live!

---

## Updating the App

Whenever you make changes:

```bash
npm run build
firebase deploy --only hosting
```

---

## Custom Domain (Optional)

1. Go to Firebase Console → Hosting → **"Add custom domain"**
2. Enter your domain (e.g., `www.skillcircuit.com`)
3. Follow DNS verification steps
4. Add the provided DNS records to your domain registrar

---

## Troubleshooting

### "firebase: command not found"
Run: `npm install -g firebase-tools`

### Build errors?
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Then `npm run build`

### API not working?
- Verify `REACT_APP_BACKEND_URL` is correct
- Check Railway backend is running
- Ensure CORS is configured on backend

### Blank page after deploy?
- Make sure you set public directory to `build`
- Ensure single-page app rewrite is enabled

---

## Firebase Configuration File

After `firebase init`, a `firebase.json` file is created:

```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Costs

Firebase Hosting is **FREE** for:
- 10 GB storage
- 360 MB/day data transfer
- Custom domain support
- SSL certificates

More than enough for most websites!

---

## Summary

1. Create Firebase project
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Set `REACT_APP_BACKEND_URL` in `.env`
5. Build: `npm run build`
6. Initialize: `firebase init hosting`
7. Deploy: `firebase deploy --only hosting`

---

## Admin Login

- **Email:** admin@skillcircuit.com
- **Password:** Chh@jer

---

## Support

Firebase Documentation: https://firebase.google.com/docs/hosting
