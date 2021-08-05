export function getValue<T>(key: string, defaultValue: T) {
  if (typeof window === 'undefined') return defaultValue;
  const item = window.localStorage.getItem(key);
  try {
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
}

export function setValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}
