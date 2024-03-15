基于 [Monaco Editor](https://github.com/microsoft/monaco-editor) 的代码编辑器。

```yaml preview
brick: vs.code-editor
properties:
  language: typescript
  value: |
    function sayHello(): string {
      return "hello";
    }
```

## Examples

### Automatic layout - fit-content

```yaml preview
brick: vs.code-editor
properties:
  automaticLayout: fit-content
  language: typescript
  value: |
    function sayHello(): string {
      return "hello";
    }
```

### Automatic layout - fit-container

```yaml preview
brick: div
properties:
  style:
    height: 200px
children:
  - brick: vs.code-editor
    properties:
      automaticLayout: fit-container
      language: typescript
      value: |
        function sayHello(): string {
          return "hello";
        }
```

### Brick Next YAML

```yaml preview
- brick: vs.code-editor
  properties:
    language: brick_next_yaml
    value: |
      # Enhanced yaml for Brick Next
      brick: button
      properties:
        textContent: '<% CTX.error ? "CTX.error": "Hello" %>'
    automaticLayout: fit-content
- brick: vs.code-editor
  properties:
    language: yaml
    value: |
      # Normal yaml
      brick: button
      properties:
        textContent: '<% CTX.error ? "Oops": "Hello" %>'
    automaticLayout: fit-content
    style:
      marginTop: 2em
```

### Brick Next YAML with highlight

```yaml preview
- brick: vs.code-editor
  events:
    token.click:
      - action: console.log
  properties:
    language: brick_next_yaml
    value: |
      basicUsige:
        keyword:
         Expression:
          expression1: <% CTX.work %>
          expression2: <% `${CTX.work}` %>
          expression3:
            test1: |
              <%
                CTX.a ? CTX.b : CTX.c 
              %>
            test2: |-
              <% 
                CTX.a ? CTX.b : CTX.c 
              %>
            test3: >
              <% 
                CTX.a ? CTX.b : CTX.c 
              %>
            test4: >-
              <% 
                CTX.a ? CTX.b : CTX.c 
              %>
          expression4: "<% CTX.a ? CTX.b : CTX.c %>"
          expression7: <% CTX.list.map(item => FN.getDetail(item, CTX.name)) %>
          expression8: <% CTX.list.map(FN.getDetail) %>
          expression9: |
            <% 
              [
                CTX.work,
                CTX.work.a,
                ACTX,
                CTXA,
                ACTX.noWork,
                CTXA.noWork,
                a.CTX.noWork,
              ]
            %>
          expression10: |
            <% 
              "TPL is warn", 
              TPL.id 
            %>
          expression11: |
            <%
              FN.getDetail(CTX.abc, CTX.efg) %>
          expression12:
            test1:
              test2:          <%  CTX.name %>
              test3: |
                              <% 
                                CTX.name
                              %>
          expression13: <%= CTX.b + CTX.c %>
          expression14: |
            <%=
              APP.id + CTX.name
            %>
          expression15: 
            test1: |
              <% 
                CTX.name %>
            test2: |
              <% CTX.name
              %>
            test3: |
              <% "track context", CTX.name
              %>
            test4: |
              <%      
                "track context", CTX.name 
              %>
            test5: |
              <%      
                "track context", 
                CTX.name 
              %>
            test6: |
              <% "track context", 
                CTX.name 
              %>
            test7: |
              <%  "track context",  CTX.name 
          exporession16:
            - <% CTX.a %>     
            - CTX.b
            -   <% CTX.c %>    
            - <% "CTX.d" %>
        markers:
          hit:
            PATH: <% PATH.instanceId %>
          info:
            QUERY: <% QUERY.info %>
          warn:
            ANCHOR: <% ANCHOR.id %>
          error:
            STATE: <% STATE.name %>
        stringAndNoWork:
          string1: CTX.noWork
          string2: FN.getTest
          string3: <% "FN.getTest(CTX.test)" %>
    automaticLayout: fit-content
    links:
      - CTX
      - FN
    markers:
      - token: CTX
        params:
          - a
          - b
      - token: PATH
        message: “这是 PATH”
        level: hit
      - token: QUERY
        message: “这是 QUERY”
        level: info
      - token: ANCHOR
        message: “这是 ANCHOR“
        level: warn
      - token: STATE
        message: "这里不能写 STATE"
        level: error
        code:
          value: "详情地址"
          target: https://brick-next.js.org/docs/concepts/context
      - token: TPL
        level: warn
        message: 不允许写入TPL
    completers:
      - label: buttonName
        detail: string
      - label: buttonType
        detail: "primary|default|link|danger"
      - label: buttonSize
        insertText: size
    advancedCompleters:
      target:
        triggerCharacter: ":"
        completers:
          - label: a
          - label: b
      CTX:
        triggerCharacter: "."
        completers:
          - label: pageTitle
          - label: name
      FN:
        triggerCharacter: "."
        completers:
          - label: getPageDetail
          - label: getInstance
      PATH:
        triggerCharacter: "."
        completers:
          - label: instanceId
          - label: name
- brick: vs.code-editor
  events:
    highlight.click:
      - action: console.log
  properties:
    language: brick_next_yaml
    value: |
      <%
        `${"<"}% CTX.a %${">"}`
      %>
    automaticLayout: fit-content
    links:
      - CTX
      - FN
    markers:
      - token: CTX
        params:
          - a
          - b
```

### Show CTX.DS

```yaml preview minHeight="500px"
- brick: eo-form
  events:
    validate.success:
      action: console.log
  properties:
    values:
      code: |
        a: <% CTX.DS.a %>
        b: <% CTX.DS.c %>
        c: <% CTX.a %>
        d: <% CTXDS.a %>
        e: <% CTX.a.DS %>
        f: <% CTX.DSA.a %>
        g: <% CTX.DS %>
        h: <% DS.a %>
        i: <% DS.c %>
  children:
    - brick: vs.code-editor
      events:
        token.click:
          - action: console.log
      properties:
        name: code
        label: code
        required: true
        language: brick_next_yaml
        showExpandButton: true
        automaticLayout: fit-content
        links:
          - CTX
          - CTX.DS
          - DS
        tokenConfig:
          showDSKey: true
        markers:
          - token: CTX
            params:
              - a
              - DS
          - token: CTX.DS
            params:
              - a
              - b
          - token: DS
            params:
              - a
              - b
    - brick: eo-submit-buttons
```
