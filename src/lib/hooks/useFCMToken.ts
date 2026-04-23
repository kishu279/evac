"use client";

import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

export const useFCMToken = () => {
  const { currentUser } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && currentUser) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const messaging = getMessaging();
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
            });
            
            if (token) {
              setFcmToken(token);
              // Save token to Firestore
              const userRef = doc(db, 'staff', currentUser.uid);
              await updateDoc(userRef, { fcmToken: token });
              console.log('FCM Token registered and saved.');
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          } else {
            console.log('Notification permission denied.');
            toast.error("Notification permission denied. You won't receive push alerts.");
          }
        } catch (error) {
          console.error('An error occurred while retrieving token. ', error);
        }
      }
    };

    requestPermissionAndGetToken();
  }, [currentUser]);

  return fcmToken;
};
