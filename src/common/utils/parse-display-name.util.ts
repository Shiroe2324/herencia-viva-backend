import { USER_DISPLAY_NAME_LENGTH_RANGE } from '@/configs';

const { minLength, maxLength } = USER_DISPLAY_NAME_LENGTH_RANGE;

export function parseDisplayName(displayName: string): string | null {
  let name: string | null = displayName;

  if (name.length < minLength) {
    name = null;
  } else if (name.length > maxLength) {
    name = name.slice(0, maxLength);
  }

  return name;
}
