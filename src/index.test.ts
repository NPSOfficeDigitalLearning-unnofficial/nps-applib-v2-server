import { exampleFunction } from ".";

test("test exampleFunction",()=>{
    expect(exampleFunction(4)).toBe(5);
    expect(exampleFunction(8)).toBe(9);
    expect(exampleFunction(487)).toBe(488);
});