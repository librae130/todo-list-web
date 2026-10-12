#!/usr/bin/env bash

set -euo pipefail
api_path="$1"

if ! command -v dotnet >/dev/null; then
  apt-get update -y
  apt-get install -y unzip aspnetcore-runtime-10.0
fi

cp "$api_path" /tmp/api.zip
systemctl stop todo-api 2>/dev/null || true
rm -rf /opt/todo-api && mkdir -p /opt/todo-api
unzip -q /tmp/api.zip -d /opt/todo-api
chmod 600 /opt/todo-api/appsettings.Development.json

chmod +x /opt/todo-api/efbundle
db_connection=$(jq -r '.ConnectionStrings.DatabaseConnection' /opt/todo-api/appsettings.Development.json)
/opt/todo-api/efbundle --connection "$db_connection"

cat > /etc/systemd/system/todo-api.service <<'EOF'
[Unit]
Description=Todo API
After=network.target

[Service]
WorkingDirectory=/opt/todo-api
ExecStart=/usr/bin/dotnet /opt/todo-api/backend.dll
Restart=always
Environment=ASPNETCORE_ENVIRONMENT=Development
Environment=ASPNETCORE_URLS=http://0.0.0.0:80
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now todo-api
systemctl restart todo-api
