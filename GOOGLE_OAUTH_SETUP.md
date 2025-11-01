# Google OAuth 설정 가이드

이 프로젝트에서 Google OAuth 로그인을 사용하기 위한 설정 방법입니다.

## 1. Google Cloud Console 설정

### 1단계: 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 2단계: OAuth 동의 화면 설정
1. 왼쪽 메뉴에서 **"API 및 서비스" > "OAuth 동의 화면"** 선택
2. **사용자 유형 선택: "외부" 선택** ⚠️
   - **외부**: 일반 사용자들(Google 계정 소유자)도 사용 가능 - **이 프로젝트에 적합**
   - **내부**: Google Workspace 조직 내부 사용자만 사용 가능 (기업 내부 도구용)
3. 앱 정보 입력:
   - 앱 이름: "약장수 챗봇" (또는 원하는 이름)
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. 범위(Scopes)는 기본값 유지
5. 테스트 사용자 추가 (선택사항)
6. 저장 및 계속

### 3단계: OAuth 2.0 클라이언트 ID 생성
1. **"API 및 서비스" > "사용자 인증 정보"** 선택
2. 상단의 **"+ 사용자 인증 정보 만들기"** 클릭
3. **"OAuth 클라이언트 ID"** 선택
4. 애플리케이션 유형: **"웹 애플리케이션"** 선택
5. 이름 입력: "약장수 챗봇 웹 클라이언트"
6. **승인된 JavaScript 원본** 필드에 추가:
   ```
   http://localhost:3000
   ```
   ⚠️ **경로(/api/auth 등)를 포함하지 않고 도메인만 입력하세요!**
7. **승인된 리디렉션 URI** 필드에 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   ⚠️ **이 필드는 전체 경로를 포함해야 합니다.**
8. **"만들기"** 클릭
9. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

## 2. 환경 변수 설정

### .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
GOOGLE_CLIENT_ID=여기에_클라이언트_ID_붙여넣기
GOOGLE_CLIENT_SECRET=여기에_클라이언트_보안_비밀번호_붙여넣기
NEXTAUTH_SECRET=랜덤_문자열_생성
NEXTAUTH_URL=http://localhost:3000
```

### NEXTAUTH_SECRET 생성 방법
터미널에서 다음 명령어 실행:
```bash
openssl rand -base64 32
```
또는 온라인 랜덤 문자열 생성기 사용

## 3. 패키지 설치

터미널에서 다음 명령어 실행:
```bash
npm install next-auth@beta @auth/core
```

## 4. 실행

개발 서버 시작:
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 "로그인" 버튼 클릭하여 Google 로그인 테스트

## 5. 문제 해결

### 오류: "redirect_uri_mismatch"
- Google Cloud Console에서 승인된 리디렉션 URI가 정확히 일치하는지 확인
- 개발 환경: `http://localhost:3000/api/auth/callback/google`
- 프로덕션: `https://yourdomain.com/api/auth/callback/google`

### 오류: "invalid_client"
- GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET이 올바른지 확인
- .env.local 파일이 프로젝트 루트에 있는지 확인
- 개발 서버를 재시작했는지 확인

### 세션이 유지되지 않음
- NEXTAUTH_SECRET이 설정되어 있는지 확인
- NEXTAUTH_URL이 올바른지 확인

## 참고 사항

- 개발 환경에서는 테스트 사용자만 로그인 가능할 수 있습니다
- 프로덕션 배포 전 OAuth 동의 화면을 검토 받아야 합니다
- 민감한 정보(클라이언트 ID, 시크릿)는 절대 공개 저장소에 커밋하지 마세요

