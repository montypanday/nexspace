"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { CreateBookingSchema } from "@/lib/definitions"
import { createBookingAction } from "@/lib/actions"
import { Switch } from "../ui/switch"
import { SpaceDto } from "@/data/space"
import { DateTimePicker } from "../datetimepicker"
import { User } from "next-auth"
import { useRef } from "react"

export function BookingForm({ space, user }: { space?: SpaceDto, user: User | null | undefined }) {

    const now = new Date();
    const form = useForm({
        defaultValues: {
            title: space?.name || "",
            startTs: new Date(),
            endTs: new Date(now.getTime() + 3600000),
            allDay: false,
            spaceId: space?.id || "",
            userId: user?.id || ""
        },
        validators: {
            onSubmit: CreateBookingSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                // Invoke the Server Action directly
                const result = await createBookingAction(value)

                if (result?.success) {
                    console.log("Booking created successfully!")
                    toast.success("Booking created successfully!")
                    form.reset()
                } else {
                    toast.error(result?.error || "Failed to create booking")
                }
            } catch (error) {
                toast.error("An unexpected error occurred.")
            }
        }
    })

    // 1. Initialize a ref with your default form value
    let prevStartTsRef = useRef(form.getFieldValue('startTs'))

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Create a booking</CardTitle>
                <CardDescription>
                    Book a space for the whole day or time slot of your choice.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="create-booking-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="title"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Booking title</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="startTs"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Start time</FieldLabel>
                                        <DateTimePicker
                                            value={field.state.value}
                                            onChange={(date) => field.handleChange(date)}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                            listeners={{
                                onChange: ({ value }) => {
                                    // 2. Capture the old value from the ref before updating it
                                    const oldValue = prevStartTsRef.current;
                                    const newValue = value;

                                    console.log('Actual Old Value:', oldValue);
                                    console.log('Actual New Value:', newValue);
                                    const diffInMs = newValue.getTime() - oldValue.getTime()
                                    console.log('Diff in ms: ', diffInMs)
                                    let endTsValue = form.getFieldValue('endTs')
                                    if (diffInMs < 0) {
                                        endTsValue = new Date(endTsValue.getTime() - Math.abs(diffInMs))
                                    } else {
                                        endTsValue = new Date(endTsValue.getTime() + diffInMs)
                                    }
                                    console.log('New end time: ', endTsValue)
                                    form.setFieldValue('endTs', endTsValue)
                                    prevStartTsRef.current = form.getFieldValue('startTs')
                                },
                            }}
                        />
                        <form.Field
                            name="endTs"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>End time</FieldLabel>
                                        <DateTimePicker
                                            value={field.state.value}
                                            onChange={(date) => field.handleChange(date)}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="allDay"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>All Day</FieldLabel>
                                        <Switch checked={field.state.value} onCheckedChange={field.handleChange} />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }
                            }
                            // Define listeners to catch state changes
                            listeners={{
                                onChange: ({ value }) => {
                                    if (value === true) {
                                        // Automatically populate the other field when checked
                                        let start = form.getFieldValue('startTs');
                                        form.setFieldValue('startTs', new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0))
                                        form.setFieldValue('endTs', new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999))
                                    } else {

                                    }
                                },
                            }}
                        />
                        <form.Field name="spaceId">
                            {(field) => (
                                <input
                                    type="hidden"
                                    name={field.name}
                                    value={field.state.value}
                                />
                            )}
                        </form.Field>
                        <form.Field name="userId">
                            {(field) => (
                                <input
                                    type="hidden"
                                    name={field.name}
                                    value={field.state.value}
                                />
                            )}
                        </form.Field>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <form.Subscribe
                    selector={(state) => [state.isSubmitting, state.isValidating]}
                    children={([isSubmitting, isValidating]) => (
                        <Field orientation="horizontal" className="w-full flex justify-between">
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
                                form="create-booking-form"
                                disabled={isSubmitting || isValidating}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </Field>
                    )}
                />
                <form.Subscribe
                    selector={(state) => [state.errors, state.errorMap]}
                    children={([errors, errorMap]) => {
                        // If this logs anything when you click submit, validation is blocking your action!
                        if (errors.length > 0) console.log("Form Validation Errors:", errors)
                        return null
                    }}
                />
            </CardFooter>
        </Card >
    )
}
