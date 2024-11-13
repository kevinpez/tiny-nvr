# Simple NVR POC

This is a simple Network Video Recorder (NVR) proof of concept with WireGuard VPN support.

## Setup Instructions

1. Generate WireGuard keys:
   ```bash
   wg genkey | tee privatekey | wg pubkey > publickey
   ```

2. Update the WireGuard configuration:
   - Replace `YOUR_SERVER_PRIVATE_KEY` in `wireguard/wg0.conf`
   - Replace `YOUR_MIKROTIK_PUBLIC_KEY` with your Mikrotik's WireGuard public key

3. Configure Mikrotik RB4011:
   ```
   /interface/wireguard
   add listen-port=51820 mtu=1420 name=wireguard1 private-key="YOUR_MIKROTIK_PRIVATE_KEY"
   
   /interface/wireguard/peers
   add allowed-address=10.0.0.1/32 endpoint-address=YOUR_SERVER_IP endpoint-port=51820 interface=wireguard1 public-key="YOUR_SERVER_PUBLIC_KEY"
   
   /ip/address
   add address=10.0.0.2/24 interface=wireguard1
   ```

4. Build and run:
   ```bash
   docker-compose up -d
   ```

5. Access the web interface at `http://localhost:8080`

## Environment Variables

- `RTSP_URL`: RTSP stream URL (default: rtsp://your-camera-ip:554/stream)
- `TZ`: Timezone (default: UTC)

## Storage

- Recordings are stored in `./recordings`
- Logs are stored in `./config`