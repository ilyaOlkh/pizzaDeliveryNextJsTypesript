'use server'

import { GetUserInfoForServer, TypeResponce } from "../AuthControllers/GetDataController"
import { getUserCookies } from "../AuthControllers/GetDataController"
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { ISort } from "../types/sort";
import { TypeFilters } from "../types/types";
import { IUser } from "../types/user";
import { Database } from "../types/databaseSchema";
import { TypeOrders } from "../types/order";

export async function getOrders(page: number, numInPage: number, all: boolean = false, sort?: ISort, filters?: TypeFilters): Promise<TypeOrders | 'error' | 'no access'> {
    let userData: TypeResponce;
    let isAdmin: boolean = false;

    if (!all) {
        userData = await getUserCookies()
    } else {
        userData = await GetUserInfoForServer()
    }

    if (all) {
        isAdmin = Boolean(userData[3])
        if (!isAdmin) {
            console.log('немає доступу адміна')
            return 'no access'
        }
    }

    if (userData[0]) {
        if (userData[2]) {
            let customer: IUser = userData[2]
            try {
                const pool = new Pool({
                    connectionString: process.env.POSTGRES_URL
                });

                const db = new Kysely<Database>({
                    dialect: new PostgresDialect({ pool }),
                });

                let query = db.selectFrom('order_')
                    .innerJoin('customer', 'order_.customer_id', 'customer.customer_id')
                    .$if(Boolean(sort), (qb) =>
                        qb.innerJoin('orderdetails', 'orderdetails.order_id', 'order_.order_id')
                    )
                    .select(
                        [
                            'order_.order_id',
                            'order_.order_date_time',
                            'order_.status',
                            'order_.payment',
                            'order_.delivery',
                            'customer.street',
                            'customer.house',
                            'customer.entrance',
                            'customer.floor',
                            'customer.apartment',
                            'customer.intercom_code',
                            'customer.phone',
                        ]
                    )
                    .$if(Boolean(isAdmin), (qb) =>
                        qb.select(
                            [
                                'customer.first_name',
                                'customer.last_name',
                            ]
                        )
                    )


                if (filters) {
                    for (const value in filters) {
                        const ingredients: string[] = filters[value].split(",").map((elem) => `${elem}`);
                        query.where(sql`${value}`, 'in', ingredients)
                    }
                }

                if (!isAdmin && customer) {
                    query = query.where('order_.customer_id', '=', customer.customer_id);
                }
                if (isAdmin) {
                    query = query.groupBy(['order_.order_id', 'customer.first_name', 'customer.last_name', 'customer.street', 'customer.house', 'customer.entrance', 'customer.floor', 'customer.apartment', 'customer.intercom_code', 'customer.phone'])
                } else {
                    query = query.groupBy(['order_.order_id', 'customer.street', 'customer.house', 'customer.entrance', 'customer.floor', 'customer.apartment', 'customer.intercom_code', 'customer.phone'])
                }


                if (sort) {
                    query = query.orderBy(sql.raw(sort.sortRule), sort.direction as 'asc' | 'desc')
                } else {
                    query = query.orderBy('order_date_time', 'desc')
                }
                if (page && numInPage) {
                    query = query
                        .limit(sql.raw(numInPage.toString()))
                        .offset(sql.raw(((page - 1) * numInPage).toString()))
                }
                console.log(query.compile())

                let result = await query.execute()
                return result
            } catch (error) {
                console.log(`1Помилка: ${error}`)
                return 'error'
            }
        } else {
            console.log('немає даних клієнта')
            return 'error'
        }
    } else {
        console.log('запит повернув помилку ', userData[1])
        return 'error'
    }
}