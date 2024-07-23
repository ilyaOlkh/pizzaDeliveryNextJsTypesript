// import { Children } from "react";

export default function ErrorBlock({ children }: { children: JSX.Element }) {
    return <>
        {/* <Header />
        <main className="page">
            <section className="personal">
                <div className="personal__container"> */}
        <div className="personal__orders">
            <div className="error">
                {children}
            </div>
        </div>
        {/* </div>
            </section>
        </main> */}
    </>
}