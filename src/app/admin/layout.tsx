export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="fixed inset-0 z-[999] bg-neutral-950 text-neutral-100 overflow-y-auto">
            {children}
        </div>
    )
}
