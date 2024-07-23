'use client'
import generateCheque from "../service/generateCheque"
import { show, hide } from '../components/loading';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function PopupCheque() {

    async function createPDF() {
        show()
        let searchParams = new URLSearchParams(window.location.search)
        let id = searchParams.get(process.env.NEXT_PUBLIC_ID_FOR_ORDER) ? decodeURIComponent(searchParams.get(process.env.NEXT_PUBLIC_ID_FOR_ORDER)) : undefined
        let text = await generateCheque(undefined, id)
        pdfMake.createPdf({
            content: text
        }).download();
        hide()
    }

    return <>
        <div id="cheque" aria-hidden="true" className="popup cheque popup-window">
            <div className="popup__wrapper">
                <div className="popup__content">
                    <button data-close="data-close" type="button" className="popup__close"><img src="/Common/CrossWhite.svg" alt="Cross" /></button>
                    <div className="cheque__body-wrapper">
                        <div className="popup__body cheque__body">
                            <img src="/Common/checkmark.svg" alt="checkmark" />
                            <h2 className='cheque__title'>Дякуємо за замовлення!</h2>
                            <div className="cheque__button-wrapper">
                                <button type="button" className='cheque__button button' onClick={createPDF}>Завантажити чек</button>
                            </div>
                            <button data-popup='#cheque' type="button" style={{ display: 'none' }}></button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    </>
}