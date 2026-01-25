export default function Template({children}: { children: React.ReactNode }) {
    return (
        <div>
            Template Top
            {children}
            Template Bottom
        </div>
    );
}