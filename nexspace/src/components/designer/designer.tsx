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
import { ElementProps, ElementType, getElementDefaultAttrs, SpawnedElement } from './element';

export function Designer() {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const [elements, setElements] = useState<ElementProps[]>([]); // store all elements, add to view on drop
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
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
                const defaultAttrs = getElementDefaultAttrs(draggedType)
                const newElement = {
                    id: crypto.randomUUID(), // Unique ID
                    type: draggedType,
                    x: position.x,
                    y: position.y,
                    draggable: true,
                    attrs: defaultAttrs,
                    isSelected: false
                };
                setElements((prev) => [...prev, newElement]);
                setSelectedIds([newElement.id])
            }
        }

    };

    const handleSelect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        // Click on shape -> Toggle selection
        console.log(evt.target)
        const id = evt.target.id();
        console.log(id)
        if (id) {
            if (evt.evt.shiftKey) {
                setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
            } else {
                setSelectedIds([id]);
            }
        }
    }

    const handleDeselect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = evt.target === evt.target.getStage();
        if (clickedOnEmpty) {
            setSelectedIds([]);
        }
    };

    useEffect(() => {
        // Imperatively attach the transformer to the selected node
        const stage = stageRef.current;
        const tr = transformerRef.current;

        if (selectedIds && tr && stage && tr.getLayer()) {
            const nodes = selectedIds.map((id) => stage.findOne(`#${id}`))
                .filter((node): node is Konva.Node => node !== undefined);;
            console.log('SelectedNode: ', nodes)
            if (nodes) {
                tr.nodes(nodes);
                tr.getLayer()?.batchDraw();
            }
        } else if (tr) {
            tr.nodes([]);
            tr.getLayer()?.batchDraw();
        }
    }, [selectedIds]);

    // Combined helper logic to prevent code duplication
    const updateElementState = (shapeId: string, node: Konva.Node) => {
        setElements((prevElements) =>
            prevElements.map((element) => {
                // FIXED: Changed '=' to '==='
                if (element.id === shapeId) {
                    return {
                        ...element,
                        x: node.x(),
                        y: node.y(),
                        attrs: {
                            ...element.attrs,
                            ...node.getAttrs(), // Saves updated scaleX, scaleY, rotation, etc.
                        }
                    };
                }
                return element;
            })
        );
    };

    const handleTransformation = (evt: Konva.KonvaEventObject<Event>) => {
        const node = evt.target;
        updateElementState(node.id(), node);
    };

    // FIXED: Corrected signature to match Konva's expected event argument
    const handleDragEnd = (evt: Konva.KonvaEventObject<DragEvent>) => {
        const node = evt.target;
        updateElementState(node.id(), node);
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
                    onMouseDown={handleDeselect}
                    ref={stageRef}
                    style={{ border: '1px solid #000' }}
                >
                    <Layer>
                        {elements.map((item) => {
                            if (item.type === ElementType.Polygon) {
                                return <SpawnedElement
                                    key={item.id}
                                    {...item}
                                    isSelected={selectedIds.includes(item.id)}
                                    onClick={handleSelect}
                                    onDragEnd={handleDragEnd}
                                    onChangeAttrs={(id, newAttrs) => {
                                        setElements((prev) =>
                                            prev.map((el) =>
                                                el.id === id ? { ...el, attrs: newAttrs } : el
                                            )
                                        )
                                    }}
                                />
                            }
                            return <SpawnedElement
                                key={item.id}
                                {...item}
                                isSelected={selectedIds.includes(item.id)}
                                onClick={handleSelect}
                                onTransformEnd={handleTransformation}
                                onDragEnd={handleDragEnd}
                            />
                        })}
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