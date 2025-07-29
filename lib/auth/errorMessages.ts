export const firebaseErrorMessages = {
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email address',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/operation-not-allowed': 'This operation is not allowed',
} as const;

export function getErrorMessage(errorCode: string, fallbackMessage = 'An error occurred'): string {
  return firebaseErrorMessages[errorCode as keyof typeof firebaseErrorMessages] || fallbackMessage;
}