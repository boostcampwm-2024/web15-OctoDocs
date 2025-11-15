#!/bin/bash

# OctoDocs 프로덕션 배포 초기화 스크립트
# Let's Encrypt SSL 인증서 자동 발급

set -e

echo "🚀 OctoDocs 프로덕션 배포 초기화 시작..."
echo ""

# 프로젝트 루트 디렉토리로 이동
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# .env.deploy 파일 확인
if [ ! -f .env.deploy ]; then
    echo "❌ .env.deploy 파일이 없습니다."
    exit 1
fi

echo "✅ .env.deploy 파일 확인 완료"

# certbot 데이터 디렉토리 생성
mkdir -p data/certbot/conf
mkdir -p data/certbot/www
mkdir -p data/certbot/log

echo "✅ certbot 디렉토리 생성 완료"

# 도메인 설정
DOMAIN="octodocs.site"
EMAIL="hihj070914@icloud.com"

echo ""
echo "📋 SSL 인증서 발급 정보:"
echo "   도메인: $DOMAIN, www.$DOMAIN"
echo "   이메일: $EMAIL"
echo ""

# 기존 인증서 확인
if [ -d "data/certbot/conf/live/$DOMAIN" ]; then
    echo "⚠️  기존 인증서가 존재합니다."
    read -p "기존 인증서를 삭제하고 재발급하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "✅ 기존 인증서를 유지합니다."
        exit 0
    fi
    echo "🗑️  기존 인증서 삭제 중..."
    rm -rf data/certbot/conf/live/$DOMAIN
    rm -rf data/certbot/conf/archive/$DOMAIN
    rm -rf data/certbot/conf/renewal/$DOMAIN.conf
fi

# compose.init.yml을 사용하여 certbot 실행
echo ""
echo "🔐 Let's Encrypt SSL 인증서 발급 중..."
echo "   (약 1-2분 소요됩니다)"
echo ""

docker compose -f compose.init.yml up certbot

# 발급 결과 확인
if [ -d "data/certbot/conf/live/$DOMAIN" ]; then
    echo ""
    echo "✅ SSL 인증서 발급 완료!"
    echo ""
    echo "📂 인증서 위치:"
    echo "   - 인증서: data/certbot/conf/live/$DOMAIN/fullchain.pem"
    echo "   - 개인키: data/certbot/conf/live/$DOMAIN/privkey.pem"
    echo ""
    echo "🎉 이제 'yarn deploy' 명령어로 배포할 수 있습니다!"
else
    echo ""
    echo "❌ SSL 인증서 발급 실패"
    echo ""
    echo "💡 다음 사항을 확인해주세요:"
    echo "   1. 도메인 DNS가 이 서버 IP를 가리키는지 확인"
    echo "   2. 80번 포트가 열려있는지 확인"
    echo "   3. 방화벽 설정 확인"
    echo ""
    echo "📝 로그 확인: data/certbot/log/"
    exit 1
fi

# compose.init.yml 정리
docker compose -f compose.init.yml down

echo ""
echo "✅ 초기화 완료!"
