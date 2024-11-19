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

  async set(nodeId: number, title: string): Promise<void> {
    const config = { ttl: this.ttlTime };
    await this.cache.setItem(nodeId.toString(), title, config);
  }

  async get(nodeId: number): Promise<String | undefined> {
    return await this.cache.getItem<String>(nodeId.toString());
  }

  async has(nodeId: number): Promise<boolean> {
    const item = await this.cache.getItem(nodeId.toString());
    return item !== undefined;
  }

  async hasSameTitle(nodeId: number, title: string): Promise<boolean> {
    const savedTitle = await this.get(nodeId);
    return !!savedTitle && savedTitle === title;
  }
}
