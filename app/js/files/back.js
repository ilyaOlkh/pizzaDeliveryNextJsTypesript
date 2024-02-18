const url = 'http://api.pizza.ua/'
let serverIsWork = false;

let HTMLServerIsntWork = `
<div class="error"> <span class="error__code">сервер не отвечает</span></div>
`



async function prompt(currentFile, objectToSend) {
    const urlLocal = url + currentFile; // замените на URL вашего API

    try {
        let response
        if (objectToSend) {
            response = await fetch(urlLocal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectToSend), // преобразование объекта в строку JSON
            });
        } else {
            response = await fetch(urlLocal);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API работает корректно:', data);
        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            console.log('Сервер не работает');
        } else {
            console.log('Произошла ошибка при проверке API:', error);
        }
    }
}

function renderCards(data, parentBlock) {
    let html = ''
    data.forEach((el) => {
        html += `
        <div class="priceList__item priceItem"> 
            <div class="priceItem__inner">
                <div class="priceItem__img"><img src="${el.image_url}" alt="pizza"/></div>
                    <div class="priceItem__info">  
                        <h2 class="priceItem__name"> <span>${el.p_name}</span></h2>
                        <div class="priceItem__composition">${el.composition}</div>
                        <div class="priceItem__row"> 
                        <button type="button" data-popup="#card" class="priceItem__select button">Выбрать</button>
                        <button type="button" data-popup="#card" class="priceItem__price">от 100 ₴</button>
                    </div>
                </div>
            </div>
        </div>`
    })
    parentBlock.innerHTML = html
}

function renderCardsBad(parentBlock) {
    parentBlock.querySelector(".priceList__grid").innerHTML = HTMLServerIsntWork
    parentBlock.querySelector(".priceList__filter").disabled = true
}

function renderFilters(data, parentBlock) {
    let html = ''
    data.forEach(element => {
        html += `
        <div class="filters__block"> 
        <div class="filters__block-title">${element.i_type}</div>
        <div class="filters__options">
        `
        element['group_concat(i_name)'].split(',').forEach(filter => {
            html += `
            <label class="filters__option">
            <input type="checkbox" name="test" style="display:none"/><span id="word_opts">${filter}</span>
            </label>
        `
        })
        html += `
        </div>
        </div>
        `
        parentBlock.innerHTML = html
    });
}

function renderBlocks() {


    if (serverIsWork) {
        let filtersHTML = document.querySelector('.filters__checks')
        prompt('pizzaFilters.php').then(data => {
            renderFilters(data, filtersHTML)
        })
        ///////////////////////////////////
        prompt('getPizza.php'
            , { type: "пицца" }
        ).then(data => {
            renderCards(data, document.querySelector('.priceList#pizza .priceList__grid'))
        })

        prompt('getPizza.php'
            , { type: "суши" }
        ).then(data => {
            renderCards(data, document.querySelector('.priceList#shushi .priceList__grid'))
        })
    } else {
        renderCardsBad(document.querySelector('.priceList#pizza'))
        renderCardsBad(document.querySelector('.priceList#shushi'))
    }

}


function pingServer(good, bad) {
    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log('Сервер ответил!');
                good()
            } else {
                console.log('Сервер не ответил, пингую снова...');
                if (bad) {
                    bad()
                }
                setTimeout(pingServer(good, bad), 5000); // Пингую каждые 5 секунд
            }
        })
        .catch(error => {
            console.log('Ошибка: ', error);
            console.log('Пингую снова...');
            if (bad) {
                bad()
            }
            setTimeout(pingServer(good, bad), 5000); // Пингую каждые 5 секунд
        });
}

document.addEventListener('DOMContentLoaded', () => {
    pingServer(
        () => {
            serverIsWork = true;
            renderBlocks()
        },
        () => {
            serverIsWork = false;
            renderBlocks()
        }
    );
})