export class ValidationError {
  private readonly rule: string
  private readonly field: string
  private readonly customMessage?: string

  private readonly messages: Record<string, string> = {
  }

  constructor (
    rule: string,
    field: string,
    customMessage?: string
  ) {
    this.rule = rule
    this.field = field

    if (customMessage !== undefined && customMessage !== null) { this.customMessage = customMessage }
  }

  toString (): string {
    if (this.customMessage !== undefined && this.customMessage !== null) { return this.customMessage }

    return this.messages[this.rule]
  }
}
