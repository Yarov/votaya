import mongoose from 'mongoose';
import { logger } from './logger';

// Variable global para mantener la conexión a través de hot reloads
let isConnected = false;

// Variable para mantener la promesa de conexión
let connectionPromise: Promise<mongoose.Connection> | null = null;

// Función para limpiar modelos existentes
function clearModels() {
  try {
    Object.keys(mongoose.models).forEach(key => {
      delete mongoose.models[key];
      logger.info(`Deleted model: ${key}`);
    });
  } catch (error) {
    logger.error('Error clearing models:', error);
  }
}

export async function connectDB() {
  if (isConnected) {
    logger.info('Using existing MongoDB connection');
    return;
  }

  if (connectionPromise) {
    logger.info('Waiting for existing connection promise');
    await connectionPromise;
    return;
  }

  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    logger.error('No MongoDB URI provided');
    throw new Error('No MongoDB URI provided');
  }

  try {
    logger.info('Connecting to MongoDB...');
    
    // Configuración de conexión
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    // Limpiar modelos existentes antes de conectar
    clearModels();

    connectionPromise = mongoose.connect(dbUri, options).then((mongoose) => mongoose.connection);
    const conn = await connectionPromise;
    
    // Configurar eventos de conexión
    mongoose.connection.on('connected', () => {
      logger.info('Connected to MongoDB');
      isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  } finally {
    connectionPromise = null;
  }
}

// Función para desconectar MongoDB
export async function disconnectDB() {
  if (isConnected) {
    try {
      // Limpiar modelos antes de desconectar
      clearModels();
      
      await mongoose.disconnect();
      isConnected = false;
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
    }
  }
}

// Exportar la función de limpieza de modelos
export { clearModels };

export default connectDB;
