class HealthController {
  constructor() {
    this.healthResponse = {
      status: 'OK',
    };
  }

  getHealth(req, res) {
    res.send(this.healthResponse);
  }
}

module.exports = HealthController;