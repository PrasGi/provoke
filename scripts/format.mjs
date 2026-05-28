import { spawnSync } from 'node:child_process';

const isCheck = process.argv.includes('--check');
const prettierArgs = isCheck ? ['--check', '.'] : ['--write', '.'];

const result = spawnSync('prettier', prettierArgs, {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
