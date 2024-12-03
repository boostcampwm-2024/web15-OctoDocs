// yMap에 저장되는 Node 형태
export type YMapNode = {
  id: string; // 노드 아이디
  type: string; // 노드의 유형
  data: {
    title: string; // 제목
    id: number; // 페이지 아이디
    emoji: string | null;
  };
  position: {
    x: number; // X 좌표
    y: number; // Y 좌표
  };
  color: string; // 색상
  selected: boolean;
  isHolding: boolean;
};

// yMap에 저장되는 edge 형태
export type YMapEdge = {
  id: string; // Edge 아이디
  source: string; // 출발 노드 아이디
  target: string; // 도착 노드 아이디
  sourceHandle: string;
  targetHandle: string;
};
