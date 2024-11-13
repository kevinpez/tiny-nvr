require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const { proxy } = require('rtsp-relay')(express);
const logger = require('./logger');
const { streams } = require('./config/streams');

const app = express();
expressWs(app);

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// Add static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create WebSocket endpoints for each stream
streams.forEach(stream => {
  app.ws(`/stream/${stream.id}`, (ws, req) => {
    logger.info(`=== New WebSocket Connection for ${stream.name} ===`);
    logger.info('Client connected:', {
      stream: stream.id,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    const streamProxy = proxy({
      url: stream.rtspUrl,
      verbose: true,
      ffmpegOptions: stream.ffmpegOptions,
      onFfmpegStart: (command) => {
        logger.info(`FFmpeg starting for ${stream.name}:`, command);
      },
      onFfmpegError: (error) => {
        logger.error(`FFmpeg error for ${stream.name}:`, error);
        setTimeout(() => {
          logger.info(`Attempting to reconnect stream ${stream.name}...`);
          streamProxy.restart();
        }, process.env.RTSP_RECONNECT_TIMEOUT || 5000);
      }
    });

    ws.on('error', (error) => {
      logger.error(`WebSocket error for ${stream.name}:`, error);
    });

    ws.on('close', () => {
      logger.info(`WebSocket connection closed for ${stream.name}`);
    });

    try {
      streamProxy(ws);
      logger.info(`Stream started successfully for ${stream.name}`);
    } catch (error) {
      logger.error(`Failed to start stream for ${stream.name}:`, error);
      ws.close();
    }
  });
});

// Pass streams configuration to the template
app.get('/', (req, res) => {
  res.render('index', { streams });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Application error:', err);
  res.status(500).send('Internal Server Error');
});

// Start server
const server = app.listen(port, host, () => {
  logger.info(`Server running at http://${host}:${port}`);
  logger.info(`Configured streams: ${streams.map(s => s.name).join(', ')}`);
});

server.on('error', (error) => {
  logger.error('Server error:', error);
});

// Handle process termination
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});