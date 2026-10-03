# Student Course Management System

A web application for managing students, courses, and course enrollments.

## Features

### Student Management
- Add student with name, email, phone, course, and date of joining
- View students
- Search students
- Edit student details
- Delete students
- Validate required fields
- Validate email format
- Validate 10-digit phone number

### Course Management
- Create courses
- View courses
- Edit courses
- Delete courses
- Store course name and duration

### Enrollment Management
- Enroll students into courses
- Display enrollment details
- Prevent duplicate enrollment for the same student and course

### Dashboard
- Display total students
- Display total courses
- Display total enrollments
- Display course-wise enrollment counts

### Bonus Features
- Pagination
- Course-wise filtering
- Export student data to CSV
- Export enrollment data to CSV

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Fetch API

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST API

### Database
- MySQL
- MySQL Workbench

### Tools
- Eclipse
- Visual Studio Code
- Postman
- Git
- GitHub

## Project Structure

```text
Student-Course-Management/
├── README.md
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    └── course-management/
        ├── src/
        │   ├── main/
        │   │   ├── java/
        │   │   │   └── com/cm/course_management/
        │   │   │       ├── controller/
        │   │   │       ├── service/
        │   │   │       ├── repository/
        │   │   │       ├── entity/
        │   │   │       └── CourseManagementApplication.java
        │   │   └── resources/
        │   │       └── application.properties
        │   └── test/
        └── pom.xml