// src/services/firestoreService.js
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

export const getUserRoleByUid = async (uid) => {
  const userDocRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userDocRef)

  if (userDoc.exists()) {
    return userDoc.data().role
  } else {
    throw new Error('User profile not found in Firestore.')
  }
}
