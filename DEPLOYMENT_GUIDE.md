# 🚀 Complete Deployment Guide

## 📋 What You'll Need

Before starting, gather these 3 credentials:

### 1. VERIFY_TOKEN
- **What**: A secret string for webhook security
- **How to get**: Just make up any random string
- **Example**: `my_super_secret_token_123`

### 2. INSTAGRAM_ACCESS_TOKEN
- **What**: Token to access Instagram API
- **How to get**:
  1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
  2. Select your app (or create one)
  3. Go to "Instagram" → "Basic Display" or "Instagram Graph API"
  4. Click "Generate Token" next to your Instagram account
  5. Select permissions:
     - `instagram_business_basic`
     - `instagram_business_manage_messages`
     - `instagram_business_manage_comments`
  6. Copy the token (starts with `IGAA`)
- **Note**: Token expires! You'll need to regenerate periodically

### 3. IG_BUSINESS_ACCOUNT_ID
- **What**: Your Instagram Business Account ID
- **How to get**:
  1. Go to [Meta Business Suite](https://business.facebook.com/)
  2. Click on your Instagram account
  3. Go to Settings
  4. Look for "Instagram Account ID" (long number like `17841433084275074`)

---

## 🎯 Step-by-Step Deployment

### Step 1: Deploy Backend to Railway

1. **Fork this repository** to your GitHub account

2. **Go to Railway**: https://railway.app

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your forked repository

4. **Configure Settings**:
   - Go to Settings
   - Set "Root Directory" to: `backend`
   - Save

5. **Add Environment Variables**:
   - Go to Variables tab
   - Add these 3 variables:
     ```
     VERIFY_TOKEN=your_random_string
     INSTAGRAM_ACCESS_TOKEN=IGAASEtKv4...
     IG_BUSINESS_ACCOUNT_ID=17841433084275074
     ```

6. **Deploy**:
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Settings**:
   - Set "Root Directory" to: `frontend`
   - Framework Preset: Next.js (auto-detected)

4. **Add Environment Variable**:
   - Add variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
     ```
   - Replace with your actual Railway URL from Step 1

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 3: Configure Instagram Webhook

1. **Go to Meta App Dashboard**: https://developers.facebook.com/apps/

2. **Select Your App**

3. **Navigate to Webhooks**:
   - Find "Instagram" section
   - Click "Edit" or "Configure"

4. **Set Webhook URL**:
   - Callback URL: `https://your-railway-url.railway.app/webhook`
   - Verify Token: Your `VERIFY_TOKEN` (same as in Railway)
   - Click "Verify and Save"

5. **Subscribe to Events**:
   - Check the box for `comments`
   - Save

### Step 4: Test Your Setup

1. **Open Your Dashboard**:
   - Go to your Vercel URL
   - You should see your Instagram reels

2. **Configure a Reel**:
   - Click on any reel
   - Set trigger keyword (e.g., "info")
   - Set DM message
   - Set comment reply
   - Make sure "Active" is checked
   - Save

3. **Test It**:
   - Go to Instagram (use a different account)
   - Comment on your reel with the trigger keyword
   - Check if you receive a DM!

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Railway deployment fails
- **Solution**: Check if `backend` is set as root directory
- **Solution**: Verify all 3 environment variables are set correctly

**Problem**: Webhook verification fails
- **Solution**: Make sure `VERIFY_TOKEN` in Railway matches the one in Meta
- **Solution**: Check if Railway URL is correct and accessible

### Frontend Issues

**Problem**: Frontend shows "Failed to fetch"
- **Solution**: Check if `NEXT_PUBLIC_API_URL` is set correctly
- **Solution**: Make sure Railway backend is deployed and running

**Problem**: No reels showing
- **Solution**: Verify `INSTAGRAM_ACCESS_TOKEN` has correct permissions
- **Solution**: Check if token is expired (regenerate if needed)

### Webhook Issues

**Problem**: Comments not triggering automation
- **Solution**: Check Railway logs for incoming webhook events
- **Solution**: Verify webhook is subscribed to `comments` field
- **Solution**: Make sure reel is configured and "Active" is checked

---

## 🔄 Updating Your Deployment

### Update Backend
1. Push changes to GitHub
2. Railway auto-deploys (if enabled)
3. Or manually trigger deployment in Railway dashboard

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys
3. Or manually trigger deployment in Vercel dashboard

---

## 💡 Tips

- **Token Expiration**: Instagram tokens expire. Set a reminder to regenerate every 60 days
- **Testing**: Use ngrok for local testing before deploying
- **Monitoring**: Check Railway logs to see webhook events
- **Security**: Never commit `.env` files to GitHub

---

## 🆘 Need Help?

- Check the [main README](README.md) for more info
- Open an issue on GitHub
- Check Railway/Vercel logs for errors

---

**Happy Automating! 🎉**
