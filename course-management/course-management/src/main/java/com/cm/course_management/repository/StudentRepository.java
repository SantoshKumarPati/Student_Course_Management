package com.cm.course_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cm.course_management.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}