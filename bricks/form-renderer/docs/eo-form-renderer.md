构件 `eo-form-renderer`

## Examples

### Basic

```yaml preview
brick: eo-form-renderer
properties:
  formData: |
    {
      "formSchema": {
        "instanceId": "5fe8d5e7af541",
        "id": "form_1126",
        "brick": "eo-form",
        "properties": {
          "valueTypes": {},
          "id": "form_1126",
          "previewConf": "undefined",
          "values": "<% FORM_STATE.values %>"
        },
        "mountPoint": "",
        "events": {
          "values.change": [
            {
              "action": "console.log",
              "args": [
                "values.change",
                "<% EVENT.detail %>"
              ]
            },
            {
              "if": "<% !_.isEqual(FORM_STATE.values,EVENT.detail.allValues) %>",
              "action": "formstate.update",
              "args": [
                "values",
                "<% {...FORM_STATE.values,...EVENT.detail.allValues} %>"
              ]
            },
            {
              "action": "console.log",
              "args": [
                "itemOptions",
                "<% FORM_STATE.itemOptions %>"
              ]
            },
            {
              "action": "console.log",
              "args": [
                "values",
                "<% FORM_STATE.values %>"
              ]
            }
          ],
          "validate.success": []
        },
        "sort": 0,
        "if": true,
        "isRoot": true,
        "bricks": [
          {
            "instanceId": "600b9d30cf039",
            "id": "input",
            "brick": "eo-input",
            "properties": {
              "brickId": "fb-input",
              "id": "input",
              "label": "Name",
              "name": "input"
            },
            "mountPoint": "",
            "events": {
              "general.input.blur": []
            },
            "sort": 1,
            "if": true,
            "isRoot": false
          },
          {
            "instanceId": "600b9d30cf040",
            "id": "select",
            "brick": "eo-select",
            "mountPoint": "",
            "properties": {
              "brickId": "fb-select",
              "id": "select",
              "label": "Gender",
              "name": "gender",
              "options": ["Male", "Female"]
            }
          }
        ]
      },
      "fields": [
        {
          "instanceId": "600b9d30c7e30",
          "fieldId": "input",
          "name": "Name",
          "fieldType": "STRING",
          "description": "",
          "limit": [],
          "defaultValue": ""
        },
        {
          "instanceId": "600b9d30c7e30",
          "fieldId": "select",
          "name": "Gender",
          "fieldType": "STRING",
          "description": "",
          "limit": [],
          "defaultValue": "Male"
        }
      ],
      "context": [
        {
          "name": "values",
          "value": {}
        },
        {
          "name": "realValues",
          "value": {}
        },
        {
          "name": "changeV2Keys",
          "value": []
        },
        {
          "name": "conf",
          "value": [
            {
              "brickId": "fb-input",
              "id": "input",
              "label": "Name",
              "name": "input"
            }
          ]
        },
        {
          "name": "itemOptions",
          "value": {}
        }
      ]
    }
```
