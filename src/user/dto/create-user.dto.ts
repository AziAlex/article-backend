import { ApiProperty } from "@nestjs/swagger";

export class GetUserDto {
  @ApiProperty({ example: '31d6c6b4-9280-4071-9ba0-958ded6b8f22' })
  id: string
  @ApiProperty({ example: 'islamgasanov532@gmail.com' })
  mail: string
  @ApiProperty({ example: false })
  verified: boolean
  @ApiProperty({ example: '2024-02-11T21:44:34.040Z' })
  createdAt: Date
  @ApiProperty({ example: '2024-02-11T21:44:34.040Z' })
  updatedAt: Date
}
