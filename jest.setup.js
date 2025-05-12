// Configuración global para Jest

// Mock para MongoDB
jest.mock('mongoose', () => {
  const mMongoDB = {
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      once: jest.fn(),
      on: jest.fn()
    },
    model: jest.fn().mockImplementation((modelName) => {
      return {
        findById: jest.fn().mockResolvedValue({}),
        findOne: jest.fn().mockResolvedValue({}),
        find: jest.fn().mockResolvedValue([]),
        lean: jest.fn().mockReturnThis(),
        create: jest.fn().mockResolvedValue({}),
        bulkWrite: jest.fn().mockResolvedValue({ matchedCount: 0, modifiedCount: 0 }),
        aggregate: jest.fn().mockResolvedValue([])
      };
    }),
    Types: {
      ObjectId: {
        isValid: jest.fn().mockReturnValue(true)
      }
    }
  };
  return mMongoDB;
});

// Configuración para evitar errores con fetch
global.fetch = jest.fn();

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});
