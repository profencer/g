import { SHAPE } from '../types';
import type { BaseStyleProps } from '../types';
import { DisplayObject } from '../DisplayObject';
import { DisplayObjectConfig } from '../DisplayObject';

export interface CircleStyleProps extends BaseStyleProps {
  r: number;
}
export class Circle extends DisplayObject<CircleStyleProps> {
  constructor({ style, ...rest }: DisplayObjectConfig<CircleStyleProps>) {
    super({
      type: SHAPE.Circle,
      style: {
        r: 0,
        opacity: 1,
        ...style,
      },
      ...rest,
    });
  }
}