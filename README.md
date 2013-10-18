
# totorox 基于 totoro 的功能扩展
主要是基于 totoro 来实现一些实用的功能, 好的功能后续也会直接集成到 totoro 中

## 安装

```
npm install totorox -g
```

## 功能列表

### totoro 代码调试
此功能主要基于 totoro 的 **console.log** 这个调试功能来实现. 简单的代码可以直接在命令行输出,
复杂的可以写到 js 中. 
```
totorox code="typeof document.getElementsByClassName"
totorox code="a.js"

totorox 'typeof 1'
totorox a.js

```

假如a.js 是以下内容:


```
console.log(typeof 1)
console.log(typeof 'abc')
```

将会得到以下类似输出:

```
  chrome 29.0.1547.65 / macosx 10.9.0
        > 'number'
        > 'string'
```


