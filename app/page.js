import Image from "next/image";
// import styles from "./page.module.css";
import Home from './screens/home.js'
import prompt from './service/prompt'
import getProductTypes from './service/getProductTypes'
const urlPizza = 'getPizza.php'


export default async function homePage(params) {
    const pizzas = await prompt(urlPizza, { type: "піца", limit: 8 })
    const shushi = await prompt(urlPizza, { type: "суші", limit: 8 })
    return Home(pizzas, shushi)
}