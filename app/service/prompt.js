const url = 'http://api.pizza.ua/'


export default async function prompt(currentFile, objectToSend) {
    const urlLocal = url + currentFile;

    try {
        let response
        if (objectToSend) {
            response = await fetch(urlLocal, {
                next: { revalidate: 30 },
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objectToSend),
            });
        } else {
            response = await fetch(urlLocal, {
                next: { revalidate: 30 },
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            console.log('Сервер не работает');
        } else {
            console.log('Произошла ошибка при проверке API:', error);
        }
    }
}