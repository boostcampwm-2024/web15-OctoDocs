#!/bin/bash

# 작업 디렉토리 경로
DIR="/home/root/app/autodocs"

# 디렉토리 확인
if [ -d "$DIR" ]; then
    echo "$DIR 디렉토리가 존재합니다. 최신 버전으로 업데이트 중..."
    cd "$DIR"
    git pull
else
    echo "$DIR 디렉토리가 존재하지 않습니다. 클론 중..."
    git clone https://github.com/boostcampwm-2024/web15-OctoDocs.git "$DIR"
    cd "$DIR"
fi

# backend 디렉토리로 이동
cd backend

# 기존 프로세스 확인 및 종료
echo "기존 프로세스 확인 중..."
EXISTING_PID=$(lsof -ti :3000) # 여기서 포트 번호는 필요에 따라 조정

if [ -n "$EXISTING_PID" ]; then
    echo "기존 프로세스(PID: $EXISTING_PID) 종료 중..."
    kill -9 "$EXISTING_PID"
    echo "기존 프로세스가 종료되었습니다."
else
    echo "실행 중인 프로세스가 없습니다."
fi

# 의존성 설치 및 애플리케이션 시작
echo "의존성 설치 중..."
npm install

echo "애플리케이션 시작 중..."
nohup npm start &
