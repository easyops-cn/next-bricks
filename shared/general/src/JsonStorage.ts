export class JsonStorage {
  constructor(
    private storage: Storage,
    private prefix: string = "brick-next-"
  ) {}

  setItem<T = any>(name: string, value: T): void {
    this.storage.setItem(this.prefix + name, JSON.stringify(value));
  }

  getItem<T = any>(name: string): T {
    return JSON.parse(this.storage.getItem(this.prefix + name) as string) as T;
  }

  removeItem(name: string): void {
    return this.storage.removeItem(this.prefix + name);
  }

  clear(): void {
    return this.storage.clear();
  }
}
