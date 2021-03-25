import { ContextService, Renderable, ShapeRenderer, ShapeRendererFactory } from '@antv/g-core';
import { Entity } from '@antv/g-ecs';
import { inject, injectable } from 'inversify';
import { FrameGraphHandle } from '../../components/framegraph/FrameGraphHandle';
import { FrameGraphPass } from '../../components/framegraph/FrameGraphPass';
import { PassNode } from '../../components/framegraph/PassNode';
import { ResourcePool } from '../../components/framegraph/ResourcePool';
import { RenderingEngine } from '../../services/renderer';
import { gl } from '../../services/renderer/constants';
import { FrameGraphEngine, IRenderPass } from '../FrameGraphEngine';
import { RenderingContext } from '../../services/WebGLContextService';

export interface RenderPassData {
  output: FrameGraphHandle;
}

@injectable()
export class RenderPass implements IRenderPass<RenderPassData> {
  public static IDENTIFIER = 'Render Pass';

  @inject(RenderingEngine)
  private readonly engine: RenderingEngine;

  @inject(ResourcePool)
  private readonly resourcePool: ResourcePool;

  @inject(ContextService)
  private readonly contextService: ContextService<RenderingContext>;

  @inject(ShapeRendererFactory)
  private shapeRendererFactory: (type: string) => ShapeRenderer | null;

  public setup = (fg: FrameGraphEngine, passNode: PassNode, pass: FrameGraphPass<RenderPassData>): void => {
    const output = fg.createRenderTarget(passNode, 'color buffer', {
      width: 1,
      height: 1,
      usage: gl.RENDER_ATTACHMENT | gl.SAMPLED | gl.COPY_SRC,
    });

    pass.data = {
      output: passNode.write(fg, output),
    };
  };

  public execute = async (
    fg: FrameGraphEngine,
    pass: FrameGraphPass<RenderPassData>,
    entities: Entity[]
  ): Promise<void> => {
    const resourceNode = fg.getResourceNode(pass.data.output);
    const framebuffer = this.resourcePool.getOrCreateResource(resourceNode.resource);

    const canvas = this.engine.getCanvas();
    framebuffer.resize({
      width: canvas.width,
      height: canvas.height,
    });

    // this.engine.setScissor({
    //   enable: false,
    // });
    this.engine.clear({
      framebuffer,
      color: this.contextService.getContext()?.view.getClearColor(), // TODO: use clearColor defined in view
      depth: 1,
    });

    this.engine.useFramebuffer(framebuffer, () => {
      for (const entity of entities) {
        const renderable = entity.getComponent(Renderable);
        const renderer = this.shapeRendererFactory(renderable.type);
        // must do rendering in a sync way
        renderer?.render(entity);
      }
    });
  };
}
