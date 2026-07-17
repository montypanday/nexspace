"use client"

import { Stage, Layer, Transformer } from 'react-konva';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

import Konva from 'konva';
import React, { KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Palette } from './palette';
import { Vector2d } from 'konva/lib/types';
import { ElementType, getElementDefaultAttrs, SpawnedElement } from './element';
import { geojsonToElements } from '@/lib/utils';

import { saveFloorPlanAction } from '@/features/floors/server/actions';
import {StageElementDto} from "@/features/floors/types";
import {getFloorPlan} from "@/features/floors/server/queries";
import {toFloorPlanElementDto, toStageElementDto} from "@/features/floors/mappers";

interface DesignerProps {
    floorId: string;
    floorPlanId: string;
    initialElements: StageElementDto[];
}

export function Designer({ floorId, floorPlanId, initialElements }: DesignerProps) {

    const [elements, setElements] = useState<StageElementDto[]>(initialElements); // store all elements, add to view on drop
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [draggedType, setDraggedType] = useState<string | null>(null);
    const [geoFile, setGeoFile] = useState<File | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const history = useRef<StageElementDto[][]>([initialElements]);
    const historyStep = useRef(0);
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    const selectedElements = useMemo(
        () => elements.filter((element) => selectedIds.includes(element.id)),
        [elements, selectedIds]
    );

    const commitElements = useCallback((nextElements: StageElementDto[]) => {
        history.current = history.current.slice(0, historyStep.current + 1);
        history.current = [...history.current, nextElements];
        historyStep.current = history.current.length - 1;
        setElements(nextElements);
    }, []);

    const updateElements = useCallback((updater: (previous: StageElementDto[]) => StageElementDto[]) => {
        setElements((previous) => {
            const nextElements = updater(previous);

            history.current = history.current.slice(0, historyStep.current + 1);
            history.current = [...history.current, nextElements];
            historyStep.current = history.current.length - 1;

            return nextElements;
        });
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(() => {
            const { width, height } = containerRef.current!.getBoundingClientRect();
            setSize({ width, height });
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleSave = useCallback(async () => {
        if (!floorPlanId) {
            setSaveMessage("No floor plan ID provided");
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const result = await saveFloorPlanAction({
                floorPlanId: floorPlanId,
                floorId: floorId,
                elements: elements.map((el) => toFloorPlanElementDto(el)).filter((el) => el !== null)
            });

            if (result.success) {
                setSaveMessage(`✓ Saved ${result.data.elements.length} elements`);
                setTimeout(() => setSaveMessage(null), 3000);
            } else {
                setSaveMessage(`✗ ${result.error}`);
            }
        } catch (error: any) {
            setSaveMessage(`✗ Failed to save: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    }, [floorPlanId, elements]);

    const handleDragStart = (type: string) => {
        setDraggedType(type);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const stage = stageRef.current;
        if (!draggedType || !stage) return;

        // Register the pointer position manually since this is a DOM event.
        stage.setPointersPositions(e);

        const position: Vector2d | null = stage.getPointerPosition();
        if (!position) return;

        const newElement: StageElementDto = {
            id: crypto.randomUUID(),
            type: draggedType,
            draggable: true,
            attrs: {
                ...getElementDefaultAttrs(draggedType),
                x: position.x,
                y: position.y,
            },
            isSelected: false,
        };

        updateElements((previous) => [...previous, newElement]);
        setSelectedIds([newElement.id]);
        setDraggedType(null);
    };

    const handleSelect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        const id = evt.currentTarget.id();
        if (!id) return;

        if (evt.evt.shiftKey) {
            setSelectedIds((previous) =>
                previous.includes(id)
                    ? previous.filter((selectedId) => selectedId !== id)
                    : [...previous, id]
            );
            return;
        }

        setSelectedIds([id]);
    };

    const handleDeselect = (evt: Konva.KonvaEventObject<MouseEvent>) => {
        const clickedOnEmpty = evt.target === evt.target.getStage();

        if (clickedOnEmpty) {
            setSelectedIds([]);
        }
    };

    useEffect(() => {
        const stage = stageRef.current;
        const transformer = transformerRef.current;

        if (!transformer || !stage) return;

        const nodes = selectedIds
            .map((id) => stage.findOne(`#${id}`))
            .filter((node): node is Konva.Node => node !== undefined);

        transformer.nodes(nodes);
        transformer.getLayer()?.batchDraw();
    }, [selectedIds]);

    const updateElementState = useCallback((shapeId: string, node: Konva.Node) => {
        updateElements((previous) =>
            previous.map((element) => {
                if (element.id !== shapeId) return element;

                return {
                    ...element,
                    attrs: {
                        ...element.attrs,
                        ...node.getAttrs(),
                    },
                };
            })
        );
    }, [updateElements]);

    const handleTransformation = (evt: Konva.KonvaEventObject<Event>) => {
        const node = evt.target;
        updateElementState(node.id(), node);
    };

    const handleDragEnd = (evt: Konva.KonvaEventObject<DragEvent>) => {
        const node = evt.target;
        updateElementState(node.id(), node);
    };

    const handleLoadGeoJSON = async (file: File) => {
        const stage = stageRef.current;
        if (!stage) return;

        try {
            const text = await file.text();
            const geojson = JSON.parse(text);

            if (geojson.type !== "FeatureCollection") {
                console.error("Invalid GeoJSON: must be a FeatureCollection");
                return;
            }

            const newElements = geojsonToElements(
                geojson,
                stage.width(),
                stage.height()
            );

            updateElements((previous) => [...previous, ...newElements]);
        } catch (error) {
            console.error("Invalid GeoJSON file", error);
        }
    };

    const handleUndo = () => {
        if (historyStep.current === 0) return;

        historyStep.current -= 1;

        const previous = history.current[historyStep.current];
        setElements(previous);
        setSelectedIds([]);
    };

    const handleRedo = () => {
        if (historyStep.current >= history.current.length - 1) return;

        historyStep.current += 1;

        const next = history.current[historyStep.current];
        setElements(next);
        setSelectedIds([]);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (selectedIds.length === 0) return;

        if (event.key === 'Backspace' || event.key === 'Delete') {
            updateElements((previous) =>
                previous.filter((element) => !selectedIds.includes(element.id))
            );
            setSelectedIds([]);
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

                    await handleLoadGeoJSON(geoFile);
                }}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="geojson-import">Import GeoJson</FieldLabel>
                            <Input
                                id="geojson-import"
                                type="file"
                                required={true}
                                accept=".json,.geojson,application/geo+json,application/json"
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

                    <div className="ml-auto flex gap-2 items-center">
                        {saveMessage && (
                            <span className={`text-sm ${saveMessage.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
                                {saveMessage}
                            </span>
                        )}
                        {floorPlanId && (
                            <Button
                                variant="default"
                                onClick={handleSave}
                                size="sm"
                                disabled={isSaving || isLoading}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleUndo}
                            size="sm"
                            disabled={historyStep.current === 0}
                        >
                            Undo
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRedo}
                            size="sm"
                            disabled={historyStep.current >= history.current.length - 1}
                        >
                            Redo
                        </Button>
                    </div>
                </div>
                <div
                    className="absolute inset-0 top-12 p-6"
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
                            {elements.map((item) => (
                                <SpawnedElement
                                    key={item.id}
                                    {...item}
                                    isSelected={selectedIds.includes(item.id)}
                                    onClick={handleSelect}
                                    onDragEnd={handleDragEnd}
                                    onTransformEnd={handleTransformation}
                                    onChangeAttrs={
                                        item.type === ElementType.Polygon
                                            ? (id, newAttrs) => {
                                                updateElements((previous) =>
                                                    previous.map((element) =>
                                                        element.id === id
                                                            ? { ...element, attrs: newAttrs }
                                                            : element
                                                    )
                                                );
                                            }
                                            : undefined
                                    }
                                />
                            ))}
                            <Transformer
                                ref={transformerRef}
                                boundBoxFunc={(oldBox, newBox) => {
                                    if (newBox.width < 5 || newBox.height < 5) {
                                        return oldBox;
                                    }

                                    return newBox;
                                }}
                            />
                        </Layer>
                    </Stage>
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <p className="text-center font-semibold">Loading floor plan...</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <aside className="w-72 border-l bg-background p-4 flex flex-col gap-4 overflow-auto scroll-smooth">
                <h2 className="text-lg font-semibold">Inspector</h2>
                {selectedIds.length === 1 ? (
                    <div className="space-y-4">
                        <Label>Selected Element</Label>
                        <Input value={selectedIds[0]} disabled />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Select a single element to edit its properties.
                    </p>
                )}

                {selectedElements.map((element) => (
                    <div key={element.id} className="space-y-4">
                        <h3 className="font-semibold text-lg">{element.type}</h3>
                        <div className="flex w-full max-w-sm flex-col gap-2 text-sm">
                            {Object.entries(element.attrs).map(([key, value]) => {
                                if (key === "points") {
                                    return null;
                                }

                                return (
                                    <dl key={key} className="flex items-center justify-between">
                                        <dt>{key}</dt>
                                        <dd className="text-muted-foreground">{String(value)}</dd>
                                    </dl>
                                );
                            })}
                        </div>
                    </div>
                ))}
                <Separator />
            </aside>
        </div>
    </>
}