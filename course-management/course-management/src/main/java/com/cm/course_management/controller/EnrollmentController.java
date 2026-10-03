package com.cm.course_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cm.course_management.entity.Enrollment;
import com.cm.course_management.service.EnrollmentService;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public Enrollment enrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestParam String enrollmentDate) {

        return enrollmentService.enrollStudent(
                studentId,
                courseId,
                enrollmentDate
        );
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
}