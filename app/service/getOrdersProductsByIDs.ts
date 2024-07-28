'use server'
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { GetUserInfoForServer } from '../AuthControllers/GetDataController';
import { Database } from '../types/databaseSchema';
import { TypeResponce } from '../AuthControllers/GetDataController';
import { IUser } from '../types/user';


import { TypeOrderDetails } from '../types/OrderDetails';

export default async function getOrdersProductsByIDs(idArray?: number[]): Promise<TypeOrderDetails> {

    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });


    let userData = await GetUserInfoForServer()

    let isAdmin: TypeResponce[3] = userData[3]

    if (userData[0]) {
        if (userData[2]) {

            let customer: IUser = userData[2]
            let query = db
                .selectFrom("orderdetails")
                .innerJoin("pizzadetails", "orderdetails.pizzadetails_id", 'pizzadetails.id')
                .innerJoin('product', 'pizzadetails.product_id', 'product.product_id')
                .innerJoin('order_', 'order_.order_id', 'orderdetails.order_id')
                .select([
                    "orderdetails.order_details_id",
                    'orderdetails.order_id',
                    'product.p_name',
                    sql<string>`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
                    'orderdetails.selled_price',
                    'orderdetails.quantity',
                    'orderdetails.dough',
                    'pizzadetails.size_cm',
                    'pizzadetails.weight_g',
                ])

            if (!isAdmin) {
                if (!idArray || idArray.length == 0) {

                    return []

                }
                query = query.where('orderdetails.order_id', 'in', idArray)
                if (!isAdmin) {
                    query = query.where('order_.customer_id', '=', customer.customer_id)
                }
            }
            try {
                const result = await query.execute();

                let TypeOrderDetails = result.reduce((acc: TypeOrderDetails, cur) => {
                    if (!acc[cur.order_id]) {
                        acc[cur.order_id] = [];
                    }
                    acc[cur.order_id].push(cur);
                    return acc;
                }, {});

                return TypeOrderDetails;
            } catch (err) {
                console.error('2Помилка:', err);
                return [];
            }
        } else {
            console.error(`помилка: немає інформації про аккаунт`)
            return []
        }
    } else {
        console.error(`помилка:${userData[1]}`)
        return []
    }
};
