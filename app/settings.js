export const settings = {
    globalURL: 'https://pizza-delivery-next-js-git-main-ilya-olkhovskys-projects.vercel.app/',
    idForProduct: 'id', //этот айди пропускается в отправке на сервер
    getURLPizza() {
        return this.globalURL + 'productLists/піца';
    },
    getURLSushi() {
        return this.globalURL + 'productLists/суші';
    }
}
