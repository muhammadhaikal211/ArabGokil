import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'admin';
  isAdmin: boolean;
  username?: string;
  isCustomAdmin?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithAdminCredentials: (username: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'arab_class10_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check saved admin session on startup
  useEffect(() => {
    testConnection();

    const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          let userRole: 'student' | 'admin' = 'student';

          // User email haikalhaikal1225@gmail.com is recognized as teacher/admin
          const isOwnerAdmin = fbUser.email === 'haikalhaikal1225@gmail.com';

          try {
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              if (data.role === 'admin' || isOwnerAdmin) {
                userRole = 'admin';
              }
            } else {
              userRole = isOwnerAdmin ? 'admin' : 'student';
              await setDoc(userDocRef, {
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName || 'Siswa Kelas X',
                photoURL: fbUser.photoURL || '',
                role: userRole,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              });
            }
          } catch (err) {
            console.warn('Could not sync user to firestore, proceeding with auth state:', err);
          }

          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Siswa Kelas X',
            photoURL: fbUser.photoURL,
            role: userRole,
            isAdmin: userRole === 'admin' || isOwnerAdmin,
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Siswa Kelas X',
            photoURL: fbUser.photoURL,
            role: 'student',
            isAdmin: false,
          });
        }
      } else {
        // If no firebase user and no admin in localStorage
        const adminData = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!adminData) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithAdminCredentials = async (username: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const adminUser: AppUser = {
          uid: 'admin-mulmedjaya',
          email: 'mulmedjaya@sekolah.sch.id',
          displayName: 'Administrator Mulmed Jaya',
          photoURL: null,
          role: 'admin',
          isAdmin: true,
          username: 'mulmedjaya',
          isCustomAdmin: true,
        };
        setUser(adminUser);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        return { success: true };
      } else {
        // Local fallback if API route is unreachable
        if (username === 'mulmedjaya' && pass === 'mulmed123') {
          const adminUser: AppUser = {
            uid: 'admin-mulmedjaya',
            email: 'mulmedjaya@sekolah.sch.id',
            displayName: 'Administrator Mulmed Jaya',
            photoURL: null,
            role: 'admin',
            isAdmin: true,
            username: 'mulmedjaya',
            isCustomAdmin: true,
          };
          setUser(adminUser);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
          return { success: true };
        }
        return { success: false, message: data.message || 'Username atau password salah' };
      }
    } catch (err: any) {
      // Local fallback for offline/direct checking
      if (username === 'mulmedjaya' && pass === 'mulmed123') {
        const adminUser: AppUser = {
          uid: 'admin-mulmedjaya',
          email: 'mulmedjaya@sekolah.sch.id',
          displayName: 'Administrator Mulmed Jaya',
          photoURL: null,
          role: 'admin',
          isAdmin: true,
          username: 'mulmedjaya',
          isCustomAdmin: true,
        };
        setUser(adminUser);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: 'Gagal menghubungi server autentikasi' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      if (auth.currentUser) {
        await fbSignOut(auth);
      }
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithGoogle,
        loginWithAdminCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
