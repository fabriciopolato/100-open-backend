import app from './app';
import { PORT } from './configs/env';

app.listen(PORT, () => {
  console.log(`100openStartups is listening on port ${PORT}`);
});
