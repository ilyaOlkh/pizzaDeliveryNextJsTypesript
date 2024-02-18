import prompt from '../service/prompt.js'

const url = 'getFilters.php'

export default async function getFilters(type, filters1) {
    let filters;
    if (filters1 != {}) {
        filters = await prompt(url, { type: type, filters: filters1 })
    } else {
        filters = await prompt(url, { type: type })
    }
    return filters
}
