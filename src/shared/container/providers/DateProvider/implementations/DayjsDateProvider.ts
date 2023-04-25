/* eslint-disable import/no-extraneous-dependencies */
import dayjs from "dayjs";

import { IDateProvider } from "../IDateProvider";

export class DayjsDateProvider implements IDateProvider {
    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }
}
