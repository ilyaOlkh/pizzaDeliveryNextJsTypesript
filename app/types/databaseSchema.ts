interface product {
    product_id: number
    p_type: 'піца' | 'суші' | 'напої' | 'закуски' | 'десерти' | 'соуси'
    p_name: string
    is_available: boolean
    added_date: string
    image_url: string | null
}

interface ingredient {
    ingredient_id: number
    i_type: 'сири' | 'соуси' | "м'ясо" | 'ковбаси' | 'морепродукти' | 'овочі' | 'гриби' | 'трави' | 'фрукти' | 'риба' | 'водорості' | 'інше'
    i_name: string
    price: number
}

interface composition {
    сomposition_id: number
    product_id: number
    ingredient_id: number
}

interface pizzadetails {
    id: number
    product_id: number
    size_cm: '20' | '28' | '33' | null
    weight_g: number
    price: number
}

interface worker {
    worker_id: number
    worker_type: 'офіціант' | 'касир'
    first_name: string
    last_name: string
    phone: string
    account: number | null
    role: string | null
}

interface customer {
    customer_id?: number
    first_name: string
    last_name: string
    phone: string
    email: string
    street: string
    house: string
    entrance: string | null
    floor: number | null
    apartment: number | null
    intercom_code: string | null
    discount: number
    password: string
    refreshtoken: string
}

interface order_ {
    order_id: number
    customer_id: number
    worker_id: number
    order_date_time: string
    status: 'готується' | 'доставляється' | 'доставлено' | 'скасовано'
    payment: 'оплачено' | 'потрібно оплатити'
    delivery: 'доставка' | 'самовивіз'
}

interface orderdetails {
    order_details_id: number
    order_id: number
    pizzadetails_id: number
    dough: string | null
    quantity: number
    selled_price: number
}

export interface Database {
    product: product
    ingredient: ingredient
    composition: composition
    pizzadetails: pizzadetails
    worker: worker
    customer: customer
    order_: order_
    orderdetails: orderdetails
}