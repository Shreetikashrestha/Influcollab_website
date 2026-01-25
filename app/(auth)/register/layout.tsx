export default function Template({children}: { children: React.ReactNode }) {
    return (
        <div>
            <section>
                My Logo
                {children}
                Footer @ 2025
            </section>
            
        </div>
    );
}