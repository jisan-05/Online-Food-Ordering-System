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
import { clearAuthToken, requestJwtToken, setAuthToken } from '../services/authService'
import { AuthContext } from './AuthContext'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
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
  }

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await syncJwt(result.user)
    return result.user
  }

  const register = async ({ name, email, password }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    await syncJwt({ ...result.user, displayName: name })
    return result.user
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    await syncJwt(result.user)
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
    clearAuthToken()
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser)
        await syncJwt(currentUser)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider }
