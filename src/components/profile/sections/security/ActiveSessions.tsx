import { useState, useEffect } from 'react';
import { Smartphone, LogOut } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, addDoc, serverTimestamp, doc, getDocs, updateDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../../../shared/LoadingSpinner';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: Date | null;
  isCurrent: boolean;
  createdAt: Date | null;
  userAgent: string;
}

export function ActiveSessions() {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!user) return;

    const sessionsRef = collection(db, 'sessions');
    const userSessionsQuery = query(sessionsRef, where('userId', '==', user.uid));

    // Function to handle session management
    const manageSession = async () => {
      try {
        const currentUserAgent = window.navigator.userAgent;
        const snapshot = await getDocs(userSessionsQuery);
        
        // Look for an existing session with the same user agent
        const existingSession = snapshot.docs.find(doc => 
          doc.data().userAgent === currentUserAgent
        );

        if (existingSession) {
          // Update existing session
          await updateDoc(doc(sessionsRef, existingSession.id), {
            lastActive: serverTimestamp(),
            isCurrent: true
          });
        } else {
          // Create new session
          await addDoc(sessionsRef, {
            userId: user.uid,
            device: getDeviceInfo(currentUserAgent),
            browser: getBrowserInfo(currentUserAgent),
            location: 'Unknown',
            lastActive: serverTimestamp(),
            createdAt: serverTimestamp(),
            isCurrent: true,
            userAgent: currentUserAgent
          });
        }

        // Set all other sessions as not current
        const otherSessions = snapshot.docs.filter(doc => 
          doc.data().userAgent !== currentUserAgent
        );
        
        await Promise.all(
          otherSessions.map(session =>
            updateDoc(doc(sessionsRef, session.id), {
              isCurrent: false
            })
          )
        );
      } catch (error) {
        console.error('Error managing session:', error);
      }
    };

    // Set up subscription to sessions
    const unsubscribe = onSnapshot(userSessionsQuery, (snapshot) => {
      const sessions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastActive: data.lastActive?.toDate() || null,
          createdAt: data.createdAt?.toDate() || null
        } as ActiveSession;
      });

      setActiveSessions(sessions);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching sessions:', error);
      setError('Failed to load active sessions');
      setLoading(false);
    });

    // Initial session management
    manageSession();

    // Set up interval to update lastActive
    const intervalId = setInterval(async () => {
      const currentSession = activeSessions.find(session => session.isCurrent);
      if (currentSession) {
        try {
          await updateDoc(doc(db, 'sessions', currentSession.id), {
            lastActive: serverTimestamp()
          });
        } catch (error) {
          console.error('Error updating session time:', error);
        }
      }
    }, 60000); // Update every minute

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [user]);

  const handleSignOut = async (sessionId: string) => {
    if (!user) return;

    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error signing out session:', error);
      setError('Failed to sign out from session');
    }
  };

  const handleSignOutAll = async () => {
    if (!user) return;

    try {
      const sessionsToDelete = activeSessions.filter(session => !session.isCurrent);
      
      await Promise.all(
        sessionsToDelete.map(session => 
          deleteDoc(doc(db, 'sessions', session.id))
        )
      );
    } catch (error) {
      console.error('Error signing out all sessions:', error);
      setError('Failed to sign out from all devices');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <Smartphone className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Active Sessions</h3>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Manage your active sessions across devices</p>
          </div>
        </div>
        {activeSessions.length > 1 && (
          <button 
            onClick={handleSignOutAll}
            className="text-sm text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark"
          >
            Sign out all devices
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {activeSessions.length === 0 ? (
          <div className="text-center py-8 text-primary dark:text-dark-text-secondary">
            No active sessions found
          </div>
        ) : (
          activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 rounded-lg border border-sage/20 dark:border-dark-border"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-mint/10 dark:bg-mint/5 rounded-lg">
                  <Smartphone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-primary-dark dark:text-dark-text">
                    {session.browser} on {session.device}
                    {session.isCurrent && (
                      <span className="ml-2 text-xs bg-mint/20 dark:bg-mint/10 text-primary dark:text-dark-text px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-primary dark:text-dark-text-secondary">
                    {session.location} • {formatLastActive(session.lastActive)}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => handleSignOut(session.id)}
                  className="text-sm text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown Browser';
}

function getDeviceInfo(userAgent: string): string {
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Android')) return 'Android Device';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Mac')) return 'MacBook';
  return 'Unknown Device';
}

function formatLastActive(date: Date | null): string {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 120) return '1 hour ago';
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return date.toLocaleDateString();
}