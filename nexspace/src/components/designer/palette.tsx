import { Armchair, LampDesk, LampDeskIcon, LineDotRightHorizontalIcon, SofaIcon, SpaceIcon, SquareIcon, ToiletIcon } from 'lucide-react';
import { IconEscalator } from '@tabler/icons-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { DeskSingle } from "./elements/desk-single"
import { DeskDouble } from "./elements/desk-double"
import { DeskRow3 } from "./elements/desk-row3"
import { DeskPod4 } from "./elements/desk-pod4"
import { Meeting4 } from "./elements/meeting-table4"
import { Meeting6 } from "./elements/meeting-table6"
import { Meeting10 } from "./elements/meeting-table10"
import { DeskLShape } from "./elements/desk-lshape"
import { ElementType } from './element';
import { CircleElement } from './elements/circle';

interface PaletteItemProps {
    type: string;
    label: string;
    icon: React.ReactNode;
    handleDragStart: (type: string) => void
}
export function PaletteItem({ type, label, icon, handleDragStart }: PaletteItemProps) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                handleDragStart(type)
            }}
            className="p-2 border rounded bg-card hover:bg-accent cursor-grab active:cursor-grabbing"
        >
            <div className="w-16 h-16">{icon}</div>
            <p className="text-xs text-center mt-1">{label}</p>
        </div>
    )
}

interface PaletteProps {
    handleDragStart: (type: string) => void;
}

export function Palette({ handleDragStart }: PaletteProps) {
    return <>
        <Accordion defaultValue={["desks/spaces"]} className="max-w-lg">
            <AccordionItem value="basic">
                <AccordionTrigger>Basic Shapes</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-2 px-2">
                    <PaletteItem
                        type={ElementType.Circle}
                        label="Circle"
                        icon={<CircleElement />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="spaces">
                <AccordionTrigger>Desks / Spaces</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-2 px-2">
                    <PaletteItem
                        type={ElementType.DeskSingle}
                        label="Single Desk"
                        icon={<DeskSingle />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.DeskLShape}
                        label="L Shape Desk"
                        icon={<DeskLShape />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.DeskDouble}
                        label="Double Desk"
                        icon={<DeskDouble />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.DeskRow3}
                        label="3 Desk Row"
                        icon={<DeskRow3 />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.DeskPod4}
                        label="4 Desk Pod"
                        icon={<DeskPod4 />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.Meeting4}
                        label="Meeting table 4"
                        icon={<Meeting4 />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.Meeting6}
                        label="Meeting table 6"
                        icon={<Meeting6 />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                    <PaletteItem
                        type={ElementType.Meeting10}
                        label="Meeting table 10"
                        icon={<Meeting10 />}   // your SVG version, not Konva
                        handleDragStart={handleDragStart}
                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
                <AccordionTrigger>Furnishings</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-2">
                    <SofaIcon />
                    <Armchair />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
                <AccordionTrigger>Points of Interest</AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-2">
                    <ToiletIcon />
                    <IconEscalator />
                </AccordionContent>
            </AccordionItem>
        </Accordion >
    </>
}