const app = require('./app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Simple API for OTUS is running at http://localhost:${PORT}`);
});