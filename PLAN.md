# Plan: Firebase + Vue 3 + Capacitor SSO Sample App

## Context
Repo is empty (only `PROMPT.md`). Goal: scaffold and build a complete sample app that demonstrates the skills called out in the job posting — Firebase Auth, Microsoft Entra ID SSO, account linking, domain-based registration, PWA/Capacitor, and supporting docs. Google SSO is scoped as a nice-to-have (see end of plan).

---

## Success Criteria → Phase Mapping
| Requirement | Covered in |
|---|---|
| SSO login on sign-in page (Microsoft) | Phase 3 |
| SSO login — Google *(nice to have)* | Nice to Have |
| Register page routes user by email domain | Phase 5 |
| Existing email/password accounts link to SSO | Phase 4 |
| Obtain name, roles, email | Phase 6 |
| Feature docs (UX script, voiceover script, enterprise setup) | Phase 8 |

---

## Phase 1 — Project Scaffold

**What:** Vue 3 + Vite + TypeScript skeleton with Firebase SDK and Capacitor wired up. No auth logic yet.

**Commands to run:**
```
npm create vite@latest . -- --template vue-ts
npm install firebase vue-router@4 pinia
npm install -D @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios vite-plugin-pwa
```

**Files to create:**
- `src/config/firebase.ts` — single `initializeApp` call; exports `app` and `auth`. All config values read from `import.meta.env.VITE_*`.
- `capacitor.config.ts` — appId, appName, webDir: `'dist'`, **`server.androidScheme: 'https'`** (required for Firebase popup on Android).
- `.env.example` — keys: `VITE_FIREBASE_API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`.
- `.gitignore` — ignore `node_modules`, `dist`, `.env`, `android/`, `ios/`.

**External config:**
1. Firebase Console → create project → add Web app → copy config to `.env`.
2. Authentication → Sign-in method → enable **Email/Password** only (Microsoft enabled in Phase 3).

---

## Phase 2 — Baseline Email/Password Auth

**What:** Full login/register flow with Pinia auth store, router guards, and a composable. No SSO yet.

**Files to create:**

| File | Role |
|---|---|
| `src/stores/auth.ts` | Pinia store. Uses an explicit `AuthState` enum (`LOADING / AUTHED / UNAUTHED`) instead of a boolean flag — eliminates the race between `onAuthStateChanged` and the router guard. Exposes `waitForAuth()` promise for guards. Has a `pendingCredential` ref (used later in Phase 4). |
| `src/services/authService.ts` | Thin wrappers: `loginWithEmail`, `registerWithEmail`, `logout`. Keeps Firebase imports out of components/stores. |
| `src/composables/useAuth.ts` | Composition-API entry point for components (`<script setup>`). Delegates to the store and service. |
| `src/router/index.ts` | Creates router. Lazy-loads views. Registers the auth guard. |
| `src/router/guards.ts` | `beforeEach` guard: calls `store.waitForAuth()`, redirects unauthenticated users to Login, redirects authenticated users away from Login/Register. |
| `src/views/LoginView.vue` | Email + password form. Error display. Link to Register. (SSO buttons added Phase 3.) |
| `src/views/HomeView.vue` | Authenticated landing page: greeting + logout button. |

**Key pattern in `main.ts`:** `app.use(pinia)` → `app.use(router)` → `useAuthStore().initListener()` → `app.mount`. Order is critical; `initListener` must run after Pinia is installed.

---

## Phase 3 — Microsoft Entra ID SSO

**What:** A Microsoft sign-in button on the login page using `signInWithPopup`. (Google SSO is a nice-to-have; see end of plan for the incremental steps to add it later.)

**External config (do before running):**
- Azure Portal → Entra ID → App Registrations → New Registration.
  - Redirect URI: `https://<firebase-project-id>.firebaseapp.com/__/auth/handler` (exact match required).
  - Generate a client secret. Copy **Client ID** and **Secret Value**.
  - Firebase Console → Auth → Microsoft → Enable → paste both values.

**Files to create / modify:**

| File | Change |
|---|---|
| `src/services/authService.ts` | Add module-level `OAuthProvider('microsoft.com')` singleton with `tenant: 'common'` and scope `User.Read`. Add `loginWithMicrosoft` function. Export the provider object so LoginView can pass it to the unified handler in Phase 4. |
| `src/components/SSOButton.vue` | Reusable presentational button. Props: `provider` (`'microsoft'`), `label`. Emits `click`. No Firebase imports — intentionally dumb. Prop type left as `string` so Google can be added without changing the component. |
| `src/views/LoginView.vue` | Add one `<SSOButton>` instance below the email form with a "Or sign in with" divider. |

---

## Phase 4 — Account Linking

**What:** When SSO sign-in hits `auth/account-exists-with-different-credential`, catch it, persist the credential through a possible page reload, prompt re-auth, then link.

**Why `sessionStorage` not Pinia:** On mobile, `signInWithPopup` can reload the page during the OAuth redirect. Pinia state is lost; `sessionStorage` is not.

**Files to create / modify:**

| File | Change |
|---|---|
| `src/services/authService.ts` | Add `handleSSOLogin(provider)` — unified entry point that wraps `signInWithPopup`, catches the specific error, serialises `idToken` + `accessToken` + `providerId` into `sessionStorage`, returns `{ success, error, credential }`. Add `linkPendingCredential()` — reads from `sessionStorage`, reconstructs the credential via `OAuthProvider.credential()`, calls `linkWithCredential`, removes the item. The reconstruction is keyed on `providerId` so adding Google later is a single extra branch (see Nice to Have). |
| `src/views/LoginView.vue` | Replace the two separate SSO handlers with a single `handleSSO(provider)` that calls `handleSSOLogin` and routes to `LinkAccount` on `ACCOUNT_EXISTS`. |
| `src/views/LinkAccountView.vue` | NEW. Explains the situation. Email + password form. On submit: calls `loginWithEmail` then `linkPendingCredential`, then navigates Home. |
| `src/router/index.ts` | Add `/link-account` route (no `requiresAuth` meta — user is not yet signed in when they arrive here). |

---

## Phase 5 — Domain-Based Registration

**What:** The Register page watches the email field. If the domain matches a known corporate domain, a banner suggests (does not force) the matching SSO provider.

**Files to create:**

| File | Role |
|---|---|
| `src/config/domainMap.ts` | Static `Record<string, string>`. Maps corporate domains like `contoso.onmicrosoft.com` → microsoft. Exports `getProviderForDomain(email)`. Clearly marked as the extension point for a Firestore-backed lookup in production. Adding `gmail.com` → google here is a one-liner once Google SSO is enabled (Nice to Have). |
| `src/components/DomainDetector.vue` | Prop: `email`. Computed: calls `getProviderForDomain`. Renders a banner when a match is found; banner button emits `provider-detected`. |
| `src/views/RegisterView.vue` | Full registration page: name, email, password fields + standard register flow. Integrates `<DomainDetector>`. On `provider-detected` event, calls `handleSSOLogin` with the matching provider (same linking-aware flow as Phase 4). |

---

## Phase 6 — User Profile & Roles

**What:** After sign-in, fetch/create a Firestore `users/{uid}` document. Display name, email, provider, and roles on a profile page.

**Role strategy:** Firestore document stores `roles: string[]` (default `['user']`). A Cloud Function stub is documented for setting custom claims server-side (the production enforcement path), but is not required to run the sample.

**Files to create / modify:**

| File | Change |
|---|---|
| `src/config/firebase.ts` | Add `export const db = getFirestore(app)`. |
| `src/services/userService.ts` | NEW. `getOrCreateUserDoc(uid, email, displayName, provider)` — reads doc, creates with default role if missing. Exports `UserProfile` interface. |
| `src/stores/auth.ts` | Add `userProfile` ref. In the `onAuthStateChanged` callback (after setting `user`), call `getOrCreateUserDoc` and populate it. |
| `src/components/UserProfileCard.vue` | Presentational card: displays name, email, provider, roles. |
| `src/views/ProfileView.vue` | Page that passes `userProfile` from store to `UserProfileCard`. |
| `src/router/index.ts` | Add `/profile` route (requiresAuth). |
| `src/App.vue` | Nav shell with links (Home, Profile) and Logout button, visible when authed. |

**External config:** Firebase Console → Firestore → Create database. Set permissive dev rules (tighten before production).

**Cloud Function stub (documented, not deployed):** `functions/index.ts` — `setCustomUserClaims` via Admin SDK. Shows the exact integration point for production RBAC.

---

## Phase 7 — PWA + Capacitor Polish

**What:** Full PWA manifest via `vite-plugin-pwa` and native build scaffolding.

**Files to modify / create:**
- `vite.config.ts` — full `VitePWA` config: manifest (name, icons, theme_color), workbox glob patterns, `registerType: 'autoUpdate'`.
- `src/main.ts` — import and call `registerSW` from `virtual:pwa-register` with `onNeedRefresh` / `onOfflineReady` hooks.
- `public/pwa-192x192.png` and `public/pwa-512x512.png` — icon assets (generate from a source SVG).

**CLI commands after `npm run build`:**
```
npx cap add android
npx cap add ios
npx cap sync
```

**Testing note:** Verify the full Microsoft popup flow on a **physical Android device** (not just emulator) — the Chrome Custom Tab + intent filter behaviour differs.

---

## Phase 8 — Documentation

**Files to create:**

| File | Contents |
|---|---|
| `README.md` | Overview, prerequisites (Node 18+, Firebase project, Azure tenant), env setup, `npm run dev`, build & deploy commands for PWA and native. |
| `docs/UX-TESTING-SCRIPT.md` | 7 test cases: email register, email login, Microsoft SSO (new user), account linking (Microsoft on existing email/password account), domain-based registration banner, PWA install, offline behaviour. Each with preconditions, steps, expected result. |
| `docs/VIDEO-VOICEOVER-SCRIPT.md` | 7 segments (~8 min total): intro, Firebase Console setup, Azure App Registration, Microsoft sign-in flow demo, account linking demo, domain-based registration demo, PWA + mobile demo, conclusion. Each segment has show/narrate notes. |
| `docs/ENTERPRISE-SETUP-GUIDE.md` | Written for a non-developer IT admin. Step-by-step: create App Registration in Entra ID, set redirect URI, generate client secret, send values to developer. Includes verification step. |

---

## Target File Tree (final state)

```
firebase-entra-id-sso-sample/
├── PROMPT.md                        (untouched)
├── PLAN.md                          (this file)
├── README.md                        (Phase 8)
├── .env.example                     (Phase 1)
├── .gitignore                       (Phase 1)
├── package.json                     (Phase 1)
├── vite.config.ts                   (Phase 1 → 7)
├── tsconfig.json / app / node      (Phase 1, scaffold)
├── capacitor.config.ts              (Phase 1)
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── pwa-192x192.png             (Phase 7)
│   └── pwa-512x512.png             (Phase 7)
├── src/
│   ├── main.ts                      (Phase 1 → 2 → 7)
│   ├── App.vue                      (Phase 1 → 3 → 6)
│   ├── env.d.ts
│   ├── config/
│   │   ├── firebase.ts              (Phase 1 → 6)
│   │   └── domainMap.ts             (Phase 5)
│   ├── services/
│   │   ├── authService.ts           (Phase 2 → 3 → 4)
│   │   └── userService.ts           (Phase 6)
│   ├── stores/
│   │   └── auth.ts                  (Phase 2 → 4 → 6)
│   ├── router/
│   │   ├── index.ts                 (Phase 2 → 4 → 5 → 6)
│   │   └── guards.ts                (Phase 2)
│   ├── composables/
│   │   └── useAuth.ts               (Phase 2 → 3)
│   ├── views/
│   │   ├── LoginView.vue            (Phase 2 → 3 → 4)
│   │   ├── RegisterView.vue         (Phase 5)
│   │   ├── HomeView.vue             (Phase 2)
│   │   ├── ProfileView.vue          (Phase 6)
│   │   ├── LinkAccountView.vue      (Phase 4)
│   │   └── StatusView.vue           (Phase 6)
│   └── components/
│       ├── SSOButton.vue            (Phase 3)
│       ├── DomainDetector.vue       (Phase 5)
│       └── UserProfileCard.vue      (Phase 6)
├── functions/
│   └── index.ts                     (Phase 6, Cloud Function stub only)
└── docs/
    ├── UX-TESTING-SCRIPT.md         (Phase 8)
    ├── VIDEO-VOICEOVER-SCRIPT.md    (Phase 8)
    └── ENTERPRISE-SETUP-GUIDE.md    (Phase 8)
```

---

## Nice to Have — Google SSO

Google SSO is architecturally identical to Microsoft but excluded from the core phases to keep the initial scope tight. Everything in the core plan is designed so that adding Google is incremental, not a rework. The exact touchpoints:

| File | What to add |
|---|---|
| Firebase Console | Auth → Google → Enable. Pick a support email. |
| `src/services/authService.ts` | Import `GoogleAuthProvider`. Create a module-level singleton (`new GoogleAuthProvider()`, add scopes `profile` + `email`). Export `loginWithGoogle` and the provider object. |
| `src/services/authService.ts` (`linkPendingCredential`) | Add one branch in the `providerId` switch: `'google.com'` → `GoogleAuthProvider.credential(idToken, accessToken)`. |
| `src/components/SSOButton.vue` | No change — prop type is already `string`. |
| `src/views/LoginView.vue` | Add a second `<SSOButton provider="google">` and wire it to `handleSSO(googleProvider)`. |
| `src/config/domainMap.ts` | Add `'gmail.com': 'google'` to the map. |
| `docs/UX-TESTING-SCRIPT.md` | Add TC for Google SSO new user and Google account linking. |
| `docs/VIDEO-VOICEOVER-SCRIPT.md` | Expand sign-in flows segment to show Google popup. |

---

## Deployment — Free Option

**Firebase Hosting** is the right choice. It is free (10 GB storage, 360 MB/month transfer), and — critically — the Microsoft OAuth redirect URI is already configured to `https://<project>.firebaseapp.com/__/auth/handler`. Using a different host would require changing that URI in both Azure and Firebase, and re-consenting. Firebase Hosting avoids all of that by design.

**Steps (after `npm run build`):**
```
npm install -g firebase-tools
firebase login
firebase init hosting   # select the existing project, set public dir to "dist", configure as SPA
firebase deploy
```

The app is live at `https://<project-id>.firebaseapp.com`. No custom domain, no extra config. The OAuth popup flow works immediately because the redirect URI already matches.

---

## Live Firebase Verification Page

Code inspection proves nothing about a running deployment. A dedicated `/status` page in the app itself solves this — anyone with the URL can confirm Firebase is live, no console access required.

**New file:** `src/views/StatusView.vue`
**New route:** `/status` — no `requiresAuth` meta (must be reachable before login).

**What the page does (all checks run on page load):**

| Check | How | What it proves |
|---|---|---|
| Project ID | Read `import.meta.env.VITE_FIREBASE_PROJECT_ID` | The app is wired to a real Firebase project, not a mock |
| Auth connectivity | Call `auth.currentUser` + attempt `getIdToken` if signed in | Firebase Auth SDK is initialised and reachable |
| Firestore write | Write a document to `_status/{sessionId}` with a timestamp | Firestore is live and the app has write access |
| Firestore read | Immediately read back that same document | Read path works; confirms the write actually persisted |
| Cleanup | Delete the `_status/{sessionId}` document after the read | No test data left behind |

Each check shows a status badge (pass / fail / pending) and a latency in ms. A "Run again" button re-executes all checks.

**Add to Phase 6** (alongside the other Firestore work) and add a `/status` link to the nav in `App.vue`. Add one test case to the UX script: "visit /status on the deployed URL, all checks pass green."

---

## Verification (how to test end-to-end)

1. **Dev server:** `npm run dev` — app starts at `http://localhost:5173`. Test email/password register + login.
2. **Microsoft SSO:** Click "Sign in with Microsoft" on login page. Complete popup. Verify redirect to Home and profile populated. Requires Azure App Registration to be configured.
3. **Account linking:** Register with email/password. Sign out. Sign in with Microsoft (same email). Confirm LinkAccount page appears. Enter password. Confirm link succeeds and both providers work.
4. **Domain detection:** Go to `/register`. Type `user@contoso.onmicrosoft.com`. Confirm banner appears suggesting Microsoft SSO.
5. **Profile & roles:** Navigate to `/profile`. Confirm name, email, provider, and `['user']` role are displayed. Manually edit Firestore doc to add `'admin'` role; refresh — confirm it appears.
6. **PWA:** `npm run build` → serve `dist/` over HTTPS → confirm install prompt in Chrome.
7. **Native (Android):** `npx cap sync && npx cap open android` → run on physical device → test full Microsoft SSO popup flow.
8. **Run UX test script:** Execute each scenario in `docs/UX-TESTING-SCRIPT.md` and mark pass/fail.
