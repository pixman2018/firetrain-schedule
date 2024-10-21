export interface I_User {
  created: number;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  token?: string;
  isProVersion: boolean;
  isVerification: boolean;
  key: string;
  namespace: string;
  uid: string;
  updated: number;
  verificationEmailTstamp: number;
  settings: I_Settings,
}

export interface I_Settings {
  resultRetain: boolean;
}
