"use client"

import { useForm } from '@tanstack/react-form';
import { CoordinatePicker, LocationValue } from "../coordinate-picker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { AddLocationSchema } from "@/lib/definitions";
import { Button } from '../ui/button';
import { addLocationAction } from '@/lib/actions';
import { toast } from 'sonner';
import { OrganizationDto } from "@/data/organization";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddLocationProps {
    organization: OrganizationDto
}

export function AddLocationForm(props: AddLocationProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            name: "",
            address: "",
            latitude: "",
            longitude: "",
            organizationId: props.organization.id || "",
            organizationName: props.organization.name || ""
        },
        validators: {
            onSubmit: AddLocationSchema
        },
        onSubmit: async ({ value }) => {
            try {
                // Invoke the Server Action directly
                const result = await addLocationAction(value)

                if (result?.success) {
                    toast.success("Location created successfully!")
                    form.reset()
                    setOpen(false);
                    router.refresh();
                } else {
                    toast.error(result?.error || "Failed to create Location")
                }
            } catch (error) {
                toast.error("An unexpected error occurred.")
            }
        },
    });
    const onCoordinateChange = (value: LocationValue) => {
        console.log("On coordinate change: ", value)
        form.setFieldValue('latitude', value.lat.toString())
        form.setFieldValue('longitude', value.lng.toString())
        form.setFieldValue('address', value.address)
    }

    return <Dialog open={open} onOpenChange={setOpen}>
        <form
            id="add-location-form"
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
        >
            <DialogTrigger render={<Button variant="outline">Add Location</Button>} />
            <DialogContent>
                <FieldGroup>
                    <form.Field
                        name="name"
                        children={(field) => (
                            <div className="space-y-2">
                                <FieldLabel htmlFor={field.name}>Location name</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. Headquarters"
                                />
                            </div>
                        )}
                    />
                    {/* 1. Address Text Input Field */}
                    <form.Field
                        name="address"
                        children={(field) => (
                            <div className="space-y-2">
                                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                <Input
                                    id={field.name}
                                    value={field.state.value || ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="e.g. 123 Main St, Melbourne 3030"
                                />
                            </div>
                        )}
                    />

                    {/* Map Interface and Visual Feedback Coordinates */}
                    <div className="space-y-3">
                        <CoordinatePicker
                            value={{
                                lat: form.state.values.latitude,
                                lng: form.state.values.longitude,
                                address: form.state.values.address
                            }}
                            onChange={onCoordinateChange}
                        />
                        {/* Visual Flat Coordinate Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <form.Field
                                name="latitude"
                                children={(field) => (
                                    <div className="space-y-1">
                                        <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                                        <Input
                                            id={field.name}
                                            value={field.state.value || ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            readOnly
                                            placeholder="Click map..."
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
                                name="longitude"
                                children={(field) => (
                                    <div className="space-y-1">
                                        <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                                        <Input
                                            id={field.name}
                                            value={field.state.value || ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            readOnly
                                            placeholder="Click map..."
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
                        </div>
                    </div>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                    <form.Subscribe
                        selector={(state) => [state.isSubmitting, state.isValidating]}
                        children={([isSubmitting, isValidating]) => {
                            return <><Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                                <Button
                                    type="submit"
                                    form="add-location-form"
                                    disabled={isSubmitting || isValidating}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </>
                        }}
                    />
                </DialogFooter>
            </DialogContent>
        </form>
    </Dialog>
}