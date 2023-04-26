import {
    getCenterPointOrSubPoint,
    createTrapezoidalTopOrBottomElement,
    createTrapezoidalRightOrLeftElement,
    createTrapezoidalObject,
    createRelationLine,
    getAppRelations,
    setAppPosition, AppData,
} from "./utils.js";
import {describe, test, expect} from "@jest/globals";
import { Vector3, Vector3Tuple} from "three";
import {CSS3DObject} from "three/addons/renderers/CSS3DRenderer.js";
const trapezoidalParams = {
    BW:50,
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

    test("createTrapezoidalObject & createTrapezoidalRightOrLeftElement", ()=> {
        expect(createTrapezoidalTopOrBottomElement({...trapezoidalParams,isTop: true})).toHaveProperty("position",
            new Vector3(0,-60, 115)
        );
        expect(createTrapezoidalTopOrBottomElement({...trapezoidalParams,isTop: false})).toHaveProperty("position",
            new Vector3(0,60, 115)
        );
        expect(createTrapezoidalRightOrLeftElement({...trapezoidalParams,isLeft: true})).toHaveProperty("position",
            new Vector3(-112.5,0, 115)
        );
        expect(createTrapezoidalRightOrLeftElement({...trapezoidalParams,isLeft: false})).toHaveProperty("position",
            new Vector3(112.5,0, 115)
        );
     })


    test("createRelationLine",()=>{
        const result = createRelationLine(new Vector3(0,0,1), new Vector3(1,0,2), "blue" );
       expect(result).toBeTruthy();
       expect(result).toHaveProperty("isObject3D", true);
    })
    test("createTrapezoidalObject",()=>{
        const object = createTrapezoidalObject({
            objectData: {
                width: 50,
                height: 60,
                point: [0,0,0]
            },
            leftBtnName: "应用部署架构",
            rightBtnName: "监控目标",
            clusters: [{title: "主机容器",
                type: "host",
                data: [{
                    nodeTitle: "255.255.0",
                    type: "virtual-machine"
                }]}],
            columns: 5

        } );
        expect(object).toHaveProperty("position", new Vector3(0,0,0));
        expect(object.children.length).toBe(6);
        expect(object.children.at(5).children.length).toBe(2);
        const _object =  createTrapezoidalObject({
            objectData: {
                width: 50,
                height: 60,
                point: [0,1,0]
            },
            clusters: [{title: "k8s容器",
                type: "k8s",
                data: [{
                    nodeTitle: "255.255.0",
                    type: "virtual-machine"
                }]}],
        });
        expect(_object).toHaveProperty("position",new Vector3(0,1,0) );
        expect(_object.children.length).toBe(6);
        expect(_object.children.at(5).children.length).toBe(0);

    })
    test("getAppRelations",()=>{
        const element = document.createElement("div");
        const object = new CSS3DObject(element);
        expect(getAppRelations(object, [])).toMatchObject([])
    })
    test("setAppPosition",()=> {
        const data:AppData[] = [{
            key: "20201-21",
            status: "normal",
            cardItemProps: {
                cardTitle: 'cardTitle',
                description: 'description'
            },
            systemCardProps: {
                cardTitle: 'cardTitle',
                status: "normal"
            },
            trapezoidalProps: {
                leftBtnName: 'leftBtnName',
                rightBtnName: 'rightBtnName',
                clusters: [{
                    title: "集群容器",
                    type: 'host',
                    data: [{
                        type: 'physical-machine',
                        nodeTitle: '255.255.255',
                    }]
                }]

            }
        }];
        expect(setAppPosition([], 10, 10)).toMatchObject([]);
        expect(setAppPosition(data, 1, 2)).toMatchObject([{...data[0],x:1,y:1}])
    })
})
