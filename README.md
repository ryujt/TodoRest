# TodoRest API v2.0

**TodoRest**는 학습용 REST API 서버입니다. JSONL 파일을 로컬 데이터베이스로 사용하며, 여러 리소스에 대한 CRUD 작업, 페이지네이션, 필터링, 정렬 기능을 제공합니다.

## 🚀 주요 기능

- **5가지 리소스**: Todos, Users, Posts, Comments, Categories
- **페이지네이션**: 대용량 데이터 처리를 위한 페이지 분할
- **필터링**: 리소스별 다양한 필터 옵션
- **검색**: 전체 텍스트 검색
- **정렬**: 오름차순/내림차순 정렬
- **풍부한 샘플 데이터**: 200개 이상의 샘플 데이터

## 📦 디렉토리 구조

```
TodoRest/
├── src/
│   ├── index.js              # 메인 애플리케이션
│   ├── routes/               # API 라우터
│   │   ├── todos.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── categories.js
│   ├── utils/                # 유틸리티 함수
│   │   ├── dataStore.js      # 데이터 관리
│   │   └── seedData.js       # 샘플 데이터 생성
│   └── data/                 # JSONL 데이터 파일
│       ├── todos.jsonl
│       ├── users.jsonl
│       ├── posts.jsonl
│       ├── comments.jsonl
│       └── categories.jsonl
├── package.json
└── README.md
```

## 🛠️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/ryujt/TodoRest.git
cd TodoRest
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 샘플 데이터 생성

```bash
npm run seed
```

### 4. 서버 실행

```bash
npm start
```

또는 개발 모드 (자동 재시작):

```bash
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

## 📚 API 엔드포인트

### 기본 정보

```bash
GET /
```

API 정보 및 사용 가능한 엔드포인트 목록을 반환합니다.

---

## 📝 Todos API

### 모든 Todos 조회

```bash
GET /api/todos
GET /api/todos?page=1&limit=10
GET /api/todos?completed=true
GET /api/todos?priority=high
GET /api/todos?search=project
GET /api/todos?sortBy=createdAt&sortOrder=desc
```

**쿼리 파라미터**:
- `page`: 페이지 번호 (기본: 1)
- `limit`: 페이지당 항목 수 (기본: 10)
- `completed`: 완료 여부 (true/false)
- `priority`: 우선순위 (low/medium/high/urgent)
- `search`: 검색 키워드
- `sortBy`: 정렬 기준 필드
- `sortOrder`: 정렬 순서 (asc/desc)

### Todo 생성

```bash
POST /api/todos
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2024-12-31",
  "tags": ["work", "urgent"]
}
```

### 특정 Todo 조회

```bash
GET /api/todos/:id
```

### Todo 수정

```bash
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "medium"
}
```

### Todo 완료 토글

```bash
PATCH /api/todos/:id
```

### Todo 삭제

```bash
DELETE /api/todos/:id
```

---

## 👥 Users API

### 모든 Users 조회

```bash
GET /api/users
GET /api/users?page=1&limit=10
GET /api/users?role=admin
GET /api/users?status=active
GET /api/users?search=john
```

**쿼리 파라미터**:
- `page`, `limit`: 페이지네이션
- `role`: 역할 필터 (user/admin/moderator)
- `status`: 상태 필터 (active/inactive)
- `search`: 검색 키워드

### User 생성

```bash
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "bio": "Software developer"
}
```

### 특정 User 조회

```bash
GET /api/users/:id
```

### User 수정

```bash
PUT /api/users/:id
```

### User 삭제

```bash
DELETE /api/users/:id
```

---

## 📄 Posts API

### 모든 Posts 조회

```bash
GET /api/posts
GET /api/posts?page=1&limit=10
GET /api/posts?authorId=USER_ID
GET /api/posts?categoryId=CATEGORY_ID
GET /api/posts?status=published
GET /api/posts?search=nodejs
GET /api/posts?sortBy=viewCount&sortOrder=desc
```

**쿼리 파라미터**:
- `page`, `limit`: 페이지네이션
- `authorId`: 작성자 필터
- `categoryId`: 카테고리 필터
- `status`: 상태 필터 (published/draft)
- `search`: 검색 키워드
- `sortBy`: 정렬 (viewCount, likeCount, createdAt 등)

### Post 생성

```bash
POST /api/posts
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "Post content here...",
  "authorId": "USER_ID",
  "categoryId": "CATEGORY_ID",
  "tags": ["nodejs", "tutorial"],
  "status": "published"
}
```

### 특정 Post 조회 (조회수 증가)

```bash
GET /api/posts/:id
```

### Post 수정

```bash
PUT /api/posts/:id
```

### Post 좋아요

```bash
PATCH /api/posts/:id/like
```

### Post 삭제

```bash
DELETE /api/posts/:id
```

---

## 💬 Comments API

### 모든 Comments 조회

```bash
GET /api/comments
GET /api/comments?postId=POST_ID
GET /api/comments?authorId=USER_ID
GET /api/comments?search=great
```

### Comment 생성

```bash
POST /api/comments
Content-Type: application/json

{
  "postId": "POST_ID",
  "authorId": "USER_ID",
  "content": "Great article!",
  "parentId": null
}
```

### 답글 생성

```bash
POST /api/comments
Content-Type: application/json

{
  "postId": "POST_ID",
  "authorId": "USER_ID",
  "content": "Thanks for the feedback!",
  "parentId": "PARENT_COMMENT_ID"
}
```

### Comment 수정

```bash
PUT /api/comments/:id
```

### Comment 좋아요

```bash
PATCH /api/comments/:id/like
```

### Comment 삭제

```bash
DELETE /api/comments/:id
```

---

## 🏷️ Categories API

### 모든 Categories 조회

```bash
GET /api/categories
GET /api/categories?search=tech
```

### Category 생성

```bash
POST /api/categories
Content-Type: application/json

{
  "name": "Technology",
  "description": "Tech-related posts",
  "slug": "technology",
  "color": "#3b82f6"
}
```

### Category 조회

```bash
GET /api/categories/:id
```

### Category 수정

```bash
PUT /api/categories/:id
```

### Category 삭제

```bash
DELETE /api/categories/:id
```

---

## 🎯 사용 예제

### cURL 예제

```bash
# 모든 todos 조회
curl http://localhost:3000/api/todos

# 페이지네이션을 사용한 조회
curl "http://localhost:3000/api/todos?page=1&limit=5"

# 완료된 todos만 조회
curl "http://localhost:3000/api/todos?completed=true"

# 새 todo 생성
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn REST API","priority":"high"}'

# Todo 수정
curl -X PUT http://localhost:3000/api/todos/ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","completed":true}'
```

### JavaScript (fetch) 예제

```javascript
// 모든 posts 조회
fetch('http://localhost:3000/api/posts?page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));

// 새 post 생성
fetch('http://localhost:3000/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    content: 'Post content',
    authorId: 'USER_ID',
    categoryId: 'CATEGORY_ID'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔧 고급 기능

### 복합 필터링

여러 쿼리 파라미터를 조합하여 사용할 수 있습니다:

```bash
GET /api/posts?categoryId=CAT_ID&status=published&sortBy=viewCount&sortOrder=desc&page=1&limit=10
```

### 검색 기능

모든 필드를 대상으로 검색합니다:

```bash
GET /api/posts?search=nodejs
GET /api/users?search=john
```

### 정렬 기능

원하는 필드로 정렬할 수 있습니다:

```bash
GET /api/todos?sortBy=priority&sortOrder=desc
GET /api/posts?sortBy=likeCount&sortOrder=desc
```

---

## 📊 응답 형식

### 성공 응답 (단일 항목)

```json
{
  "id": "1234567890",
  "title": "Example Todo",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 성공 응답 (목록 - 페이지네이션 없음)

```json
{
  "data": [...],
  "total": 30
}
```

### 성공 응답 (페이지네이션 포함)

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 에러 응답

```json
{
  "error": "Todo not found"
}
```

---

## 🎓 학습 가이드

이 API 서버는 다음을 학습하기에 적합합니다:

1. **REST API 기본**
   - HTTP 메서드 (GET, POST, PUT, PATCH, DELETE)
   - 상태 코드 (200, 201, 404, 500 등)
   - JSON 요청/응답

2. **고급 기능**
   - 페이지네이션 구현
   - 필터링 및 검색
   - 정렬 기능
   - 관계형 데이터 (Users, Posts, Comments)

3. **프론트엔드 연동**
   - fetch API 사용
   - axios 사용
   - 비동기 처리

---

## 🛡️ CORS

CORS가 활성화되어 있어 모든 도메인에서 API에 접근할 수 있습니다.

---

## 📝 데이터 초기화

데이터를 초기화하고 새로운 샘플 데이터를 생성하려면:

```bash
npm run seed
```

---

## 🤝 기여

이 프로젝트는 학습 목적으로 만들어졌습니다. 개선 사항이나 버그를 발견하시면 이슈를 등록해주세요.

---

## 📄 라이센스

MIT License

---

## 📞 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.

---

**Happy Learning! 🚀**
