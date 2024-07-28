'use server'
import { ISort } from '../types/sort';
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';
import { IProduct } from '../types/products';

interface IProps {
    type: Database['product']['p_type']
    filters: { [key: string]: string } | undefined
    limit?: number
    sort?: ISort
}

export default async function getProducts(req: IProps): Promise<IProduct[]> {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    const type = req.type;
    let filters: { [x: string]: string } | undefined = { ...req.filters };
    const limit = req.limit;
    const sort: ISort | undefined = req.sort;
    let size_condition: '=' | 'is' | undefined;
    let size_sm: "20" | "28" | "33" | 'null' | undefined;
    let priceFrom: number | undefined;
    let priceTo: number | undefined;
    let searchName: string | undefined;

    if (filters) {
        console.log(filters)
        if (filters.searchName) {
            searchName = filters.searchName
        }
        if (filters.size_sm) {
            let size_smInvalid = filters.size_sm.replace('см', '')
            if (size_smInvalid === "20" || size_smInvalid === "28" || size_smInvalid === "33" || size_smInvalid === null) {
                size_sm = size_smInvalid
            }
            if (size_sm && size_sm != 'null') {
                size_condition = '='
            } else {
                size_condition = 'is'
            }
            if (filters.priceFrom) {
                priceFrom = +filters.priceFrom
            }
            if (filters.priceTo) {
                priceTo = +filters.priceTo
            }
        }
        delete filters.size_sm
        delete filters.priceFrom
        delete filters.priceTo
        delete filters.searchName


        if (Object.keys(filters).length == 0) {
            filters = undefined
        }
    }
    const subQueryRating = db
        .selectFrom('product')
        .leftJoin('pizzadetails', 'product.product_id', 'pizzadetails.product_id')
        .leftJoin('orderdetails', 'pizzadetails.id', 'orderdetails.pizzadetails_id')
        .select([
            'product.product_id',
            sql<number>`count(order_details_id)`.as('rating')
        ])
        .where('p_type', '=', type)
        .groupBy('product.product_id');
    let subQueryPrices = db
        .selectFrom('product')
        .leftJoin('pizzadetails', 'product.product_id', 'pizzadetails.product_id')
        .select([
            'product.product_id',
            sql<number>`min(pizzadetails.price)`.as('minprice'),
            sql<number>`count(pizzadetails.price)`.as('numofprice')
        ])
    if (size_sm && size_condition) {
        subQueryPrices = subQueryPrices
            .where('pizzadetails.size_cm', size_condition, size_sm)
    }
    subQueryPrices = subQueryPrices.groupBy('product.product_id');

    let query = db
        .selectFrom('product')
        .leftJoin('composition', 'composition.product_id', 'product.product_id')
        .leftJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
        .$if(type === 'піца' && Boolean(size_sm) || type !== 'піца', (qb) => qb
            .leftJoin('pizzadetails', 'product.product_id', 'pizzadetails.product_id')
            // .where('pizzadetails.size_cm', '=', size_sm!)
            .$if(Boolean(size_sm), (qb) => qb.where('pizzadetails.size_cm', '=', size_sm!))

            .$if(Boolean(priceFrom), (qb) => qb.where('pizzadetails.price', '>=', priceFrom!))
            .$if(Boolean(priceTo), (qb) => qb.where('pizzadetails.price', '<=', priceTo!))
        )
        .$if(Boolean(sort), (qb) => qb
            .$if(sort!.sortRule === 'rating', (qb) => qb
                .leftJoin(subQueryRating.as('order_counts'), 'product.product_id', 'order_counts.product_id')
                .select(['order_counts.rating'])
                .groupBy(['rating'])
            )
            .orderBy(sql.ref(sort!.sortRule), sort!.direction)
        )
        .leftJoin(subQueryPrices.as('prices'), 'prices.product_id', 'product.product_id')
        .select([
            'product.product_id',
            `prices.minprice`,
            `prices.numofprice`,
            'p_name',
            'p_type',
            'is_available',
            'added_date',
            sql<string>`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
            sql<string>`COALESCE(STRING_AGG(i_name, ', '), 'немає складу')`.as('composition'),
        ])
        .$if(Boolean(searchName), (qb) => qb.where(sql`POSITION(${searchName!} IN p_name)`, '>', 0))
        .$if(Boolean(type), (qb) => qb.where('p_type', '=', type))
        .groupBy(['product.product_id', 'prices.minprice', 'numofprice'])
        .$if(!sort, (qb) => qb.orderBy('product.product_id'))
        .$if(Boolean(limit), (qb) => qb.limit(limit!))

    if (filters) {
        for (const value in filters) {
            console.log(filters)
            const ingredients = filters[value].split(",")
                .map((elem) => {
                    elem = elem.replace("'", "''")
                    return `'${elem}'`
                });
            query = query.having(sql.raw(`SUM(CASE WHEN i_name in (${ingredients}) THEN 1 ELSE 0 END)`), '>=', 1)
        }
    }
    try {
        console.log(query.compile())
        const result = await query.execute();
        return result;
    } catch (err) {
        console.error('Помилка:', err);
        return [];
    }
};
