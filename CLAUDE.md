# Project Guidance - Firebase Entra ID SSO Sample

## Project Overview

This is a Vue 3 + Capacitor sample application demonstrating SSO authentication using Microsoft Entra ID (Azure AD) with Firebase. The project showcases:

- Email/password authentication baseline
- Microsoft Entra ID OAuth integration
- Account linking workflows
- Domain-based registration routing
- User profile management
- PWA and native mobile deployment

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (free tier supported)

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and configure your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MICROSOFT_TENANT_ID=your_tenant_id  # Optional
VITE_MICROSOFT_CLIENT_ID=your_client_id  # Optional
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output in `dist/` directory

### Run Tests

Unit tests:
```bash
npm test
```

E2E tests (requires dev server running):
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── components/       # Vue components (DomainDetector, etc.)
├── composables/      # Vue 3 composables (useAuth)
├── config/          # Configuration (domainMap)
├── router/          # Vue Router setup and guards
├── services/        # Service layer (authService, userService)
├── stores/          # Pinia state management
├── types/           # TypeScript type definitions
├── views/           # Page components (LoginView, RegisterView, etc.)
├── App.vue          # Root component
├── firebase.ts      # Firebase initialization
├── main.ts          # Application entry point
└── vite-env.d.ts    # Vite environment types

tests/
├── e2e/            # Playwright end-to-end tests
└── unit/           # Vitest unit tests
```

## Authentication Flow

### Email/Password
1. User enters email and password
2. `authService.loginWithEmail()` creates/verifies Firebase Auth user
3. `userService.getOrCreateUserDoc()` creates Firestore user profile
4. User redirected to `/home`

### Microsoft Entra ID (OAuth)
1. User clicks "Login with Microsoft"
2. Popup opens Microsoft login
3. If new user or first SSO: `signInWithPopup()` creates account
4. If email exists with different provider: Redirect to `/link-account`
5. On link-account: User re-authenticates with email/password
6. `linkWithCredential()` merges accounts

### Account Linking
1. User attempts Microsoft OAuth
2. Firebase detects: `auth/account-exists-with-different-credential`
3. Pending credential saved to `sessionStorage`
4. Redirect to `/link-account` with email parameter
5. User enters password for existing email account
6. Accounts merged, user logged in

## Domain-Based Registration

The `DomainDetector` component analyzes email domains and suggests appropriate sign-up method:

- **Microsoft domains** (contoso.com, contoso.onmicrosoft.com): Suggests Microsoft SSO
- **Google domains** (gmail.com): Suggests Google OAuth
- **Other domains**: Standard email/password

Configure domain mappings in `src/config/domainMap.ts`

## Key Components

### AuthService (`src/services/authService.ts`)
- `registerWithEmail(email, password)`
- `loginWithEmail(email, password)`
- `loginWithMicrosoft()`
- `logout()`
- Account linking credential management

### UserService (`src/services/userService.ts`)
- `getOrCreateUserDoc(uid, email, displayName, provider)`
- `updateUserProfile(uid, updates)`

### useAuth Composable (`src/composables/useAuth.ts`)
- Reactive auth state (`user`, `userProfile`, `state`, `error`)
- Auth methods (`login`, `register`, `loginWithMicrosoft`, `logout`)
- Loading states (`isLoading`, `isAuthed`, `isUnauthed`)

### Auth Store (Pinia) (`src/stores/auth.ts`)
- Centralized authentication state
- `waitForAuth()` promise to prevent race conditions
- Auto-loads user profiles when user changes

## Testing

### Unit Tests (27 tests)
- Auth service functionality
- Router configuration and guards
- User service methods
- Account linking flows
- Domain detection logic

Run with: `npm test -- --run`

### E2E Tests
- Basic navigation flows
- Form validation
- Provider button visibility
- Route transitions

Run with: `npm run test:e2e`

## Firebase Setup

### Authentication
1. Go to Firebase Console
2. Authentication > Sign-in method
3. Enable Email/Password
4. Enable OAuth providers (Microsoft, Google)

### Microsoft Entra ID Configuration
1. Azure Portal > App Registration > New registration
2. Set Redirect URI: `https://<project-id>.firebaseapp.com/__/auth/handler`
3. Create client secret
4. Go to Firebase Console
5. Authentication > OAuth provider settings
6. Add Microsoft credentials

### Firestore
1. Create Firestore database (development mode for testing)
2. Database path: `users/{uid}` contains UserProfile documents

## Coding Standards

- **Language**: TypeScript (strict mode enabled)
- **Component Framework**: Vue 3 with `<script setup>` syntax
- **State Management**: Pinia composable API
- **Styling**: Vue scoped CSS
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Code Style**: 2-space indentation, camelCase naming

## Performance Notes

- Firebase SDK: ~291 KB (gzip: ~99 KB)
- Lazy-loaded route components reduce initial bundle
- Service Worker ready for PWA installation
- Optimized for mobile-first responsive design

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Native Mobile (Capacitor)
```bash
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

## Known Limitations

- Account linking currently shows placeholder (requires Firebase credential handling)
- Google OAuth not yet implemented (similar to Microsoft flow)
- Roles management is basic (see Phase 6 for Cloud Functions-based RBAC)

## Next Steps

1. **Phase 4**: PWA manifest and service worker setup
2. **Phase 5**: Cloud Functions for server-side role management
3. **Phase 6**: Advanced Firestore rules and user hierarchy
4. **Phase 7**: Native iOS/Android testing
5. **Phase 8**: Documentation and video scripts

## Getting Help

- Check `.env.example` for required Firebase config
- Review `PLAN.md` for detailed phase-by-phase breakdown
- Run `npm test` to validate setup
- Check browser console for Firebase initialization errors
