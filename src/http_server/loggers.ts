export const logger = (command: string) => {
    console.log(`Received command: ${command}`)
}

export const loggerStatus = (isSuccess: boolean) => {
    const result = isSuccess ? 'SUCCESS' : "FAIL"
    console.log(`Operation result: ${result}`)
}