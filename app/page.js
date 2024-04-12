// import Image from "next/image";
// import styles from "./page.module.css";
import Home from './screens/home.js'
import getProducts from './service/getProducts.js'

const urlPizza = 'getPizza.php'





export default async function homePage(params) {
    const pizzas = await getProducts({ type: "піца", limit: 8 })
    const shushi = await getProducts({ type: "суші", limit: 8 })
    const drinks = await getProducts({ type: "напої", limit: 8 })
    return Home(pizzas, shushi, drinks)
}// test