data => data() 拿到数据

## 响应式设计
1. 源数据=>option
2. vm.$option = option
3. vm._data = data.call(vm),数据从option到_data
4. 访问数据为vm._data.title
5. 添加proxy=>Object.defineProperty
6. get()===>vm[target][key]; target=>_data
7. set()===>vm[target][key]=newValue
8. 通过拦截将数据访问从vm._data.title=>vm.title


目的是:劫持data()目的是为了能够让用户不是在源数据上操作，最好能在操作过程添加其他操作,最后要达到通过访问vm.title就能访问数据，且是响应式 

# 流程 
从new Vue开始
获取data(){}

index->init(vm)
初始化，将option传给vm.$option

init
initState->initData
initData
1. 获取data(),得到vm._data
2. 添加到proxyData，包一层代理，在访问vm.title=>vm._data.title
3. observe(vm._data) 

initData=>observe=>observer

observer->reactive
object=>defineReactiveData-object.defineProperty
data.__proto__=arrMethods,给对象附上原型

reactive
拦截value和newValue原因是这2个都有可能是{},即嵌套的{}


array=>array.js->config.js==>因为使用上述的方法会导致数组内产生变化，所以要重写该方法

先拷贝一份原来的原型
Array.prototype
object.create
var args = Array.prototype.slice.call(arguments);
将参数转为数组

在arrMethods执行原来的方法
再执行自定义的操作
主要是为了能够将添加的数据是对象时，能够拦截到
将newArr=>observeArr

array=>observeArr
循环遍历每个元素去observe,observe里面会判断是不是对象



插件化开发
```js
  function Vue(){
    this._init()
  }
  initMixin()


  function initMixin(){
    Vue.prototype._init(){
      initState()
    }
  }

  

```

模板编译
1. 获取template顺序=>render-> template:-> <template> 
2. template => AST树
3. AST => render函数
4. render函数 => 虚拟节点
5. 设置PATCH =>打补丁到真实DOM


可能需要看 虚拟节点和DOM diff算法源码实现


template => AST树
流程是通过正则匹配，每匹配一部分就删除，比如说`<div =>type:div`

 AST => render函数
 将AST转为 _c,_v,_s


render函数 => 虚拟节点


