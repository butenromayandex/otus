export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public age: number,
  ) {}

  isValidEmail(): boolean {
    return Boolean(this.email?.includes('@'))
  }
}
