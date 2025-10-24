import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
const { DATABASE_URL, PORT } = config;

async function bootstrap() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log(`Database connection successful`);
    app.listen(PORT, () => {
      console.log(`Application running on port: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect database:', error);
    process.exit(1);
  }

  process.on('unhandledRejection', (error) => {
    console.log('UnhandledRejection:', error);
    process.exit(1);
  });
}

bootstrap();
