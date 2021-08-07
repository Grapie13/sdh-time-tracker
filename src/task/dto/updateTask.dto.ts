// Creating DTO properties with a bang operator (!),
// because strict checking is enabled in tsconfig.
class UpdateTaskDto {
  id!: number;
  newTaskName?: string;
  tracked?: boolean;
}

export { UpdateTaskDto };
