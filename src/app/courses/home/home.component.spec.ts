import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let courseServiceSpy: any;
  let courseService: any;
  let beginnerCourse = setupCourses().filter(course => course.category === 'BEGINNER');
  let advanceCourse = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(async () => {
    courseServiceSpy = jasmine.createSpyObj('CoursesService', ["findAllCourses"]);
    await TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule],
      providers: [
        {
          provide: CoursesService,
          useValue: courseServiceSpy
        }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    courseService = TestBed.get(CoursesService);
  });

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    courseService.findAllCourses.and.returnValue(of(beginnerCourse));
    fixture.detectChanges();
    const tab = el.queryAll(By.css(".mdc-tab--active"));
    expect(tab.length).toBe(1, "Unexpected number of tabs found");
    expect(tab[0].nativeElement.textContent).toBe('Beginners');
  });


  it("should display only advanced courses", () => {
    courseService.findAllCourses.and.returnValue(of(advanceCourse));
    fixture.detectChanges();
    const tab = el.queryAll(By.css(".mdc-tab--active"));
    expect(tab.length).toBe(1, "Unexpected number of tabs found");
    expect(tab[0].nativeElement.textContent).toBe('Advanced');

  });

  it("should display both tabs", () => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css(".mdc-tab"));
    expect(tab.length).toBe(2, "Unexpected number of tabs found");
    expect(tab[0].nativeElement.textContent).toBe('Beginners');
    expect(tab[1].nativeElement.textContent).toBe('Advanced');

  });


  it("should display advanced courses when tab clicked", (done: DoneFn) => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css(".mdc-tab"));
    click(tab[1]);
    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = el.queryAll(By.css("mat-card-title"));
      expect(cardTitles.length).toBeGreaterThan(0, "Unexpected number of tabs found");
      // expect(cardTitles[0].nativeElement.textContent).toBe("Angular Security Course");
      done();
    }, 500);

  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css(".mdc-tab"));
    click(tab[1]);
    fixture.detectChanges();
    flush();
    const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
    expect(cardTitles.length).toBeGreaterThan(0, "Unexpected number of tabs found");
    // expect(cardTitles[0].nativeElement.textContent).toBe("Angular Security Course");
  }));

  it("should display advanced courses when tab clicked - async ", waitForAsync(() => {
    courseService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tab = el.queryAll(By.css(".mdc-tab"));
    click(tab[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      console.log("called whenStable()");
      const cardTitles = el.queryAll(By.css(".mat-mdc-card-title"));
      expect(cardTitles.length).toBeGreaterThan(0, "Unexpected number of tabs found");
      // expect(cardTitles[0].nativeElement.textContent).toBe("Angular Security Course");
    })
  }));

});


