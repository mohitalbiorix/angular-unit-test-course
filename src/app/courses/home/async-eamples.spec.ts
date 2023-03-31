import { fakeAsync, flush, tick, flushMicrotasks } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/internal/operators/delay";

describe("Async Testing Example", () => {

    it("Asynchronous example with jasmin done", (done: DoneFn) => {
        let test = false;
        setTimeout(() => {
            console.log("running assertion");
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000)
    });

    it("Asynchronous test example - setTimeOut()", fakeAsync(() => {
        let test = false;
        setTimeout(() => {
            console.log("running assertion - setTimeOut()");
            test = true;
            // expect(test).toBeTruthy();
        }, 500);

        setTimeout(() => { }, 800);

        /*  
             tick(500); // wait on specific time
             tick(300); 
         */

        flush(); // wait for all the time
        expect(test).toBeTruthy();
    }));

    it("Asynchronous test example-plain Promise", fakeAsync(() => {

        let test = false;
        console.log("Creating promise");

        // setTimeout is in maintask in event loop so run after promise
        setTimeout(() => {
            console.log("setTimeout first callback() triggered.")
        });

        setTimeout(() => {
            console.log("setTimeout second callback() triggered.")
        });

        // promise is in microtask  in event loop so run before setTimeout
        Promise.resolve().then(() => {
            console.log("Promise first then() evaluted successfully");
        }).then(() => {
            console.log("Promise second then() evaluted successfully");
            test = true;
        });

        flush() // for setTimeout 
        flushMicrotasks(); // for run promise before run expected code

        console.log("Running test assertions");
        expect(test).toBeTruthy();

    }));

    it("Asynchronous test example-Promise + setTimeout()", fakeAsync(() => {
        let counter = 0;
        Promise.resolve().then(() => {
            counter += 10;

            setTimeout(() => {
                counter += 1;
            }, 1000);

        });

        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        flush();
        expect(counter).toBe(11);
    }));

    it("Asynchronous test example - Observables", fakeAsync(() => {
        let test = false;
        console.log("Creating Observable");

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });
        tick(1000);
        console.log("Running test assertions");
        expect(test).toBeTruthy();
    }));

})