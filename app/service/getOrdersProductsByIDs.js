'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'
import { GetUserInfoForServer, checkIsAdmin } from '../AuthControllers/GetDataController';
import { getUserCookies } from "../AuthControllers/GetDataController"


export default async function getOrdersProductsByIDs(idArray) {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    let userData;
    let isAdmin = false;
    console.log(idArray)
    if (idArray) {
        userData = await getUserCookies()
    } else {
        userData = await GetUserInfoForServer()
    }
    if (userData[0]) {
        userData = userData[1]
        console.log(userData)

        if (!idArray) {
            isAdmin = await checkIsAdmin(userData.customer_id)
        }

        let query = db
            .selectFrom('orderdetails')
            .leftJoin('pizzadetails', 'orderdetails.pizzadetails_id', 'pizzadetails.id')
            .leftJoin('product', 'pizzadetails.product_id', 'product.product_id')
            .leftJoin('order_', 'order_.order_id', 'orderdetails.order_id')
            .select([
                'orderdetails.order_id',
                'product.p_name',
                // 'product.image_url',
                sql`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
                'orderdetails.selled_price',
                'orderdetails.quantity',
                'orderdetails.dough',
                'pizzadetails.size_cm',
                'pizzadetails.weight_g',
            ])

        if (!isAdmin) {
            let querytextGlobal = ``
            if (!idArray || idArray.length == 0) {
                return []
            }
            for (const value of idArray) {
                console.log(value)
                querytextGlobal += `orderdetails.order_id = ${value} OR `
            }
            querytextGlobal = querytextGlobal.slice(0, -4);
            querytextGlobal = `(${querytextGlobal}) AND order_.customer_id = ${userData.customer_id}`
            console.log(querytextGlobal)
            query = query.where(sql(querytextGlobal));
        }
        // query = query.having('order_.customer_id', '=', userData.customer_id)
        // query = query.orderBy('orderdetails.order_details_id');
        try {
            const result = await query.execute();

            let groupedOrders = result.reduce((acc, cur) => {
                if (!acc[cur.order_id]) {
                    acc[cur.order_id] = [];
                }
                acc[cur.order_id].push(cur);
                return acc;
            }, {});
            console.log('groupedOrders', groupedOrders)
            return groupedOrders;
        } catch (err) {
            console.error('error:', err);
            return [];
        }
    }
};
