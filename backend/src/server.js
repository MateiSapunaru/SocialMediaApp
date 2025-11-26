const createApp = require('./app');
const { PORT } = require('./config/env');

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
