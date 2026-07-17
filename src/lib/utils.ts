import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import bcrypt from 'bcryptjs';
import { ElementType } from '@/features/floors/components/designer/element';
import { geoIdentity } from "d3-geo";
import rewind from '@turf/rewind';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, GeometryCollection } from 'geojson';
import { point } from 'leaflet';
import {StageElementDto} from "@/features/floors/types";

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

export function geojsonToElements(
    geojson: FeatureCollection,
    stageWidth: number,
    stageHeight: number
): StageElementDto[] {
    const correctedGeoJson = rewind(geojson, { reverse: true });

    if (correctedGeoJson.type != 'FeatureCollection') {
        return []
    }

    const projection = geoIdentity()
        .reflectY(true)
        .fitSize([stageWidth, stageHeight], correctedGeoJson);

    const elements: StageElementDto[] = [];

    correctedGeoJson.features.forEach((f) => {
        const g = f.geometry;
        const feature_properties: GeoJsonProperties = f.properties;

        if (g.type === "MultiPolygon" && f.properties?.category === 'businesscampus') {
            const polygons = g.coordinates;
            let polygonProjections: { x: number, y: number }[][] = polygons.flatMap((multiPolygoncoordinates) => {
                let result: { x: number, y: number }[][] = []
                for (let polygonCoordinates of multiPolygoncoordinates) {
                    let singlePolygonProjection: { x: number, y: number }[] = []
                    for (let coord of polygonCoordinates) {
                        let polygonProjection = projection([coord[0], coord[1]])
                        if (polygonProjection) {
                            singlePolygonProjection.push({ x: polygonProjection[0], y: polygonProjection[1] })
                        }
                    }
                    result.push(singlePolygonProjection)
                }
                return result
            });
            for (let polygon of polygonProjections) {
                if (polygon) {
                    elements.push({
                        id: crypto.randomUUID(),
                        type: ElementType.Polygon,
                        draggable: true,
                        isSelected: false,
                        attrs: {
                            points: polygon,
                            // fill: "#ddd",
                            // stroke: "#000",
                            // strokeWidth: 1,
                            closed: true,
                            fill: "white",
                            stroke: "black",
                            strokeWidth: 2
                        },
                        feature_properties: feature_properties
                    });
                }
            }

        }

        if (g.type === "Polygon") {
            let result: { x: number, y: number }[][] = []
            for (let polygonCoordinates of g.coordinates) {
                let singlePolygonProjection: { x: number, y: number }[] = []
                for (let coord of polygonCoordinates) {
                    let polygonProjection = projection([coord[0], coord[1]])
                    if (polygonProjection) {
                        singlePolygonProjection.push({ x: polygonProjection[0], y: polygonProjection[1] })
                    }
                }
                result.push(singlePolygonProjection)
            }
            for (let polygon of result) {
                if (polygon) {
                    elements.push({
                        id: crypto.randomUUID(),
                        type: ElementType.Polygon,
                        draggable: true,
                        isSelected: false,
                        attrs: {
                            points: polygon,
                            closed: true,
                            fill: "white",
                            stroke: "black",
                            strokeWidth: 2
                        },
                        feature_properties: feature_properties
                    });
                }
            }
        }

        // if (g.type === "LineString") {
        //     const points = g.coordinates.flatMap((coord) => projection(coord));
        //     console.log(points)
        //     // if (points) {
        //     //     elements.push({
        //     //         id: crypto.randomUUID(),
        //     //         type: ElementType.Line,
        //     //         x: 0,
        //     //         y: 0,
        //     //         draggable: true,
        //     //         isSelected: false,
        //     //         attrs: {
        //     //             points,
        //     //             stroke: "#000",
        //     //             strokeWidth: 1,
        //     //         },
        //     //     });
        //     // }
        // }
    });

    return elements;
}
