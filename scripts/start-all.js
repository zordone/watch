// - Starts the database
// - Waits until it's ready for connections
// - Starts the server
// - Starts the client
// - Opens the client in the default browser

const spawn = require('child_process').spawn;

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

let isAllStarted = false;

spawnPipe('mongod', [], '[DB]', line => {
    if (isAllStarted) {
        return;
    }
    const isStarted = line.includes('waiting for connections on port');
    const isAlreadyRunning = line.includes('Another mongod instance is already running');
    if (isStarted || isAlreadyRunning) {
        spawnPipe('npm', ['run', 'server'], '[BE]');
        spawnPipe('npm', ['start'], '[FE]');
        console.log('\nAll processes started.\n');
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
