![Sprint 33](https://github.com/user-attachments/assets/2b23184d-90ed-458d-9dc4-dab9579c1e48)


<br>








<div align="center">
  
   ![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Fweb15-OctoDocs&count_bg=%23000000&title_bg=%23000000&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false) [![Group 112 (1)](https://github.com/user-attachments/assets/b7b4387e-ffe9-4469-82b7-c14509282d86)](https://octodocs.site)
 [![Group 83 (2)](https://github.com/user-attachments/assets/2d106d94-430c-47bc-a9e2-1f0026f76c2f)](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki) [![Group 84 (2)](https://github.com/user-attachments/assets/b29b191b-8172-42a9-b541-40fdb8f165f3)](https://github.com/orgs/boostcampwm-2024/projects/120) 

</div>

# 🐙 프로젝트 소개

### 🕸️ 관계형 지식 관리 툴 


> 문서들을 작성하고 연결하면서 문서들 간의 연간 관계를 시각적으로 확인 가능.

https://github.com/user-attachments/assets/1ac81d56-a0ce-403c-9e3f-7ba092b6a5b6


<br>


### 🧸 실시간 동시 편집 및 협업 기능

> 실시간으로 다른 사용자들과 동시 편집 및 협업 가능.

https://github.com/user-attachments/assets/ad1f6dc9-50af-46e4-bac4-267b1432b301

<br>


### ⛺️ 워크스페이스 초대 기능

> 개별 워크 스페이스에 다른 사용자들을 초대해서 함께 이용 가능.

<br>


# 🛠️ 프로젝트 구조

### 🖥️ System Architecture

![image (13)](https://github.com/user-attachments/assets/60bfb7a1-3c1a-436d-b961-5a30dc9dba7f)


### 🐳 Sequence Diagram 

<div align="center">


![image (14)](https://github.com/user-attachments/assets/ea6853d8-398e-4448-ae0a-07bffc653722)

</div>

# 🗺️ 프로젝트 타임라인

![project-timeline](https://github.com/user-attachments/assets/2ae32844-ac61-4fc6-bb19-93c40f4f8f23)


# 🚧 문제와 해결과정

### 실시간 편집 구현 과정

Octodocs 팀은 핵심 기능인 에디터와 노드 캔버스의 **실시간 편집**을 위해 **CRDT** 라이브러리인 **YJS**와 **SocketIO**를 어떻게 활용 했을까요? [🔗 링크](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki)

### 데이터 흐름 변경

YDoc과 소켓을 사용하면서도 RESTful 방식으로 일부 상태를 관리하던 구조를, YDoc 중심의 **단일 truth source**와 소켓 기반 **단방향 흐름**으로 단순화했습니다. 그 결과 모든 상태가 YDoc을 통해 일관성 있게 관리되며, 클라이언트와 서버 간 데이터 흐름도 간소화되었습니다. 중복 관리와 데이터 충돌을 줄이기 위한 이런 **data flow 변화**의 핵심은 무엇이었을까요? [🔗 링크](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki)

### FE 프로젝트 구조 개선 과정

Octodocs 팀은 기존 **프로젝트 구조**의 문제점을 어떻게 파악했고, 어떤 방법으로 개선을 했을까요? [🔗 링크](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki)

### 드래그 이벤트 발생 시 생기는 쿼리 최적화

**노트 카드를 드래그** 할 때, 그 위치를 DB에 저장하기 위해 **너무 많은 쿼리가 발생**하는 문제가 있었습니다. 이를 위해 **쿼리를 최적화**해야할 필요성이 생겼는데 이를 어떻게 해결할 수 있었을까요? [🔗 링크](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki)

### redis 캐싱으로 데이터베이스 부하 감소

실시간 문서 동시 편집에서 발생하는 굉장히 많은 변경 사항을 모두 데이터베이스에 저장하기에는 데이터베이스 부하가 너무 많이 발생했고, Octodocs 팀은 redis를 도입하기로 결정했습니다. 저희는 왜 redis를 도입하기로 결정했고 또 redis를 어떻게 활용했을까요? [🔗 링크](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki/redis%EB%A5%BC-%ED%86%B5%ED%95%B4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%BF%BC%EB%A6%AC-%EC%A4%84%EC%9D%B4%EA%B8%B0)

### 개발 환경, 배포 환경 및 CI/CD에 대한 개선 과정

Octodocs 팀은 사용자 경험 향상은 물론, 일관된 코드 품질 유지와 개발자 친화적인 쾌적한 개발 환경 조성을 위해 많은 노력을 기울였습니다. 멀티 레포에서 모노레포로의 전환, GitHub Actions를 활용한 CI/CD 구축, Docker와 Docker Compose의 도입까지—우리는 어떤 변화를 거쳤을까요? [🔗 링크](https://github.com/boostcampwm-2024/web15-OctoDocs/wiki)

# 🧸 팀원 소개
| [J032_김동준](https://github.com/djk01281) | [J075_김현준](https://github.com/Tolerblanc) | [J097_민서진](https://github.com/summersummerwhy) | [J162_유성민](https://github.com/ezcolin2) | [J248_진예원](https://github.com/yewonJin) |
|:----------------------------------------:|:------------------------------------------:|:------------------------------------------------:|:----------------------------------------:|:----------------------------------------:|
| <img width="204" alt="스크린샷 2024-10-29 오후 4" src="https://github.com/user-attachments/assets/71a5a38e-f60c-4f60-97e3-30d7a73a3c77"> | <img width="204" alt="스크린샷 2024-10-29 오후 11 41 04" src="https://github.com/user-attachments/assets/e093f852-a6ea-4937-b0ce-b89276bd7135"> | <img width="204" alt="스크린샷 2024-10-29 오후 11 41 55" src="https://github.com/user-attachments/assets/0f638ba9-a1ad-47b8-a874-957c0119384c"> | <img width="204" alt="스크린샷 2024-10-29 오후 11 41 00" src="https://github.com/user-attachments/assets/1d77b650-70f1-4dee-9489-dc0122b7c9ff"> | <img width="204" alt="스크린샷 2024-10-29 오후 11 40 31" src="https://github.com/user-attachments/assets/db99b6b2-ae06-4758-8687-17ebb860a52b"> |
| **INFJ** | **INFJ** | **INTP** | **INFP** | **ISTJ** |
| **`FE`** | **`BE`** | **`BE`** | **`BE`** | **`FE`** |
