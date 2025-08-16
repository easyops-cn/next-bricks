import { describe, test, expect } from "@jest/globals";
import "./index.js";
import type { LucideIcon } from "./index.js";

(global as any).fetch = jest.fn((url: string) =>
  Promise.resolve({
    ok: true,
    text: () =>
      Promise.resolve(
        url.endsWith("activity.svg")
          ? `<!-- @license lucide-static v0.539.0 - ISC -->
<svg
  class="lucide lucide-activity"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
</svg>`
          : `<!-- @license lucide-static v0.539.0 - ISC -->
<svg
  class="lucide lucide-ambulance"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M10 10H6" />
  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
  <path
    d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14" />
  <path d="M8 8v4" />
  <path d="M9 18h6" />
  <circle cx="17" cy="18" r="2" />
  <circle cx="7" cy="18" r="2" />
</svg>`
      ),
  })
);

describe("eo-lucide-icon", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-lucide-icon") as LucideIcon;
    element.icon = "activity";

    expect(element.shadowRoot).toBeFalsy();
    document.body.appendChild(element);
    expect(element.shadowRoot).toBeTruthy();
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
NodeList [
  <style>
    styles.shadow.css
icons.shadow.css
  </style>,
  <svg
    class="lucide lucide-activity"
    fill="none"
    height="1em"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    
  
    <path
      d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
    />
    

  </svg>,
]
`);
    document.body.removeChild(element);
    expect(element.shadowRoot?.childNodes.length).toBe(0);

    // Re-connect
    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes.length).toBe(2);
    document.body.removeChild(element);
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("gradient", async () => {
    const element = document.createElement("eo-lucide-icon") as LucideIcon;
    element.icon = "ambulance";
    element.startColor = "#000000";
    element.endColor = "#ffffff";

    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
NodeList [
  <style>
    styles.shadow.css
icons.shadow.css
  </style>,
  <svg
    class="lucide lucide-ambulance"
    fill="none"
    height="1em"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <lineargradient
        gradientUnits="userSpaceOnUse"
        id="linear-gradient"
        x1="0"
        x2="0"
        y1="0"
        y2="100%"
      >
        <stop
          offset="0%"
          stop-color="#000000"
        />
        <stop
          offset="100%"
          stop-color="#ffffff"
        />
      </lineargradient>
    </defs>
    
  
    <path
      d="M10 10H6"
    />
    
  
    <path
      d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
    />
    
  
    <path
      d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"
    />
    
  
    <path
      d="M8 8v4"
    />
    
  
    <path
      d="M9 18h6"
    />
    
  
    <circle
      cx="17"
      cy="18"
      r="2"
    />
    
  
    <circle
      cx="7"
      cy="18"
      r="2"
    />
    

  </svg>,
]
`);

    // Update `gradientDirection`
    element.gradientDirection = "left-to-right";
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
NodeList [
  <style>
    styles.shadow.css
icons.shadow.css
  </style>,
  <svg
    class="lucide lucide-ambulance"
    fill="none"
    height="1em"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <lineargradient
        gradientUnits="userSpaceOnUse"
        id="linear-gradient"
        x1="0"
        x2="100%"
        y1="0"
        y2="0"
      >
        <stop
          offset="0%"
          stop-color="#000000"
        />
        <stop
          offset="100%"
          stop-color="#ffffff"
        />
      </lineargradient>
    </defs>
    
  
    <path
      d="M10 10H6"
    />
    
  
    <path
      d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
    />
    
  
    <path
      d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"
    />
    
  
    <path
      d="M8 8v4"
    />
    
  
    <path
      d="M9 18h6"
    />
    
  
    <circle
      cx="17"
      cy="18"
      r="2"
    />
    
  
    <circle
      cx="7"
      cy="18"
      r="2"
    />
    

  </svg>,
]
`);

    document.body.removeChild(element);
  });

  test("no icon", async () => {
    const element = document.createElement("eo-lucide-icon") as LucideIcon;

    const onIconFound = jest.fn();
    element.addEventListener("icon.found", (e) => {
      onIconFound((e as CustomEvent).detail);
    });

    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
      icons.shadow.css
        </style>,
      ]
    `);
    expect(onIconFound).toHaveBeenCalledWith(false);

    document.body.removeChild(element);
  });

  test("not connected", async () => {
    const element = document.createElement("eo-lucide-icon") as LucideIcon;
    element.icon = "activity";
    (element as any)._render();
    expect(fetch).not.toHaveBeenCalled();
  });
});
