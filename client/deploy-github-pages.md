# Deploy EmpTrack Frontend to GitHub Pages

## 🚀 Step 1: Build for Production

```bash
cd client
npm run build
```

## 🎯 Step 2: Install GitHub Pages Package

```bash
npm install --save-dev gh-pages
```

## ⚙️ Step 3: Update package.json

Add these scripts to your `client/package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "homepage": "https://yourusername.github.io/emptrack"
  }
}
```

## 🌐 Step 4: Create GitHub Repository

1. Create a new repository on GitHub
2. Initialize git in your project:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/emptrack.git
git push -u origin main
```

## 🚀 Step 5: Deploy to GitHub Pages

```bash
npm run deploy
```

## ⚠️ Important Notes

### Limitations with GitHub Pages:
- ❌ No backend API (Node.js server won't work)
- ❌ No database connectivity
- ❌ No server-side authentication
- ❌ Limited to static content only

### What WILL work:
- ✅ Static pages and routing
- ✅ UI components
- ✅ Client-side state management
- ✅ LocalStorage for data persistence

### What WON'T work:
- ❌ API calls to backend
- ❌ Database operations
- ❌ JWT authentication
- ❌ Real-time data updates
```
