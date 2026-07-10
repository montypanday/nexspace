"use client"

import { BuildingDto } from "@/data/building";
import { addFloorAction } from "@/lib/actions";
import { AddFloorSchema } from "@/lib/definitions";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface AddFloorFormProps {
    building: BuildingDto
}

export function AddFloorForm(props: AddFloorFormProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            name: "",
            buildingId: props.building.id,
            organizationId: props.building.organizationId
        },
        validators: {
            onSubmit: AddFloorSchema
        },
        onSubmit: async ({ value }) => {
            try {
                // Invoke the Server Action directly
                const result = await addFloorAction(value)

                if (result?.success) {
                    toast.success("Floor created successfully!")
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
                id="add-floor-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <DialogTrigger render={<Button variant="outline">Add floor</Button>} />
                <DialogContent>
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => (
                                <div className="space-y-2">
                                    <FieldLabel htmlFor={field.name}>Floor name</FieldLabel>
                                    <Input
                                        id={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="e.g. Ground floor, Level 1"
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
                                        form="add-floor-form"
                                        disabled={isSubmitting || isValidating}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </Button>
                                </>
                            )}
                        />
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    </>
}