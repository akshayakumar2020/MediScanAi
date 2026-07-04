# MediScan AI - Backend

## Tech Stack
- Java 21
- Spring Boot 3.3.4
- Spring Security + JWT Authentication
- Spring Data JPA
- PostgreSQL
- Firebase Storage
- Tess4J (OCR)
- Apache PDFBox
- Spring AI / OpenAI Integration

## Setup

### Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 16+
- Tesseract OCR (optional, for OCR features)

### Database Setup
```sql
CREATE DATABASE mediscan_db;
```

### Configuration
Edit `src/main/resources/application.properties`:
- Update PostgreSQL credentials
- Add Firebase service account JSON file
- Set OpenAI API key

### Run
```bash
cd backend
mvn spring-boot:run
```

### Default Admin
- Email: admin@mediscan.com
- Password: Admin@123

## API Endpoints

### Authentication
- POST /api/auth/register/patient
- POST /api/auth/register/doctor
- POST /api/auth/login

### Reports
- POST /api/reports/upload
- GET /api/reports
- GET /api/reports/{id}

### Appointments
- POST /api/appointments
- GET /api/appointments
- DELETE /api/appointments/{id}

### Doctors
- GET /api/doctors
- GET /api/doctors/{id}

### Admin
- GET /api/admin/users
- PUT /api/admin/users/suspend/{id}
- PUT /api/admin/users/block/{id}
- DELETE /api/admin/users/delete/{id}
- GET /api/admin/doctors
- PUT /api/admin/doctors/approve/{id}
- PUT /api/admin/doctors/reject/{id}
- GET /api/admin/analytics
- GET /api/admin/system-health

## Deployment (Render)

1. Connect your repository to Render and create a new **Web Service**.
2. **Build Command**: `mvn clean package -DskipTests`
3. **Start Command**: `java -jar target/mediscan-ai-1.0.0.jar`
4. Go to the **Environment** tab and add all the variables from your `.env` file (e.g., `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, etc.).
   *Note: For `DB_URL` using Supabase, make sure to use the **Connection Pooler (IPv4)** connection string.*
5. Ensure `application.properties` has `cors.allowed-origins` updated to include your frontend URL (e.g., `https://<your-vercel-app-url>.vercel.app`).
