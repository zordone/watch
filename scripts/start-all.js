// - Starts the database
// - Waits until it's ready for connections
// - Starts the server
// - Starts the client (dev/prod)
// - Opens the client in the default browser

const spawn = require('child_process').spawn;
const isProduction = process.argv[2] === '--prod';

const spawnPipe = (command, args = [], prefix = '', onLine = () => {}) => {
    const db = spawn(command, args, {stdio: ['ignore', 'pipe', process.stderr]});
    db.stdout.on('data', data => {
        data.toString()
            .replace(/\n+$/, '')
            .split('\n')
            .forEach(line => {
                console.log(prefix, line);
                setTimeout(() => onLine(line), 0);
            });
    });
};

// log title & mode
const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';
const color = isProduction ? green : red;
const mode = isProduction ? 'PRODUCTION' : 'DEVELOPMENT';
console.log(`\n🍿 Watch - ${color}${mode}${reset}\n\n`);

// start db, then server & client
let isAllStarted = false;
spawnPipe('mongod', [], '[DB]', line => {
    if (isAllStarted) {
        return;
    }
    const isStarted = line.includes('waiting for connections on port');
    const isAlreadyRunning = line.includes('Another mongod instance is already running');
    if (isStarted || isAlreadyRunning) {
        spawnPipe('npm', ['run', 'server'], '[BE]');
        if (isProduction) {
            // TODO: instead of this harcoded timeout, we should wait for "Listening on port X" from the server.
            setTimeout(() => {
                spawnPipe('npm', ['run', 'start-prod'], '[FE]');
            }, 3000);
        } else {
            spawnPipe('npm', ['start'], '[FE]');
        }
        console.log(`\n${green}All processes started.${reset}\n`);
        isAllStarted = true;
    }
});

process.on('SIGTERM', () => {
    console.info('\nSIGTERM received.');
    console.log('Exiting.');
    process.exit(0);
    // TODO: do we need to close the sub processes as well?
});

process.on('SIGINT', () => {
    console.info('\nSIGINT received.');
    console.log('Exiting.');
    process.exit(0);
    // TODO: do we need to close the sub processes as well?
});
