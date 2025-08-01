import pg from 'pg';

const { Client } = pg;

export class DatabasePostgres {
  #client;

  constructor() {
    this.#client = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/first_nodejs_db'
    });
  }

  async connect() {
    await this.#client.connect();
  }

  async list() {
    const result = await this.#client.query('SELECT * FROM videos ORDER BY created_at DESC');
    return result.rows;
  }

  async create(video) {
    const { title, description, duration } = video;
    const result = await this.#client.query(
      'INSERT INTO videos (title, description, duration) VALUES ($1, $2, $3) RETURNING *',
      [title, description, duration]
    );
    return result.rows[0];
  }

  async update(id, video) {
    const { title, description, duration } = video;
    const result = await this.#client.query(
      'UPDATE videos SET title = $1, description = $2, duration = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, description, duration, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.#client.query('DELETE FROM videos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  async disconnect() {
    await this.#client.end();
  }
}