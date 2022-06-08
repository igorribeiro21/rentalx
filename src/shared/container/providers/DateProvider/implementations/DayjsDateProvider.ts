import { IDateProvider } from "../IDateProvider";
import dayjs from "dayjs";
import uct from 'dayjs/plugin/utc';

dayjs.extend(uct);

class DayjsDateProvider implements IDateProvider {
    compareInHours(start_date: Date, end_date: Date): Number {
        const end_date_utc = this.convertToUTC(end_date);
        const start_date_uct = this.convertToUTC(start_date);

        return dayjs(end_date_utc).diff(start_date_uct, "hours");
    }

    convertToUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    dateNow(): Date {
        return dayjs().toDate();
    }

    compareInDays(start_date: Date, end_date: Date): Number {
        const end_date_utc = this.convertToUTC(end_date);
        const start_date_uct = this.convertToUTC(start_date);

        return dayjs(end_date_utc).diff(start_date_uct, "days");
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hours").toDate();
    }

    compareIfBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date);
    }
}

export { DayjsDateProvider }