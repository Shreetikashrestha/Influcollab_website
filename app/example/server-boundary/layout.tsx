export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            Layout Top
            {children}
            Layout Bottom
        </section>
    );
}