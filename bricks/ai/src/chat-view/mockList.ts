export const mockmsgList = [
  {
    role: "guide",
    content: [
      {
        type: "guide",
        text: "DEFAULT_CHAT_GUIDE",
      },
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "你好",
      },
    ],
    ctime: 1710731198,
  },
  {
    content: [
      {
        text: "你好！很高兴能为你服务。如果你有任何问题或者需要帮助，随时告诉我，我会尽我所能为你提供帮助。有什么我可以帮你的吗？",
        type: "markdown",
      },
    ],
    ctime: "1710731200",
    role: "assistant",
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "你知道百度的地址吗",
      },
    ],
    ctime: 1710731261,
  },
  {
    content: [
      {
        text: "百度公司是一家中国的互联网技术公司，其总部位于北京市。以下是百度的官方地址：\n\n北京市海淀区西北旺东路10号院百度科技园\n\n请注意，百度可能有多个办公地点，但上述地址是其主要的总部地址。如果你需要访问百度或与其联系，建议你查看其官方网站获取最新的联系信息。",
        type: "markdown",
      },
    ],
    ctime: 1710731266,
    role: "assistant",
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "可以给我官网的地址吗",
      },
    ],
    ctime: 1710731280,
  },
  {
    content: [
      {
        text: "当然可以。以下是百度公司的官方网站地址：\n\nhttps://www.baidu.com/\n\n你可以通过这个链接访问百度，获取更多信息和服务。",
        type: "markdown",
      },
    ],
    ctime: "1710731282",
    role: "assistant",
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "现在我们多少个微应用",
      },
    ],
    ctime: 1710731716,
  },
  {
    content: [
      {
        text: "很抱歉，但我不清楚你提到的“微应用”是指什么具体的上下文或系统。如果你是指在使用某个特定的平台或服务中的微应用数量，例如微信小程序、百度智能小程序等，我需要更多的上下文信息才能给出准确的回答。\n\n如果你能提供更多的细节，我会很乐意帮助你查询或解答有关微应用数量的问题。",
        type: "markdown",
      },
    ],
    ctime: "1710731720",
    role: "assistant",
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "给我一个任意表格数据",
      },
    ],
    ctime: 1710731756,
  },
  {
    content: [
      {
        text: "以下是任意创建的一个简单表格数据示例：\n\n| 姓名  | 年龄 | 性别 | 职位     |\n|-------|-----|------|----------|\n| 张三  | 25  | 男   | 软件工程师 |\n| 李四  | 30  | 女   | 产品经理  |\n| 王五  | 28  | 男   | UI设计师  |\n| 赵六  | 32  | 女   | 市场专员  |\n\n这个表格包含了姓名、年龄、性别和职位四列数据，以及四个示例员工的信息。这只是一个虚构的数据示例，你可以根据需要修改或扩展表格的内容。",
        type: "markdown",
      },
    ],
    ctime: 1710731761,
    role: "assistant",
  },
] as any;

export const mockList2 = [
  {
    role: "guide",
    content: [
      {
        type: "guide",
        text: "DEFAULT_CHAT_GUIDE",
        examplePrompts: ["http://www.baidu.com"],
      },
    ],
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "什么是 SSE",
      },
    ],
    ctime: 1710837828,
  },
  {
    content: [
      {
        text: "SSE（Server-Sent Events）是一种服务器到客户端的单向通信协议。它允许服务器通过HTTP连接向客户端推送数据，特别适用于实现实时更新功能，比如在网页上实时显示新闻更新、股票价格变动等。SSE基于HTTP协议，并且得到了所有现代浏览器的支持。\n\nSSE 的工作原理是什么？\nSSE的工作原理相对简单：\n1. 客户端通过JavaScript的`EventSource`对象向服务器发送一个HTTP请求，请求建立SSE连接。\n2. 服务器接收到请求后，返回一个HTTP响应，这个响应的`Content-Type`头部被设置为`text/event-stream`。\n3. 服务器保持这个连接打开，并且可以随时通过这个连接向客户端发送数据。\n4. 客户端通过`EventSource`对象接收服务器发来的数据，并可以监听特定的事件。\n\nSSE 有哪些优点？\n- **兼容性**：SSE得到了所有现代浏览器的支持，而其他一些实时通信技术如WebSocket可能不适用于所有浏览器。\n- **简单性**：SSE的实现比较简单，不需要复杂的握手过程，直接基于HTTP协议，易于理解和部署。\n\n与短轮询、Comet、WebSocket等技术相比，SSE有哪些优势？\n- **短轮询**：短轮询要求客户端定期向服务器发送请求，这种方式实现简单，但会造成很多无效请求，增加服务器负载。\n- **Comet**：Comet技术是一种基于HTTP长连接的推送技术，但实现较为复杂，且不如SSE标准化。\n- **WebSocket**：WebSocket提供了全双工的通信渠道，适用于需要双向通信的场景，但它的兼容性和实现复杂度不如SSE。\n\nSSE相比之下，在只需要服务器到客户端单向通信的场景中，提供了简单、高效且兼容性好的解决方案。\n\n如何实现一个简单的SSE服务？\n以下是一个简单的示例，展示了客户端和服务器端的实现：\n\n**客户端（JavaScript）**\n```javascript\n// 创建EventSource对象\nconst eventSource = new EventSource('http://localhost:8080/events');\n// 监听服务器发送的消息\neventSource.onmessage = function(event) {\n  console.log('收到消息：', event.data);\n};\n// 监听连接关闭事件\neventSource.onclose = function() {\n  console.log('连接已关闭');\n};\n// 监听错误事件\neventSource.onerror = function() {\n  console.log('连接出错');\n};\n```\n\n**服务器端（Node.js）**\n```javascript\nconst http = require('http');\nconst express = require('express');\nconst app = express();\n\napp.get('/events', function(req, res) {\n  res.setHeader('Content-Type', 'text/event-stream');\n  res.setHeader('Cache-Control', 'no-cache');\n  res.setHeader('Connection', 'keep-alive');\n  \n  // 定期发送数据到客户端\n  const sendData = () => {\n    res.write(`data: ${new Date().toString()}\\n\\n`);\n  };\n  setInterval(sendData, 1000);\n\n  // 当连接关闭时，停止发送数据\n  req.on('close', () => {\n    clearInterval(sendData);\n  });\n});\n\nconst server = http.createServer(app);\nserver.listen(8080, () => {\n  console.log('SSE服务正在监听端口8080');\n});\n```\n\n以上代码展示了一个简单的SSE服务器和客户端的实现，其中服务器每秒向客户端发送当前时间。",
        type: "markdown",
      },
    ],
    ctime: 1710837855,
    role: "assistant",
  },
  {
    role: "user",
    content: [
      {
        type: "text",
        text: "请写出一段示例代码",
      },
    ],
    ctime: 1710837859,
  },
  {
    content: [
      {
        text: "当然，下面是一个简单的Node.js服务器端示例代码，它使用Express框架来创建一个SSE服务器。这个服务器会向连接的客户端发送一个简单的消息流。\n\n**服务器端（Node.js + Express）**\n\n```javascript\nconst express = require('express');\nconst app = express();\nconst PORT = 3000;\n\napp.get('/events', function(req, res) {\n  // 设置响应头以支持SSE\n  res.writeHead(200, {\n    'Content-Type': 'text/event-stream', // SSE的MIME类型\n    'Cache-Control': 'no-cache', // 禁止缓存\n    'Connection': 'keep-alive', // 保持连接\n  });\n\n  // 发送事件到客户端\n  const sendEvent = (data, eventName = 'message') => {\n    res.write(`event: ${eventName}\\n`); // 事件名称\n    res.write(`data: ${JSON.stringify(data)}\\n\\n`); // 数据\n  };\n\n  // 发送初始化消息\n  sendEvent({ message: 'Connected successfully!' });\n\n  // 模拟定时发送数据\n  const intervalId = setInterval(() => {\n    sendEvent({ message: `Server time: ${new Date().toString()}` });\n  }, 1000); // 每1秒发送一次\n\n  // 当请求关闭时，清除定时器\n  req.on('close', () => {\n    clearInterval(intervalId);\n    console.log('Client connection closed, stopped sending events');\n  });\n});\n\napp.listen(PORT, () => {\n  console.log(`SSE server is running on http://localhost:${PORT}`);\n});\n```\n\n**客户端（HTML + JavaScript）**\n\n以下是客户端的HTML和JavaScript代码，它将连接到上面的SSE服务器并显示接收到的消息。\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<title>SSE Client Example</title>\n<script>\nwindow.onload = function() {\n  var eventSource = new EventSource('/events');\n  eventSource.onmessage = function(e) {\n    console.log('Received a message:', e.data);\n    document.getElementById('output').innerHTML += e.data + '<br>';\n  };\n  eventSource.onerror = function(e) {\n    console.error('EventSource failed:', e);\n    eventSource.close();\n  };\n};\n</script>\n</head>\n<body>\n<div id=\"output\"></div>\n</body>\n</html>\n```\n\n要运行这个示例，首先启动服务器端代码，然后打开HTML文件在浏览器中查看。服务器将开始向客户端发送消息，客户端将在`<div id=\"output\"></div>`元素中显示这些消息。",
        type: "markdown",
      },
    ],
    ctime: 1710837878,
    role: "assistant",
  },
] as any;
