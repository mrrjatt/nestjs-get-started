import { Transform } from 'class-transformer';

export function TransformTrim() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );
}
