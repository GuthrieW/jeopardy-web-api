export type ApiError = {
    status: 'error'
    message: string
}

export type ApiSuccess = {
    status: 'success'
    payload: T
}

export type ApiResponse<T> = ApiSuccess | ApiError
