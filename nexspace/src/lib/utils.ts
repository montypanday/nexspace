import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';
import { PlaceFeature } from '@/components/ui/place-autocomplete';

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

interface PlaceFeatureProperties {
  osm_id: number
  osm_type: "N" | "W" | "R"
  osm_key: string
  osm_value: string
  type: string
  name?: string
  housenumber?: string
  street?: string
  locality?: string
  district?: string
  postcode?: string
  city?: string
  county?: string
  state?: string
  country?: string
  countrycode?: string
  extent?: [number, number, number, number]
  extra?: Record<string, string>
}

export function formatAddress(properties: PlaceFeatureProperties) {
  const parts = []

  if (properties.name) {
    parts.push(properties.name)
  }

  if (properties.housenumber && properties.street) {
    parts.push(`${properties.housenumber} ${properties.street}`)
  } else if (properties.street) {
    parts.push(properties.street)
  }

  if (properties.city) {
    parts.push(properties.city)
  } else if (properties.locality) {
    parts.push(properties.locality)
  }

  if (properties.state && properties.state !== properties.city) {
    parts.push(properties.state)
  }

  if (properties.country) {
    parts.push(properties.country)
  }

  return [...new Set(parts)].join(", ")
}

// Helper function to find the mathematical distance from a point to a line segment
export const getDistanceToSegment = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return {
    distance: Math.sqrt(dx * dx + dy * dy),
    x: xx,
    y: yy
  };
};