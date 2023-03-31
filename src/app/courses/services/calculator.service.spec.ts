import { any } from "cypress/types/bluebird";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import {TestBed} from '@angular/core/testing';

// fdescribe => focus only that service/ component 
describe('CalculatorService', () => {


    let calculator: CalculatorService;
    let loggerSpy: any


    beforeEach(()=>{
        console.log("calling beforeEach");
        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

        TestBed.configureTestingModule({
            providers:[
                CalculatorService,
                {
                    provide: LoggerService, useValue: loggerSpy
                }
            ]
        });
        // calculator = new CalculatorService(loggerSpy);

        calculator = TestBed.get(CalculatorService);

    })

    it('Should add two numbers', () => {
        // pending();
           /*  
                // actual instance
                const logger = new LoggerService();
                // create fake object
                spyOn(logger,'log');  
            */
        // second way create spy
        // const logger = jasmine.createSpyObj('LoggerService', ["log"]);
        // const calculator = new CalculatorService(logger);
        console.log("add test");
        const result = calculator.add(2,2);
        expect(result).toBe(4);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
        // expect(result).toBe(4, "if fail we can add message here");
        
    });
    // xit => temporary disable
    // fit => focus only that test
    it('Should substract two numbers', () => {
        // pending();
        console.log("substract test");
        const result = calculator.subtract(2,2);
        expect(result).toBe(0);
    });
})