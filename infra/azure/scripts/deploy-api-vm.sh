#!/usr/bin/env bash
# Usage: deploy-api-vm.sh <publish-dir> <domain> <Development|Production>
set -euo pipefail

SRC="${1:?usage: deploy-api-vm.sh <publish-dir> <domain> <environment>}"
DOMAIN="${2:?missing domain}"
APP_ENV="${3:?missing environment}"
case "$APP_ENV" in
Development | Production) ;;
*)
  echo "Bad environment: $APP_ENV"
  exit 1
  ;;
esac
APP_DIR="/opt/todo-api"
SETTINGS="$APP_DIR/appsettings.${APP_ENV}.json"

if ! command -v dotnet >/dev/null; then
  apt-get update -y
  apt-get install -y aspnetcore-runtime-10.0
fi
apt-get install -y jq >/dev/null

# ---------- Caddy (HTTPS reverse proxy) ----------
if ! command -v caddy >/dev/null; then
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' |
    gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    >/etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddyc
fi

cat >/etc/caddy/Caddyfile <<EOF
${DOMAIN} {
    reverse_proxy 127.0.0.1:5000
}
EOF
systemctl enable caddy
systemctl reload caddy || systemctl restart caddy

# ---------- Install the new build ----------
systemctl stop todo-api 2>/dev/null || true
rm -rf "$APP_DIR" && mkdir -p "$APP_DIR"
cp -a "$SRC"/. "$APP_DIR"/
rm -rf "$SRC" # also removes the staged copy of the settings file (secrets)
chmod 600 "$SETTINGS"

# ---------- Database migrations ----------
chmod +x "$APP_DIR/efbundle"
CONN=$(jq -r '.ConnectionStrings.DatabaseConnection' "$SETTINGS")
cd "$APP_DIR"
ASPNETCORE_ENVIRONMENT="$APP_ENV" \
  ConnectionStrings__DatabaseConnection="$CONN" \
  ./efbundle --connection "$CONN"

# ---------- systemd service ----------
cat >/etc/systemd/system/todo-api.service <<EOF
[Unit]
Description=Todo API
After=network.target

[Service]
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/dotnet ${APP_DIR}/backend.dll
Restart=always
Environment=ASPNETCORE_ENVIRONMENT=${APP_ENV}
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable todo-api
systemctl restart todo-api
