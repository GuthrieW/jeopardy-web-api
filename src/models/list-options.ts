export class ListOptions {
    limit: number
    offset: number
    order: 'ASC' | 'DESC'
    sort: string

    constructor({
        limit,
        offset,
        order,
        sort,
    }: {
        limit: number | null
        offset: number | null
        order: 'ASC' | 'DESC' | null
        sort: string | null
    }) {
        if (limit && limit > 100) {
            limit = 100
        }

        this.limit = limit || 10
        this.offset = offset || 0
        this.order = order || 'DESC'
        this.sort = sort || 'id'
    }
}
