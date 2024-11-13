module.exports = {
  streams: [
    {
      id: 'camera1',
      name: 'Front Door',
      rtspUrl: 'rtsp://admin:MaxCr33k420@10.0.100.232:554/h264Preview_01_main',
      width: 1280,
      height: 720,
      ffmpegOptions: {
        '-loglevel': 'warning',
        '-rtsp_transport': 'tcp',
        '-timeout': '5000000',
        '-use_wallclock_as_timestamps': '1',
        '-fflags': '+genpts',
        '-codec:v': 'mpeg1video',
        '-b:v': '2000k',
        '-bf': '0',
        '-qscale:v': '2',
        '-f': 'mpegts'
      }
    },
    {
      id: 'camera2',
      name: 'Back Yard',
      rtspUrl: 'rtsp://admin:MaxCr33k420@10.0.100.245:554/h264Preview_01_main',
      width: 1280,
      height: 720,
      ffmpegOptions: {
        '-loglevel': 'warning',
        '-rtsp_transport': 'tcp',
        '-timeout': '5000000',
        '-use_wallclock_as_timestamps': '1',
        '-fflags': '+genpts',
        '-codec:v': 'mpeg1video',
        '-b:v': '2000k',
        '-bf': '0',
        '-qscale:v': '2',
        '-f': 'mpegts'
      }
    },
    {
      id: 'amcrest240',
      name: 'Amcrest 240',
      rtspUrl: 'rtsp://admin:MaxCr33k420@10.0.100.240:554/cam/realmonitor?channel=1&subtype=0',
      width: 1280,
      height: 720,
      ffmpegOptions: {
        '-loglevel': 'warning',
        '-rtsp_transport': 'tcp',
        '-timeout': '5000000',
        '-use_wallclock_as_timestamps': '1',
        '-fflags': '+genpts',
        '-codec:v': 'mpeg1video',
        '-b:v': '2000k',
        '-bf': '0',
        '-qscale:v': '2',
        '-f': 'mpegts'
      }
    },
    {
      id: 'amcrest244',
      name: 'Amcrest 244',
      rtspUrl: 'rtsp://admin:MaxCr33k420@10.0.100.244:554/cam/realmonitor?channel=1&subtype=0',
      width: 1280,
      height: 720,
      ffmpegOptions: {
        '-loglevel': 'warning',
        '-rtsp_transport': 'tcp',
        '-timeout': '5000000',
        '-use_wallclock_as_timestamps': '1',
        '-fflags': '+genpts',
        '-codec:v': 'mpeg1video',
        '-b:v': '2000k',
        '-bf': '0',
        '-qscale:v': '2',
        '-f': 'mpegts'
      }
    }
  ]
};
