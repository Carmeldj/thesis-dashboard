# Admin Dashboard Setup Guide

## Overview
This is a comprehensive admin dashboard for managing streamers and shops in your application. Built with React 19, TypeScript, and Tailwind CSS.

## Quick Start

### 1. Installation
```bash
pnpm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Replace `http://localhost:3000` with your actual backend API URL.

### 3. Run Development Server
```bash
pnpm dev
```

The dashboard will be available at `http://localhost:5173`

## Features

### 🔐 Authentication
- Secure admin login using JWT tokens
- Automatic token refresh and session management
- Protected routes for authenticated access only

### 📊 Dashboard
- Overview statistics for:
  - Total users
  - Total streamers (verified and pending)
  - Total shops (active and inactive)
- Real-time data updates

### 👥 Streamers Management
- **View & Filter**
  - List all streamers
  - Filter by verification status (All/Verified/Pending)
  - Search by name, username, or email
  
- **Actions**
  - Verify streamer accounts
  - Revoke verification
  - View detailed information including:
    - Contact details
    - Bio and social stats
    - Account creation date
    - Shop association (if any)

### 🏪 Shops Management
- **View & Filter**
  - List all shops
  - Filter by status (All/Active/Inactive)
  - Search by name, email, or address
  
- **Actions**
  - Activate shops
  - Deactivate shops
  - View detailed information including:
    - Business information (IFU, address)
    - Contact details
    - Owner information
    - Website

## Project Structure

```
thesis_dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout with sidebar
│   │   ├── ProtectedRoute.tsx  # Route protection wrapper
│   │   └── Sidebar.tsx      # Navigation sidebar
│   │
│   ├── context/             # React Context providers
│   │   └── AuthContext.tsx  # Authentication state management
│   │
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Main dashboard with stats
│   │   ├── Login.tsx        # Admin login page
│   │   ├── Streamers.tsx    # Streamers management
│   │   └── Shops.tsx        # Shops management
│   │
│   ├── services/            # API integration
│   │   └── api.ts           # Axios instance & API calls
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # User, Shop, Auth types
│   │
│   ├── App.tsx              # Root app component
│   ├── main.tsx             # Entry point with routing
│   └── index.css            # Global styles with Tailwind
│
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## API Integration

### Backend Requirements
Your backend must implement the following endpoints:

#### Authentication
```
POST /auth/admin/login
Body: { email: string, password: string }
Response: { access_token: string, user: User }
```

#### Users
```
GET /users                    # Get all users
GET /users/streamers/all      # Get all streamers
GET /users/:id                # Get user by ID
PATCH /users/:id              # Update user
  Body: { is_verified?: boolean, ... }
DELETE /users/:id             # Delete user
```

#### Shops
```
GET /shops                    # Get all shops
GET /shops/:id                # Get shop by ID
PATCH /shops/:id              # Update shop
  Body: { isActive?: boolean, ... }
DELETE /shops/:id             # Delete shop
```

### Authentication Flow
1. Admin logs in with email/password
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically sent with each API request
5. On 401 response, user is redirected to login

## Usage Guide

### First Time Setup
1. Ensure your backend is running and accessible
2. Configure the `VITE_API_BASE_URL` in `.env`
3. Start the development server
4. Navigate to `/login`

### Admin Login
- Go to `/login`
- Enter admin credentials
- Upon success, you'll be redirected to `/dashboard`

### Managing Streamers
1. Click **Streamers** in the sidebar
2. Use the search bar to find specific streamers
3. Use the filter dropdown to show All/Verified/Pending
4. Click **View Details** on any streamer to see full information
5. Click **Verify** to approve a pending streamer
6. In the detail modal, you can verify or revoke verification

### Managing Shops
1. Click **Shops** in the sidebar
2. Use the search bar to find specific shops
3. Use the filter dropdown to show All/Active/Inactive
4. Click **View Details** on any shop to see full information
5. In the detail modal, you can activate or deactivate shops

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run ESLint
pnpm lint
```

### Tech Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v7** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Key Dependencies
```json
{
  "react": "^19.1.1",
  "react-router": "^7.9.4",
  "axios": "^1.12.2",
  "lucide-react": "^0.548.0",
  "tailwindcss": "^4.1.16"
}
```

## Security Best Practices

### Implemented Security Features
- ✅ JWT token-based authentication
- ✅ Protected routes requiring authentication
- ✅ Automatic logout on token expiration
- ✅ Secure token storage in localStorage
- ✅ HTTPS recommended for production

### Recommended Additional Security
- Implement refresh tokens
- Add rate limiting on backend
- Use HTTPS in production
- Implement CORS properly on backend
- Add request/response encryption for sensitive data
- Implement audit logging for admin actions

## Troubleshooting

### Common Issues

**Issue: Cannot connect to API**
- Solution: Check `VITE_API_BASE_URL` in `.env`
- Ensure backend is running and accessible
- Check CORS configuration on backend

**Issue: Login fails with valid credentials**
- Solution: Verify `/auth/admin/login` endpoint exists
- Check that response includes `access_token` and `user`
- Ensure admin role is properly set in backend

**Issue: Styles not loading**
- Solution: Run `pnpm install` to ensure Tailwind is installed
- Check that `tailwind.config.js` and `postcss.config.js` exist
- Restart dev server

**Issue: 401 errors after some time**
- Solution: Token may have expired
- Implement token refresh mechanism
- Increase token expiration time on backend

## Production Deployment

### Build for Production
```bash
pnpm build
```

This creates an optimized build in the `dist/` directory.

### Environment Variables
Ensure production environment variables are set:
```env
VITE_API_BASE_URL=https://your-production-api.com
```

### Deployment Platforms
Compatible with:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Deployment Steps
1. Build the project: `pnpm build`
2. Upload `dist/` directory to your hosting service
3. Configure environment variables
4. Ensure routing is properly configured (SPA fallback)

## Support & Maintenance

### Updating Dependencies
```bash
pnpm update
```

### Code Quality
- ESLint configured for React and TypeScript
- Type checking with TypeScript
- Follow React best practices

## License
[Your License Here]

## Contact
[Your Contact Information]
