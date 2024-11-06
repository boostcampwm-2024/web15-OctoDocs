import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './page.dto';
import { Page } from './page.entity';

describe('PageController', () => {
  let controller: PageController;
  let service: PageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageController],
      providers: [
        {
          provide: PageService,
          useValue: {
            createPage: jest.fn(),
            deletePage: jest.fn(),
            updatePage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PageController>(PageController);
    service = module.get<PageService>(PageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPage', () => {
    it('should create a page and return a success message', async () => {
      const page: Page = {
        id: 1,
        title: 'Test Page',
        content: null,
        node: null,
      };
      const dto: CreatePageDto = {
        title: 'Test Page',
        content: null,
        x: 0,
        y: 0,
      };
      jest.spyOn(service, 'createPage').mockResolvedValue(page);

      const result = await controller.createPage(dto);
      expect(result).toEqual({
        message: 'Page and related Node successfully created',
        page,
      });
      expect(service.createPage).toHaveBeenCalledWith(dto);
    });
  });

  describe('deletePage', () => {
    it('should delete a page and return a success message', async () => {
      jest.spyOn(service, 'deletePage').mockResolvedValue();

      const result = await controller.deletePage(1);
      expect(result).toEqual({
        message: 'Page with ID 1 successfully deleted',
      });
      expect(service.deletePage).toHaveBeenCalledWith(1);
    });
  });

  describe('updatePage', () => {
    it('should update a page and return a success message', async () => {
      const page: Page = {
        id: 1,
        title: 'Updated Page',
        content: null,
        node: null,
      };
      const dto: UpdatePageDto = { title: 'Updated Page', content: null };
      jest.spyOn(service, 'updatePage').mockResolvedValue(page);

      const result = await controller.updatePage(1, dto);
      expect(result).toEqual({
        message: 'Page and related Node successfully updated',
        page,
      });
      expect(service.updatePage).toHaveBeenCalledWith(1, dto);
    });
  });
});
