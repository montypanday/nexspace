"use client"

import { Stage, Layer, Rect, Circle, Text, KonvaNodeEvents, Transformer } from 'react-konva';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import { Palette } from './palette';
import { Vector2d } from 'konva/lib/types';
import { ElementProps, SpawnedElement } from './element';

export function Designer() {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const [elements, setElements] = useState<ElementProps[]>([]); // store all elements, add to view on drop
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [draggedType, setDraggedType] = useState<string | null>(null);

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
                    draggable: true,
                    isSelected: true,
                };
                setElements((prev) => [...prev, newElement]);
                setSelectedId(newElement.id)
            }
        }

    };

    const handleDeselect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = evt.target === evt.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(null);
        }
    };

    useEffect(() => {
        // Imperatively attach the transformer to the selected node
        const stage = stageRef.current;
        const tr = transformerRef.current;

        if (selectedId && tr && stage && tr.getLayer()) {
            console.log('Finding selected node:', `#${selectedId}`)
            const selectedNode = stage.findOne(`#${selectedId}`);
            console.log('SelectedNode: ', selectedNode)
            if (selectedNode) {
                console.log('Setting Selected node on transformer:', selectedNode)
                tr.nodes([selectedNode]);
                tr.getLayer()?.batchDraw();
            }
        } else if (tr) {
            console.log('Nothing is selected', selectedId)
            tr.nodes([]);
            tr.getLayer()?.batchDraw();
        }
    }, [selectedId]);

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
                    onMouseDown={handleDeselect}
                    ref={stageRef}
                    style={{ border: '1px solid #000' }}
                >
                    <Layer>
                        {elements.map((item) => (
                            <SpawnedElement key={item.id} {...item} isSelected={item.id === selectedId} onClick={(evt) => setSelectedId(item.id)} />
                        ))}
                        {/* The Transformer overlay handles scaling and rotation bounds */}
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                // Prevent sizing the shape down to 0 pixels
                                if (newBox.width < 5 || newBox.height < 5) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    </Layer>
                </Stage>
            </div>
            <div className='flex-none'>

            </div>
        </div>
    </>
}