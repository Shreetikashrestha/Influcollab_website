export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            Example Header
            {children}
            Example Footer
        </section>
    );
}