#!/bin/bash

# 스크립트가 위치한 디렉토리로 이동
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# OpenSSL 설정 파일 생성
cat > openssl.conf << EOF
[req]
default_bits       = 2048
default_keyfile    = localhost.key
distinguished_name = req_distinguished_name
req_extensions     = req_ext
x509_extensions    = v3_ca
prompt            = no

[req_distinguished_name]
C  = KR
ST = Seoul
L  = Seoul
O  = OctoDocs
OU = Development
CN = localhost

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names

[alt_names]
DNS.1   = localhost
DNS.2   = *.localhost
DNS.3   = octodocs.local
DNS.4   = *.octodocs.local
IP.1    = 127.0.0.1
EOF

# 인증서 생성
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -config openssl.conf

chmod 644 localhost.crt
chmod 644 localhost.key

# 설정 파일 정리
rm openssl.conf

echo "SSL certificate generated successfully!"
echo "Certificate: $SCRIPT_DIR/localhost.crt"
echo "Private key: $SCRIPT_DIR/localhost.key"