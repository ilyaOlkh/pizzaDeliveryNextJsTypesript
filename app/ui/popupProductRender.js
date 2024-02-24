export default function popupProductRender() {
    return (
        <div id="card" aria-hidden="true" className="popup card">
            <div className="popup__wrapper card__wrapper">
                <div className="popup__content card__content">
                    <div className="card__header popup__header"><span className="card__title popup__title">Фильтры</span>
                        <button data-close="data-close" type="button" className="popup__close">
                            <img src="/Common/Cross.svg" alt="Cross" />
                        </button>
                    </div>
                    <div className="card__body">
                        <div className="card__img"><img src="/pizzas/pizza1.png/" alt="pizza" /></div>
                        <div className="card__info">
                            <div className="card__title-product">
                                <img src="@img/Common/Fire.svg" alt="Fire" /><span>Пепперони по-деревенски</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}