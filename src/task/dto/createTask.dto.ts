// Creating entity properties with a bang operator (!),
// because strict checking is enabled in tsconfig.
class CreateTaskDto {
  name!: string;
  tracked?: boolean;
}

export { CreateTaskDto };
