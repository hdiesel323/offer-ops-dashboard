# Offer-Ops Dashboard Deployment Guide

## Deploy to Coolify

### Prerequisites
- Coolify server running
- Git repository pushed to GitHub/GitLab
- Supabase instance accessible from server

### Method 1: Deploy via Coolify UI (Recommended)

1. **Login to Coolify Dashboard**

2. **Create New Resource**
   - Click "New Resource"
   - Select "Application"
   - Choose "Public Repository" or connect your GitHub

3. **Configure Repository**
   ```
   Repository URL: https://github.com/[your-username]/offer-ops-dashboard
   Branch: main
   Build Pack: Dockerfile
   Port: 3000
   ```

4. **Environment Variables**
   Add these in Coolify's Environment section:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-qw4s08kc8ws0ccg84080cgc0.46.224.16.19.sslip.io
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MjA1MjE2MCwiZXhwIjo0OTE3NzI1NzYwLCJyb2xlIjoiYW5vbiJ9.yvCnr_nuNFxVUQkmPHuoCcieoZoufx3clXJleGaw2w0
   NODE_ENV=production
   ```

5. **Domain Settings**
   - Enable public access
   - Configure custom domain (optional): `dashboard.yourdomain.com`
   - Coolify will auto-generate SSL certificate

6. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes for build
   - Dashboard will be available at assigned URL

### Method 2: Manual Docker Deployment

If you prefer to deploy manually on your server:

```bash
# 1. Clone repository on server
git clone https://github.com/[your-repo]/offer-ops-dashboard.git
cd offer-ops-dashboard

# 2. Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=http://supabasekong-qw4s08kc8ws0ccg84080cgc0.46.224.16.19.sslip.io
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MjA1MjE2MCwiZXhwIjo0OTE3NzI1NzYwLCJyb2xlIjoiYW5vbiJ9.yvCnr_nuNFxVUQkmPHuoCcieoZoufx3clXJleGaw2w0
NODE_ENV=production
EOF

# 3. Build Docker image
docker build -t offer-ops-dashboard .

# 4. Run container
docker run -d \
  --name offer-ops-dashboard \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  offer-ops-dashboard

# 5. Check logs
docker logs -f offer-ops-dashboard
```

### Method 3: Direct Node.js Deployment

```bash
# 1. On your server
cd offer-ops-dashboard
npm ci
npm run build

# 2. Start with PM2
npm install -g pm2
pm2 start npm --name "offer-dashboard" -- start
pm2 save
pm2 startup

# 3. Configure nginx reverse proxy (optional)
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
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Verify Deployment

After deployment, check:

1. **Home Page**: `http://your-domain.com/`
   - Should show dashboard with stats
   
2. **Offers Page**: `http://your-domain.com/offers`
   - Should load data table with 56 offers
   
3. **Buyers Page**: `http://your-domain.com/buyers`
   - Should show 3 buyers

4. **API Connection**: Check browser console
   - No errors about Supabase connection

## Troubleshooting

### Build Fails
- Check Node.js version (need 18+)
- Verify all dependencies installed: `npm ci`
- Check build logs: `npm run build`

### Data Not Loading
- Verify SUPABASE_URL is accessible from server
- Check SUPABASE_ANON_KEY is correct
- Inspect browser Network tab for API errors

### Port Already in Use
- Change port in Dockerfile: `ENV PORT=3001`
- Or stop conflicting service: `lsof -ti:3000 | xargs kill`

## Production Checklist

- [ ] Environment variables set correctly
- [ ] Supabase URL accessible from server network
- [ ] Domain/SSL configured (if using custom domain)
- [ ] Dashboard loads without errors
- [ ] All pages accessible (Home, Offers, Buyers, Publishers)
- [ ] Data displays correctly
- [ ] Edit/Create forms work
- [ ] Export functionality tested

## Updates

To deploy updates:

**Coolify:**
- Push to git repository
- Coolify auto-deploys on commit (if enabled)
- Or click "Redeploy" in Coolify UI

**Manual:**
```bash
git pull
npm run build
pm2 restart offer-dashboard
# or
docker build -t offer-ops-dashboard .
docker stop offer-ops-dashboard
docker rm offer-ops-dashboard
docker run -d --name offer-ops-dashboard -p 3000:3000 --env-file .env.local offer-ops-dashboard
```

## Support

- Next.js Docs: https://nextjs.org/docs
- PrimeReact Docs: https://primereact.org/
- Supabase Docs: https://supabase.com/docs
