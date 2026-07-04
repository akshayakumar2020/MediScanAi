# MediScan AI - Frontend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the `frontend` directory and add your backend URL:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. Connect your repository to Vercel and import the frontend project.
2. In **Settings > Environment Variables**, add the following environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<your-render-backend-url>.onrender.com/api` (Replace with your actual Render backend URL)
3. Deploy the project.
