export const settings = {
    globalURL: 'https://pizza-delivery-next-fqeh0a5sg-ilya-olkhovskys-projects.vercel.app/',
    idForProduct: 'id', //этот айди пропускается в отправке на сервер
    getURLPizza() {
        return this.globalURL + 'productLists/піца';
    },
    getURLSushi() {
        return this.globalURL + 'productLists/суші';
    }
}
