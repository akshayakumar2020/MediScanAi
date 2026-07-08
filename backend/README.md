# MediScan AI - Backend

## Tech Stack
- Java 21
- Spring Boot 3.3.4
- Spring Security + JWT Authentication
- Spring Data JPA
- PostgreSQL
- Cloudinary Storage
- Tess4J (OCR)
- Apache PDFBox
- Spring AI / OpenAI Integration

## Setup

### Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 16+
- Tesseract OCR ( for OCR features)

### Database Setup
```sql
CREATE DATABASE mediscan_db;
```


### Run
```bash
cd backend
mvn spring-boot:run
```



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


