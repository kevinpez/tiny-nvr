const { spawn } = require('child_process');
const logger = require('./logger');

const CAMERA_IP = '10.0.100.232';
const USERNAME = 'admin';
const PASSWORD = 'MaxCr33k420';

// Common Reolink RTSP URL patterns
const rtspPatterns = [
    '/h264Preview_01_main',
    '/h264Preview_01_sub',
    '/live1s1.sdp',
    '/live1s2.sdp',
    '/live',
    '/live/ch01/main',
    '/live/ch01/sub',
    '/cam/realmonitor?channel=1&subtype=0',
    '/streaming/channels/101',
    '/live/main',
    '/live/sub'
];

async function testRtspPattern(pattern) {
    const rtspUrl = `rtsp://${USERNAME}:${PASSWORD}@${CAMERA_IP}:554${pattern}`;
    logger.info(`\nTesting RTSP URL: ${rtspUrl}`);

    return new Promise((resolve) => {
        const ffmpeg = spawn('ffmpeg', [
            '-v', 'error',
            '-rtsp_transport', 'tcp',
            '-stimeout', '3000000',
            '-i', rtspUrl,
            '-frames:v', '1',
            '-f', 'null',
            '-'
        ]);

        let error = '';

        ffmpeg.stderr.on('data', (data) => {
            error += data.toString();
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                logger.info('✅ Success! This URL pattern works.');
                resolve(true);
            } else {
                logger.info('❌ Failed');
                resolve(false);
            }
        });

        // Set timeout
        setTimeout(() => {
            ffmpeg.kill('SIGKILL');
        }, 3000);
    });
} 