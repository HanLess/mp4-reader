import MP4Parse from './mp4Parse'
import myFetch from './myFetch'

var ownTmpl = function (type,index) {
    return `<div class="own" style="width:${index * 60}px;">
                <div class="triangle triangle-right"></div>
                <div class="type-name">${type}</div>
            </div>`
}

var createBox = function (type,index) {
    let box = document.createElement('div');
    box.setAttribute('class', 'box hide-children');
    box.innerHTML = ownTmpl(type,index);

    return box;
}   

var resolveObj = function (boxObj,index = 1) {
    let type = boxObj.type;
    let box = createBox(type,index);
    ++index;
    let hasChild = false
    let props = {}
    for(let key in boxObj){
        if (Object.prototype.toString.call(boxObj[key]) == "[object Object]") {
            hasChild = true
            let cbox = resolveObj(boxObj[key],index)
            box.appendChild(cbox)
        } else {
            if (type == 'mdat' && key == 'data') {
                continue;
            }
            props[key] = boxObj[key].toString();
        }
    }
    if (!hasChild) {
        box.setAttribute('class', 'box');
        let own = box.querySelector('.own')
        let triangle = box.querySelector('.triangle')
        own.removeChild(triangle);
    }
    let own = box.querySelector('.own')
    own.setAttribute('data',JSON.stringify(props))
    
    return box
}

var bindEvent = function () {
    var triangleList = document.querySelectorAll('.triangle')
    Array.prototype.forEach.call(triangleList,function (val) {
        val.addEventListener('click',function(e){
            var triangleClass = e.currentTarget.getAttribute('class')
            if (triangleClass.search('triangle-right') > -1) {
                e.currentTarget.setAttribute('class', 'triangle triangle-down')
            } else {
                e.currentTarget.setAttribute('class', 'triangle triangle-right')
            }

            let parentOwn = e.currentTarget.parentNode
            let parentBox = parentOwn.parentNode
            let classStr = parentBox.getAttribute("class")
            if (classStr.search('hide-children') > -1) {
                parentBox.setAttribute("class",'box')
            } else {
                parentBox.setAttribute("class",'box hide-children')
            }
        })
    })

    var ownList = document.querySelectorAll('.own')
    Array.prototype.forEach.call(ownList,function(val){
        val.addEventListener('click',function(e){
            let data = JSON.parse(e.currentTarget.getAttribute('data'))
            let fragment = document.createDocumentFragment()
            for(let key in data){
                let d = document.createElement('div')
                d.innerText = `${key} : ${data[key]}`
                fragment.appendChild(d)
            }
            document.getElementById('content').innerHTML = ''
            document.getElementById('content').appendChild(fragment)
        })
    })
}

var init = function (arrayBuffer) {
    var buffer = new Uint8Array(arrayBuffer);
    var mp4Parser = new MP4Parse(buffer);
    var mp4BoxTreeArray = mp4Parser.mp4BoxTreeArray
    var arrayLength = mp4BoxTreeArray.length;
    let fragment = document.createDocumentFragment();

    for(let i = 0; i < arrayLength;i ++){
        let boxObj = mp4BoxTreeArray[i];
        let box = resolveObj(boxObj);

        fragment.appendChild(box)
    }
    document.getElementById('root').innerHTML = ''
    document.getElementById('root').appendChild(fragment)
    bindEvent()
}

export default function () {
    document.getElementById('reader-btn').addEventListener('click',function(){
        var buffer = null;
        let source = document.getElementById('source').files[0]
        let sourceUrl = document.getElementById('sourceUrl').value
        if(source){
            var reader = new FileReader();
            reader.readAsArrayBuffer(source);
            reader.onload = function () {
                init(this.result)
            }
        } else if (sourceUrl) {
            myFetch(sourceUrl, function (buf) {
                init(buf)
            });
        } else {
            alert("啥也没有，分析啥啊！")
        }
    })
}