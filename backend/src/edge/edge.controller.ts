import { Controller } from '@nestjs/common';
import { EdgeService } from './edge.service';

@Controller('edge')
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}
}
