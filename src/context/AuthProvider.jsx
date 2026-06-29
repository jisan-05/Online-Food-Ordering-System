import { useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import { clearAuthToken, getCurrentUser, requestJwtToken, setAuthToken } from '../services/authService'
import { AuthContext } from './AuthContext'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [appUser, setAppUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const syncJwt = async (firebaseUser) => {
    if (!firebaseUser) {
      clearAuthToken()
      return
    }

    const token = await requestJwtToken({
      uid: firebaseUser.uid,
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    })

    setAuthToken(token)
    const currentUser = await getCurrentUser()
    setAppUser(currentUser)
    return currentUser
  }

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return syncJwt(result.user)
  }

  const register = async ({ name, email, password }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    return syncJwt({ ...result.user, displayName: name })
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return syncJwt(result.user)
  }

  const logout = async () => {
    await signOut(auth)
    clearAuthToken()
    setAppUser(null)
  }

  const updateUserProfile = async ({ name, photoURL }) => {
    if (!auth.currentUser) return
    await updateProfile(auth.currentUser, { displayName: name, photoURL })
    const result = await syncJwt(auth.currentUser)
    setUser({ ...auth.currentUser })
    return result
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser)
        setAppUser(null)
        await syncJwt(currentUser)
      } catch {
        clearAuthToken()
        setUser(null)
        setAppUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({ user, appUser, loading, login, register, loginWithGoogle, logout, updateUserProfile }),
    [user, appUser, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider }
