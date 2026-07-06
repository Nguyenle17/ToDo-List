# Todo List App

Ứng dụng quản lý công việc (Todo List) gồm 2 phần:
- **Backend**: Spring Boot 3.5 + PostgreSQL (`java-backend/todo-api`)
- **Frontend**: React + Vite (`react-frontend`)

## Yêu cầu môi trường

- **Java 21**
- **Maven** (hoặc dùng `mvnw` nếu có sẵn trong project)
- **Node.js** (khuyến nghị bản LTS mới nhất) + npm
- **Docker Desktop** (để chạy PostgreSQL qua Docker Compose)

## 1. Chạy Database (PostgreSQL qua Docker)

```bash
cd java-backend/todo-api
docker compose up -d
```

Kiểm tra container đã chạy:
```bash
docker ps
```

Nếu đây là lần đầu chạy hoặc gặp lỗi `database "todo_db" does not exist`, xóa volume cũ và khởi tạo lại:
```bash
docker compose down -v
docker compose up -d
```

## 2. Chạy Backend (Spring Boot)

```bash
cd java-backend/todo-api
mvn spring-boot:run
```

Backend mặc định chạy tại: **http://localhost:3000**

> **Lưu ý:** nếu gặp lỗi `Port 3000 was already in use` hoặc `Port 5433 was already in use`, có thể có process khác (Postgres cài native trên máy, hoặc app khác) đang chiếm cổng. Kiểm tra bằng:
> ```bash
> netstat -ano | findstr :3000
> netstat -ano | findstr :5433
> ```
> rồi tắt process đó (`taskkill /PID <PID> /F`) hoặc đổi cổng trong `application.yml` / `docker-compose.yml`.

### Cấu hình backend

File cấu hình chính: `src/main/resources/application.yml`

```yaml
server:
  port: 3000

spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/todo_db
    username: postgres
    password: 123456
  jpa:
    hibernate:
      ddl-auto: update
```

Hibernate sẽ tự động tạo/cập nhật bảng `todos` khi khởi động (nhờ `ddl-auto: update`).

## 3. Chạy Frontend (React + Vite)

```bash
cd react-frontend
npm install
```

Tạo file `.env` từ mẫu(Có thể bỏ qua):
```bash
cp .env.example .env
```

Nội dung `.env`:
```
VITE_API_URL=http://localhost:3000/api/v1
```

> Đổi giá trị này nếu backend chạy ở cổng/domain khác. Sau khi sửa `.env`, cần **restart lại dev server** (Vite chỉ đọc biến môi trường lúc khởi động).

Chạy dev server:
```bash
npm run dev
```

Frontend mặc định chạy tại: **http://localhost:5173** (cổng mặc định của Vite)

## 4. Thứ tự khởi động khuyến nghị

1. `docker compose up -d` (database)
2. `mvn spring-boot:run` (backend, chờ log `Started TodoApiApplication`)
3. `npm run dev` (frontend)

## Cấu trúc API chính

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/todos?page=&limit=&status=&search=&sortBy=&sortOrder=` | Lấy danh sách todo (có phân trang, lọc, sắp xếp) |
| POST | `/todos` | Tạo todo mới |
| PATCH | `/todos/{id}` | Cập nhật todo (title/description/completed) |
| DELETE | `/todos/{id}` | Xóa todo |

## Xử lý sự cố thường gặp

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `database "todo_db" does not exist` | Volume Postgres cũ chưa có database này | `docker compose down -v && docker compose up -d` |
| `Failed to determine DatabaseDriver` | Sai thứ tự chạy: backend chạy trước khi container Postgres sẵn sàng | Đảm bảo chạy `docker compose up -d` và chờ container `Up` trước khi `mvn spring-boot:run` |
| `Port XXXX was already in use` | Có process khác đang chiếm cổng | `netstat -ano \| findstr :XXXX` rồi `taskkill /PID <PID> /F`, hoặc đổi cổng trong cấu hình |
| CORS bị chặn ở FE | Origin của FE chưa được khai báo ở backend | Kiểm tra `CorsConfig.java` — `setAllowedOrigins` phải khớp đúng port FE đang chạy (ví dụ `http://localhost:5173`) |