import * as z from "zod/v4";

const foodSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative()
})
const snakeSegmentSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative()
});
const obstacleSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative()
})
const playerSchema = z.object({
  playerName: z.string(),
  snakeSegments: z.array(snakeSegmentSchema),
  startColor: z.string().nonempty().min(6).max(6).optional(),
  endColor: z.string().nonempty().min(6).max(6).optional(),
});

//------------------------

export const playerInitRequestSchema = z.object({
    type: z.literal("playerInitRequest"),
    playerName: z.string().nonempty()
});

export const playerInitResponseSchema = z.object({
  type: z.literal("playerInitResponse"),
  rows: z.number().min(1),
  columns: z.number().min(1),
  players: z.array(playerSchema).nonempty(),
  foodPositions: z.array(foodSchema),
  staticObstaclePositions: z.array(obstacleSchema),
  movingObstaclePositions: z.array(obstacleSchema)
})

export const snakeLoopSchema = z.object({
  type: z.literal("snakeLoop"),
  players: z.array(playerSchema),
  food: z.array(foodSchema)
});

export const movingObstacleLoopSchema = z.object({
  type: z.literal("movingObstacleLoop"),
  movingObstacles: z.array(obstacleSchema)
});

export const straightControllerMovementInputsHeldSchema = z.object({
  type: z.literal("straightControllerMovementInputsHeld"),
  movementInputsHeld: z.array(z.string()).max(4)
})

export const unionSchema = z.discriminatedUnion("type", [
  playerInitRequestSchema,
  playerInitResponseSchema,
  snakeLoopSchema,
  movingObstacleLoopSchema,
  straightControllerMovementInputsHeldSchema
]);

export type InitMessage = z.infer<typeof playerInitRequestSchema>;
export type InitResponse = z.infer<typeof playerInitResponseSchema>;
export type SnakeLoopMessage = z.infer<typeof snakeLoopSchema>;
export type MovingObstacleLoopMessage = z.infer<typeof movingObstacleLoopSchema>;
export type StraightControllerMovementInputsHeldMessage = z.infer<typeof straightControllerMovementInputsHeldSchema>;
