import { Injectable } from '@nestjs/common';
import { EdgeRepository } from './edge.repository';

@Injectable()
export class EdgeService {
  constructor(private edgeRepository: EdgeRepository) {}
}
