export class SimulatedFailureError extends Error {
  constructor() {
    super('Simulated failure')
    this.name = 'SimulatedFailureError'
  }
}
