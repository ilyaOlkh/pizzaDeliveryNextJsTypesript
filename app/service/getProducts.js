'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export default async (req) => {

    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    const type = req.type;
    let filters = { ...req.filters };
    const limit = req.limit;
    const sort = req.sort;
    let size_sm;
    let priceFrom;
    let priceTo;
    let searchName;

    if (filters) {
        if (filters.searchName) {
            searchName = filters.searchName
        }
        if (filters.size_sm) {
            size_sm = filters.size_sm.replace('см', '')
            if (size_sm != 'null') {
                size_sm = `= '${size_sm}'`
                console.log(filters)

            } else {
                size_sm = `IS NULL`
            }
            if (filters.priceFrom) {
                priceFrom = filters.priceFrom
            }
            if (filters.priceTo) {
                priceTo = filters.priceTo
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
    let query = db
        .selectFrom('product')
        .leftJoin('composition', 'composition.product_id', 'product.product_id')
        .leftJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
    if (size_sm) {
        query = query.leftJoin('pizzadetails', 'product.product_id', 'pizzadetails.product_id')
    }
    if (sort?.sortRule == 'rating') {
        query = query.leftJoin(sql(`(SELECT 
        product.product_id, 
        count(order_details_id) as rating
    FROM 
        product
    LEFT JOIN 
        pizzadetails ON product.product_id = pizzadetails.product_id
    LEFT JOIN 
        orderdetails ON pizzadetails.id = orderdetails.pizzadetails_id
    WHERE 
        p_type = '${type}'
    GROUP BY 
        product.product_id) AS order_counts`), 'product.product_id', 'order_counts.product_id')
    }
    query = query.leftJoin(sql(`(
        SELECT 
            product.product_id as product_id,
            min(pizzadetails.price) as minprice, 
            count(pizzadetails.price) as numofprice
        FROM 
            product
        LEFT JOIN 
            pizzadetails ON product.product_id = pizzadetails.product_id
        ${size_sm ? ('WHERE pizzadetails.size_cm ' + size_sm) : ''}
        GROUP BY 
            product.product_id) AS prices`), 'prices.product_id', 'product.product_id')
        .select([
            'product.product_id',
            `prices.minprice`,
            `prices.numofprice`,
            'p_name',
            // 'pizzadetails.size_cm',
            (sort?.sortRule == 'rating') ? 'order_counts.rating' : null,
            'is_available',
            'added_date',
            // 'image_url',
            sql`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
            sql`COALESCE(STRING_AGG(i_name, ', '), 'немає складу')`.as('composition'),
        ].filter(Boolean))

    let whereArr = []
    if (searchName) {
        whereArr.push(`POSITION('${searchName}' IN p_name) > 0`)
    }
    if (type) {
        whereArr.push(`p_type = '${type}'`)
    }
    if (size_sm) {
        whereArr.push(`pizzadetails.size_cm ${size_sm}`)
        if (priceFrom) {
            whereArr.push(`pizzadetails.price >= ${priceFrom}`)
        }
        if (priceTo) {
            whereArr.push(`pizzadetails.price <= ${priceTo}`)
        }
    }
    query = query.where(sql(`${whereArr.join(' AND ')}`));
    query = query.groupBy(sql(`product.product_id, minprice, numofprice${(sort?.sortRule == 'rating') ? ', rating' : ''}`));
    if (filters) {
        let querytextGlobal = ``
        for (const value in filters) {
            const ingredients = filters[value].split(",").map((elem) => {
                elem = elem.replace(/'/g, "''")
                return `'${elem}'`
            });
            let querytext = ''
            ingredients.forEach(element => {
                querytext += element + ', '
            });
            querytext = querytext.slice(0, -2);
            querytextGlobal += `SUM(CASE WHEN i_name in (${querytext}) THEN 1 ELSE 0 END) >= 1 AND `
        }
        querytextGlobal = querytextGlobal.slice(0, -4);

        query = query.having(sql(querytextGlobal));
    }
    if (sort) {
        query = query.orderBy(sql(sort.sortRule), sort.direction)
    } else {
        query = query.orderBy('product.product_id');
    }
    if (limit) {
        query = query.limit(limit);
    }
    try {
        const result = await query.execute();
        return result;
    } catch (err) {
        console.error('Помилка:', err);
        return [];
    }
};
