---
title: EventTarget
order: 1
---

和 DOM API 中的 [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) 类似，该对象提供了事件绑定/解绑的能力。

在 G 中有以下继承关系，因此 [Canvas](/zh/docs/api/canvas)，[Document]()，[DisplayObject](/zh/docs/api/basic/display-object) 这些高级对象都拥有事件管理能力：

-   Canvas -> EventTarget
-   Document -> Node -> EventTarget
-   DisplayObject -> Element -> Node -> EventTarget

具体 API 可以参考[事件系统](/zh/docs/api/event)：

-   绑定事件：[addEventListener](/zh/docs/api/event#addeventlistener)
-   解绑事件：[removeEventListener](/zh/docs/api/event#removeeventlistener)
-   触发自定义事件：[dispatchEvent](/zh/docs/api/event#dispatchevent)
-   移除所有事件监听器 [removeAllEventListeners](/zh/docs/api/event#removealleventlisteners)