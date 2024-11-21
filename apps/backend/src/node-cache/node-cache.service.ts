import { Injectable } from '@nestjs/common';
import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

type CacheValue = { title: string; isHolding: boolean };

@Injectable()
export class NodeCacheService {
  private cache: CacheContainer;
  private ttlTime: number;

  constructor() {
    this.ttlTime = 10;
    this.cache = new CacheContainer(new MemoryStorage());
  }

  async set(nodeId: number, value: CacheValue): Promise<void> {
    const config = { ttl: this.ttlTime };
    await this.cache.setItem(nodeId.toString(), value, config);
  }

  async get(nodeId: number): Promise<CacheValue | undefined> {
    return await this.cache.getItem<CacheValue>(nodeId.toString());
  }

  async has(nodeId: number): Promise<boolean> {
    const item = await this.cache.getItem(nodeId.toString());
    return item !== undefined;
  }

  async hasSameTitle(nodeId: number, title: string): Promise<boolean> {
    const savedCacheValue = await this.get(nodeId);
    return !!savedCacheValue && savedCacheValue.title === title;
  }

  async isHoldingStatusChanged(
    nodeId: number,
    isHolding: boolean,
  ): Promise<boolean> {
    const savedCacheValue = await this.get(nodeId);
    return !!savedCacheValue && savedCacheValue.isHolding !== isHolding;
  }
}
