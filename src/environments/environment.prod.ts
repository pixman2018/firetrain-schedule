import { firebaseConfig } from "./firebase.config";

export const environment = {
  production: true,
  appName: require('../../package.json').name,
  appVersion: require('../../package.json').version,
  firebase:  firebaseConfig,
};
