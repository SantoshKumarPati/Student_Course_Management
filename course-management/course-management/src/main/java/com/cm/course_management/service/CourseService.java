package com.cm.course_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cm.course_management.entity.Course;
import com.cm.course_management.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {

        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {

        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course addCourse(Course course) {

        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course course) {

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        existingCourse.setCourseName(course.getCourseName());
        existingCourse.setDuration(course.getDuration());

        return courseRepository.save(existingCourse);
    }

    public void deleteCourse(Long id) {

        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found");
        }

        courseRepository.deleteById(id);
    }
}