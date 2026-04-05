# AadhyaRaj Technologies - Deployment to Netlify

This project is ready to be deployed directly to **Netlify**. Follow these steps to connect your application:

## 1. Export to GitHub
1. Open the **Settings** menu in AI Studio.
2. Select **Export to GitHub**.
3. Follow the prompts to create a new repository or update an existing one.

## 2. Connect to Netlify
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** > **Import from existing project**.
3. Choose **GitHub** and select the repository you just exported.
4. Netlify will automatically detect the settings from the `netlify.toml` file:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**.

## 3. Configure Environment Variables
Since this app uses Firebase and Gemini AI, you must add your environment variables to Netlify:
1. In your Netlify site dashboard, go to **Site settings** > **Environment variables**.
2. Add the following variables (copy values from your `.env` or `firebase-applet-config.json`):
   - `VITE_GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 4. Continuous Deployment
Every time you export changes from AI Studio to your GitHub repository, Netlify will automatically rebuild and redeploy your site.
