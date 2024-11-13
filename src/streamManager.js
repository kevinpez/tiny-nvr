const Stream = require('node-rtsp-stream');
const EventEmitter = require('events');

class StreamManager extends EventEmitter {
  constructor(config) {
    super();
    this.rtspUrl = config.rtspUrl;
    this.wsPort = config.wsPort || 9999;
    this.logger = config.logger;
    this.stream = null;

    this.startStream();
  }

  startStream() {
    try {
      if (this.stream) {
        this.stopStream();
      }

      const streamConfig = {
        name: 'camera1',
        streamUrl: this.rtspUrl,
        wsPort: this.wsPort,
        ffmpegOptions: {
          '-rtsp_transport': 'tcp',
          '-i': this.rtspUrl,
          '-analyzeduration': '15000000',
          '-probesize': '15000000',
          '-re': '',
          '-f': 'mpegts',
          '-codec:v': 'mpeg1video',
          '-b:v': '1000k',
          '-maxrate': '1000k',
          '-bufsize': '2000k',
          '-q:v': '3',
          '-r': '30',
          '-an': '',
          '-stats': ''
        }
      };

      this.logger.info('Starting stream with config:', streamConfig);
      this.stream = new Stream(streamConfig);

      this.stream.on('error', (error) => {
        this.logger.error('Stream error:', error);
        this.emit('error', error);
        
        setTimeout(() => {
          this.logger.info('Attempting to reconnect stream...');
          this.startStream();
        }, 5000);
      });

    } catch (error) {
      this.logger.error('Failed to start stream:', error);
      this.emit('error', error);
      
      setTimeout(() => {
        this.logger.info('Attempting to reconnect after error...');
        this.startStream();
      }, 5000);
    }
  }

  stopStream() {
    if (this.stream) {
      this.stream.stop();
      this.stream = null;
    }
  }

  getStatus() {
    return this.stream ? 'Connected' : 'Disconnected';
  }

  getWebsocketUrl() {
    if (!this.stream) return null;
    return `ws://${process.env.HOST || 'localhost'}:${this.wsPort}`;
  }
}

module.exports = StreamManager;