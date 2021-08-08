import { expect } from 'chai';
import { Group } from '..';
import { container } from '../inversify.config';
import { SceneGraphService } from '../services';

describe('DisplayObject Sort', () => {
  const sceneGraphService = container.get<SceneGraphService>(SceneGraphService);

  it('should sort children correctly', () => {
    const group1 = new Group({
      id: 'id1',
      name: 'group1',
      style: {
        zIndex: 1,
      }
    });
    const group2 = new Group({
      id: 'id2',
      name: 'group2',
    });
    const group3 = new Group({
      id: 'id3',
      name: 'group3',
    });
    const group4 = new Group({
      id: 'id4',
      name: 'group4',
    });

    // 1 -> 2
    // 1 -> 3
    // 1 -> 4
    group1.appendChild(group2);
    group1.appendChild(group3);
    group1.appendChild(group4);

    expect(group1.style.zIndex).to.eqls(1);
    expect(group1.getCount()).to.eqls(3);
    expect(group1.getChildren().length).to.eqls(3);
    expect(group1.getFirst()).to.eqls(group2);
    expect(group1.getLast()).to.eqls(group4);

    // 2, 3, 4
    const children = [...group1.children];
    children.sort(sceneGraphService.sort);
    expect(children[0]).to.eqls(group2);
    expect(children[2]).to.eqls(group4);

    // bring group2 to front
    // 3, 4, 2(1)
    group2.setZIndex(1);
    children.sort(sceneGraphService.sort);
    expect(children[0]).to.eqls(group3);
    expect(children[2]).to.eqls(group2);

    // bring group3 to front
    // 4, 2(1), 3(2)
    group3.setZIndex(2);
    children.sort(sceneGraphService.sort);
    expect(children[0]).to.eqls(group4);
    expect(children[2]).to.eqls(group3);

    // use stable sort with the same z-index
    // 2(1), 4(1), 3(2)
    group4.setZIndex(1);
    children.sort(sceneGraphService.sort);
    expect(children[0]).to.eqls(group2);
    expect(children[2]).to.eqls(group3);

    // bring to front
    // 4(1), 3(2), 2(3)
    group2.toFront();
    children.sort(sceneGraphService.sort);
    expect(children[0]).to.eqls(group4);
    expect(children[2]).to.eqls(group2);
    expect(group2.style.zIndex).to.eqls(3);

    // push to back
    group2.toBack();
    children.sort(sceneGraphService.sort);
    expect(children[0]).to.eqls(group2);
    expect(children[2]).to.eqls(group3);
    expect(group2.style.zIndex).to.eqls(0);
  });
});
