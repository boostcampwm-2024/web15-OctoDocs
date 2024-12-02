import * as Y from 'yjs';

// Y.Doc에는 name 컬럼이 없어서 생성했습니다.
export class CustomDoc extends Y.Doc {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
