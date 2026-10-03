package com.cm.course_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cm.course_management.entity.Course;
import com.cm.course_management.entity.Enrollment;
import com.cm.course_management.entity.Student;
import com.cm.course_management.repository.CourseRepository;
import com.cm.course_management.repository.EnrollmentRepository;
import com.cm.course_management.repository.StudentRepository;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public Enrollment enrollStudent(
            Long studentId,
            Long courseId,
            String enrollmentDate) {

        if (enrollmentRepository
                .existsByStudentIdAndCourseId(studentId, courseId)) {

            throw new RuntimeException(
                    "Student is already enrolled in this course");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(
                        () -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(
                        () -> new RuntimeException("Course not found"));

        Enrollment enrollment = new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(enrollmentDate);

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getAllEnrollments() {

        return enrollmentRepository.findAll();
    }
}