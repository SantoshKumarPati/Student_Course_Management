package com.cm.course_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cm.course_management.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}