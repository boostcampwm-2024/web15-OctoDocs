import { Injectable } from '@nestjs/common';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

type Node = {
  title: string;
  x: number;
  y: number;
};

@Injectable()
export class NodeCacheService {
  private cache: CacheContainer;
  private ttlTime: number;

  constructor() {
    this.ttlTime = 10;
    this.cache = new CacheContainer(new MemoryStorage());
  }

  async set(nodeId: number, value: Node): Promise<void> {
    const config = { ttl: this.ttlTime };
    await this.cache.setItem(nodeId.toString(), value, config);
  }

  async get(nodeId: number): Promise<Node | undefined> {
    return await this.cache.getItem<Node>(nodeId.toString());
  }

  async has(nodeId: number): Promise<boolean> {
    const item = await this.cache.getItem(nodeId.toString());
    return item !== undefined;
  }

  async hasSameTitle(nodeId: number, title: string): Promise<boolean> {
    const node = await this.get(nodeId);
    return !!node && node.title === title;
  }
}
