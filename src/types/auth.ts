import type { User as FirebaseUser } from 'firebase/auth'

export enum AuthState {
  LOADING = 'LOADING',
  AUTHED = 'AUTHED',
  UNAUTHED = 'UNAUTHED',
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  provider: string
  roles: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthContext {
  state: AuthState
  user: FirebaseUser | null
  userProfile: UserProfile | null
  error: string | null
}

export interface PendingCredential {
  provider: string
  email: string
}
