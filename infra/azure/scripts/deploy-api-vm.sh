#!/usr/bin/env bash
set -euo pipefail
ZIP="$1"
DOMAIN="$2"
export DEBIAN_FRONTEND=noninteractive

if ! command -v dotnet >/dev/null; then
  apt-get update -y
  apt-get install -y aspnetcore-runtime-10.0
fi
apt-get install -y unzip jq >/dev/null

if ! command -v caddy >/dev/null; then
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddyc
fi

cat > /etc/caddy/Caddyfile <<EOF
${DOMAIN} {
    reverse_proxy 127.0.0.1:5000
}
EOF
systemctl enable caddy
systemctl reload caddy || systemctl restart caddy

systemctl stop todo-api 2>/dev/null || true
rm -rf /opt/todo-api && mkdir -p /opt/todo-api
unzip -q "$ZIP" -d /opt/todo-api
chmod 600 /opt/todo-api/appsettings.Development.json

chmod +x /opt/todo-api/efbundle
CONN=$(jq -r '.ConnectionStrings.DatabaseConnection' /opt/todo-api/appsettings.Development.json)
/opt/todo-api/efbundle --connection "$CONN"

cat > /etc/systemd/system/todo-api.service <<'EOF'
[Unit]
Description=Todo API
After=network.target

[Service]
WorkingDirectory=/opt/todo-api
ExecStart=/usr/bin/dotnet /opt/todo-api/backend.dll
Restart=always
Environment=ASPNETCORE_ENVIRONMENT=Development
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable todo-api
systemctl restart todo-api
