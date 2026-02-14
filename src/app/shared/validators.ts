import { resource } from '@angular/core';
import { SchemaPath, validate, validateAsync } from '@angular/forms/signals';

export function isBetween(
  field: SchemaPath<number>,
  min: number,
  max: number,
  options?: { message?: string },
) {
  validate(field, ({ value }) => {
    if (value() === null || value() === undefined) {
      return null;
    }

    if (value() !== null && value() !== undefined) {
      const numValue = Number(value());

      if (numValue < min || numValue > max) {
        return {
          kind: 'isBetween',
          message: options?.message ?? '',
        };
      }
    }
    return null;
  });
}

export function isNumber(field: SchemaPath<string>, options?: { message?: string }) {
  validate(field, ({ value }) => {
    if (value() === null || value() === undefined || value() === '') {
      return null;
    }

    const isNumeric = !isNaN(Number(value())) && isFinite(Number(value()));
    if (!isNumeric) {
      return {
        kind: 'isNumber',
        message: options?.message,
      };
    }

    return null;
  });
}

export function confirmValue(
  field: SchemaPath<string>,
  confirmField: SchemaPath<string>,
  options?: { message: string },
) {
  validate(confirmField, ({ value, stateOf }) => {
    const confirmFieldItem = value();
    const fieldItemState = stateOf(field);
    const fieldItem = fieldItemState.value();

    if (confirmFieldItem !== fieldItem) {
      return {
        kind: 'confirmValue',
        message: options?.message ?? '',
      };
    }

    return null;
  });
}

export function url(field: SchemaPath<string>, min: number, options?: { message?: string }) {
  validate(field, ({ value }) => {
    console.log('min', min);
    try {
      new URL(value());
      return null;
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL',
      };
    }
  });
}

export function fromToday(field: SchemaPath<string>, options?: { message: string }) {
  validate(field, ({ value }) => {
    const now = `${getDateObj().year}-${getDateObj().month}-${getDateObj().day}`;
    const nowTstamp = new Date(now).getTime();
    const dateTtamp = new Date(value()).getTime();

    if (dateTtamp - nowTstamp <= 0) {
      return {
        kind: 'fromToday',
        message: options?.message ?? '',
      };
    }
    return null;
  });
}

export function startAfterEndDate(
  endDateField: SchemaPath<string>,
  startDateField: SchemaPath<string>,
  options?: { message: string },
) {
  validate(endDateField, ({ value, stateOf }) => {
    const endDate = value();
    const startDateState = stateOf(startDateField);
    const startDate = startDateState.value();

    if (startDateState.valid() && endDate < startDate) {
      return {
        kind: 'dateRange',
        message: options?.message ?? 'Das Enddatum muss nach dem Startdatum liegen',
      };
    }

    return null;
  });
}

// service Date
type T_Date = { year: string; month: string; day: string };
function getDateObj(current: boolean = true): T_Date {
  let dateObj: T_Date = {
    year: '0'.padStart(4, '0'),
    month: '0'.padStart(2, '0'),
    day: '0'.padStart(2, '0'),
  };
  if (current) {
    const date = new Date();
    dateObj.year = date.getFullYear().toString();
    dateObj.month = (date.getMonth() + 1).toString().padStart(2, '0');
    dateObj.day = date.getDate().toString().padStart(2, '0');
  }
  return dateObj;
}

// async
export function usernameExists(field: SchemaPath<string>, options?: { message?: string }) {
  validateAsync(field, {
    params: ({ value }) => value(),
    factory: (params) =>
      resource({
        params,
        loader: async ({ params }) => {
          // Simulate API call
          console.log('params', params);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return { taken: params === 'admin' };
        },
      }),
    onSuccess: (result) => {
      if (result.taken) {
        return {
          kind: 'usernameTaken',
          message: 'Username is already taken',
        };
      }
      return null;
    },
    onError: (error) => ({
      kind: 'networkError',
      message: 'Could not verify username availability',
    }),
  });
}
