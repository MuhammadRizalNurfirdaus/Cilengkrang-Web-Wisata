export class RequestError extends Error {
    status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.name = "RequestError";
        this.status = status;
    }
}

export function parsePositiveInt(value: string, fieldName = "ID"): number {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isSafeInteger(parsed) || parsed < 1) {
        throw new RequestError(`${fieldName} tidak valid`, 400);
    }

    return parsed;
}

export function parseDateOnly(value: string, fieldName = "Tanggal"): Date {
    const trimmedValue = value.trim();
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);

    if (dateOnlyMatch) {
        const year = Number.parseInt(dateOnlyMatch[1] ?? "", 10);
        const month = Number.parseInt(dateOnlyMatch[2] ?? "", 10);
        const day = Number.parseInt(dateOnlyMatch[3] ?? "", 10);
        const normalizedDate = new Date(Date.UTC(year, month - 1, day));

        if (
            normalizedDate.getUTCFullYear() !== year ||
            normalizedDate.getUTCMonth() !== month - 1 ||
            normalizedDate.getUTCDate() !== day
        ) {
            throw new RequestError(`${fieldName} tidak valid`, 400);
        }

        return normalizedDate;
    }

    const parsedDate = new Date(trimmedValue);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new RequestError(`${fieldName} tidak valid`, 400);
    }

    return new Date(
        Date.UTC(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate()
        )
    );
}
