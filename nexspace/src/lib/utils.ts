import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';

export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}