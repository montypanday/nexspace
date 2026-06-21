"use client"

import { Stage, Layer, Rect, Circle, Text, KonvaNodeEvents, Transformer } from 'react-konva';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import Konva from 'konva';
import React, { useRef, useState } from 'react';
import { Palette } from './palette';
import { Vector2d } from 'konva/lib/types';
import { ElementProps, SpawnedElement } from './element';

export function Designer() {
    const stageRef = useRef<Konva.Stage>(null);
    const [elements, setElements] = useState<ElementProps[]>([]); // store all elements, add to view on drop
    // const [selectedId, selectShape] = React.useState(null);
    const [draggedType, setDraggedType] = useState<string | null>(null);
    // const checkDeselect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    //     console.log('checkDeselect')
    //     // deselect when clicked on empty area
    //     const clickedOnEmpty = evt.target === evt.target.getStage();
    //     if (clickedOnEmpty) {
    //         selectShape(null);
    //     }
    // };

    // 1. Capture the type of element being dragged
    const handleDragStart = (type: string) => {
        setDraggedType(type);
    };

    // 2. Allow the canvas to accept the drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // 3. Handle the drop, calculate coordinates, and add to state
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedType) { return }
        if (stageRef.current) {
            // Register the pointer position manually since this is a DOM event
            stageRef.current.setPointersPositions(e);
            const position: Vector2d | null = stageRef.current.getPointerPosition();

            if (position && draggedType) {
                const newElement = {
                    id: crypto.randomUUID(), // Unique ID
                    type: draggedType,
                    x: position.x,
                    y: position.y,
                    draggble: true
                };
                setElements((prev) => [...prev, newElement]);
            }
        }

    };

    const handleSelect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        // setSelectedId(id);

        // 2. You can also directly reference the Konva node using e.target
        const konvaNode = evt.target;
        console.log(evt)
        console.log('Selected Konva Node:', konvaNode);
    };
    return <>
        <div className='flex h-screen w-screen overflow-hidden'>
            <div className='flex-none'>
                <Palette handleDragStart={handleDragStart} />
            </div>
            <div className='flex-1 max-w-svh'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    // onMouseDown={checkDeselect}
                    ref={stageRef}
                    style={{ border: '1px solid #000' }}
                >
                    <Layer>
                        {elements.map((item) => (
                            <SpawnedElement key={item.id} {...item} />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <div className='flex-none'>

            </div>
        </div>
    </>
}