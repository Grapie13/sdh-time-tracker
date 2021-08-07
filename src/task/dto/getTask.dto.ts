// Creating DTO properties with a bang operator (!),
// because strict checking is enabled in tsconfig.
class GetTaskDto {
  id!: number;
}

export { GetTaskDto };
