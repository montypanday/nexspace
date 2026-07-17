"use client";

import { Stage, Layer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { SpawnedElement } from './designer/element';
import { FloorDto, FloorPlanDto, StageElementDto } from "@/features/floors/types";

interface FloorPlanViewProps {
    floor: FloorDto;
    floorPlan: FloorPlanDto;
    elements: StageElementDto[];
    width?: number;
    height?: number;
}

export function FloorPlanView({ floor, floorPlan, elements, height, width }: FloorPlanViewProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) {
            console.log('Container ref is null');
            return;
        }

        const observer = new ResizeObserver(() => {
            if (!containerRef.current) {
                console.log('Container ref is null during resize');
                return;
            }
            const { width, height } = containerRef.current.getBoundingClientRect();
            console.log(`Container resized: width=${width}, height=${height}`);
            setSize({ width, height });
        });

        console.log('Observing container for resize');
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="border rounded-lg overflow-hidden h-screen p-6"
        >
            {elements.length === 0 && <div className="w-full h-full flex items-center justify-center border rounded-lg bg-muted">
                <p className="text-muted-foreground">No elements found</p>
            </div>}

            {elements.length > 0 && <Stage
                className="bg-white"
                height={size.height}
                width={size.width}
            >
                <Layer>
                    {elements.map((item) => (
                        <SpawnedElement
                            key={item.id}
                            {...item}
                            draggable={false}
                            isSelected={false}
                        />
                    ))}
                </Layer>
            </Stage>}
        </div>
    );
}
