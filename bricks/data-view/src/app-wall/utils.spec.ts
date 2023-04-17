import {
    getCenterPointOrSubPoint,
    createTrapezoidalTopOrBottomElement,
    createTrapezoidalRightOrLeftElement,
    createTrapezoidalObject,
    eulerToXYZ,
    getCoordinates,
    createCardItems,
    AppData,
    createRelationLine,
    vector3ToXYZ,
    xyzToVector3
} from "./utils.js";
import {describe, test, expect} from "@jest/globals";
import {dataSource} from "./mockData.js"
import {Euler, Vector3} from "three";
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
        expect(getCenterPointOrSubPoint(data.start, data.end)).toStrictEqual(data.result)
    })
    test.each([[[0,0,0],{x:0,y:0,z:0}],[[1,1,1],{x:1,y:1,z:1}]])("vector3ToXYZ & xyzToVector3",(a,res)=>{
        expect(vector3ToXYZ(new Vector3(a[0],a[1],a[2]))).toStrictEqual(res);
        expect(xyzToVector3(res as { x: number, y: number, z: number })).toStrictEqual(new Vector3(a[0],a[1],a[2]));
    })

    test("eulerToXYZ",()=>{
        expect(eulerToXYZ(new Euler(0,0,0))).toStrictEqual({x: 0, y:0,z:0})
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
    test("getCoordinates", () =>{
        const  result = getCoordinates(4, 2);
        expect(result).toHaveProperty("elementWidth",1074.1909650384132);
        expect(result).toHaveProperty("elementHeight",890);
       })
    test("createCardItems",()=>{
      const {css3DObjects} = createCardItems(dataSource as AppData[]);
      expect(css3DObjects.length).toBe(52);
      const {css3DObjects:_css3DObjects} = createCardItems([...dataSource,...dataSource,...dataSource,...dataSource,...dataSource] as AppData[]);
        expect(_css3DObjects.length).toBe(233); //测试超出数量不显示

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
            rightBtnName: "监控目标"
        } );
        expect(object).toHaveProperty("position", new Vector3(0,0,0));
        expect(object.children.length).toBe(6);
        expect(object.children.at(5).children.length).toBe(2);
        const _object =  createTrapezoidalObject({
            objectData: {
                width: 50,
                height: 60,
                point: [0,1,0]
            }
        });
        expect(_object).toHaveProperty("position",new Vector3(0,1,0) );
        expect(_object.children.length).toBe(6);
        expect(_object.children.at(5).children.length).toBe(0);

    })



})
