# 협업 가이드 - 여러 노트북에서 함께 작업하기 🤝

이 문서는 여러 노트북에서 같은 프로젝트를 함께 작업하는 방법을 안내합니다.

## 방법 1: GitHub를 통한 협업 (권장) ⭐

가장 안전하고 표준적인 방법입니다.

### 📌 1단계: 현재 노트북에서 GitHub 저장소 생성 및 푸시

#### 1.1 GitHub 저장소 생성
1. [GitHub](https://github.com)에 로그인
2. 우측 상단 `+` → `New repository` 클릭
3. 저장소 이름 입력 (예: `clone-chat-gpt-cursor`)
4. **Private** 또는 **Public** 선택
5. **초기화하지 않기** (이미 코드가 있으므로)
6. `Create repository` 클릭

#### 1.2 현재 프로젝트 푸시
현재 노트북의 터미널에서:

```bash
# 현재 변경사항 커밋
git add .
git commit -m "Initial commit for collaboration"

# GitHub 저장소 URL 확인 (예: https://github.com/사용자명/저장소명.git)
# 원격 저장소 추가 (만약 없다면)
git remote add origin https://github.com/사용자명/저장소명.git

# 또는 이미 설정되어 있다면:
git remote set-url origin https://github.com/사용자명/저장소명.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

### 📌 2단계: 다른 노트북에서 프로젝트 클론

각 노트북에서:

```bash
# 프로젝트 클론
git clone https://github.com/사용자명/저장소명.git

# 프로젝트 폴더로 이동
cd 저장소명

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 📌 3단계: 협업 워크플로우

#### 작업 시작 전
```bash
# 최신 코드 가져오기
git pull origin main
```

#### 작업 완료 후
```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "작업 내용 설명"

# 푸시
git push origin main
```

#### 충돌 해결
동시에 같은 파일을 수정하면 충돌이 발생할 수 있습니다:

```bash
# 충돌 발생 시
git pull origin main

# 충돌 파일 열기 (<<<<<<, ======, >>>>>> 표시 확인)
# 충돌 부분 수정 후:

git add .
git commit -m "충돌 해결"
git push origin main
```

---

## 방법 2: OneDrive/클라우드 동기화 (간단한 경우)

현재 프로젝트가 OneDrive에 있으므로 동기화를 활용할 수 있습니다.

### ⚠️ 주의사항
- **동시 편집 시 충돌 가능**
- **Git보다 덜 안전함**
- **node_modules 폴더는 동기화 제외 권장**

### 설정 방법
1. `.gitignore`에 이미 `node_modules` 등이 제외되어 있음
2. 각 노트북에서:
   ```bash
   # OneDrive 동기화된 폴더로 이동
   cd "C:\Users\사용자명\OneDrive\Desktop\스물 여섯_하\EC 헤커톤\clone-chat-gpt-cursor"
   
   # 의존성 설치 (각 노트북마다)
   npm install
   
   # 개발 서버 실행
   npm run dev
   ```

### 작업 규칙
- **한 번에 한 사람만 같은 파일 수정**
- 변경 전에 OneDrive 동기화 완료 확인
- 작업 후 즉시 동기화

---

## 방법 3: 네트워크 공유 폴더 (로컬 네트워크)

같은 네트워크에서 작업하는 경우:

### 설정
1. 한 노트북의 폴더를 네트워크 공유
2. 다른 노트북에서 `\\노트북IP\공유폴더` 접근
3. Git 사용 권장 (방법 1과 동일하게)

---

## 🎯 권장 사항

### ✅ Git 사용을 강력히 권장
- 충돌 관리 용이
- 버전 이력 관리
- 롤백 가능
- 협업 표준

### 📝 필수 설정

#### .env.local 파일 관리
각 노트북마다 `.env.local` 파일을 만들어야 합니다:
```bash
# 프로젝트 루트에 .env.local 생성
OPENAI_API_KEY=각자의_API_키
DEFAULT_MODEL=gpt-4o-mini
```

**주의**: `.gitignore`에 `.env.local`이 포함되어 있으므로 각자 로컬에 생성해야 합니다.

### 🔧 공통 작업 규칙

1. **작업 전**
   - `git pull`로 최신 코드 받기
   - 다른 사람이 작업 중인지 확인

2. **작업 중**
   - 작은 단위로 자주 커밋
   - 명확한 커밋 메시지 작성

3. **작업 후**
   - 테스트 확인
   - `git push`로 업로드
   - 팀원에게 알림

### 🚨 주의사항

- ✅ `.env.local` 파일은 절대 공유하지 않기
- ✅ `node_modules`는 Git에 추가하지 않기
- ✅ 작업 전 항상 `git pull` 실행
- ✅ 같은 파일을 동시에 수정하지 않기
- ✅ 커밋 메시지를 명확하게 작성

---

## 🔄 빠른 참조

### 현재 작업 상태 확인
```bash
git status
```

### 최신 코드 가져오기
```bash
git pull origin main
```

### 변경사항 업로드
```bash
git add .
git commit -m "작업 내용"
git push origin main
```

### 브랜치 생성 (기능별 작업)
```bash
git checkout -b feature/기능이름
# 작업 후
git push origin feature/기능이름
```

---

## 문제 해결

### 충돌 발생 시
```bash
git pull origin main
# 충돌 파일 수정
git add .
git commit -m "충돌 해결"
git push origin main
```

### 원격 저장소 변경
```bash
git remote set-url origin https://github.com/새사용자명/새저장소명.git
```

### 초기 설정 확인
```bash
git remote -v  # 원격 저장소 확인
git config user.name  # 사용자 이름 확인
git config user.email  # 이메일 확인
```

---

## 도움이 필요하신가요?

- Git 기본: [Pro Git Book (한국어)](https://git-scm.com/book/ko)
- GitHub 가이드: [GitHub Docs](https://docs.github.com/ko)

