export default function sqlError(message: string, error: unknown): void {
    console.error(`${message}\n${JSON.stringify(error)}`)
}
