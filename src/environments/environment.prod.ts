import { firebaseConfig } from 'src/db/db-config';

export const environment = {
  production: true,
  firebase: firebaseConfig,
  useEmulators: false,
};
