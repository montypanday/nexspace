"use client"

import { Stage, Layer, Rect, Circle, Text, KonvaNodeEvents, Transformer } from 'react-konva';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import Konva from 'konva';
import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { Palette } from './palette';
import { Vector2d } from 'konva/lib/types';
import { ElementProps, ElementType, getElementDefaultAttrs, SpawnedElement } from './element';
import { geojsonToElements } from '@/lib/utils';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ObjectView } from "react-obj-view";

export function Designer() {

    const [elements, setElements] = useState<ElementProps[]>([]); // store all elements, add to view on drop
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [draggedType, setDraggedType] = useState<string | null>(null);
    const [geoFile, setGeoFile] = useState<File | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const history = useRef<ElementProps[][]>([])
    const historyStep = React.useRef(0);
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);


    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(() => {
            const { width, height } = containerRef.current!.getBoundingClientRect();
            setSize({ width, height });
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // 1. Capture the type of element being dragged
    const handleDragStart = (type: string) => {
        console.log('Handle Drag Start', type)
        setDraggedType(type);
    };

    // 2. Allow the canvas to accept the drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // 3. Handle the drop, calculate coordinates, and add to state
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('Handling object drop')
        e.preventDefault();
        if (!draggedType) { return }
        if (stageRef.current) {
            // Register the pointer position manually since this is a DOM event
            stageRef.current.setPointersPositions(e);
            const position: Vector2d | null = stageRef.current.getPointerPosition();

            if (position && draggedType) {
                const defaultAttrs = getElementDefaultAttrs(draggedType)
                const attributes = {
                    ...defaultAttrs,
                    x: position.x,
                    y: position.y
                }
                const newElement = {
                    id: crypto.randomUUID(), // Unique ID
                    type: draggedType,
                    draggable: true,
                    attrs: attributes,
                    isSelected: false
                };
                console.log('Created new element', newElement)
                handleElementsChange([...elements, newElement])
                setElements((prev) => [...prev, newElement]);
                setSelectedIds([newElement.id])
            }
        }

    };

    const handleSelect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        // Click on shape -> Toggle selection
        console.log('Handle select event target', evt.currentTarget)
        const id = evt.currentTarget.id();
        console.log('Handle select event target id', id)
        if (id) {
            if (evt.evt.shiftKey) {
                setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
            } else {
                setSelectedIds([id]);
            }
        }
    }

    const handleDeselect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        console.log("Handle Deselect")
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
                .filter((node): node is Konva.Node => node !== undefined);
            console.log('Use Effect SelectedNode: ', nodes)
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
        const newElements = elements.map((element) => {
            // FIXED: Changed '=' to '==='
            if (element.id === shapeId) {
                return {
                    ...element,
                    attrs: {
                        ...element.attrs,
                        ...node.getAttrs(), // Saves updated scaleX, scaleY, rotation, etc.
                    }
                };
            }
            return element;
        });
        handleElementsChange(newElements)
        setElements((prevElements) => newElements);
    };

    const handleTransformation = (evt: Konva.KonvaEventObject<Event>) => {
        const node = evt.target;
        console.log('Handle Transformation', node.id(), node)
        updateElementState(node.id(), node);
    };

    // FIXED: Corrected signature to match Konva's expected event argument
    const handleDragEnd = (evt: Konva.KonvaEventObject<DragEvent>) => {
        const node = evt.target;
        console.log('Handle Transformation', node.id(), node)
        updateElementState(node.id(), node);
    };

    const handleLoadGeoJSON = async (file: File) => {
        const text = await file.text();
        const geojson = JSON.parse(text);

        const stage = stageRef.current;
        if (!stage) return;

        const newEls = geojsonToElements(
            geojson,
            stage.width(),
            stage.height()
        );
        handleElementsChange([...elements, ...newEls])
        setElements((prev) => [...prev, ...newEls]);
    };

    const handleElementsChange = (elements: ElementProps[]) => {
        history.current = history.current.slice(0, historyStep.current + 1);
        history.current = history.current.concat([elements]);
        historyStep.current += 1;
    }

    const handleUndo = () => {
        if (historyStep.current === 0) {
            return;
        }
        historyStep.current -= 1;
        const previous = history.current[historyStep.current];
        console.log('Previous elements', previous)
        setElements(previous);
    };

    const handleRedo = () => {
        if (historyStep.current === history.current.length - 1) {
            return;
        }
        historyStep.current += 1;
        const next = history.current[historyStep.current];
        console.log('Next elements', next)
        setElements(next);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        console.log('handleKeyDown')
        console.log(event);

        if (selectedIds.length == 0) {
            return
        }
        if (event.key === 'Backspace' || event.key == 'Delete') {
            const newElements = elements.filter((value) => !selectedIds.includes(value.id))
            handleElementsChange(newElements)
            setSelectedIds([])
            setElements(newElements);
        }
    };

    return <>
        <div className="flex w-full h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background">
            <aside className="w-64 border-r bg-background p-4 flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Palette</h2>
                <Palette handleDragStart={handleDragStart} />
                <Separator />
                <form onSubmit={async (e: React.SubmitEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (!geoFile) return;

                    const text = await geoFile.text();
                    const json = JSON.parse(text);

                    if (json.type !== "FeatureCollection") {
                        console.error("Invalid GeoJSON: must be a FeatureCollection");
                        return;
                    }

                    await handleLoadGeoJSON(geoFile);
                }
                }>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="geojson-import">Import GeoJson</FieldLabel>
                            <Input
                                id="geojson-import"
                                type="file"
                                required={true}
                                // accept=".json,.geojson"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setGeoFile(file);
                                }}
                            />
                            <FieldDescription>Select a GeoJson to upload. Must be a FeatureCollection</FieldDescription>
                        </Field>
                        <Button type="submit">Import features</Button>
                    </FieldGroup>
                </form>
            </aside>
            <main
                className="flex-1 relative bg-white dark:bg-neutral-900"
            >
                <div className="absolute top-0 left-0 right-0 h-12 border-b flex items-center px-4 gap-3 z-20 bg-background/80 backdrop-blur">
                    <Button variant="outline" size="sm">Zoom In</Button>
                    <Button variant="outline" size="sm">Zoom Out</Button>
                    <Button variant="outline" size="sm">Reset</Button>

                    <div className="ml-auto flex gap-2">
                        <Button variant="outline" onClick={handleUndo} size="sm">Undo</Button>
                        <Button variant="outline" onClick={handleRedo} size="sm">Redo</Button>
                    </div>
                </div>
                <div className="absolute inset-0 top-12"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    tabIndex={1}
                    onKeyDown={handleKeyDown}
                    ref={containerRef}
                >
                    <Stage
                        width={size.width}
                        height={size.height}
                        onMouseDown={handleDeselect}
                        ref={stageRef}
                        className="bg-white"
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
                                        onTransformEnd={handleTransformation}
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
            </main>
            <aside className="w-72 border-l bg-background p-4 flex flex-col gap-4 overflow-auto scroll-smooth">
                <h2 className="text-lg font-semibold">Inspector</h2>
                {selectedIds.length === 1 ? (
                    <div className="space-y-4">
                        <Label>Selected Element</Label>
                        <Input value={selectedIds[0]} disabled />

                        {/* Add dynamic controls here */}
                        {elements.map((element) => {
                            if (selectedIds.includes(element.id)) {

                            }
                            return null
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Select a single element to edit its properties.
                    </p>
                )}
                {elements
                    .filter(el => selectedIds.includes(el.id))
                    .map(el => (
                        <div key={el.id} className="space-y-4">
                            <h3 className="font-semibold text-lg">{el.type}</h3>
                            <div className="flex w-full max-w-sm flex-col gap-2 text-sm">
                                {Object.entries(el.attrs).map(([key, value], index) => {
                                    // Skip points — they need a custom editor
                                    if (key === "points") {
                                        return null
                                    }

                                    return (
                                        <dl key={index} className="flex items-center justify-between">
                                            <dt>{key}</dt>
                                            <dd className="text-muted-foreground">{String(value)}</dd>
                                        </dl>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                {elements
                    .filter(el => selectedIds.includes(el.id))
                    .map(el => (
                        <div key={el.id} className="space-y-4">
                            {/* <ObjectView
                                valueGetter={() => el}
                                name="elements"
                                expandLevel={2}
                                preview
                            /> */}
                        </div>
                    ))}

                <Separator />
            </aside>
        </div>
    </>
}