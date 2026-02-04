# Firebase Entra ID SSO Sample

A production-ready Vue 3 + Firebase sample application demonstrating Single Sign-On (SSO) authentication using Microsoft Entra ID (Azure AD) with account linking, domain-based registration, and user role management.

## Features

✨ **Authentication**
- Email/password registration and login
- Microsoft Entra ID (Azure AD) OAuth integration
- Account linking for existing users
- Race-condition-free auth state management

🔐 **User Management**
- Firestore user profiles with roles
- Auto-profile creation on first login
- User data extraction (email, name, roles)

🎯 **Smart Registration**
- Domain detection suggests appropriate SSO provider
- One-click signup for corporate emails
- Conditional form rendering based on provider

📱 **Cross-Platform**
- Web (PWA-ready)
- Native iOS/Android via Capacitor
- Responsive mobile-first design

✅ **Testing & Quality**
- 27 comprehensive unit tests
- E2E test framework (Playwright)
- TypeScript strict mode
- Production-optimized build

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Firebase project (free tier supported)
- Microsoft Entra ID app registration (for SSO)

### 1. Clone & Install

```bash
git clone https://github.com/alfredorevilla/firebase-entra-id-sso-sample.git
cd firebase-entra-id-sso-sample
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Microsoft Entra ID
VITE_MICROSOFT_TENANT_ID=your_tenant_id
VITE_MICROSOFT_CLIENT_ID=your_client_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Setup Guide

### Firebase Configuration

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name and settings
4. Enable Firebase Analytics (optional)

#### Step 2: Enable Authentication Methods
1. In Firebase Console, go to **Authentication > Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Microsoft** provider
   - You'll need Microsoft Entra ID credentials (see below)

#### Step 3: Create Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Select **Start in development mode** (for testing)
3. Choose region close to your location
4. Click **Create**

#### Step 4: Set Firestore Rules (Development)
Go to **Firestore > Rules** and use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

### Microsoft Entra ID Configuration

#### Step 1: Register Application
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory > App registrations**
3. Click **New registration**
4. Enter app name: `firebase-sso-sample`
5. Select **Accounts in this organizational directory only**
6. Click **Register**

#### Step 2: Configure Redirect URI
1. In the app overview, go to **Authentication**
2. Click **Add a platform > Web**
3. Add Redirect URI: `https://<your-project-id>.firebaseapp.com/__/auth/handler`
4. Click **Configure**

#### Step 3: Create Client Secret
1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: `Firebase SSO`
4. Select **Expires: 12 months**
5. Copy the secret value

#### Step 4: Add Microsoft to Firebase
1. In Firebase Console, go to **Authentication > Sign-in method > Microsoft**
2. Enable the provider
3. Enter:
   - **Client ID**: From Azure app overview
   - **Client Secret**: From step 3 above
4. Click **Save**

## Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm test

# Run unit tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

### Project Structure

```
src/
├── components/        # Vue components
│   └── DomainDetector.vue
├── composables/       # Vue 3 composables
│   └── useAuth.ts
├── config/           # Configuration
│   └── domainMap.ts  # Domain-to-provider mapping
├── router/           # Vue Router
│   ├── guards.ts     # Auth guards
│   └── index.ts
├── services/         # Business logic
│   ├── authService.ts
│   └── userService.ts
├── stores/           # Pinia state management
│   └── auth.ts
├── types/            # TypeScript types
│   └── auth.ts
├── views/            # Page components
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── LinkAccountView.vue
│   ├── HomeView.vue
│   ├── ProfileView.vue
│   └── StatusView.vue
├── App.vue
├── firebase.ts
├── main.ts
└── vite-env.d.ts

tests/
├── unit/             # Unit tests (Vitest)
└── e2e/              # E2E tests (Playwright)
```

## Deployment

### Firebase Hosting

#### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Step 2: Initialize Firebase
```bash
firebase login
firebase init hosting
```

When prompted:
- Select your Firebase project
- Public directory: `dist`
- Configure as single-page app: `yes`
- Overwrite `dist/index.html`: `no`

#### Step 3: Build & Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at `https://<project-id>.web.app`

### Deploy to Staging

```bash
# Build staging build (can add staging config)
npm run build

# Deploy with specific target
firebase deploy --only hosting:staging
```

### Capacitor Native Mobile

#### Step 1: Add Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

#### Step 2: Build Web App
```bash
npm run build
```

#### Step 3: Add Platforms
```bash
npx cap add android
npx cap add ios
```

#### Step 4: Sync Changes
```bash
npx cap sync
```

#### Step 5: Open in IDE
```bash
# Android Studio
npx cap open android

# Xcode
npx cap open ios
```

#### Step 6: Build & Deploy

**Android:**
- Open in Android Studio
- Select emulator or device
- Click **Run**

**iOS:**
- Open in Xcode
- Select simulator or device
- Click **Run**

### Environment-Specific Builds

Create multiple environment files:

```bash
# .env.staging
VITE_FIREBASE_PROJECT_ID=my-project-staging

# .env.production
VITE_FIREBASE_PROJECT_ID=my-project-prod
```

Build for specific environment:
```bash
npm run build -- --mode production
```

## Testing

### Unit Tests

Run all unit tests:
```bash
npm test -- --run
```

Run tests in watch mode (auto-rerun on changes):
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Run specific test file:
```bash
npm test -- tests/unit/auth.test.ts
```

### E2E Tests

Start dev server first:
```bash
npm run dev
```

In another terminal, run E2E tests:
```bash
npm run test:e2e
```

View test report:
```bash
npm run test:e2e -- --ui
```

## Authentication Flows

### Email/Password Login
1. User enters email and password on login page
2. Firebase Auth validates credentials
3. Firestore user profile auto-created if new user
4. User redirected to home page

### Microsoft SSO (New User)
1. User clicks "Login with Microsoft"
2. Microsoft popup opens
3. User grants permissions
4. Firebase Auth creates account
5. Firestore user profile created
6. User redirected to home

### Microsoft SSO (Existing Email User)
1. User attempts Microsoft SSO
2. Firebase detects existing email with different provider
3. User redirected to account linking page
4. User re-enters password for existing account
5. Accounts linked via `linkWithCredential()`
6. User logged in with merged account

### Domain-Based Registration
1. User enters corporate email (e.g., user@contoso.com)
2. DomainDetector banner suggests Microsoft SSO
3. User clicks suggested provider
4. One-click SSO signup
5. New user profile created in Firestore

## Configuration

### Domain Mapping

Edit `src/config/domainMap.ts` to add more domain-to-provider mappings:

```typescript
export const domainProviderMap: Record<string, SSOProvider> = {
  'your-company.com': 'microsoft.com',
  'partner-company.com': 'google.com',
  // Add more mappings...
}
```

### Auth Guard Rules

Edit `src/router/index.ts` to protect routes:

```typescript
{
  path: '/admin',
  component: () => import('@/views/AdminView.vue'),
  meta: { requiresAuth: true, roles: ['admin'] }
}
```

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Verify `.env` file has correct Firebase credentials
- Check Firebase Console > Project Settings for accurate keys
- Ensure `.env` file is in root directory

### "Auth popup blocked"
- Browser popup blocker may be preventing Microsoft login
- Check browser privacy settings
- Test in incognito/private mode
- Ensure Redirect URI in Azure Portal matches Firebase settings

### "Account exists with different credential"
- This is expected behavior when SSO email exists with different provider
- User should click "Link Accounts" and enter existing password
- Accounts will be merged after successful re-authentication

### Tests failing with Firebase errors
- Ensure `.env` file exists with test Firebase credentials
- Firebase emulator can be used for local testing (advanced setup)

### Build fails with "dist is locked"
```bash
rm -rf dist
npm run build
```

## Performance

- **Bundle Size:** ~436 KB (gzip: ~142 KB)
- **Build Time:** ~7 seconds
- **Test Suite:** ~10 seconds
- **Lazy-loaded Routes:** Components split for faster initial load

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Security Notes

- ⚠️ Never commit `.env` file with real credentials
- Store sensitive data in environment variables only
- Use HTTPS for all deployments
- Rotate PATs and secrets regularly
- Review Firestore rules before production
- Enable reCAPTCHA in Firebase Auth console

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Run tests: `npm test`
4. Build: `npm run build`
5. Push: `git push origin feature/my-feature`
6. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues and questions:
1. Check [GitHub Issues](https://github.com/alfredorevilla/firebase-entra-id-sso-sample/issues)
2. Review [CLAUDE.md](./CLAUDE.md) for detailed documentation
3. Check [PLAN.md](./PLAN.md) for implementation phases

---

**Last Updated:** February 2026
**Maintained by:** Alfredo Revilla
