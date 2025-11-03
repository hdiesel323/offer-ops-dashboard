# 🚀 Quick Deploy to Coolify

## 📋 Pre-Deployment Checklist

- [ ] Git repository accessible (GitHub/GitLab)
- [ ] Coolify server running
- [ ] Supabase instance accessible from server
- [ ] Have Supabase URL and anon key ready

---

## 🎯 Deploy in 5 Minutes

### Step 1: Push to Git (if not done)

```bash
cd /Users/admin/Dropbox/Labs/GitHub/offer-ops-dashboard
git push origin main
```

### Step 2: Create App in Coolify

1. **Open Coolify Dashboard**
   - Navigate to your Coolify instance

2. **Click "New Resource" → "Application"**

3. **Configure Source:**
   - **Type**: Public Repository or GitHub (connect your account)
   - **Repository**: `https://github.com/[username]/offer-ops-dashboard`
   - **Branch**: `main`
   - **Build Pack**: `Dockerfile` (auto-detected)

4. **Build Configuration:**
   - **Port**: `3000`
   - **Health Check Path**: `/` (optional)

5. **Environment Variables:**
   Click "Add Environment Variable" for each:
   
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-qw4s08kc8ws0ccg84080cgc0.46.224.16.19.sslip.io
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MjA1MjE2MCwiZXhwIjo0OTE3NzI1NzYwLCJyb2xlIjoiYW5vbiJ9.yvCnr_nuNFxVUQkmPHuoCcieoZoufx3clXJleGaw2w0
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

6. **Domain (Optional):**
   - Enable "Generate Domain" for auto URL
   - Or add custom domain: `dashboard.yourdomain.com`
   - SSL auto-configured by Coolify

7. **Click "Deploy"**
   - Wait 3-5 minutes for build
   - Watch build logs for any errors

### Step 3: Verify Deployment

Once deployed, test these URLs:

✅ **Home**: `https://your-app.coolify.io/`
✅ **Offers**: `https://your-app.coolify.io/offers`
✅ **Buyers**: `https://your-app.coolify.io/buyers`
✅ **Publishers**: `https://your-app.coolify.io/publishers`

---

## 🔧 Alternative: Manual Server Deployment

If you're deploying to a custom server (non-Coolify):

### Option A: Docker

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Clone repository
git clone https://github.com/[username]/offer-ops-dashboard.git
cd offer-ops-dashboard

# 3. Create .env file
cat > .env.production.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-qw4s08kc8ws0ccg84080cgc0.46.224.16.19.sslip.io
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MjA1MjE2MCwiZXhwIjo0OTE3NzI1NzYwLCJyb2xlIjoiYW5vbiJ9.yvCnr_nuNFxVUQkmPHuoCcieoZoufx3clXJleGaw2w0
NODE_ENV=production
EOF

# 4. Build and run with Docker
docker build -t offer-ops-dashboard .
docker run -d \
  --name offer-ops-dashboard \
  -p 3000:3000 \
  --env-file .env.production.local \
  --restart unless-stopped \
  offer-ops-dashboard

# 5. Check logs
docker logs -f offer-ops-dashboard

# 6. Visit http://your-server-ip:3000
```

### Option B: PM2 (Node.js)

```bash
# 1. Install dependencies
npm ci --production=false

# 2. Build
npm run build

# 3. Install PM2
npm install -g pm2

# 4. Start with PM2
pm2 start npm --name "offer-dashboard" -- start

# 5. Save PM2 config
pm2 save
pm2 startup

# 6. Check status
pm2 status
pm2 logs offer-dashboard
```

### Option C: Systemd Service

```bash
# 1. Build the app
npm ci
npm run build

# 2. Create systemd service
sudo nano /etc/systemd/system/offer-dashboard.service

# Paste this:
[Unit]
Description=Offer-Ops Dashboard
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/offer-ops-dashboard
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-qw4s08kc8ws0ccg84080cgc0.46.224.16.19.sslip.io"
Environment="NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MjA1MjE2MCwiZXhwIjo0OTE3NzI1NzYwLCJyb2xlIjoiYW5vbiJ9.yvCnr_nuNFxVUQkmPHuoCcieoZoufx3clXJleGaw2w0"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target

# 3. Start service
sudo systemctl daemon-reload
sudo systemctl enable offer-dashboard
sudo systemctl start offer-dashboard
sudo systemctl status offer-dashboard
```

---

## 🌐 Nginx Reverse Proxy (Optional)

If using custom domain:

```nginx
# /etc/nginx/sites-available/dashboard
server {
    listen 80;
    server_name dashboard.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d dashboard.yourdomain.com
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Dashboard loads at root URL
- [ ] Stats cards display correct numbers (56 offers, 3 buyers, 3 publishers)
- [ ] Charts render on home page
- [ ] Offers table loads and displays data
- [ ] Search/filter works on offers page
- [ ] Can view individual offer details
- [ ] Can edit offers
- [ ] Buyers page loads
- [ ] Publishers page loads
- [ ] No console errors in browser
- [ ] Supabase API calls succeed (check Network tab)

---

## 🔄 Updating the Dashboard

### Coolify (Auto-Deploy)
1. Push changes to git: `git push origin main`
2. Coolify auto-deploys (if webhook enabled)
3. Or click "Redeploy" in Coolify UI

### Manual Docker
```bash
cd offer-ops-dashboard
git pull origin main
docker build -t offer-ops-dashboard .
docker stop offer-ops-dashboard
docker rm offer-ops-dashboard
docker run -d --name offer-ops-dashboard -p 3000:3000 --env-file .env.production.local --restart unless-stopped offer-ops-dashboard
```

### PM2
```bash
cd offer-ops-dashboard
git pull origin main
npm ci
npm run build
pm2 restart offer-dashboard
```

---

## 🐛 Troubleshooting

### Build Fails in Coolify
- Check build logs in Coolify
- Verify Node.js version (need 18+)
- Ensure Dockerfile is present in repo
- Check package.json for syntax errors

### Dashboard Shows Blank Page
- Check browser console for errors
- Verify environment variables are set
- Check that Supabase URL is accessible from server
- Inspect Network tab for failed API calls

### Data Not Loading
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase is accessible from server network
- Test direct curl: `curl http://supabasekong-qw4s08kc8ws0ccg84080cgc0.46.224.16.19.sslip.io/rest/v1/offers`

### Port 3000 Already in Use
- Change port in Docker run: `-p 3001:3000`
- Or kill existing process: `lsof -ti:3000 | xargs kill`

---

## 📞 Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Review Next.js docs: https://nextjs.org/docs/deployment
- Check Coolify docs: https://coolify.io/docs
