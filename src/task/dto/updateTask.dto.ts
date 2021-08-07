// Creating DTO properties with a bang operator (!),
// because strict checking is enabled in tsconfig.
class UpdateTaskDto {
  id!: number;
  name?: string;
  tracked?: boolean;
}

export { UpdateTaskDto };
