import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL ? ? databaseUrl;

if (!databaseUrl || !directUrl) {
    console.error('DATABASE_URL and DIRECT_URL must be set before running prisma generate.');
    process.exit(1);
}

const command =
    process.platform === 'win32' ?
    join(process.cwd(), 'node_modules', '.bin', 'prisma.cmd') :
    join(process.cwd(), 'node_modules', '.bin', 'prisma');
const commandArgs = ['generate', '--schema', 'server/prisma/schema.prisma'];

const result = spawnSync(command, commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        DIRECT_URL: directUrl,
    },
});

if (result.error) {
    console.error(result.error);
}

process.exit(result.status ? ? 1);