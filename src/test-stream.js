const { spawn } = require('child_process');
const net = require('net');
const logger = require('./logger');

const CAMERA_IP = '10.0.100.232';
const RTSP_PORT = 554;
const USERNAME = 'admin';
const PASSWORD = 'MaxCr33k420';
const RTSP_URL = `rtsp://${USERNAME}:${PASSWORD}@${CAMERA_IP}:${RTSP_PORT}/h264Preview_01_main`;

// Test TCP connectivity first
function testTcpConnection() {
    return new Promise((resolve) => {
        logger.info(`Testing TCP connection to ${CAMERA_IP}:${RTSP_PORT}...`);
        
        const socket = new net.Socket();
        socket.setTimeout(2000);  // 2 second timeout
        
        socket.on('connect', () => {
            logger.info('✅ TCP connection successful');
            socket.destroy();
            resolve(true);
        });
        
        socket.on('error', (err) => {
            logger.error(`❌ TCP connection failed: ${err.message}`);
            resolve(false);
        });
        
        socket.on('timeout', () => {
            logger.error('❌ TCP connection timed out');
            socket.destroy();
            resolve(false);
        });
        
        socket.connect(RTSP_PORT, CAMERA_IP);
    });
}

// Test RTSP stream with Reolink specific settings
function testRTSPStream() {
    logger.info('Testing RTSP stream connection...');
    logger.info(`Using RTSP URL: ${RTSP_URL}`);
    
    // FFmpeg command optimized for Reolink cameras
    const ffmpeg = spawn('ffmpeg', [
        '-v', 'warning',
        '-rtsp_transport', 'tcp',
        '-stimeout', '5000000',
        '-use_wallclock_as_timestamps', '1',  // Important for Reolink
        '-i', RTSP_URL,
        '-frames:v', '1',
        '-f', 'null',
        '-'
    ]);

    let errorOutput = '';

    ffmpeg.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    ffmpeg.on('close', (code) => {
        if (code === 0) {
            logger.info('✅ RTSP stream is accessible and working!');
        } else {
            logger.error('❌ Failed to connect to RTSP stream');
            if (errorOutput) {
                logger.error('FFmpeg Error Details:', errorOutput);
            }
            logger.info('\nTroubleshooting steps:');
            logger.info('1. Verify camera IP (current: 10.0.100.232)');
            logger.info('2. Check credentials (username: admin)');
            logger.info('3. Confirm RTSP port 554 is accessible');
            logger.info('4. Try testing with VLC: ' + RTSP_URL);
        }
    });

    // Set a timeout
    setTimeout(() => {
        ffmpeg.kill('SIGKILL');
    }, 6000);
}

// Run the test
testRTSPStream();
