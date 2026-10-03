package com.cm.course_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cm.course_management.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

}