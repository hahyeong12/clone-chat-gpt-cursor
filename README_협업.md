# 👥 3명 협업 가이드 - 간단 요약

## 🚀 빠른 시작

### 현재 노트북 (첫 푸시)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

### 다른 노트북에서
```bash
git clone https://github.com/사용자명/저장소명.git
cd 저장소명
npm install
npm run dev
```

---

## 📝 일상 협업 명령어

```bash
# 작업 시작 전 (필수!)
git pull origin main

# 작업 완료 후
git add .
git commit -m "작업 내용"
git push origin main

# 다른 사람이 업로드한 내용 받기
git pull origin main
```

---

## ⚠️ 규칙
1. 작업 전에 **항상 `git pull`**
2. 작업 후 **즉시 `git push`**
3. 같은 파일 **동시 수정 금지**

자세한 내용은 `협업_설정_스크립트.md` 참고!

