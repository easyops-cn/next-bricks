import {describe, test, expect,jest,afterEach} from "@jest/globals";
import {act} from "react-dom/test-utils";
import "./index.jsx";

import {CabinetContainer} from "./index.jsx";
import {CabinetNodeProps} from "../cabinet-node/index.js";

const data: CabinetNodeProps[] = [{
    type: "physical-machine",
    nodeTitle: "255.255.255"
}, {
    type: "physical-machine",
    nodeTitle: "255.255.200"
}
];
jest.mock("../../hooks/index.js", () => {
    return {
        useResizeObserver: jest.fn().mockReturnValue([{ current: null }, { clientWidth: 462, clientHeight: 500 }])
        // 最大 12 ，最小42;
    }
})

describe("data-view.cabinet-container", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("basic usage and maxSize", async () => {
        const element = document.createElement("data-view.cabinet-container") as CabinetContainer;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.data = data;
            element.customTitle = "集群容器";
            document.body.appendChild(element);
        })
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot.querySelector(".footer").textContent).toBe("集群容器");
        expect(element.shadowRoot.querySelector(".itemContent").getAttribute("style")).toBe("width: 109px;")
        expect(element.shadowRoot.querySelector(".item").getAttribute("style")).toBe("width: 92px;");
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("render minSize", async () => {
         const element = document.createElement("data-view.cabinet-container") as CabinetContainer;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.data = new Array(42).fill(data[0]);
            element.customTitle = "k8s容器";
            element.type= "k8s";
            element.status ="active";
            document.body.appendChild(element);
        })
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot.querySelector(".footer").textContent).toBe("k8s容器");
        expect(element.shadowRoot.querySelector(".container").classList.contains("container-active"))
        expect(element.shadowRoot.querySelector(".itemContent").getAttribute("style")).toBe("width: 62.285714285714285px;");
        expect(element.shadowRoot.querySelector(".item").getAttribute("style")).toBe("width: 56px;");
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("render data is empty", async () => {
        const element = document.createElement("data-view.cabinet-container") as CabinetContainer;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.data = [];
            element.customTitle = "淡化";
            element.type= "k8s";
            element.status ="faded";
            document.body.appendChild(element);
        })
        expect(element.shadowRoot).toBeTruthy();
        expect(element.shadowRoot.querySelector(".footer").textContent).toBe("淡化");
        expect(element.shadowRoot.querySelector(".container").classList.contains("container-faded"))
        expect(element.shadowRoot.querySelector(".content").innerHTML).toBeFalsy();
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("render middleSize and middleSize gt centerSize", async () => {
        const element = document.createElement("data-view.cabinet-container") as CabinetContainer;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.data = new Array(30).fill(data[0]);
            element.type= "k8s";
            element.status ="faded";
            document.body.appendChild(element);
        })
        expect(element.shadowRoot.querySelector(".itemContent").getAttribute("style")).toBe("width: 72.66666666666667px;");
        expect(element.shadowRoot.querySelector(".item").getAttribute("style")).toBe("width: 62.66666666666667px;");
        expect(element.shadowRoot).toBeTruthy();
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })
    test("render middleSize and middleSize lt centerSize", async () => {
        const element = document.createElement("data-view.cabinet-container") as CabinetContainer;
        expect(element.shadowRoot).toBeFalsy();
        act(() => {
            element.data = new Array(20).fill(data[0]);
            document.body.appendChild(element);
        })
        expect(element.shadowRoot.querySelector(".itemContent").getAttribute("style")).toBe("width: 87.2px;");
        expect(element.shadowRoot.querySelector(".item").getAttribute("style")).toBe("width: 77.2px;");
        expect(element.shadowRoot).toBeTruthy();
        act(() => {
            document.body.removeChild(element);
        });
        expect(document.body.contains(element)).toBeFalsy();
    })

})
