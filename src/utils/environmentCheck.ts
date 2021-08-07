const VARS = [
  'PORT',
  'SDH_USERNAME',
  'SDH_PASSWORD'
];

function environmentCheck(): void {
  let checkPassed = true;
  let failMsg = 'Environment check failed. Following variables need to be set:';

  for (const VAR of VARS) {
    if (!process.env[VAR]) {
      checkPassed = false;
      failMsg += `\n -- ${VAR}`;
    }
  }

  if (!checkPassed) {
    throw new Error(failMsg);
  }
}

export { environmentCheck };
