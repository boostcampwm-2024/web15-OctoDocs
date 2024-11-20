import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from '../page/page.service';
import { EdgeService } from '../edge/edge.service';
import { NodeService } from '../node/node.service';
import { YjsService } from './yjs.service';
import { NodeCacheService } from '../node-cache/node-cache.service';

describe('PageService', () => {
  const dummyNovelData = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'asdf',
          },
        ],
      },
      {
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: {
              checked: false,
            },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '아녕하세요',
                  },
                ],
              },
            ],
          },
          {
            type: 'taskItem',
            attrs: {
              checked: false,
            },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: '하하',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: '제목임',
          },
        ],
      },
      {
        type: 'heading',
        attrs: {
          level: 2,
        },
        content: [
          {
            type: 'text',
            text: '네목임',
          },
        ],
      },
      {
        type: 'heading',
        attrs: {
          level: 3,
        },
        content: [
          {
            type: 'text',
            text: '세목임',
          },
        ],
      },
      {
        type: 'bulletList',
        attrs: {
          tight: true,
        },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'gfsd',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'gfsd',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'hgfd',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'orderedList',
        attrs: {
          tight: true,
          start: 1,
        },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'gsf',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'hgfddf',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'fd',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'codeBlock',
        attrs: {
          language: null,
        },
        content: [
          {
            type: 'text',
            text: 'codingdi',
          },
        ],
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'dlsdydla',
              },
            ],
          },
        ],
      },
      {
        type: 'youtube',
        attrs: {
          src: 'https://www.youtube.com/watch?v=_2p2pFUoS5c',
          start: 0,
          width: 640,
          height: 480,
        },
      },
      {
        type: 'paragraph',
      },
      {
        type: 'twitter',
        attrs: {
          src: 'https://x.com/withyou3542',
        },
      },
      {
        type: 'paragraph',
      },
      {
        type: 'paragraph',
      },
    ],
  };
  let yjsService: YjsService;
  let pageService: PageService;
  let nodeService: NodeService;
  let edgeService: EdgeService;
  let nodeCacheService: NodeCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YjsService,
        {
          provide: PageService,
          useValue: {},
        },
        {
          provide: PageService,
          useValue: {},
        },
        {
          provide: NodeService,
          useValue: {},
        },
        {
          provide: EdgeService,
          useValue: {},
        },
        {
          provide: NodeCacheService,
          useValue: {},
        },
      ],
    }).compile();

    yjsService = module.get<YjsService>(YjsService);
    pageService = module.get<PageService>(PageService);
    nodeService = module.get<NodeService>(NodeService);
    edgeService = module.get<EdgeService>(EdgeService);
    nodeCacheService = module.get<NodeCacheService>(NodeCacheService);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(yjsService).toBeDefined();
    expect(pageService).toBeDefined();
    expect(nodeService).toBeDefined();
    expect(edgeService).toBeDefined();
    expect(nodeCacheService).toBeDefined();
  });

  it('모든 페이지 목록을 조회할 수 있다.', async () => {});

  describe('createPage', () => {
    it('페이지를 성공적으로 생성한다.', async () => {});
  });
});
