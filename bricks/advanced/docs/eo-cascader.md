大型表格

## Examples

### Basic

```yaml preview minHeight="300px"
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-cascader
      properties:
        label: 城市选择
        name: city
        placeholder: 请选择城市
        required: true
        options:
          - children:
              - children:
                  - label: West Lake
                    value: xihu
                label: Hangzhou
                value: hangzhou
            label: Zhejiang
            value: zhejiang
          - children:
              - children:
                  - label: Zhong Hua Men
                    value: zhonghuamen
                label: Nanjing
                value: nanjing
            label: Jiangsu
            value: jiangsu
      events:
        cascader.change:
          - action: console.log
    - brick: eo-submit-buttons
```
