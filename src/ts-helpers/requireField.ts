export type RequireField<T, K extends keyof T> = Required<Pick<T, K>> & T
