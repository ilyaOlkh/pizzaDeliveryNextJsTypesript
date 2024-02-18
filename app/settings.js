export const settings = {
    globalURL: 'http://localhost:3000/',
    idForProduct: 'id', //этот айди пропускается в отправке на сервер
    getURLPizza() {
        return this.globalURL + 'productLists/піца';
    },
    getURLSushi() {
        return this.globalURL + 'productLists/суші';
    }
}