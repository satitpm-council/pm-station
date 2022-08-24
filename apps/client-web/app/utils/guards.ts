export const isString = (test: any): test is string => {
    return test && typeof test === "string"
}

export const isNumber = (test: any): test is number => {
    return test && typeof test === "number"
}