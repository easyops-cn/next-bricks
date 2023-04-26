import {
    getCenterPointOrSubPoint,
    createTrapezoidalTopOrBottomElement,
    createTrapezoidalRightOrLeftElement,
    createTrapezoidalObject,
    createRelationLine,
    getAppRelations,
    setAppPosition, AppData, findElementByEvent,
} from "./utils.js";
import { describe, test, expect } from "@jest/globals";
import { Vector3, Vector3Tuple } from "three";
import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
const trapezoidalParams = {
    BW: 50,
    BH: 60,
    TW: 400,
    TH: 180,
    d: 230,
}
describe("utils", () => {
    test.each([{
        start: [0, 0, 0],
        end: [1, 0, 0],
        result: {
            centerVector: new Vector3(0.5, 0, 0),
            subVector: new Vector3(-1, 0, 0)
        }
    },
    {
        start: [1, 0, 0],
        end: [-1, 0, 0],
        result: {
            centerVector: new Vector3(0, 0, 0),
            subVector: new Vector3(2, 0, 0)
        }
    }
    ])("getCenterPointOrSubPoint", (data) => {
        expect(getCenterPointOrSubPoint(data.start as Vector3Tuple, data.end as Vector3Tuple)).toStrictEqual(data.result)
    })

    test("createTrapezoidalObject & createTrapezoidalRightOrLeftElement", () => {
        expect(createTrapezoidalTopOrBottomElement({ ...trapezoidalParams, isTop: true })).toHaveProperty("position",
            new Vector3(0, -60, 115)
        );
        expect(createTrapezoidalTopOrBottomElement({ ...trapezoidalParams, isTop: false })).toHaveProperty("position",
            new Vector3(0, 60, 115)
        );
        expect(createTrapezoidalRightOrLeftElement({ ...trapezoidalParams, isLeft: true })).toHaveProperty("position",
            new Vector3(-112.5, 0, 115)
        );
        expect(createTrapezoidalRightOrLeftElement({ ...trapezoidalParams, isLeft: false })).toHaveProperty("position",
            new Vector3(112.5, 0, 115)
        );
    })


    test("createRelationLine", () => {
        const result = createRelationLine(new Vector3(0, 0, 1), new Vector3(1, 0, 2), "blue");
        expect(result).toBeTruthy();
        expect(result).toHaveProperty("isObject3D", true);
    })
    test("createTrapezoidalObject", () => {
        const object = createTrapezoidalObject({
            objectData: {
                width: 50,
                height: 60,
                point: [0, 0, 0]
            },
            leftBtnName: "应用部署架构",
            rightBtnName: "监控目标",
            clusters: [{
                title: "主机容器",
                type: "host",
                data: [{
                    nodeTitle: "255.255.0",
                    type: "virtual-machine"
                }]
            }],
            columns: 5

        });
        expect(object).toHaveProperty("position", new Vector3(0, 0, 0));
        expect(object.children.length).toBe(6);
        expect(object.children.at(5).children.length).toBe(2);
        const _object = createTrapezoidalObject({
            objectData: {
                width: 50,
                height: 60,
                point: [0, 1, 0]
            },
            clusters: [{
                title: "k8s容器",
                type: "k8s",
                data: [{
                    nodeTitle: "255.255.0",
                    type: "virtual-machine"
                }]
            }],
        });
        expect(_object).toHaveProperty("position", new Vector3(0, 1, 0));
        expect(_object.children.length).toBe(6);
        expect(_object.children.at(5).children.length).toBe(0);

    })
    test("getAppRelations", () => {
        const object = {
            userData:{
                key: '0'
            }
        } as any as CSS3DObject;
        const relationsData =[
            {
                source:'0',
                target:'1'
            },
            {
                source:'2',
                target:'0'
            },
        ]
        expect(getAppRelations(object, relationsData)).toMatchObject(relationsData)
    })
    test("setAppPosition", () => {
        expect(setAppPosition([], 0, 0)).toStrictEqual([])

        const table = Array.from({
            length: 2
        }).map((v, i) => ({
            key: `${i}`,
        })) as any as (AppData[]);
        const result = setAppPosition(table, 2, 1);
        expect(result).toStrictEqual(table.map((v, i) => ({
            ...v,
            x: i + 1,
            y: 1
        })));

        const table2 = Array.from({
            length: 3
        }).map((v, i) => ({
            key: `${i}`,
        })) as any as (AppData[]);
        const result2 = setAppPosition(table2, 2, 2);
        expect(result2).toStrictEqual(table2.map((v, i) => ({
            ...v,
            x: i % 2?i + 1:1,
            y: i>=2?2:1
        })));
    })
})
describe('findElementByEvent', () => {
    beforeEach(() => {
        Document.prototype.elementFromPoint = jest.fn(() => ({
            shadowRoot: new Document()
        })) as any;
    });
    test('should return null when no matching element is found', () => {
        const event = new MouseEvent('click', { clientX: 100, clientY: 100 });
        const result = findElementByEvent(event);
        expect(result).toBeNull();
    });

    test('should return the correct element when found in composed path', async () => {
        const target = document.createElement('data-view.app-wall-card-item');
        const innerHTML = `
          <div>Some content</div>
      `;
        target.attachShadow({ mode: 'open' }).innerHTML = innerHTML;
        const event = { clientX: 100, clientY: 100, composedPath: () => [target] } as any as MouseEvent;
        const result = findElementByEvent(event);
        expect(result).toBe(target);
    });
});

