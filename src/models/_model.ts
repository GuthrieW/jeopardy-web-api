export interface Model<T, C> {
    TableName: string
    insert: (input: C) => Promise<boolean>
    insertMany?: (input: C[]) => Promise<boolean>
    fetchById?: (id: string) => Promise<T | null>
}
