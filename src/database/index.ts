import knex from 'knex';
import config from '../config';
import knexConfig from './../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);


db.raw('SELECT 1')
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection failed', err));

export default db;