export interface I_User {
  created: number;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  isProVersion: boolean;
  isVerification: boolean;
  key: string;
  namespace: string;
  uid: string;
  updated: number;
  verificationEmailTstamp: number;
}
