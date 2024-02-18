export const settings = {
    globalURL: process.env.GLOBAL_URL,
    idForProduct: 'id', //этот айди пропускается в отправке на сервер
    getURLPizza() {
        return this.globalURL + 'productLists/піца';
    },
    getURLSushi() {
        return this.globalURL + 'productLists/суші';
    }
}