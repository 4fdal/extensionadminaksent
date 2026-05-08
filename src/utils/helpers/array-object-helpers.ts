/**
 * Common Array and Object Utility Functions
 * Reusable helpers for common data manipulation operations
 */

/**
 * Safely get nested object value
 * Usage: getNestedValue(obj, 'user.profile.name')
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
};

/**
 * Filter out null/undefined values from array
 */
export const filterEmpty = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item !== null && item !== undefined);
};

/**
 * Group array by property
 * Usage: groupBy(users, 'status') => { active: [...], inactive: [...] }
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by property
 * Usage: sortBy(users, 'name', 'asc')
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  const sorted = [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Remove duplicates from array by property
 * Usage: uniqueBy(users, 'id')
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set<any>();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Map and flatten array (flatMap)
 */
export const mapFlat = <T, U>(array: T[], mapper: (item: T) => U[]): U[] => {
  return array.flatMap(mapper);
};

/**
 * Create object from array of key-value pairs
 */
export const fromEntries = <T>(entries: [string, T][]): Record<string, T> => {
  return Object.fromEntries(entries) as Record<string, T>;
};

/**
 * Create array from object entries
 */
export const toEntries = <T extends Record<string, any>>(obj: T): [keyof T, any][] => {
  return Object.entries(obj) as [keyof T, any][];
};

/**
 * Pick specific properties from object
 * Usage: pick(user, ['id', 'name'])
 */
export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};

/**
 * Omit specific properties from object
 * Usage: omit(user, ['password', 'token'])
 */
export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
};

/**
 * Merge two objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(
  obj1: T,
  obj2: Partial<T>
): T => {
  const result = { ...obj1 };

  Object.keys(obj2).forEach((key) => {
    const value2 = (obj2 as any)[key];
    const value1 = result[key];

    if (typeof value1 === "object" && typeof value2 === "object" && !Array.isArray(value1)) {
      result[key as keyof T] = deepMerge(value1, value2);
    } else {
      result[key as keyof T] = value2;
    }
  });

  return result;
};
