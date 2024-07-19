const { writeFileSync } = require('fs');
const { join } = require('path');
// get the previous build number
const BUILD_VERSION_PATH = join(__dirname, 'src/build-version.json');

function getTimestampBasedVersion() {
  return parseInt(new Date().getTime() / 1000);
}

// let currentIteration = 1; // 1 as the build number
let currentIteration = getTimestampBasedVersion(); // current timestamp as the build number

try {
  currentIteration =
    require('./build-version.json')?.currentIteration ||
    getTimestampBasedVersion();
} catch (e) {
  currentIteration = getTimestampBasedVersion();
}

const versionArr = require('./package.json')?.version.split('.');
const buildVersion = {
  buildNo: versionArr[0] + versionArr[1] + versionArr[2] + currentIteration,
  timeStamp: currentIteration * 1000,
  currentIteration: currentIteration + 1,
  buildVersion: `${
    require('./package.json')?.version
  }`,
};
// creates a new file if the specified file does not exist.
writeFileSync(BUILD_VERSION_PATH, JSON.stringify(buildVersion, null, 2));
