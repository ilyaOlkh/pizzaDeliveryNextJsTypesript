// import { Children } from "react";

export default function ErrorBlock({ children, withButtons = false }: { children: JSX.Element, withButtons?: boolean }) {
    return <>
        {/* <Header />
        <main className="page">
            <section className="personal">
                <div className="personal__container"> */}
        <div className="personal__orders">
            {
                withButtons ? <div className="personal__buttons">
                    <button type="button" data-popup="#filters" className="button button_white">
                        <img src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фільтри</span>
                    </button>
                    <button type="button" data-popup="#sort" className="button button_white">
                        <img src="/Common/Sort.svg" alt="sort" width={20} height={20} /><span>Сортування</span>
                    </button>
                </div> : <></>
            }
            <div className="error">
                {children}
            </div>
        </div>
        {/* </div>
            </section>
        </main> */}
    </>
}