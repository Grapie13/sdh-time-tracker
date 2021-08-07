import { Connection, createConnection } from 'typeorm';

const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<Connection> => await createConnection({
      type: 'postgres',
      host: process.env.POSTGRES_HOSTNAME,
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/../entities/*.entity.{ts,js}'],
      synchronize: process.env.NODE_ENV !== 'production'
    })
  }
];

export { databaseProviders };
