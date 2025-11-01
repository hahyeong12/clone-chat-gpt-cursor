'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export function TokenSender() {
  const { data: session, status } = useSession();
  const tokenSent = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.idToken && !tokenSent.current) {
      console.log('Session authenticated, sending token to backend...');

      fetch('https://hackathon.jifferent.org/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: session.idToken }),
      })
        .then(response => {
          if (response.ok) {
            console.log('Token successfully sent to backend');
            tokenSent.current = true; // Mark as sent for this session
          } else {
            console.error('Failed to send token to backend:', response.status, response.statusText);
          }
        })
        .catch(error => {
          console.error('Error sending token to backend:', error);
        });
    } else if (status === 'unauthenticated') {
        // Reset the flag when the user logs out
        tokenSent.current = false;
    }
  }, [session, status]);

  return null; // This component does not render anything
}
