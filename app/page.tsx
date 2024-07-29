// import Image from "next/image";
// import styles from "./page.module.css";
import Home from './screens/home'
import getProducts from './service/getProducts'
import { IParams } from './types/types'



export default async function homePage(params: IParams) {
    const pizzas = await getProducts({ type: "піца", limit: 8 })
    const shushi = await getProducts({ type: "суші", limit: 8 })
    const drinks = await getProducts({ type: "напої", limit: 8 })
    const snaks = await getProducts({ type: "закуски", limit: 8 })
    const dessert = await getProducts({ type: "десерти", limit: 8 })
    const sauces = await getProducts({ type: "соуси", limit: 8 })
    return Home(pizzas, shushi, drinks, snaks, dessert, sauces)
}