# create-vue-file

命令行生成vue文件

* 安装
```javascript
npm install create-vue-file
```
* 使用
```javascript
cvue MyComp
cvue MyComp -t clazz
cvue MyComp -f -p -s -x vue
```
* 参数说明

简称|全名|作用|备注
--|--|--|--
-t|--template|模板选择|目前只支持default和clazz
-f|--functional|函数组件|
-p|--page|是否page组件|仅影响css的class
-s|--single|是否只生成vue文件|默认生成文件夹+vue文件+index.js

---

### for fun :)