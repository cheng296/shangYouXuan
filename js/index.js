// 需要将所有的dom元素以及相关资源全部加载完毕之后需要实现的函数
window.onload = function(){
    let bigimgIndex = 0;
    //路径导航的动态渲染
    navPathDataBind();
    function navPathDataBind(){
        /**
             * 思路：
             * 1.获取路径导航页面元素
             * 2.获取所需要的数据（data.js->goodData.path）
             * 3.创建DOM元素
             * 4.最后一条DOM元素，只创建a标签，不创建i标签
             */
        const navPath = document.querySelector('#wrapper #content .contentMain #navPath')

        let path = goodData.path
        for(let i=0;i<path.length;i++){
            if(i == path.length-1){
                let aNode = document.createElement("a")
                aNode.innerText = path[i].title
                navPath.appendChild(aNode)
            }else{
                let aNode = document.createElement("a")
                aNode.href = path[i].url
                aNode.innerText = path[i].title
        
                let iNode = document.createElement("i")
                iNode.innerText = '/'
        
                navPath.appendChild(aNode)
                navPath.appendChild(iNode)
            }
            
        }
    }

    //放大镜的移入，移出
    bigClassBind();
    function bigClassBind() {
        /**
         * 思路：
         * 1.获取小图框元素对象，设置移入事件（onmouseover(冒泡),onmouseenter）
         * 2.动态创建蒙版元素和大图片
         * 3.移出时移除蒙版元素、大图框
         */
        const smallPic = document.querySelector("#wrapper #content .contentMain .center #left #leftTop #smallPic")
        const leftTop = document.querySelector("#wrapper #content .contentMain .center #left #leftTop")
        const imgsrc = goodData.imagessrc

        smallPic.onmouseenter = function(){
            //创建蒙版元素
            let maskDiv = document.createElement("div")
            maskDiv.className = "mask"

            //创建大图框
            let bigPic = document.createElement("div")
            bigPic.id = "bigPic"

            //创建大图片
            let bigImg = document.createElement("img")
            bigImg.src = imgsrc[bigimgIndex].b

            //大图框追加大图片
            bigPic.appendChild(bigImg)

            //让小图框追加蒙版
            smallPic.appendChild(maskDiv)

            //让lefttop追加大图框
            leftTop.appendChild(bigPic)

            //移动事件
            smallPic.onmousemove = function(event){
                // event.clientX:鼠标点距离浏览器左侧X轴的值
                // smallPic.getBoundingClientRect().left：小图框元素距离浏览器左侧可视left
                let left = event.clientX-smallPic.getBoundingClientRect().left-maskDiv.offsetWidth/2
                let top = event.clientY-smallPic.getBoundingClientRect().top-maskDiv.offsetHeight/2
                
                if(left<0){
                    left = 0
                }else if(left>smallPic.clientWidth - maskDiv.offsetWidth){
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }

                if(top<0){
                    top = 0
                }else if(top>smallPic.clientHeight - maskDiv.offsetHeight){
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }
                
                maskDiv.style.left = left + "px"
                maskDiv.style.top = top + "px"

                //蒙版元素移动的距离 = 小图框宽度-蒙版元素的宽度
                //大图片元素移动的距离 = 大图片宽度-大图框元素的宽度

                let scale = (smallPic.clientWidth-maskDiv.offsetWidth)/(bigImg.offsetWidth-bigPic.clientWidth)
                bigImg.style.left = -left / scale + "px"
                bigImg.style.top = -top / scale + "px"
            }

            //设置移出
            smallPic.onmouseleave = function(){
                //小图框移除蒙版
                smallPic.removeChild(maskDiv)
                leftTop.removeChild(bigPic)
            }
        }
    }
    
    //放大镜缩略图数据动态渲染
    thumbnailData();
    function thumbnailData(){
        /** 思路：
         * 1.获取ul
         * 2.获取data.js下的goodData.imagessrc
         * 3.遍历数组，创建li
        */
       const piclist = document.querySelector("#wrapper #content .contentMain .center #left #leftBottom #piclist ul")

       let imagessrc = goodData.imagessrc

       for(let i=0;i<imagessrc.length;i++){
        let li = document.createElement("li")
        
        let image = document.createElement("img")
        image.src = imagessrc[i].s

        li.appendChild(image)
        piclist.appendChild(li)
       }
    }

    //点击缩略图
    thumbnailClick();
    function thumbnailClick(){
        /**思路：
         * 1.获取所有li,循环发生点击
         * 2.点击缩略图，确定其下标位置，找到小图、大图路径并替换
         */
        const liNodes = document.querySelectorAll("#wrapper #content .contentMain .center #left #leftBottom #piclist ul li")
        let smallPic_img = document.querySelector("#wrapper #content .contentMain .center #left #leftTop #smallPic img")
        const imagessrc = goodData.imagessrc

        //小图路径需要默认和imagessrc的第一个元素小图路径一致
        smallPic_img.src = imagessrc[0].s

        for(let i=0;i<liNodes.length;i++){
            liNodes[i].onclick = function(){
                bigimgIndex = i

                smallPic_img.src = imagessrc[i].s
            }
        }
    }

    //点击缩略图左右箭头
    thumbnailleftRightClick();
    function thumbnailleftRightClick(){
        /**
         * 思路：
         * 1.获取按钮
         * 2.div元素、ul元素和li
         * 3.计算（起点、步长、总体运动的距离值）
         * 4.发生点击事件
         */

        const prev = document.querySelector("#wrapper #content .contentMain .center #left #leftBottom .prev")
        const next = document.querySelector("#wrapper #content .contentMain .center #left #leftBottom .next")

        const piclist = document.querySelector("#wrapper #content .contentMain .center #left #leftBottom #piclist")
        const ul = document.querySelector("#wrapper #content .contentMain .center #left #leftBottom #piclist ul")
        const li = document.querySelectorAll("#wrapper #content .contentMain .center #left #leftBottom #piclist ul li")

        let start = 0
        let step = (li[0].offsetWidth+20)*2

        let endPosition = (li.length-5)*(li[0].offsetWidth+20)

        prev.onclick = function(){
            start -= step
            if(start < 0){
                start = 0
            }
            ul.style.left = -start + "px"
        }
        next.onclick = function(){
            start += step
            if(start > endPosition){
                start = endPosition
            }
            ul.style.left = -start + "px"
        }

    }

    //商品详情数据动态渲染
    rightTopData();
    function rightTopData(){
        /**
         * 思路：
         * 1.查找rightTop元素
         * 2.找到data.js->goodData->goodsDetail相应元素
         * 3.建立一个字符串变量，将原来的布局结构贴进来，将对应的数据放进去重新渲染rightTop元素
         */
        const rightTop = document.querySelector("#wrapper #content .contentMain .center .right .rightTop")
        
        const goodsDetail = goodData.goodsDetail
        
        rightTop.innerHTML = `
        <h3>${goodsDetail.title}</h3>
        <p>${goodsDetail.recommend}</p>                      
        <div class="priceWrap">
            <div class="priceTop">
                <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                <div class="price">
                    <span>￥</span>
                    <p>${goodsDetail.price}</p>
                    <i>降价通知</i>
                </div>
                <p>
                    <span>累计评价</span>
                    <span>670000</span>
                </p>
            </div>
            <div class="priceBottom">
                <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                <p>
                    <span>${goodsDetail.promoteSales.type}</span>
                    <span>${goodsDetail.promoteSales.content}</span>
                </p>
            </div>
        </div>
        <div class="support">
            <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
            <p>${goodsDetail.support}</p>
        </div>
        <div class="address">
            <span>配&nbsp;送&nbsp;至</span>
            <p>${goodsDetail.address}</p>
        </div>
        `
    }

    //商品参数数据动态渲染
    rightBottomData();
    function rightBottomData(){
        /**
         * 思路:
         * 1.找rightBottom
         * 2.找数据
         * 3.遍历数组,动态dl
         */
        const chooseWrap = document.querySelector("#wrapper #content .contentMain .center .right .rightBottom .chooseWrap")

        const crumbData = goodData.goodsDetail.crumbData

        for(let i=0;i<crumbData.length;i++){
            const dlNode = document.createElement('dl')
            const dtNode = document.createElement('dt')
            const ddNode = document.createElement('dd')
            dtNode.innerText = crumbData[i].title

            dlNode.appendChild(dtNode)

            for(let j=0;j<crumbData[i].data.length;j++){
                const ddNode = document.createElement('dd')
                ddNode.innerText = crumbData[i].data[j].type
                ddNode.setAttribute('price',crumbData[i].data[j].changePrice)

                dlNode.appendChild(ddNode)
            }

            chooseWrap.appendChild(dlNode)


        }
    }

    //点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind(){
        /**
         * 思路:
         * 1.获取dl,取第一个的dd
         * 2.循环所有dd,添加onclick
         * 3.确定实际发生事件的目标源对象,给其他所有元素颜色重置为基础色
         */
        const dlNodes = document.querySelectorAll("#wrapper #content .contentMain .center .right .rightBottom .chooseWrap dl")
        let arr = new Array(dlNodes.length)
        const choose = document.querySelector("#wrapper #content .contentMain .center .right .rightBottom .choose")
        arr.fill(0)

        for(let k=0;k<dlNodes.length;k++){
            const ddNodes = dlNodes[k].querySelectorAll('dd')
            for(let i=0;i<ddNodes.length;i++){
                ddNodes[i].onclick = function(){

                    choose.innerHTML=''
                    for(let j=0;j<ddNodes.length;j++){
                        ddNodes[j].style.color = "#666"
                    }
                    this.style.color = "red"


                    //点击哪一个dd元素动态产生一个新的mark
                    arr[k] = this
                    // console.log(this)
                    changePriceBind(arr)
                    
                    arr.forEach(function(value,index) {
                        if(value){
                            //创建div
                            const markDiv = document.createElement("div")
                            //设置属性
                            markDiv.className = 'mark'
                            markDiv.innerText = value.innerText
                            //创建a
                            const aNode = document.createElement("a")
                            aNode.innerText = "X"
                            //设置下标
                            aNode.setAttribute('index',index)
                            //div追加a
                            markDiv.appendChild(aNode)
                            //choose追加markdiv
                            choose.appendChild(markDiv)
                        }
                    })

                    //获取a,循环点击
                    const aNodes = document.querySelectorAll("#wrapper #content .contentMain .center .right .rightBottom .choose .mark a")
                    for(let m=0;m<aNodes.length;m++){
                        aNodes[m].onclick = function(){
                            let idx1 = this.getAttribute('index')
                            arr[idx1] = 0

                            const ddlist = dlNodes[idx1].querySelectorAll("dd")
                            for(let n=0;n<ddlist.length;n++){
                                ddlist[n].style.color = "#666"

                            }
                            ddlist[0].style.color = "red"

                            choose.removeChild(this.parentNode)

                            changePriceBind(arr)
                        }
                    }

                }
            }
        }
    }

    //价格变动的函数声明（点击dd，删除mark调用）
    function changePriceBind(arr){
        /**
         * 思路：
         * 1.获取价格标签元素
         * 2.给每个dd标签身上设置一个自定义属性，记录变化的价格
         * 3.遍历arr
         */
        const oldPrice = document.querySelector("#wrapper #content .contentMain .center .right .rightTop .priceWrap .priceTop .price > p")

        let price = goodData.goodsDetail.price

        for(let i=0;i<arr.length;i++){
            if(arr[i]){
                let changePrice = Number(arr[i].getAttribute('price'))
                price += changePrice
            }
        }

        oldPrice.innerText = price

        const leftprice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p")
        const ipts = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input")


        leftprice.innerText = '¥'+price

        for(let j=0;j<ipts.length;j++){
            if(ipts[j].checks){
                price+=Number(ipts[j].value)
            }
        }

        const newprice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i")
        newprice.innerText = '¥'+price
    }

    //选择搭配复选框套餐价变动
    chooseprice();
    function chooseprice(){
        /**
         * 思路：
         * 1.获取复选框
         * 2.遍历，累加，写回套餐价
         */
        const ipts = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input")
        const leftprice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p")
        const newprice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i")
        for(let i=0;i<ipts.length;i++){
            ipts[i].onclick = function(){
                let oldprice = Number(leftprice.innerText.slice(1))
                for(let j=0;j<ipts.length;j++){
                    if(ipts[j].checked){
                        oldprice += Number(ipts[j].value)
                    }
                }

                newprice.innerText = '¥'+oldprice

            }
        }
    }

    //公共的选项卡函数
    function Tab(tabBtns,tabConts){
        /**
         * 1.被点击的元素
         * 2.切换显示的元素
         */
        for(let i=0;i<tabBtns.length;i++){
            tabBtns[i].onclick = function(){
                for(let j=0;j<tabBtns.length;j++){
                    tabBtns[j].className = ''
                    tabConts[j].className = ''
                }
                this.className = 'active'
                tabConts[i].className = 'active'
            }
        }
    }

    //点击左侧选项卡
    leftTab();
    function leftTab(){
        //被点击的元素
        const h4s = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4")
        //切换显示的元素
        const divs = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideContent > div")
        Tab(h4s,divs)
    }

    //右侧选项卡
    rightTop();
    function rightTop(){
        const lis = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabBtns li")
        const divs = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabContents > div")
        Tab(lis,divs)
    }

    //右边侧边栏
    rightAsideBind();
    function rightAsideBind(){
        const btns = document.querySelector("#wrapper .rightAside .btns")

        const rightAside = document.querySelector("#wrapper .rightAside")

        let flag = true

        btns.onclick = function(){
            if(flag){
                //展开
                btns.className = 'btns btnsOpen'
                rightAside.className = 'rightAside asideOpen'
            }else{
                //关闭
                btns.className = 'btns btnsClose'
                rightAside.className = 'rightAside asideClose'
            }
            flag = !flag
        }
    }
}