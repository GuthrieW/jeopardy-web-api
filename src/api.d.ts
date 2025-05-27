export type ApiError = {
    status: 'error'
    message: string
}

export type ApiResponse<T> =
    | {
          status: 'success'
          payload: T
      }
    | ApiError
