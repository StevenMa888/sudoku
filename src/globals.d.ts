interface Array<T> {
    countOf(value: number): number;
    reduceArray():T[];
    max(): Array<number>;
    equals(array: Array<any>): boolean; 
}