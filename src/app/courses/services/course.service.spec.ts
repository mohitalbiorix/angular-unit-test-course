import { CoursesService } from "./courses.service"
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { environment } from "../../../environments/environment";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
    let courseService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });
        courseService = TestBed.get(CoursesService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should retrive all courses', () => {
        courseService.findAllCourses().subscribe(
            courses => {
                expect(courses).toBeTruthy('No course returned');
                expect(courses.length).toBe(12, "incorrect number of course length");
                const course = courses.find(course => course.id === 12);
                expect(course.titles.description).toBe("Angular Testing Course");
            });

        const req = httpTestingController.expectOne(`${environment.baseURL}/api/courses`);
        expect(req.request.method).toEqual("GET");
        // get data, so testing inside part of subscribe
        req.flush({ payload: Object.values(COURSES) });

    });

    it('should retrive data based on id', () => {
        courseService.findCourseById(12).subscribe(
            courses => {
                expect(courses).toBeTruthy();
                expect(courses.id).toBe(12);
            });

        const req = httpTestingController.expectOne(`${environment.baseURL}/api/courses/12`);
        expect(req.request.method).toEqual("GET");
        req.flush(COURSES[12]);
    });

    it('should save the course data', () => {
        const courseBody: Partial<Course> = {
            titles: {
                description: 'Testing course'
            }
        };
        courseService.saveCourse(12, courseBody).subscribe(
            course => {
                expect(course.id).toBe(12);
            }
        );
        const req = httpTestingController.expectOne(`${environment.baseURL}/api/courses/12`);
        expect(req.request.method).toBe("PUT");
        expect(req.request.body.titles.description).toBe(courseBody.titles.description);
        req.flush({
            ...COURSES[12],
            ...courseBody
        })

    });

    it('should give an error if some test course fail', () => {
        const courseBody: Partial<Course> = {
            titles: {
                description: 'Testing course'
            }
        };

        courseService.saveCourse(12, courseBody).subscribe(
            () => fail("the save course operation should have failed"),
            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );

        const req = httpTestingController.expectOne(`${environment.baseURL}/api/courses/12`);
        expect(req.request.method).toEqual("PUT");
        req.flush('Save course failed', { status: 500, statusText: "Internal Server Error" })

    });

    it('should find a list of lessons', () => {
        courseService.findLessons(12).subscribe(
            lessons => {
                expect(lessons).toBeTruthy('NO records found');
                expect(lessons.length).toBe(3);
            });

        const req = httpTestingController.expectOne(req => req.url == `${environment.baseURL}/api/lessons`);
        expect(req.request.method).toEqual("GET");
        expect(req.request.params.get("courseId")).toEqual("12");
        expect(req.request.params.get("filter")).toEqual("");
        expect(req.request.params.get("sortOrder")).toEqual("asc");
        expect(req.request.params.get("pageNumber")).toEqual("0");
        expect(req.request.params.get("pageSize")).toEqual("3");

        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        })
    });

    afterEach(() => {
        httpTestingController.verify();
    })
})