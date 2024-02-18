import prompt from '../service/prompt.js'

const url = 'getProductTypes.php'

export default async function getProductTypes() {
    let types = await prompt(url)
    return types.map(type => {
        return type.p_type
    })
}