export class DatabaseMemory {
  #videos = new Map();

  list() {
    return Array.from(this.#videos.entries()).map(([id, video]) => ({
      id,
      ...video,
    }));
  }

  create(video) {
    const id = crypto.randomUUID();
    this.#videos.set(id, video);
  }

  update(id, video) {
    this.#videos.set(id, video);
  }

  delete(id) {
    this.#videos.delete(id);
  }
}
