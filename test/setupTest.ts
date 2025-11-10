// Configuración de variables de entorno para los tests e2e
process.env.PORT = '3000';
process.env.NATS_SERVERS = 'nats://localhost:4222';

// Mock de console para evitar logs innecesarios durante los tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
