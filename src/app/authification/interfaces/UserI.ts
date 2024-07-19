export interface UserI {
    namespace: string;
    uid: string;
    key: string;
    email: string;
    isAdmin: boolean;
    isActive: boolean;
    isProVersion: boolean;
    isVerification: boolean;
    verificationEmailTstamp: number;
    created: number;
    updated: number;
  }
  