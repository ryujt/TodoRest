# TodoRest

**TodoRest**는 JSONL 파일을 로컬 데이터베이스로 사용하는 간단한 Todo 관리용 RESTful API 서버입니다. Node.js와 Express를 기반으로 개발되었으며, 가벼운 로컬 환경에서 실행이 가능합니다.

## 디렉토리 구조

```
.
├── README.md          # 프로젝트 설명 문서
├── index.js           # 메인 애플리케이션 코드
├── package-lock.json  # 종속성 잠금 파일
├── package.json       # Node.js 설정 파일
└── todos.jsonl        # 로컬 데이터 저장 파일 (JSONL 형식)
```

---

## 주요 기능

- **GET /todo**: 모든 Todo 항목 조회
- **POST /todo**: 새 Todo 생성
- **GET /todo/:id**: 특정 Todo 조회
- **PUT /todo/:id**: Todo 수정
- **PATCH /todo/:id**: Todo 완료 처리
- **DELETE /todo/:id**: Todo 삭제

---

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/username/TodoRest.git
cd TodoRest
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 서버 실행
```bash
node index.js
```

---

## API 사용법

### **1. 모든 Todo 조회**
- **Endpoint**: `GET /todo`
- **예제**:
```bash
curl -X GET http://localhost:3000/todo
```

---

### **2. 새 Todo 생성**
- **Endpoint**: `POST /todo`
- **Body**: JSON 형식으로 `title`과 `description`을 전달
- **예제**:
```bash
curl -X POST http://localhost:3000/todo \
-H "Content-Type: application/json" \
-d '{"title": "New Task", "description": "Learn REST API"}'
```

---

### **3. 특정 Todo 조회**
- **Endpoint**: `GET /todo/:id`
- **예제**:
```bash
curl -X GET http://localhost:3000/todo/ID_HERE
```

---

### **4. Todo 수정**
- **Endpoint**: `PUT /todo/:id`
- **Body**: JSON 형식으로 수정할 `title`과 `description` 전달
- **예제**:
```bash
curl -X PUT http://localhost:3000/todo/ID_HERE \
-H "Content-Type: application/json" \
-d '{"title": "Updated Task", "description": "Update REST API knowledge"}'
```

---

### **5. Todo 완료 처리**
- **Endpoint**: `PATCH /todo/:id`
- **예제**:
```bash
curl -X PATCH http://localhost:3000/todo/ID_HERE
```

---

### **6. Todo 삭제**
- **Endpoint**: `DELETE /todo/:id`
- **예제**:
```bash
curl -X DELETE http://localhost:3000/todo/ID_HERE
```

---

## 개발 환경

- **Node.js**: v14 이상
- **Express**: 최신 버전

---

## 라이센스

MIT
