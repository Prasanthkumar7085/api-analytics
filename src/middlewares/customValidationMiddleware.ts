export interface CustomErrorInterface {
    status?: number
    errorCode?: string
    errors?: any
    message?: string,
    metadata?: any
}

export class CustomError extends Error {
    status: number
    errorCode: string
    errors?: any
    metadata?: any

    constructor(status?: number, message?: string, errorCode?: string, errors?: any, metadata?: any) {
        super(message)
        this.status = status
        this.errorCode = errorCode
        this.message = message
        this.errors = errors
        this.metadata = metadata;
    }

    setStatusCode(statusCode) {
        this.status = statusCode
    }

    setErrorCode(errorCode) {
        this.errorCode = errorCode
    }

    setMessage(message) {
        this.message = message
    }

    setMetadata(data) {
        this.metadata = data
    }
}

