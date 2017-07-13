let canvasW = Math.min(800,$(window).width() - 20)
let canvasH = canvasW
let bgColor = 'black'
let fontColor = 'black'

let canvas = document.getElementById("canvas")
let cxt = canvas.getContext('2d')

canvas.width = canvasW
canvas.height = canvasH

//some params
let isMouseDown = false
let lastLoc = {x:0,y:0}
let lastTimestamp = 0
let lastLineWidth = 0

$(".ctrl").css("width",canvasW+'px')
//begin stroke background
drawBg()

$(".ctrl span").click(function(){
    fontColor = $(this).css('background-color')
})

$(".btn").click(function(){
    cxt.clearRect(0,0,canvasW,canvasW)
    drawBg()
})
//移动端
canvas.addEventListener('touchstart',function(e){
    e.preventDefault()
    //移动端可能会发生多点触控的情况,只取第一个
    touch = e.touches[0]
    beginStroke({x:touch.pageX,y:touch.pageY})
})
canvas.addEventListener('touchmove',function(e){
    e.preventDefault()
    if(isMouseDown){
        touch = e.touches[0]
        stroking({x:touch.pageX,y:touch.pageY})
    }
})
canvas.addEventListener('touchend',function(e){
    e.preventDefault()
    endStroke()
})
//浏览器
canvas.onmousedown = function(e){
    e.preventDefault()
    beginStroke({x:e.clientX,y:e.clientY})
}
canvas.onmouseout = function(e){
    e.preventDefault()
    endStroke()
}
canvas.onmouseup = function(e){
    e.preventDefault()
    endStroke()
}
canvas.onmousemove = function(e){
    e.preventDefault()
    if(isMouseDown){
        stroking({x:e.clientX,y:e.clientY})
    }
}

function beginStroke(point) {
    isMouseDown = true
    //record last location
    lastLoc = windowToCanvasPos(point)
    //record last location time
    lastTimestamp = new Date().getTime()
}

function endStroke(){
    isMouseDown = false
}

function stroking(point){
    let curLoc = windowToCanvasPos(point)
    //current time
    let curTimestamp = new Date().getTime()
    let timeDiff = curTimestamp - lastTimestamp
    let distance = calcDistance(curLoc,lastLoc)

    let lineWidth = calcFontWidth(timeDiff,distance)

    cxt.beginPath()
    cxt.moveTo(lastLoc.x,lastLoc.y)
    cxt.lineTo(curLoc.x,curLoc.y)
    cxt.closePath()
    cxt.strokeStyle = fontColor
    cxt.lineWidth = lineWidth
    cxt.lineCap = 'round'
    cxt.lineJoin = 'round'
    cxt.stroke()

    //update lastLoc
    lastLoc = curLoc
    lastTimestamp = curTimestamp
    lastLineWidth = lineWidth
}

let MaxW = 30
let MinW = 1
let MaxBoundary = 10
let MinBoundary = 0.1
function calcFontWidth(time,distance){
    let a = distance / time
    if(a <= MinBoundary){
        return MinW
    }else if(a >= MaxBoundary){
        return MaxW
    }else{
        return lastLineWidth*2/3 + (MaxW - (a-MinBoundary)/(MaxBoundary-MinBoundary)*(MaxW - MinW))*1/3
    }
}
//diagonal
function calcDistance( loc1 , loc2 ){
    return Math.sqrt( (loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y) )
}

function windowToCanvasPos(point){
    let box = canvas.getBoundingClientRect()
    return {x:Math.round(point.x - box.left),y:Math.round(point.y - box.top)}
}

function drawBg(){
    cxt.save()
    cxt.beginPath()
    cxt.moveTo(0 ,0)
    cxt.lineTo(canvasW ,0)
    cxt.lineTo(canvasW ,canvasH)
    cxt.lineTo(0 ,canvasH)
    cxt.closePath()
    cxt.lineWidth = 6
    cxt.strokeStyle = bgColor
    cxt.stroke()

    cxt.beginPath()
    cxt.moveTo(0,0)
    cxt.lineTo(canvasW,canvasH)

    cxt.moveTo(canvasW,0)
    cxt.lineTo(0,canvasH)

    cxt.moveTo(0,canvasH/2)
    cxt.lineTo(canvasW,canvasH/2)

    cxt.moveTo(canvasW/2,0)
    cxt.lineTo(canvasW/2,canvasH)

    cxt.lineWidth = 1
    cxt.stroke()

    cxt.restore()
}
