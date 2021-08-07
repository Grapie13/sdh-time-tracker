const VARS = [
  'APP_PORT',
  'SDH_USERNAME',
  'SDH_PASSWORD',
  'POSTGRES_HOSTNAME',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE'
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
