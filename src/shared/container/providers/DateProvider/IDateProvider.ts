interface IDateProvider {
    compareInHours(start_date: Date, end_date: Date): Number;
    convertToUTC(date: Date): string;
    dateNow(): Date;
    compareInDays(start_date: Date, end_date: Date): Number;
    addDays(days: number): Date;
    addHours(hours: number): Date;
    compareIfBefore(start_date:Date,end_date:Date): boolean
}

export { IDateProvider };