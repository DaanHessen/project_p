# Deploying to the Raspberry Pi

The site is a static Vite build. Nothing in it is host-specific.

## Build

```bash
npm ci
npm run build
```

Output lands in `dist/`. Copy that directory to the Pi, or build on the Pi
directly.

`ascii-blobs` resolves from npm at `^1.0.3`. When a sibling `../ASCII-blobs`
checkout exists, `vite.config.ts` aliases it to that source instead, so local
development picks up library edits without a publish cycle. The Pi has no
sibling checkout, so it uses the published package — nothing to configure.

## Serve with Node

```bash
npm run serve
```

Listens on `0.0.0.0:4173`. Override with `PORT` and `HOST`; point it at a
different directory with `STATIC_ROOT`.

As a systemd unit at `/etc/systemd/system/portfolio.service`:

```ini
[Unit]
Description=daanhessen.nl
After=network.target

[Service]
WorkingDirectory=/srv/portfolio
ExecStart=/usr/bin/node server.mjs
Environment=PORT=4173
Restart=always
User=daan

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now portfolio
```

## Serve with nginx instead

If nginx is already fronting the Pi, skip `server.mjs` and point a site at
`dist/`. The `try_files` line is what makes `/cv` survive a hard refresh:

```nginx
server {
    listen 80;
    server_name daanhessen.nl;
    root /srv/portfolio/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|woff2|png|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Any static host works as long as unknown paths fall back to `index.html`.
Without that rule, `/cv` 404s on refresh.
