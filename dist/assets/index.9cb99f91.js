var D=Object.defineProperty;var I=(g,n,h)=>n in g?D(g,n,{enumerable:!0,configurable:!0,writable:!0,value:h}):g[n]=h;var E=(g,n,h)=>(I(g,typeof n!="symbol"?n+"":n,h),h);const x=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))u(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&u(c)}).observe(document,{childList:!0,subtree:!0});function h(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function u(a){if(a.ep)return;a.ep=!0;const r=h(a);fetch(a.href,r)}};x();class w{constructor(n,h,u,a,r,c,f,p){this.radius=u/2,this.leftX=n-this.radius,this.leftY=h-this.radius,this.rightX=n+this.radius,this.rightY=h+this.radius,this.rectLeftX=Math.round(this.leftX),this.rectLeftY=Math.round(this.leftY),this.rectRightX=Math.ceil(this.rightX),this.rectRightY=Math.ceil(this.rightY),this.rectSize=this.rectRightX-this.rectLeftX,this.rectChangePoint=this.rectSize*.1,this.afterChangeRectSize=1,this.rectImgData=null,this.ctx=c,this.unit=u,this.circlePos=p,this.copyCtx=f,this.centerX=n,this.centerY=h,this.parentCenterX=a,this.parentCenterY=r,this.pi=Math.PI*2,this.distanceUnit=1,this.isDivided=!1,this.rgbData=null}draw(){if(!this.rgbData){const h=this.copyCtx.getImageData(this.leftX,this.leftY,this.rightX-this.leftX,this.rightY-this.leftY).data;this.rgbData=this.getAverageColor(h)}if(this.ctx.fillStyle=`rgb(${[...this.rgbData]})`,this.ctx.beginPath(),Math.abs(this.parentCenterX-this.centerX)<1)this.parentCenterX=this.centerX,this.parentCenterY=this.centerY;else switch(this.circlePos){case 1:this.parentCenterX-=this.distanceUnit,this.parentCenterY-=this.distanceUnit;break;case 2:this.parentCenterX-=this.distanceUnit,this.parentCenterY+=this.distanceUnit;break;case 3:this.parentCenterX+=this.distanceUnit,this.parentCenterY+=this.distanceUnit;break;case 4:this.parentCenterX+=this.distanceUnit,this.parentCenterY-=this.distanceUnit;break}this.ctx.arc(this.parentCenterX,this.parentCenterY,this.radius,0,this.pi),this.ctx.fill(),this.ctx.closePath()}clear(){this.afterChangeRectSize<this.rectSize?this.afterChangeRectSize+=this.rectChangePoint:this.isClear=!0,this.rectImgData||(this.rectImgData=this.copyCtx.getImageData(this.rectLeftX,this.rectLeftY,this.rectSize,this.rectSize)),this.ctx.putImageData(this.rectImgData,this.rectLeftX,this.rectLeftY,0,0,this.afterChangeRectSize,this.afterChangeRectSize)}getAverageColor(n){const h=[0,0,0];let u=0;return n.forEach((a,r)=>{(r+1)%4!=0?(h[u]+=a,u++):u=0}),h.map(a=>a/(n.length/4))}}class L{constructor(n){E(this,"CircleArr",[]);this.canvas=document.createElement("canvas"),this.copyCanvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.copyCtx=this.copyCanvas.getContext("2d",{alpha:!1}),this.speedInput=document.getElementById("speed");const h=document.querySelector(".controller"),u=h.offsetHeight,a=window.innerHeight-u,r=150,c=100,f=16.667;n.height>n.width&&n.height/n.width>=1.5?(this.imgWidthHeight=[9,6],this.canvas.height=Math.floor(a/r)*r,this.canvas.width=this.canvas.height/1.5,this.canvas.width>window.innerWidth&&(this.canvas.width=Math.floor(window.innerWidth/r)*r,this.canvas.height=this.canvas.width*1.5),this.radius=Math.floor(this.canvas.height/r)*f):n.height<n.width&&n.width/n.height>=1.5?(this.imgWidthHeight=[6,9],this.canvas.width=Math.floor(window.innerWidth/r)*r,this.canvas.height=this.canvas.width/1.5,this.canvas.height>a&&(this.canvas.height=Math.floor(a/r)*r,this.canvas.width=this.canvas.height*1.5),this.radius=Math.floor(this.canvas.width/r)*f):(this.imgWidthHeight=[6,6],this.canvas.height=Math.floor(a/c)*c,this.canvas.height>window.innerWidth?(this.canvas.width=Math.floor(window.innerWidth/c)*c,this.canvas.height=this.canvas.width):this.canvas.width=this.canvas.height,this.radius=Math.floor(this.canvas.width/c)*f),this.copyCanvas.width=this.canvas.width,this.copyCanvas.height=this.canvas.height,this.ctx.drawImage(n,0,0,this.canvas.width,this.canvas.height),this.copyCtx.drawImage(n,0,0,this.canvas.width,this.canvas.height),document.body.insertBefore(this.canvas,document.body.firstElementChild),this.copyCanvas.id="copyCanvas",document.body.appendChild(this.copyCanvas),h.classList.add("fadeIn"),this.defaultCircleCnt=this.imgWidthHeight[0]*this.imgWidthHeight[1]/4,this.drawCircle(...this.imgWidthHeight),document.getElementById("autoBtn").addEventListener("click",()=>this.autoDivide()),document.getElementById("originalBtn").addEventListener("click",()=>this.clearCanvas()),navigator.userAgent.toUpperCase().includes("MOBILE")?this.canvas.addEventListener("touchmove",v=>this.touchMoveEvent(v)):this.canvas.addEventListener("mousemove",v=>this.moveEvent(v))}moveEvent(n){for(let h=0;h<this.CircleArr.length;h++)if(!this.CircleArr[h].isDivided&&this.CircleArr[h].leftX<=n.offsetX&&this.CircleArr[h].rightX>=n.offsetX&&this.CircleArr[h].leftY<=n.offsetY&&this.CircleArr[h].rightY>=n.offsetY){this.divideCircle(this.CircleArr[h]);break}}touchMoveEvent(n){n=this.addTouchOffsets(n),this.moveEvent(n)}addTouchOffsets(n){var h=n.touches[0]||n.changedTouches[0],u=document.elementFromPoint(h.clientX,h.clientY);return n.offsetX=h.clientX-u.getBoundingClientRect().x,n.offsetY=h.clientY-u.getBoundingClientRect().y,n}divideCircle(n){const{leftX:h,leftY:u,rightX:a,rightY:r,unit:c,centerX:f,centerY:p}=n;if(!(a-h<=4)){n.isDivided=!0;const v=c/2,d=(h+f)/2,o=(u+p)/2,e=(a+f)/2,s=(r+p)/2;this.CircleArr.push(new w(d,o,v,f,p,this.ctx,this.copyCtx,1)),this.CircleArr.push(new w(d,s,v,f,p,this.ctx,this.copyCtx,2)),this.CircleArr.push(new w(e,s,v,f,p,this.ctx,this.copyCtx,3)),this.CircleArr.push(new w(e,o,v,f,p,this.ctx,this.copyCtx,4))}}clearCanvas(){cancelAnimationFrame(this.ani_ID),this.CircleArr.forEach(n=>n.isClear?"":n.clear()),this.ani_ID=requestAnimationFrame(()=>this.clearCanvas())}autoDivide(n=0){cancelAnimationFrame(this.ani_ID);let h=Number(this.speedInput.value);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);let u=0;for(let a=0;a<this.CircleArr.length;a++)this.CircleArr[a].isDivided?u++:this.CircleArr[a].draw();u>5e3&&(h=1e4);for(let a=n;a<n+h;a++)this.CircleArr[a].isDivided||this.divideCircle(this.CircleArr[a]);this.ani_ID=requestAnimationFrame(()=>this.autoDivide(n+h))}animate(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.CircleArr.forEach(n=>n.isDivided?"":n.draw()),this.ani_ID=requestAnimationFrame(()=>this.animate())}drawCircle(n,h){for(let u=0;u<n;u++){const a=this.radius*u+this.radius/2;for(let r=0;r<h;r++){const c=this.radius*r+this.radius/2;this.CircleArr.push(new w(c,a,this.radius,c,a,this.ctx,this.copyCtx))}}requestAnimationFrame(()=>this.animate())}}var O=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};function M(g){return g&&g.__esModule&&Object.prototype.hasOwnProperty.call(g,"default")?g.default:g}var A={exports:{}};/*!
 * 
 *   typed.js - A JavaScript Typing Animation Library
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v2.0.12
 *   Url: https://github.com/mattboldt/typed.js
 *   License(s): MIT
 * 
 */(function(g,n){(function(u,a){g.exports=a()})(O,function(){return function(h){var u={};function a(r){if(u[r])return u[r].exports;var c=u[r]={exports:{},id:r,loaded:!1};return h[r].call(c.exports,c,c.exports,a),c.loaded=!0,c.exports}return a.m=h,a.c=u,a.p="",a(0)}([function(h,u,a){Object.defineProperty(u,"__esModule",{value:!0});var r=function(){function d(o,e){for(var s=0;s<e.length;s++){var i=e[s];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(o,i.key,i)}}return function(o,e,s){return e&&d(o.prototype,e),s&&d(o,s),o}}();function c(d,o){if(!(d instanceof o))throw new TypeError("Cannot call a class as a function")}var f=a(1),p=a(3),v=function(){function d(o,e){c(this,d),f.initializer.load(this,e,o),this.begin()}return r(d,[{key:"toggle",value:function(){this.pause.status?this.start():this.stop()}},{key:"stop",value:function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this))}},{key:"start",value:function(){this.typingComplete||!this.pause.status||(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this))}},{key:"destroy",value:function(){this.reset(!1),this.options.onDestroy(this)}},{key:"reset",value:function(){var e=arguments.length<=0||arguments[0]===void 0?!0:arguments[0];clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,e&&(this.insertCursor(),this.options.onReset(this),this.begin())}},{key:"begin",value:function(){var e=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){!e.currentElContent||e.currentElContent.length===0?e.typewrite(e.strings[e.sequence[e.arrayPos]],e.strPos):e.backspace(e.currentElContent,e.currentElContent.length)},this.startDelay)}},{key:"typewrite",value:function(e,s){var i=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var t=this.humanizer(this.typeSpeed),l=1;if(this.pause.status===!0){this.setPauseStatus(e,s,!0);return}this.timeout=setTimeout(function(){s=p.htmlParser.typeHtmlChars(e,s,i);var y=0,m=e.substr(s);if(m.charAt(0)==="^"&&/^\^\d+/.test(m)){var b=1;m=/\d+/.exec(m)[0],b+=m.length,y=parseInt(m),i.temporaryPause=!0,i.options.onTypingPaused(i.arrayPos,i),e=e.substring(0,s)+e.substring(s+b),i.toggleBlinking(!0)}if(m.charAt(0)==="`"){for(;e.substr(s+l).charAt(0)!=="`"&&(l++,!(s+l>e.length)););var C=e.substring(0,s),k=e.substring(C.length+1,s+l),T=e.substring(s+l+1);e=C+k+T,l--}i.timeout=setTimeout(function(){i.toggleBlinking(!1),s>=e.length?i.doneTyping(e,s):i.keepTyping(e,s,l),i.temporaryPause&&(i.temporaryPause=!1,i.options.onTypingResumed(i.arrayPos,i))},y)},t)}},{key:"keepTyping",value:function(e,s,i){s===0&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this)),s+=i;var t=e.substr(0,s);this.replaceText(t),this.typewrite(e,s)}},{key:"doneTyping",value:function(e,s){var i=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),!(this.arrayPos===this.strings.length-1&&(this.complete(),this.loop===!1||this.curLoop===this.loopCount))&&(this.timeout=setTimeout(function(){i.backspace(e,s)},this.backDelay))}},{key:"backspace",value:function(e,s){var i=this;if(this.pause.status===!0){this.setPauseStatus(e,s,!1);return}if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var t=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){s=p.htmlParser.backSpaceHtmlChars(e,s,i);var l=e.substr(0,s);if(i.replaceText(l),i.smartBackspace){var y=i.strings[i.arrayPos+1];y&&l===y.substr(0,s)?i.stopNum=s:i.stopNum=0}s>i.stopNum?(s--,i.backspace(e,s)):s<=i.stopNum&&(i.arrayPos++,i.arrayPos===i.strings.length?(i.arrayPos=0,i.options.onLastStringBackspaced(),i.shuffleStringsIfNeeded(),i.begin()):i.typewrite(i.strings[i.sequence[i.arrayPos]],s))},t)}},{key:"complete",value:function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0}},{key:"setPauseStatus",value:function(e,s,i){this.pause.typewrite=i,this.pause.curString=e,this.pause.curStrPos=s}},{key:"toggleBlinking",value:function(e){!this.cursor||this.pause.status||this.cursorBlinking!==e&&(this.cursorBlinking=e,e?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink"))}},{key:"humanizer",value:function(e){return Math.round(Math.random()*e/2)+e}},{key:"shuffleStringsIfNeeded",value:function(){!this.shuffle||(this.sequence=this.sequence.sort(function(){return Math.random()-.5}))}},{key:"initFadeOut",value:function(){var e=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){e.arrayPos++,e.replaceText(""),e.strings.length>e.arrayPos?e.typewrite(e.strings[e.sequence[e.arrayPos]],0):(e.typewrite(e.strings[0],0),e.arrayPos=0)},this.fadeOutDelay)}},{key:"replaceText",value:function(e){this.attr?this.el.setAttribute(this.attr,e):this.isInput?this.el.value=e:this.contentType==="html"?this.el.innerHTML=e:this.el.textContent=e}},{key:"bindFocusEvents",value:function(){var e=this;!this.isInput||(this.el.addEventListener("focus",function(s){e.stop()}),this.el.addEventListener("blur",function(s){e.el.value&&e.el.value.length!==0||e.start()}))}},{key:"insertCursor",value:function(){!this.showCursor||this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling))}}]),d}();u.default=v,h.exports=u.default},function(h,u,a){Object.defineProperty(u,"__esModule",{value:!0});var r=Object.assign||function(s){for(var i=1;i<arguments.length;i++){var t=arguments[i];for(var l in t)Object.prototype.hasOwnProperty.call(t,l)&&(s[l]=t[l])}return s},c=function(){function s(i,t){for(var l=0;l<t.length;l++){var y=t[l];y.enumerable=y.enumerable||!1,y.configurable=!0,"value"in y&&(y.writable=!0),Object.defineProperty(i,y.key,y)}}return function(i,t,l){return t&&s(i.prototype,t),l&&s(i,l),i}}();function f(s){return s&&s.__esModule?s:{default:s}}function p(s,i){if(!(s instanceof i))throw new TypeError("Cannot call a class as a function")}var v=a(2),d=f(v),o=function(){function s(){p(this,s)}return c(s,[{key:"load",value:function(t,l,y){if(typeof y=="string"?t.el=document.querySelector(y):t.el=y,t.options=r({},d.default,l),t.isInput=t.el.tagName.toLowerCase()==="input",t.attr=t.options.attr,t.bindInputFocusEvents=t.options.bindInputFocusEvents,t.showCursor=t.isInput?!1:t.options.showCursor,t.cursorChar=t.options.cursorChar,t.cursorBlinking=!0,t.elContent=t.attr?t.el.getAttribute(t.attr):t.el.textContent,t.contentType=t.options.contentType,t.typeSpeed=t.options.typeSpeed,t.startDelay=t.options.startDelay,t.backSpeed=t.options.backSpeed,t.smartBackspace=t.options.smartBackspace,t.backDelay=t.options.backDelay,t.fadeOut=t.options.fadeOut,t.fadeOutClass=t.options.fadeOutClass,t.fadeOutDelay=t.options.fadeOutDelay,t.isPaused=!1,t.strings=t.options.strings.map(function(T){return T.trim()}),typeof t.options.stringsElement=="string"?t.stringsElement=document.querySelector(t.options.stringsElement):t.stringsElement=t.options.stringsElement,t.stringsElement){t.strings=[],t.stringsElement.style.display="none";var m=Array.prototype.slice.apply(t.stringsElement.children),b=m.length;if(b)for(var C=0;C<b;C+=1){var k=m[C];t.strings.push(k.innerHTML.trim())}}t.strPos=0,t.arrayPos=0,t.stopNum=0,t.loop=t.options.loop,t.loopCount=t.options.loopCount,t.curLoop=0,t.shuffle=t.options.shuffle,t.sequence=[],t.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},t.typingComplete=!1;for(var C in t.strings)t.sequence[C]=C;t.currentElContent=this.getCurrentElContent(t),t.autoInsertCss=t.options.autoInsertCss,this.appendAnimationCss(t)}},{key:"getCurrentElContent",value:function(t){var l="";return t.attr?l=t.el.getAttribute(t.attr):t.isInput?l=t.el.value:t.contentType==="html"?l=t.el.innerHTML:l=t.el.textContent,l}},{key:"appendAnimationCss",value:function(t){var l="data-typed-js-css";if(!!t.autoInsertCss&&!(!t.showCursor&&!t.fadeOut)&&!document.querySelector("["+l+"]")){var y=document.createElement("style");y.type="text/css",y.setAttribute(l,!0);var m="";t.showCursor&&(m+=`
        .typed-cursor{
          opacity: 1;
        }
        .typed-cursor.typed-cursor--blink{
          animation: typedjsBlink 0.7s infinite;
          -webkit-animation: typedjsBlink 0.7s infinite;
                  animation: typedjsBlink 0.7s infinite;
        }
        @keyframes typedjsBlink{
          50% { opacity: 0.0; }
        }
        @-webkit-keyframes typedjsBlink{
          0% { opacity: 1; }
          50% { opacity: 0.0; }
          100% { opacity: 1; }
        }
      `),t.fadeOut&&(m+=`
        .typed-fade-out{
          opacity: 0;
          transition: opacity .25s;
        }
        .typed-cursor.typed-cursor--blink.typed-fade-out{
          -webkit-animation: 0;
          animation: 0;
        }
      `),y.length!==0&&(y.innerHTML=m,document.body.appendChild(y))}}}]),s}();u.default=o;var e=new o;u.initializer=e},function(h,u){Object.defineProperty(u,"__esModule",{value:!0});var a={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:1/0,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(c){},onComplete:function(c){},preStringTyped:function(c,f){},onStringTyped:function(c,f){},onLastStringBackspaced:function(c){},onTypingPaused:function(c,f){},onTypingResumed:function(c,f){},onReset:function(c){},onStop:function(c,f){},onStart:function(c,f){},onDestroy:function(c){}};u.default=a,h.exports=u.default},function(h,u){Object.defineProperty(u,"__esModule",{value:!0});var a=function(){function p(v,d){for(var o=0;o<d.length;o++){var e=d[o];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(v,e.key,e)}}return function(v,d,o){return d&&p(v.prototype,d),o&&p(v,o),v}}();function r(p,v){if(!(p instanceof v))throw new TypeError("Cannot call a class as a function")}var c=function(){function p(){r(this,p)}return a(p,[{key:"typeHtmlChars",value:function(d,o,e){if(e.contentType!=="html")return o;var s=d.substr(o).charAt(0);if(s==="<"||s==="&"){var i="";for(s==="<"?i=">":i=";";d.substr(o+1).charAt(0)!==i&&(o++,!(o+1>d.length)););o++}return o}},{key:"backSpaceHtmlChars",value:function(d,o,e){if(e.contentType!=="html")return o;var s=d.substr(o).charAt(0);if(s===">"||s===";"){var i="";for(s===">"?i="<":i="&";d.substr(o-1).charAt(0)!==i&&(o--,!(o<0)););o--}return o}}]),p}();u.default=c;var f=new c;u.htmlParser=f}])})})(A);var _=M(A.exports);const B=g=>{const n=g.lastIndexOf("."),u=g.substring(n+1,g.length).toLowerCase();return u=="jpg"||u=="png"||u=="jpeg"?!0:(alert("jpg, jpeg, png  \uD655\uC7A5\uC790\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4."),!1)},X=g=>{const n=g.target.files[0];if(B(n.name)){document.querySelector(".mainWrapper").classList.add("hide");const u=new FileReader;u.onload=a=>{const r=new Image;r.src=a.target.result,r.onload=c=>{new L(c.target)}},u.readAsDataURL(n)}},P=document.getElementById("imageInput");P.addEventListener("change",X);var Y={strings:["Dot Image On Canvas"],typeSpeed:55};new _(".typedTitle",Y);