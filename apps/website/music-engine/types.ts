export abstract class MusicEngine {
  constructor() {}
  abstract search(q: string): Promise<any[]>;
}
