import { auth, clerkClient } from '@clerk/nextjs/server'

export default async function Page() {
    // Use `auth()` to access the `Auth` object
    // https://clerk.com/docs/reference/backend/types/auth-object
    const { isAuthenticated, orgId, orgRole } = await auth()

    // Check if user is authenticated
    if (!isAuthenticated) return <p>You must be signed in to access this page.</p>

    // Check if there is an Active Organization
    if (!orgId) return <p>Set an Active Organization to access this page.</p>

    // Initialize clerkClient
    const client = await clerkClient()

    // Use the `getOrganization()` method to get the Backend `Organization` object
    const organization = await client.organizations.getOrganization({ organizationId: orgId })

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
                Welcome to the <strong>{organization.name}</strong> organization
            </h1>
            <p className="mb-6">
                Your role in this organization: <strong>{orgRole}</strong>
            </p>
        </div>
    )
}