import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import type { UserProfile } from '@/types/auth'

export class UserService {
  async getOrCreateUserDoc(uid: string, email: string | null, displayName: string | null, provider: string): Promise<UserProfile> {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    }

    const newUserProfile: UserProfile = {
      uid,
      email,
      displayName,
      provider,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(userRef, newUserProfile)
    return newUserProfile
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    }, { merge: true })
  }
}

export const userService = new UserService()
