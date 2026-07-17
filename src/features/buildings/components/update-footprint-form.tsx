"use client"

import { LocationDto } from "@/features/locations/types";
import { useForm } from "@tanstack/react-form";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateBuildingFootprintSchema } from "@/features/buildings/schemas";
import { FootprintDrawer } from "@/components/maps/footprint-drawer";
import { Textarea } from "@/components/ui/textarea";
import { updateBuildingFootprintAction } from "@/features/buildings/server/actions";
import { toast } from "sonner";
import { BuildingDto } from "@/features/buildings/types";

interface UpdateFootprintFormProps {
    building: BuildingDto,
    location: LocationDto
}

export function UpdateFootprintForm(props: UpdateFootprintFormProps) {
    const { resolvedTheme } = useTheme();
    // 1. Control the dialog visibility explicitly via local state
    const [isOpen, setIsOpen] = useState(true);

    const router = useRouter();
    const form = useForm({
        defaultValues: {
            buildingId: props.building.id,
            footprints: "",
        },
        validators: {
            onSubmit: UpdateBuildingFootprintSchema
        },
        onSubmit: async ({ value }) => {
            try {
                // Invoke the Server Action directly
                const result = await updateBuildingFootprintAction(value)

                if (result?.success) {
                    toast.success("Building footprint updated successfully!")
                    form.reset()
                    // 2. FORCE the modal overlay to shut down immediately
                    handleOpenChange(false)

                } else {
                    toast.error(result?.error || "Failed to update building footprint")
                }
            } catch (error) {
                toast.error("An unexpected error occurred.")
            }
        },
    });

    // Handles closing the modal via ESC key, clicking outside, or the 'X' button
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            router.back();
        }
    };

    return <>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>

            <form
                id="update-building-footprint-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <DialogContent className="min-w-3/4 and min-h-3/4">
                    <DialogHeader>
                        <DialogTitle>Edit {props.building.name}</DialogTitle>
                        <DialogDescription>{props.building.address}</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <form.Field
                            name="footprints"
                            children={(field) => (
                                <div className="space-y-2">
                                    <FieldLabel htmlFor={field.name}>Building footprints</FieldLabel>

                                    <Textarea
                                        // height="440px" theme={resolvedTheme === "dark" ? "vs-dark" : "light"} defaultLanguage="json"
                                        value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                    <FieldDescription>Draw the building footprints again.</FieldDescription>
                                    {/* Display Validation Error Messaging */}
                                    {field.state.meta.errors ? (
                                        <p className="text-sm font-medium text-destructive">
                                            {field.state.meta.errors.join(", ")}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <FootprintDrawer
                            center={props.location.coordinates}
                            onDraw={(footprint) => form.setFieldValue('footprints', JSON.stringify(footprint))} />
                    </FieldGroup>

                    <DialogFooter>
                        <Button onClick={() => handleOpenChange(false)} variant="outline">Cancel</Button>
                        <form.Subscribe
                            selector={(state) => [state.isSubmitting, state.isValidating]}
                            children={([isSubmitting, isValidating]) => (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => form.reset()}
                                        disabled={isSubmitting}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        form="update-building-footprint-form"
                                        disabled={isSubmitting || isValidating}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </Button>
                                </>
                            )}
                        />
                    </DialogFooter>
                </DialogContent>
                <form.Subscribe
                    selector={(state) => [state.errors, state.errorMap]}
                    children={([errors, errorMap]) => {
                        // 1. Check if it's a flat array and has items
                        const hasArrayErrors = Array.isArray(errors) && errors.length > 0;

                        // 2. Check if it's an error map object and has keys
                        const hasMapErrors = errors && !Array.isArray(errors) && Object.keys(errors).length > 0;
                        // If this logs anything when you click submit, validation is blocking your action!
                        if (hasArrayErrors || hasMapErrors) console.log("Form Validation Errors:", errors)
                        return null
                    }}
                />
            </form>
        </Dialog>
    </>
}