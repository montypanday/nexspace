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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddBuildingSchema } from "@/features/buildings/schemas";
import { FootprintDrawer } from "@/components/maps/footprint-drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addBuildingAction } from "@/features/buildings/server/actions";
import { toast } from "sonner";

interface AddBuildingProps {
    location: LocationDto
}

export function AddBuildingForm(props: AddBuildingProps) {
    const { resolvedTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            name: "",
            address: "",
            footprints: "[]",
            locationId: props.location.id,
            organizationId: props.location.organizationId
        },
        validators: {
            onSubmit: AddBuildingSchema
        },
        onSubmit: async ({ value }) => {
            try {
                // Invoke the Server Action directly
                const result = await addBuildingAction(value)

                if (result?.success) {
                    toast.success("Location created successfully!")
                    form.reset()
                    setOpen(false);
                    router.refresh();
                } else {
                    toast.error(result?.error || "Failed to create Building")
                }
            } catch (error) {
                toast.error("An unexpected error occurred.")
            }
        },
    });

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <form
                id="add-building-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <DialogTrigger render={<Button variant="outline">Add building</Button>} />
                <DialogContent className="min-w-3/4 and min-h-3/4">

                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => (
                                <div className="space-y-2">
                                    <FieldLabel htmlFor={field.name}>Building name</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. Headquarters"
                                    />
                                    {/* Display Validation Error Messaging */}
                                    {field.state.meta.errors ? (
                                        <p className="text-sm font-medium text-destructive">
                                            {field.state.meta.errors.join(", ")}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        />
                        {/* 1. Address Text Input Field */}
                        <form.Field
                            name="address"
                            children={(field) => (
                                <div className="space-y-2">
                                    <FieldLabel htmlFor={field.name}>Building address</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value || ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. 123 Main St, Melbourne 3030"
                                    />
                                    {/* Display Validation Error Messaging */}
                                    {field.state.meta.errors ? (
                                        <p className="text-sm font-medium text-destructive">
                                            {field.state.meta.errors.join(", ")}
                                        </p>
                                    ) : null}
                                </div>
                            )}
                        />
                        <form.Field
                            name="footprints"
                            children={(field) => (
                                <div className="space-y-2">
                                    <FieldLabel htmlFor={field.name}>Building footprints</FieldLabel>

                                    <Textarea
                                        // height="440px" theme={resolvedTheme === "dark" ? "vs-dark" : "light"} defaultLanguage="json"
                                        value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
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
                        <FootprintDrawer center={props.location.coordinates} onDraw={(footprint) => form.setFieldValue('footprints', JSON.stringify(footprint))} />
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
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
                                        form="add-building-form"
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