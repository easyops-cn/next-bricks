发送 HTTP 请求。

## Examples

```yaml preview
brick: basic.general-button
properties:
  textContent: Check weather in Shenzhen
events:
  click:
    useProvider: basic.http-request
    args:
      - |
        <%
          `//api.weatherapi.com/v1/current.json?q=Shenzhen&key=${MISC.weather_api_key}`
        %>
    callback:
      success:
        action: message.success
        args:
          - <% `It's ${EVENT.detail.current.condition.text} in Shenzhen` %>
      error:
        action: handleHttpError
```
