export interface BlockState {
  x: number // 块的横坐标
  y: number // 块的纵坐标
  revealed: boolean // 是否已经揭开
  mine?: boolean // 是否是雷
  flagged?: boolean // 是否是标记
  adjacentMines: number // 邻近的雷数
}// 块的状态
