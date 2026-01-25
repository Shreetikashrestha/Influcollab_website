export default function Template({children}: { children: React.ReactNode }) {
    return (
        <div>
            User Header
            {children}
            User Footer
        </div>
    );
}