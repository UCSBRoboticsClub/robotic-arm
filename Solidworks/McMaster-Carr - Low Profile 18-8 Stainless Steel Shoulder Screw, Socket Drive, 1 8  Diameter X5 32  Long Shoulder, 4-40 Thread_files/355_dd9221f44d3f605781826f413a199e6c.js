/* 3/13/2014 6:51:09 PM, 130*/
this.Cmn||(Cmn=new function(){if(("undefined"==typeof YAHOO||!YAHOO)&&"undefined"!=typeof McMasterCom&&McMasterCom&&McMasterCom.Nav)YAHOO=McMasterCom.Nav.GetTopFrame().YAHOO;var l=/([a-z])([A-Z])/g,n={},p={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};this.APPL_ENVR_NMS={DEV:"DEV",QUAL:"QUAL",PROD:"PROD",PUBDEV:"PUBDEV",PUBQUAL:"PUBQUAL",PUB:"PUB"};this.Bt=function(a,b,c){return YAHOO.util.Dom.batch(a,b,c)};this.CrteElement=function(a,b){var c;if(b&&
b.name){c=b.name;var d=null;try{d=document.createElement("<"+a+' name="'+c+'">')}catch(e){}if(!d||d.nodeName!=a.toUpperCase())d=document.createElement(a),d.name=c;c=d;delete b.name}else c=document.createElement(a);for(var f in b)b.hasOwnProperty(f)&&(c[f]=b[f]);return c};this.InsrtAfter=function(a,b){return YAHOO.util.Dom.insertAfter(a,b)};this.InsrtBefore=function(a,b){return YAHOO.util.Dom.insertBefore(a,b)};this.RemElem=function(a){return a.parentNode.removeChild(a)};this.HideHTMLElem=function(a){a.style.display=
"none"};this.VldtHTMLElemHidden=function(a){return"none"==a.style.display};this.ShowHTMLElem=function(a){a.style.display=""};this.ShowByID=function(a){a=this.GetObj(a);this.ShowHTMLElem(a)};this.HideByID=function(a){a=this.GetObj(a);this.HideHTMLElem(a)};this.GetStyle=function(a,b){return YAHOO.util.Dom.getStyle(a,b)};this.SetStyle=function(a,b,c){if("string"===typeof b)return YAHOO.util.Dom.setStyle(a,b,c);if("object"===typeof b){var d;c={};var e="",f,g,h,k;a=q(a);d=a.style.cssText.split(";");g=
0;for(f=d.length;g<f;g++)h=d[g].split(":"),k=h[0].Trim(),h=h[1],""!==k&&(c[k]=h);for(k in b)b.hasOwnProperty(k)&&(d=c,f=k.Trim(),l.test(f)&&(n[f]?f=n[f]:(g=f.replace(l,"$1-$2").toLowerCase(),f=n[f]=g)),d[f]=b[k]);for(k in c)c.hasOwnProperty(k)&&(e+=k+":"+c[k]+";");"undefined"===typeof a.style.cssText?a.setAttribute("style",e):a.style.cssText=e}};this.AddCls=function(a,b){return YAHOO.util.Dom.addClass(a,b)};this.ReplaceCls=function(a,b,c){return YAHOO.util.Dom.replaceClass(a,b,c)};this.RemCls=function(a,
b){if(Cmn.HasCls(a,b))return YAHOO.util.Dom.removeClass(a,b)};this.HasCls=function(a,b){return YAHOO.util.Dom.hasClass(a,b)};this.ChgCls=function(a,b,c){a=q(a);var d=a.className.split(" "),e,f,g,h;switch(typeof b){case "string":b=[b];break;case "object":b=null===b?[]:b;break;default:b=[]}switch(typeof c){case "string":classesToRemArr=[c];break;case "object":classesToRemArr=null===c?[]:c;break;default:classesToRemArr=[]}for(c=0;c<d.length;c++)if(g=d[c].Trim(),""!==g){f=0;for(e=classesToRemArr.length;f<
e;f++)classesToRemArr[f].Trim()===g&&(d.splice(c,1),c--)}for(f=0;f<b.length;f++){g=!1;h=b[f].Trim();c=0;for(e=d.length;c<e;c++)if(h===d[c]){g=!0;break}!0!==g&&d.push(h)}a.className=d.join(" ").Trim()};this.AddDropShadow=function(a){if(!Cmn.GetFrstChldBy(a,function(a){if(Cmn.HasCls(a,"DropShadow"))return!0})){var b=document.createElement("div");this.AddCls(b,"DropShadow");this.AddCls(b,"AbsolutelyPositionedDropShadow");var c=this.GetStyle(a,"z-index")-1;this.SetStyle(b,"z-index",c);a.appendChild(b)}};
this.GetObj=function(a){return document.getElementById(a)};this.Get=function(a){return YAHOO.util.Dom.get(a)};this.GetTxtContent=function(a){return a.textContent||a.innerText};this.GetElementBy=function(a,b,c){var d=null;a=YAHOO.util.Dom.getElementsBy(a,b,c);0<a.length&&(d=a[0]);return d};this.GetElementsBy=function(a,b,c){return YAHOO.util.Dom.getElementsBy(a,b,c)};this.GetElementsByClsNm=function(a,b,c){c||(c=document);if(c.getElementsByClassName){a=c.getElementsByClassName(a);len=a.length;arr=
[];switch(!0){case !b:for(b=0;b<len;b++)arr[b]=a[b];break;case "string"===typeof b:c=b.toUpperCase();for(b=0;b<len;b++)a[b].tagName.toUpperCase()===c&&arr.push(a[b])}return arr}return YAHOO.util.Dom.getElementsByClassName(a,b,c)};this.GetElementsByAttrVal=function(a,b,c,d){return Cmn.GetElementsBy(function(c){return"string"===typeof c.getAttribute(a)&&c.getAttribute(a)===b?!0:!1},c,d)};this.GetElementsByAttrValInList=function(a,b,c,d,e){return Cmn.GetElementsBy(function(d){var e=!1,h,k;if("string"===
typeof d.getAttribute(a)){d=d.getAttribute(a).split(c);h=0;for(k=d.length;h<k;h++)if(d[h]===b){e=!0;break}}return e},d,e)};this.GetChldrnBy=function(a,b){return YAHOO.util.Dom.getChildrenBy(b,a)};this.GetFrstChld=function(a){return YAHOO.util.Dom.getFirstChild(a)};this.GetFrstChldBy=function(a,b){return YAHOO.util.Dom.getFirstChildBy(a,b)};this.GetFrstChldByClsNm=function(a,b){var c=a.childNodes,d=c.length,e,f=null;e=0;for(d=c.length;e<d;e++)if(Cmn.HasCls(c[e],b)){f=c[e];break}return f};this.GetChildrenByClsNm=
function(a,b){var c=a.childNodes,d=c.length,e,f=[];e=0;for(d=c.length;e<d;e++)Cmn.HasCls(c[e],b)&&f.push(c[e]);return f};this.GetLastChld=function(a){return YAHOO.util.Dom.getLastChild(a)};this.GetLastChldBy=function(a,b){return YAHOO.util.Dom.getLastChildBy(a,b)};this.GetNxtSibling=function(a){return YAHOO.util.Dom.getNextSibling(a)};this.GetNxtSiblingBy=function(a,b){return YAHOO.util.Dom.getNextSiblingBy(a,b)};this.GetPrevSibling=function(a){return YAHOO.util.Dom.getPreviousSibling(a)};this.GetPrevSiblingBy=
function(a,b){return YAHOO.util.Dom.getPreviousSiblingBy(a,b)};this.GetAncestorBy=function(a,b){return YAHOO.util.Dom.getAncestorBy(a,b)};this.GetAncestorByClsNm=function(a,b){return YAHOO.util.Dom.getAncestorByClassName(a,b)};this.GetAncestorByTagNm=function(a,b){return YAHOO.util.Dom.getAncestorByTagName(a,b)};this.IsAncestor=function(a,b){return YAHOO.util.Dom.isAncestor(a,b)};this.IsInDocument=function(a){return YAHOO.util.Dom.inDocument(a)};this.SelectorFilter=function(a,b){return YAHOO.util.Selector.filter(a,
b)};this.SelectorQuery=function(a,b,c){return YAHOO.util.Selector.query(a,b,c)};this.SelectorTest=function(a,b){return YAHOO.util.Selector.test(a,b)};this.GetX=function(a){return YAHOO.util.Dom.getX(a)};this.GetY=function(a){return YAHOO.util.Dom.getY(a)};this.GetXY=function(a){return YAHOO.util.Dom.getXY(a)};this.GetXOffset=function(a){return this.GetXYOffset(a)[0]};this.GetYOffset=function(a){return this.GetXYOffset(a)[1]};this.GetXYOffset=function(a){var b=curtop=0;if(a.offsetParent){do b+=a.offsetLeft,
curtop+=a.offsetTop;while(a=a.offsetParent);return[b,curtop]}};this.SetX=function(a,b){return isNaN(b)?!1:YAHOO.util.Dom.setX(a,b)};this.SetY=function(a,b){return isNaN(b)?!1:YAHOO.util.Dom.setY(a,b)};this.SetXY=function(a,b){return isNaN(b[0])||isNaN(b[0])?!1:YAHOO.util.Dom.setXY(a,b)};this.GetRegion=function(a){return YAHOO.util.Dom.getRegion(a)};this.GetHeight=function(a){return a&&"undefined"!==typeof a.offsetHeight?a.offsetHeight:0};this.GetWidth=function(a){return a&&"undefined"!==typeof a.offsetHeight?
a.offsetWidth:0};this.GetViewportHeight=function(){return YAHOO.util.Dom.getViewportHeight()};this.GetViewportWidth=function(){return YAHOO.util.Dom.getViewportWidth()};this.GetVerticalScrollPosn=function(a){return a.scrollTop};this.SetVerticalScrollPosn=function(a,b){a.scrollTop=b};this.ChkForScrollBar=function(a,b){var c=!1,d=Cmn.Get(a);if(d)switch(b.toLowerCase()){case "vertical":d.scrollHeight>d.clientHeight&&(c=!0);break;case "horizontal":if(d.scrollWidth>d.clientWidth)c=!0;else if(!0===Cmn.IsIE&&
(Cmn.IsIE8||Cmn.IsIE9||Cmn.IsIE10))0<d.scrollLeft?c=!0:(d.scrollLeft=5,0<d.scrollLeft&&(c=!0),d.scrollLeft=0)}return c};this.AddEvntListener=function(a,b,c,d,e){var f;if("FOCUS"==b.toUpperCase())f=YAHOO.util.Event.addFocusListener(a,c,d,e);else if("BLUR"==b.toUpperCase())f=YAHOO.util.Event.addBlurListener(a,c,d,e);else if(!Cmn.IsTouchAware()||!(b&&-1<b.toLowerCase().indexOf("mouse")))f=YAHOO.util.Event.addListener(a,b,c,d,e);return f};this.PreventDeflt=function(a){if(a)return YAHOO.util.Event.preventDefault(a)};
this.RemEvntListeners=function(a,b){return YAHOO.util.Event.purgeElement(a,!1,b)};this.RemEvntListener=function(a,b,c){return YAHOO.util.Event.removeListener(a,b,c)};this.StopEvnt=function(a){if(a)return YAHOO.util.Event.stopEvent(a)};this.StopPropagation=function(a){if(a)return YAHOO.util.Event.stopPropagation(a)};this.OnContentReady=function(a,b,c){return YAHOO.util.Event.onContentReady(a,b,c)};this.GetEvntTarget=function(a){return YAHOO.util.Event.getTarget(a)};this.GetEvntRelatedTarget=function(a){return YAHOO.util.Event.getRelatedTarget(a)};
this.GetEvntPageX=function(a){return YAHOO.util.Event.getPageX(a)};this.GetEvntPageY=function(a){return YAHOO.util.Event.getPageY(a)};this.GetQSVal=function(a,b){var c="",d="";if(b){var d=b,e=d.split("?",2);2==e.length&&(d=e[1])}else d=location.search;d=d.replace(/^\?/,"");d=d.split("&");for(e=0;e<d.length;e++){var f=d[e].split("=");f[0].toLowerCase()==a.toLowerCase()&&f[1]&&(c=unescape(f[1]))}return c};this.RemoveQSNmVal=function(a,b){var c="";if(-1<a.indexOf(b+"=")){for(var c=a.split("&"),d=[],
e=0;e<c.length;e++)c[e].split("=")[0].toLowerCase()!=b.toLowerCase()&&d.push(c[e]);c=d.join("&")}else c=a;return c};this.AddQSNmVal=function(a,b,c){c=b+"="+c;var d=a.split("?",2);1==d.length?b=a+"?"+c:(a=d[0],d=d[1],d=this.RemoveQSNmVal(d,b),d=0==d.length?c:d+"&"+c,b=a+"?"+d);return b};this.GetUrlHash=function(){var a,b;try{b=top.location.href}catch(c){return"unknown"}a=b.indexOf("#");return 0<=a?b.substr(a+1):null};this.SetUrlHash=function(a){window.location.hash=a};this.ChkLoadedSecure=function(){return 0==
location.protocol.indexOf("https:")};this.BldSecureURL=function(a,b,c){var d=this.GetApplEnvrPrfx(c)+"1";return m("https://",d,a,b,c)};this.BldNonSecureURL=function(a,b,c){var d=this.GetApplEnvrPrfx(c)+"";return m("http://",d,a,b,c)};this.GetApplEnvrSfx=function(a){var b="",b="";a||(a=location.hostname);b=a.split(".")[0].toLowerCase();return b=-1<b.search("dev$")?"dev":-1<b.search("qual$")?"qual":""};this.GetApplEnvrPrfx=function(a){var b="";a||(a=location.hostname);b=a.split(".")[0].toLowerCase();
return applEnvrSfxTxt=-1<b.search("^www")?"www":-1<b.search("^pub")?"pub":"www"};this.GetCookieVal=function(a){var b="",c=document.cookie,d=c.indexOf(a+"=");-1<d&&(a=d+a.length+1,b=c.indexOf(";",a),-1==b&&(b=c.length),b=unescape(c.substring(a,b)));return b};this.StringifyJSON=function(a){return window.JSON&&window.JSON.stringify?window.JSON.stringify(a):YAHOO.lang.JSON.stringify(a)};this.ParseJSON=function(a){return window.JSON&&window.JSON.parse?window.JSON.parse(a):YAHOO.lang.JSON.parse(a)};this.IsAjaxAvail=
function(){return!0};this.IsTouchAware=function(){var a=!1;if("TRUE"===Cmn.GetQSVal("touch").toUpperCase())a=!0;else if("FALSE"===Cmn.GetQSVal("touch").toUpperCase())a=!1;else{var a="touchstart",b=document.createElement(p[a]||"div"),a="on"+a,c=a in b;c||(b.setAttribute(a,"return;"),c="function"==typeof b[a]);a=c}return a};this.IsSpriteEnabled=function(){var a=!0;"TRUE"===Cmn.GetQSVal("sprite").toUpperCase()?a=!0:"FALSE"===Cmn.GetQSVal("sprite").toUpperCase()?a=!1:Cmn.IsIE6()&&(a=!1);return a};this.IsAppMode=
function(){var a=!1;"TRUE"===Cmn.GetQSVal("appmode").toUpperCase()&&(a=!0);return a};this.GetPixelDensity=function(){return window.devicePixelRatio};this.CallMethodOnSingletonObjByMethodNm=function(a,b,c){if(a&&a[b])a[b](c)};this.GetClonedObj=function(a){var b=null;if(null==a)b=a;else if("object"==typeof a)if("function"==typeof a.Clone)b=a.Clone();else{var b=a instanceof Array?[]:a instanceof Date?new Date:{},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=Cmn.GetClonedObj(a[c]))}else b=a;return b};this.PerformOutOfFlowFunc=
function(a,b){var c=a.parentNode,d=a.nextSibling;c.removeChild(a);b();d?c.insertBefore(a,d):c.appendChild(a)};this.IsEmpty=function(a){var b=!0;if("object"===typeof a&&!(a instanceof Date))if(a instanceof Array)0<a.length&&(b=!1);else for(var c in a){if(a.hasOwnProperty(c)){b=!1;break}}else throw new TypeError;return b};this.VldtEmailAddr=function(a){return/^[^\s]+@[^\s]+[^\s\.]+$/.test(a)};this.Trim=function(a){return a.replace(/^\s+|\s+$/g,"")};this.SetWndwStat=function(a){window.status=a;return!0};
this.ForceWordWrapping=function(a){var b,c=Cmn.GetElementsByClsNm("ForceWordWrapCntnr",null,a);0===c.length&&c.push(Cmn.Get(a));for(a=0;a<c.length;a++){b=c[a];var d=Cmn.GetWidth(b);if(0<d)for(var e=Cmn.GetElementsByClsNm("ForceWordWrapWidthCntnr",null,b),f=0;f<e.length;f++){var g=e[f],h=Cmn.GetWidth(g);if(h>d){var k=Cmn.GetElementsByClsNm("ForceWordWrapTxtCntnr",null,g),l=new CmnColls.List;for(b=0;b<k.length;b++)for(var m=k[b].innerHTML.split(" "),n=0;n<m.length;n++){var p=m[n];-1===p.toLowerCase().indexOf("<wbr>")&&
!1==l.ContainsObj(p)&&l.Add(p)}for(l.Srt("length",CmnColls.SRT_TYP_ALPHANUMERIC_KY_TXT,CmnColls.SRT_DRCT_DESCENDING_KY_TXT);h>d&&0<l.Cnt();){h=l.Itms()[0];m=h.split("").join("<wbr>");for(b=0;b<k.length;b++)k[b].innerHTML=k[b].innerHTML.replace(h,m);l.Rem(0);h=Cmn.GetWidth(g)}}}}};this.collToArray=function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b};this.filter=function(a,b){if(Array.prototype.filter)return Array.prototype.filter.apply(a,[b]);var c=a.length;if("function"!=typeof b)throw new TypeError;
for(var d=[],e=0;e<c;e++)if(e in a){var f=a[e];b.call(b,f,e,a)&&d.push(f)}return d};this.forEach=function(a,b){if(Array.prototype.forEach)return Array.prototype.forEach.apply(a,[b]);var c=a.length;if("function"!=typeof b)throw new TypeError;for(var d=0;d<c;d++)d in a&&b.call(b,a[d],d,a)};this.every=function(a,b){if(Array.prototype.every)return Array.prototype.every.apply(a,[b]);var c=a.length;if("function"!=typeof b)throw new TypeError;for(var d=0;d<c;d++)if(d in a&&!b.call(b,a[d],d,a))return!1;return!0};
this.map=function(a,b){if(Array.prototype.map)return Array.prototype.map.apply(a,[b]);var c=a.length;if("function"!=typeof b)throw new TypeError;for(var d=Array(c),e=0;e<c;e++)e in a&&(d[e]=b.call(b,a[e],e,a));return d};this.some=function(a,b){if(Array.prototype.some)return Array.prototype.some.apply(a,[b]);var c=a.length;if("function"!=typeof b)throw new TypeError;for(var d=0;d<c;d++)if(d in a&&b.call(b,a[d],d,a))return!0;return!1};this.reduce=function(a,b){if(Array.prototype.reduce)return Array.prototype.reduce.apply(a,
[b]);var c=a.length>>>0;if("function"!=typeof b)throw new TypeError;if(0==c&&1==arguments.length)throw new TypeError;c-=1;if(3<=arguments.length)var d=arguments[2];else{do{if(c in a){d=a[c--];break}if(0>--c)throw new TypeError;}while(1)}for(;0<=c;c--)c in a&&(d=b.call(null,d,a[c],c,a));return d};this.reduceRight=function(a,b){if(Array.prototype.reduceRight)return Array.prototype.reduceRight.apply(a,[b]);var c=a.length;if("function"!=typeof b)throw new TypeError;if(0==c&&1==arguments.length)throw new TypeError;
c-=1;if(3<=arguments.length)var d=arguments[2];else{do{if(c in a){d=a[c--];break}if(0>--c)throw new TypeError;}while(1)}for(;0<=c;c--)c in a&&(d=b.call(null,d,a[c],c,a));return d};this.isArray=function(a){return"[object Array]"===Object.prototype.toString.apply(a)};this.create=function(a){var b=function(){};b.prototype=a;return new b};this.GetBaseConversionNbr=function(a,b,c){a=a.toString().toUpperCase();for(var d=0,e=0;e<=a.length;e++)d+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(a.charAt(e))*
Math.pow(b,a.length-e-1);a="";for(e=Math.floor(Math.log(d)/Math.log(c));0<=e;e--)b=Math.floor(d/Math.pow(c,e)),a+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(b),d-=b*Math.pow(c,e);return a};this.AreEqual=function(a,b){var c=!1;switch(!0){case "undefined"==typeof a||"undefined"==typeof b:c=!1;break;case null==a&&null==b:c=!0;break;case "object"==typeof a&&"object"==typeof b:var d=0,e;for(e in a)a.hasOwnProperty(e)&&d++;var f=0;for(e in b)b.hasOwnProperty(e)&&f++;if(d==f)for(var g in a)if(a.hasOwnProperty(g)&&
(c=Cmn.AreEqual(a[g],b[g]),!1==c))break;break;case "object"!=typeof a&&"object"!=typeof b:c=a===b;break;default:c=!1}return c};this.TrkAct=function(a,b){if("true"!==this.GetQSVal("no204").toLowerCase()){var c="";if("object"==typeof a)for(var d in a)a.hasOwnProperty(d)&&(""!=c&&(c+="&"),c=c+d+"="+encodeURIComponent(a[d]));else c=a;d=new Date;d=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"T"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();c+="&page="+b;c+="&ClientBrowserTime="+
d;c+="&sesnextrep="+McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SesnExtRepKy.KyTxt());d=this.GetApplEnvrPrfx(document.location.hostname)+"2"+this.GetApplEnvrSfx(document.location.hostname);d=document.location.protocol+"//"+d+".mcmaster.com";c=d+"/mcm/204.asp?"+c;(new Image(1,1)).src=c}};this.GetTimeOfAction=function(){var a=new Date,b=a.getHours()+1,c=a.getMinutes(),a=a.getSeconds();return""+b+c+a};this.GetTSOfActInclMS=function(){for(var a=new Date,b=a.getHours(),c=a.getMinutes(),d=a.getSeconds(),
a=a.getMilliseconds();3>a.length;)a="0"+a;return b+":"+c+":"+d+"."+a};this.GetOperatingSys=function(){var a="Other OS",b=window.navigator.appVersion;-1<b.indexOf("Win")?a="Windows":-1<b.indexOf("Mac")?a="MacOS":-1<b.indexOf("X11")?a="UNIX":-1<b.indexOf("Linux")&&(a="Linux");return a};this.GetBrowserInfo=function(){var a="Unknown",b="0.0",c=0,d=0,e=window.navigator.userAgent.toUpperCase(),f=!1,g=!1;-1<e.indexOf("MSIE")?(a="Internet Explorer",c=e.indexOf("MSIE")+5,d=e.indexOf(";",c)):-1<e.indexOf("CHROME/")?
(a="Chrome",c=e.indexOf("CHROME/")+7,d=e.indexOf(" ",c)):-1<e.indexOf("OPERA")?(a="Opera",c=e.indexOf("VERSION/")+8,d=e.indexOf("/",c)):-1<e.indexOf("SAFARI")?(a="Safari",c=e.indexOf("VERSION/")+8,d=e.indexOf(" ",c)):-1<e.indexOf("MOZILLA/")&&(a=e.indexOf("GECKO/")+15,f=e.indexOf("/",a),a=e.slice(a,f),c=e.indexOf(a)+a.length+1,d=e.indexOf(" ",c),f=!0);0<c&&(b=e.slice(c,d));-1<e.indexOf("APPLEWEBKIT/")&&(g=!0);e={};e.browserNm=a;e.browserVer=b;e.geckoBrowserInd=f;e.webkitEnabledInd=g;return e};this.GetBrowserVer=
function(){return this.GetBrowserInfo().browserVer};this.IsIE=function(){return!!eval("/*@cc_on true; @*/")};this.IsIE6Below=function(){return!!eval("/*@cc_on if (@_jscript_version >= 9 || @_jscript_version == 5.8 || (@_jscript_version == 5.7 && window.XMLHttpRequest)) {} else {true;} @*/")};this.IsIE6=function(){return!!eval("/*@cc_on if (@_jscript_version == 5.6 || (@_jscript_version == 5.7 && !window.XMLHttpRequest)) {true;} @*/")};this.IsIE7=function(){return!!eval("/*@cc_on if (@_jscript_version == 5.7 && window.XMLHttpRequest) {true;} @*/")};
this.IsIE8=function(){return!!eval("/*@cc_on if (@_jscript_version == 5.8) {true;} @*/")};this.IsIE9=function(){return!!eval("/*@cc_on if (@_jscript_version == 9) {true;} @*/")};this.IsIE10=function(){return!!eval("/*@cc_on if (@_jscript_version == 10) {true;} @*/")};this.IsGecko=function(){return this.GetBrowserInfo().geckoBrowserInd};this.IsChrome=function(){return"CHROME"===this.GetBrowserInfo().browserNm.toUpperCase()?!0:!1};this.IsSafari=function(){return"SAFARI"===this.GetBrowserInfo().browserNm.toUpperCase()?
!0:!1};this.IsIPad=function(){var a=!1;navigator&&"iPad"===navigator.platform&&(a=!0);return a};this.IsIPhone=function(){var a=!1;navigator&&"iPhone"===navigator.platform&&(a=!0);return a};this.IsOpera=function(){return"OPERA"===this.GetBrowserInfo().browserNm.toUpperCase()?!0:!1};this.IsWebKitEnabled=function(){return this.GetBrowserInfo().webkitEnabledInd};this.GetEnvrNm=function(){var a="";switch(Cmn.GetApplEnvrPrfx()+Cmn.GetApplEnvrSfx()){case "www":a=this.APPL_ENVR_NMS.PROD;break;case "wwwqual":a=
this.APPL_ENVR_NMS.QUAL;break;case "wwwdev":a=this.APPL_ENVR_NMS.DEV;break;case "pub":a=this.APPL_ENVR_NMS.PUB;break;case "pubqual":a=this.APPL_ENVR_NMS.PUBQUAL;break;case "pubdev":a=this.APPL_ENVR_NMS.PUBDEV;break;default:a=this.APPL_ENVR_NMS.PROD}return a};this.GetSesnExtRep=function(){if("undefined"!=typeof McMaster)return McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SesnExtRepKy.KyTxt());var a=this.GetCookieVal("sesnextrep");a||(a=this.GetQSVal("sesnextrep"));return a};this.RefreshOrds=
function(a){this.RefreshIncmplOrds();this.RefreshRecentOrds(a)};this.RefreshIncmplOrds=function(){try{var a=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.INCMPL_ORDS),b=new McMaster.MsgMgrMsgs.IncmplOrdsChged(a);McMaster.MsgMgr.PubMsg(b)}catch(c){}};this.RefreshRecentOrds=function(a){try{a||(a=0);var b=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.RECENT_ORDS),c=new McMaster.MsgMgrMsgs.RecentOrdsChged(b);setTimeout(McMaster.MsgMgr.PubMsg(c),a)}catch(d){}};this.ChkLoginRefreshOrds=function(){try{var a=
!!this.GetQSVal("justloggedin"),b=!!this.GetQSVal("justSwitchedUsrInd");(a||b)&&this.RefreshOrds()}catch(c){}};this.ChkUpdtIncmplOrds=function(){try{var a=!!this.GetQSVal("refreshincmplords"),b=this.GetQSVal("ordnavload");(a||"refresh"==b)&&this.RefreshIncmplOrds()}catch(c){}};this.GetLowRsltnHeight=function(){return 600};this.GetForm=function(){return document.getElementById("aspnetForm")};this.ShowInlineHTMLElem=function(a){this.ShowHTMLElem(a)};this.WriteLnk=function(a,b,c,d){var e="";McMasterCom&&
(e=McMasterCom.Nav.GetTopNm(self.name));document.write('<a target="'+e+'" class="'+c+'" href="'+a+'"'+b+">"+d+"</a>")};this.DetectBrowser=function(){var a="Other";if(Cmn.IsIE6())a="IE 6.0";else{var b=navigator.userAgent;-1<b.indexOf("AppleWebKit")?a="Safari":-1<b.indexOf("Opera")?(b.substring(b.indexOf("Opera")),a="Opera"):-1<b.indexOf("Mozilla/4.7")?a="Netscape 4.7":-1<b.indexOf("Netscape")?(a=b.substring(b.indexOf("Netscape")),a=a.substring(a.indexOf("/")+1),a="Netscape "+a):-1<b.indexOf("Firefox")?
(b.substring(b.indexOf("Firefox")),a="Firefox"):-1<b.indexOf("Gecko")&&-1<b.indexOf("Mozilla/5.0")?(a=b.substring(b.indexOf("rv:")),a.substring(3,a.indexOf(")")),a="Mozilla"):-1<b.indexOf("MSIE")&&(a=b.substring(b.indexOf("MSIE")),a=a.substring(5,a.indexOf(";")),a="IE "+a)}return a};this.IsOpera8x=function(){var a=!1;this.IsOpera()&&9>this.GetBrowserInfo().browserVer&&(a=!0);return a};this.GatherContentSizeData=function(){var a={},b=Cmn.GetElementsByClsNm("SpecSrch_Pane","div",Cmn.GetObj("SpecSrch_Cntnr"))[0];
b?(a.hgt=Cmn.GetHeight(b),a.wdth=Cmn.GetWidth(b),a.nbrSpecAttrs=Cmn.GetElementsByClsNm("SpecSrch_AttrShow","div").length,a.hasSpecSearch=!0):a.specSrchPane=!1;return Cmn.StringifyJSON(a)};var m=function(a,b,c,d,e){var f;f="";a&&b&&(a=a.replace(/^\s*/,""),a=a.replace(/\s*$/,""),b=b.replace(/\s*$/,""),b=b.replace(/\s*$/,""),0<a.length&&0<b.length&&(f=f+a+b,f+=Cmn.GetApplEnvrSfx(e),f+=".mcmaster.com"),c&&(c=c.replace(/^\s*/,""),c=c.replace(/\s*$/,""),0<c.length&&(f=0==c.indexOf("/")?f+c:f+("/"+c))),
d&&(d=d.replace(/^\s*/,""),d=d.replace(/\s*$/,""),0<d.length&&(f=0==d.indexOf("?")?f+d:f+("?"+d))));return f},q=function(a){return a=a&&(a.tagName||a.item)?a:YAHOO.util.Dom.get(a)}});Array.max=function(l){return Math.max.apply(Math,l)};Array.min=function(l){return Math.min.apply(Math,l)};Array.dim=function(l,n){var p=[],m;for(m=0;m<l;m+=1)p[m]=n;return p};Function.prototype.curry=function(){var l=Array.prototype.slice,n=l.apply(arguments),p=this;return function(){return p.apply(null,n.concat(l.apply(arguments)))}};


if(this.CmnColls){}else{CmnColls=new function(){this.SRT_TYP_ALPHANUMERIC_KY_TXT="alphanumeric";this.SRT_TYP_DT_KY_TXT="dt";this.SRT_TYP_NONE_KY_TXT="none";this.SRT_DRCT_ASCENDING_KY_TXT="ascending";this.SRT_DRCT_DESCENDING_KY_TXT="descending";this.SRT_DRCT_NONE_KY_TXT="none";var b=function(k,i,h,l,j,g){var f;if(h>i){f=Math.floor(Math.random()*(h-i+1))+i;f=a(k,i,h,f,l,j,g);b(k,i,f-1,l,j,g);b(k,f+1,h,l,j,g);}};var a=function(l,j,f,m,h,i,o){var g=l[m][h],n=j,k;d(l,m,f);n=j;for(k=j;k<f;k++){if((o==CmnColls.SRT_DRCT_ASCENDING_KY_TXT)&&(c(l[k][h],g,i)<0)){d(l,n,k);n++;}else{if((o==CmnColls.SRT_DRCT_DESCENDING_KY_TXT)&&(c(l[k][h],g,i)>0)){d(l,n,k);n++;}}}d(l,f,n);return n;};var d=function(f,i,g){var h;h=f[i];f[i]=f[g];f[g]=h;};var c=function(j,i,h){var k=0;if(h==CmnColls.SRT_TYP_DT_KY_TXT){var g=new Date(j);var f=new Date(i);return g.getTime()-f.getTime();}else{if((j==parseInt(j))&&(i==parseInt(i))){k=j-i;}else{if((j==parseInt(j))||(i==parseInt(i))){if(j<i){k=-1;}else{if(j>i){k=1;}}}else{if(j.toUpperCase()<i.toUpperCase()){k=-1;}else{if(j.toUpperCase()>i.toUpperCase()){k=1;}}}}}return k;};this.List=function(){var i=new Array();var h=CmnColls.SRT_DRCT_NONE_KY_TXT;var f="";var g=CmnColls.SRT_TYP_NONE_KY_TXT;this.Itms=function(){return i;};this.Cnt=function(){return i.length;};this.CurrSrtDrct=function(){return h;};this.CurrSrtPropertyNm=function(){return f;};this.CurrSrtTyp=function(){return g;};this.Add=function(j){i[i.length]=j;};this.Insrt=function(l,j){if((j<0)||(j>i.length)){}else{var k;for(k=i.length;k>j;k--){i[k]=i[k-1];}i[j]=l;}};this.Rem=function(j){if((j<0)||(j>i.length-1)){}else{var k;for(k=j;k<i.length-1;k++){i[k]=i[k+1];}i.length=i.length-1;}};this.Contains=function(n,j){var m=false;var l;var k;for(l=0;l<i.length;l++){k=i[l];if(Cmn.AreEqual(k[n],j)){m=true;break;}}return m;};this.ContainsObj=function(m){var l=false;var k;var j;for(k=0;k<i.length;k++){j=i[k];if(Cmn.AreEqual(j,m)){l=true;break;}}return l;};this.Clear=function(){i.length=0;};this.Srt=function(l,k,j){if((k==CmnColls.SRT_TYP_ALPHANUMERIC_KY_TXT)||(k==CmnColls.SRT_TYP_DT_KY_TXT)){if((j==CmnColls.SRT_DRCT_ASCENDING_KY_TXT)||(j==CmnColls.SRT_DRCT_DESCENDING_KY_TXT)){h=j;f=l;g=k;b(i,0,i.length-1,l,k,j);}}};this.Clone=function(){var k=new CmnColls.List();var l;var j;for(var m=0;m<i.length;m++){l=i[m];j=Cmn.GetClonedObj(l);k.Add(j);}k.Srt(f,g,h);return k;};};this.HashTable=function(f){this.table=f||{};};this.HashTable.prototype.Keys=function(){return e(this.table);};this.HashTable.prototype.Vals=function(){var j=[];var h=this.Keys();for(var g=0;g<h.length;g++){var f=h[g];j.push(this.table[f]);}return j;};this.HashTable.prototype.Cnt=function(){return this.Keys().length;};this.HashTable.prototype.Add=function(f,g){if(this.table.hasOwnProperty(f)){}else{this.table[f]=g;}};this.HashTable.prototype.Itm=function(f){return this.table[f]||null;};this.HashTable.prototype.Clear=function(){this.table={};};this.HashTable.prototype.ContainsKy=function(f){return this.table[f]?true:false;};this.HashTable.prototype.ContainsVal=function(j){var h=this.Keys();for(var g=0;g<h.length;g++){var f=h[g];if(this.table[f]===j){return true;}}return false;};this.HashTable.prototype.Rem=function(f){delete (this.table[f]);};this.HashTable.prototype.Replace=function(f,g){if(this.table[f]){this.table[f]=g;}};this.HashTable.prototype.Clone=function(){var f=clonedItm=Cmn.GetClonedObj(this.table);var g=new CmnColls.HashTable(f);return g;};var e=function e(g){var f=[];for(var h in g){if(g.hasOwnProperty(h)){if(g.hasOwnProperty(h)){f.push(h);}}}return f;};this.DeprecatedHashTable=function(){var g=new CmnColls.List();this.Keys=function(){var h=new Array();for(var i=0;i<g.Cnt();i++){h[h.length]=g.Itms()[i].Ky;}return h;};this.Vals=function(){var h=new Array();for(var i=0;i<g.Cnt();i++){h[h.length]=g.Itms()[i].Val;}return h;};this.Cnt=function(){return g.Cnt();};this.Add=function(h,i){if(g.Contains(f.KY_PROPERTY_NM,h)){}else{g.Add(new f(h,i));}};this.Itm=function(h){var i=null;for(var j=0;j<g.Cnt();j++){if(g.Itms()[j].Ky==h){i=g.Itms()[j].Val;}}return i;};this.Clear=function(){g.Clear();};this.ContainsKy=function(h){return g.Contains(f.KY_PROPERTY_NM,h);};this.ContainsVal=function(h){return g.Contains(f.VAL_PROPERTY_NM,h);};this.Rem=function(i){var h=-1;for(var j=0;j<g.Cnt();j++){if(g.Itms()[j].Ky==i){h=j;}}if(h>=0){g.Rem(h);}};this.Replace=function(h,j){for(var i=0;i<g.Cnt();i++){if(g.Itms()[i].Ky==h){g.Itms()[i].Val=j;}}};this.Clone=function(){var h=new CmnColls.HashTable();var k=Cmn.GetClonedObj(g);var i;for(var j=0;j<k.Cnt();j++){i=k.Itms()[j];h.Add(i.Ky,i.Val);}return h;};var f=function(i,h){this.Ky=i;this.Val=h;};f.KY_PROPERTY_NM="Ky";f.VAL_PROPERTY_NM="Val";};};}

if(McMaster.SesnMgr){}else{McMaster.SesnMgr=new function(){var p=this,j=new CmnColls.HashTable(),k=new CmnColls.HashTable(),o={},l={},b=new CmnColls.HashTable(),e=new CmnColls.DeprecatedHashTable(),r=[],q=0,a=null,d=null,n=null,i=false;this.SITE_TITL_PRFX_TXT="McMaster-Carr";p.IsLoadingPrevSesnStInd=function(){return i;};p.InitSesnStKy=function(){return n;};p.StHistEnabledInd=function(){return(typeof(McMaster.SesnMgr.StHist)==="object");};p.StValDefs={};p.ContainsStValKy=function(s){var t=false;if(typeof(s)==="string"){s=s.toLowerCase();if(j.ContainsKy(s)){t=true;}else{if(e.ContainsKy(s)){t=true;}}}return t;};p.CrteSesnStSnapshot=function(){var x=Cmn.GetClonedObj(j),t=Cmn.GetClonedObj(k),w=Cmn.GetClonedObj(l),s=Cmn.GetClonedObj(o),v=Cmn.GetClonedObj(b),u=Cmn.GetClonedObj(a);q+=1;return new p.SesnStSnapshot(x,t,w,s,v,u,q);};p.GetIFrameDatByCntnrId=function(v){var u=null,t=b.Vals();for(var s=0;s<t.length;s++){if(t[s].CntnrIDTxt===v){u=t[s];break;}}return u;};p.GetStVal=function(s){var u=null;s=s.toLowerCase();if(f(s)){var t=j.Itm(s);if(t){u=t.Val;}}else{u=e.Itm(s);}return Cmn.GetClonedObj(u);};p.GetWebPartDatByCntnrId=function(t){var s=null;var u=l[t];if(u){s=k.Itm(u);}return s;};p.GetImplicitWebPartChildrenByCntnrId=function(E,y){var B=[],x=k.Keys(),F=new CmnColls.HashTable();for(var D=0;D<x.length;D++){var t=x[D],A=k.Itm(t).CntnrIDTxt;F.Add(t,A);}for(var z in o){if(o.hasOwnProperty(z)){var w=o[z];for(var s=0;s<w.length;s++){var v=w[s];F.Rem(v);}}}var u=F.Vals();for(var D=0;D<u.length;D++){var A=u[D];if(y.Cmn&&y.Cmn.IsAncestor(E,A)){var C=p.GetWebPartDatByCntnrId(A);if(C){B.push(C);}}}return B;};p.IsWebPartLoaded=function(u,v){var x=false;if(v){var s=McMaster.SesnMgr.GetWebPartDatByCntnrId(v);if(s){if(s.ClsNm===u){x=true;}}}else{for(var w in l){if(l.hasOwnProperty(w)){var t=McMaster.SesnMgr.GetWebPartDatByCntnrId(w);if(t){if(t.ClsNm===u){x=true;break;}}}}}return x;};p.IsVldSesnStKy=function(t){var s=false;if(p.StHistEnabledInd){s=McMaster.SesnMgr.StHist.isVldSesnStKy(t);}return s;};p.LoadDefltWebsiteSt=function(s){if(typeof(McMaster.SesnMgr.StValDefs.LoadDefltWebsiteSt)==="function"){McMaster.SesnMgr.StValDefs.LoadDefltWebsiteSt(s);}};p.LoadPrevSesnSt=function(t){if(p.StHistEnabledInd()){var s=McMaster.SesnMgr.StHist.getPrevSesnStSnapshot(t);if(s){i=true;h(s);o=s.ParToChldWebPartDats;a=s.SiteTitlTxt;q=s.Seq;l=Cmn.GetClonedObj(s.CntnrToWebPartDats);j=Cmn.GetClonedObj(s.SesnStVals);k=Cmn.GetClonedObj(s.WebPartDats);b=Cmn.GetClonedObj(s.IFrameDats);McMaster.LoadMgr.LoadFrmSesn(k,b);p.SetSiteTitlTxt(a);i=false;}}};p.ReloadCurrSesnSt=function(){var s=McMaster.UrlMgr.GetSesnStKyTxtFrmHash(document.location.hash);if(s){p.LoadPrevSesnSt(s);}};p.RemIFrameDatByCntnrId=function(s){if(b.ContainsKy(s)){b.Rem(s);}};p.RemStVal=function(s){s=s.toLowerCase();if(j.ContainsKy(s)){j.Rem(s);}else{if(e.ContainsKy(s)){e.Rem(s);}}};p.RemWebPartDat=function(v,B){if(k.ContainsKy(v)){var t=k.Itm(v),D=t.ChldWebPartDats.Vals();for(var s=0;s<D.length;s++){p.RemWebPartDat(D[s].IDTxt);}if(B){var y=k.Itm(B);if(y){y.remChldWebPartDat(v);}var w=[],u=o[B];if(u){for(var s=0;s<u.length;s++){var z=u[s];if(z===v){}else{w.push(z);}}o[B]=w;}}if(o[v]&&o[v].length===0){var A=[];for(var C in o){if(o.hasOwnProperty(C)){if(C===v){}else{A[C]=o[C];}}}o=A;}var x=k.Itm(v).CntnrIDTxt;l[x]=null;k.Rem(v);}};p.SetIFrameDat=function(s,u,v){c(s);var t=new McMaster.SesnMgr.IFrameDat(s,u,v);b.Add(s,t);};p.SetSiteTitlTxt=function(t){t=(t)?Cmn.Trim(t):"";var s=p.SITE_TITL_PRFX_TXT;if(t.length>0){s+=" - "+t;}a=t;document.title=s;};p.SetStVal=function(s,v){s=s.toLowerCase();var u=null;v=Cmn.GetClonedObj(v);if(f(s)){if(j.ContainsKy(s)){u=j.Itm(s).Val;j.Replace(s,new McMaster.SesnMgr.SesnStVal(v));}else{j.Add(s,new McMaster.SesnMgr.SesnStVal(v));}}else{if(e.ContainsKy(s)){u=e.Itm(s);e.Replace(s,v);}else{e.Add(s,v);}}if(m()){var t=new p.StChgCntxt(s,v,u);g(t);}};p.SetWebPartDat=function(y,s){var w=y.CntnrIDTxt,u=y.IDTxt,v=y.ClsNm;var z=(y.SesnStSnapshotInd!==false)?true:false;c(w);var A=new McMaster.SesnMgr.WebPartDat(w,u,v,z);k.Add(u,A);if(s&&s!=u){var t=o[s];if(t==null){t=[];}t.push(u);o[s]=t;var x=k.Itm(s);x.addChldWebPartDat(A);}if(w){l[w]=u;}};p.addSnapshotSesnStValKy=function(s){r.push(s);};var c=function(t){var s=l[t];if(s){p.RemWebPartDat(s);}if(b.ContainsKy(t)){p.RemIFrameDatByCntnrId(t);}};var h=function(s){var z=new CmnColls.HashTable(),B=k.Vals(),A=null;for(A=0;A<B.length;A++){z.Add(B[A].CntnrIDTxt,B[A]);}var v=b.Vals();for(A=0;A<v.length;A++){z.Add(v[A].CntnrIDTxt,v[A]);}var w=new CmnColls.HashTable();B=s.WebPartDats.Vals();for(A=0;A<B.length;A++){w.Add(B[A].CntnrIDTxt,B[A]);}v=s.IFrameDats.Vals();for(A=0;A<v.length;A++){w.Add(v[A].CntnrIDTxt,v[A]);}var x=z.Keys();for(A=0;A<x.length;A++){var y=x[A];if(w.ContainsKy(y)&&w.Itm(y).ClsNm===z.Itm(y).ClsNm){}else{var u=z.Itm(y);if(u instanceof p.WebPartDat){if(u.SesnStSnapshotInd===true){McMaster.LoadMgr.UnloadWebPart(u);}}else{if(u instanceof p.IFrameDat){var t=window[u.IDTxt];if(t&&t.location){McMaster.LoadMgr.UnloadIFrame(t);}}}}}};var m=function(){if(d===null){d=false;if(typeof(McMaster.UrlMgr)==="object"){if(p.StHistEnabledInd()){d=true;}else{if(McMaster.UrlMgr.FriendlyUrlsEnabledInd()){d=true;}}}}return d;};var f=function(s){var t=false,u;for(u in r){if(r.hasOwnProperty(u)){if(r[u]==s){t=true;break;}}}return t;};var g=function(s){var t=false,u=null;if(p.StHistEnabledInd()){s.RelStChgCntxts=McMaster.SesnMgr.StHist.relStChgCntxts();if(McMaster.SesnMgr.StHist.isEndOfStHistChg(s)){u=McMaster.SesnMgr.StHist.hndlStHistChg(s);if(n===null){n=u;}t=true;}else{McMaster.SesnMgr.StHist.mntnRelStChgCntxts(s);}}else{if(McMaster.UrlMgr.FriendlyUrlsEnabledInd()){t=true;}}if(t){McMaster.UrlMgr.UpdtUrlHash(s,u);McMaster.SesnMgr.StHist.clearRelStChgCntxts();}};p.IFrameDat=function(t,v,s){var w=this,u=new Date();w.ClsNm=null;w.CntnrIDTxt=t;w.CrteTs=u;w.IDTxt=v;w.LoaderClsNm=null;w.URLTxt=s;};p.IFrameDat.prototype.Clone=function(){var s={};for(var t in this){if(this.hasOwnProperty(t)){s[t]=this[t];}}return s;};p.SesnStSnapshot=function(A,y,v,s,w,z,u){var x=this,t=new Date();x.CntnrToWebPartDats=v;x.CrteTs=t;x.IFrameDats=w;x.ParToChldWebPartDats=s;x.SesnStVals=A;x.Seq=u;x.SiteTitlTxt=z;x.WebPartDats=y;};p.SesnStSnapshot.prototype.Clone=function(){var y=Cmn.GetClonedObj(this.SesnStVals),u=Cmn.GetClonedObj(this.WebPartDats),x=Cmn.GetClonedObj(this.CntnrToWebPartDats),t=Cmn.GetClonedObj(this.ParToChldWebPartDats),w=Cmn.GetClonedObj(this.IFrameDats),v=Cmn.GetClonedObj(this.SiteTitlTxt),s=Cmn.GetClonedObj(this.Seq);return new p.SesnStSnapshot(y,u,x,t,w,v,s);};p.StChgCntxt=function(v,t,s){var u=this,w=null;u.PropertyNm=v;u.NewVal=t;u.OldVal=s;u.RelStChgCntxts=w;u.StHistChgDefNm=null;};p.StChgCntxt.prototype.Clone=function(){return this;};p.StChgCntxt.prototype.IsValChg=function(u){var s=false;if(this.PropertyNm.toLowerCase()==u.toLowerCase()){if(Cmn.AreEqual(this.OldVal,this.NewVal)===false){s=true;}}else{if(this.RelStChgCntxts){var t=this.RelStChgCntxts.Itm(u);if(t){if(Cmn.AreEqual(t.OldVal,t.NewVal)===false){s=true;}}}}return s;};p.WebPartDat=function(t,v,y,x){var w=this,u=new Date(),s=new CmnColls.HashTable();w.ChldWebPartDats=s;w.ClsNm=y;w.CntnrIDTxt=t;w.CrteTs=u;w.IDTxt=v;w.SesnStSnapshotInd=x;w.addChldWebPartDat=function(z){return s.Add(z.IDTxt,z);};w.remChldWebPartDat=function(z){if(s.ContainsKy(z)){s.Rem(z);}};};p.WebPartDat.prototype.Clone=function(){var s=new McMaster.SesnMgr.WebPartDat(this.CntnrIDTxt,this.IDTxt,this.ClsNm,this.SesnStSnapshotInd,this.EmbeddedIntoShellInd);s.CrteTs=this.CrteTs;s.ChldWebPartDats=this.ChldWebPartDats;return s;};p.SesnStVal=function(u){var t=this,s=new Date();t.Val=u;t.CrteTs=s;};p.SesnStVal.prototype.Clone=function(){var s=Cmn.GetClonedObj(this.Val),t=new McMaster.SesnMgr.SesnStVal(s);t.CrteTs=this.CrteTs;return t;};p.SesnStValDef=function(u,t){var s=this;s.KyTxt=function(){return u;};s.Vals={};s.isSnapshotStInd=function(){return(t)?t:false;};if(s.isSnapshotStInd()){McMaster.SesnMgr.addSnapshotSesnStValKy(s.KyTxt());}};p.SesnStValDef.prototype.Clone=function(){var s=new McMaster.SesnMgr.SesnStValDef(this.KyTxt(),this.isSnapshotStInd());s.Vals=this.Vals;return s;};};}

if(McMaster.SesnMgr.StHist){}else{McMaster.SesnMgr.StHist=new function(){var e=this,g=new CmnColls.HashTable(),d=0,h=new CmnColls.HashTable(),a=15,c=1231000000000;e.Defs={};e.MaxHistSnapshotsCnt=a;e.SesnStKyTSSeedMSOffset=c;e.clearRelStChgCntxts=function(){h=new CmnColls.HashTable();};e.getPrevSesnStSnapshot=function(i){return g.Itm(i);};e.hndlStHistChg=function(i){var k=f().toLowerCase();if(typeof(McMaster.SesnMgr.StHist.Defs[i.StHistChgDefNm].bldSiteTitlTxt)==="function"){var l=McMaster.SesnMgr.StHist.Defs[i.StHistChgDefNm].bldSiteTitlTxt(i);McMaster.SesnMgr.SetSiteTitlTxt(l);}var j=McMaster.SesnMgr.CrteSesnStSnapshot();mCurrSesnStKyTxt=k;b(k,j);return k;};e.isEndOfStHistChg=function(j){var k=false,i;for(i in McMaster.SesnMgr.StHist.Defs){if(McMaster.SesnMgr.StHist.Defs.hasOwnProperty(i)){if(McMaster.SesnMgr.StHist.Defs[i].isEndOfStHistChg(j)){k=true;j.StHistChgDefNm=i;break;}}}return k;};e.isVldSesnStKy=function(j){var i=false;if(g.Itm(j)!=null){i=true;}return i;};e.mntnRelStChgCntxts=function(i){var j=i.PropertyNm;if(h.ContainsKy(j)){h.Replace(j,i);}else{h.Add(j,i);}};e.relStChgCntxts=function(){return h;};var f=function(){var i=new Date().getTime()-e.SesnStKyTSSeedMSOffset;i=Math.floor(i/100);var j=Cmn.GetBaseConversionNbr(i,10,36);return j;};var b=function(p,m){var j=m.Seq;if(j>d){g.Add(p,m);var l=g.Cnt();if(l>e.MaxHistSnapshotsCnt){var k=l-e.MaxHistSnapshotsCnt;var n=g.Keys();for(var i=0;i<k;i++){var o=n[i];g.Rem(o);}}d=j;}else{var n=g.Keys();for(var i=n.length;i>=j;i--){var o=n[i-1];g.Rem(o);}g.Add(p,m);}};};}

// Session manager must exist
if (typeof(McMaster.SesnMgr) == 'object') {
    //-------------------------------------------------------------------------
    // Class:       StValDefs
    // Namespace:   McMaster.SesnMgr
    // Summary:     Defines various session states used in the website.
    // Remarks:     This is an application-specific file and each website
    //              should have its own version. We've identified two uses for
    //              creating session state definitions:
    //                  1. Consistency - when multiple parts of a website are
    //                      getting and setting the same session state values
    //                      this object servers to provide a consistent way of
    //                      getting and setting those values.
    //                  2. Website snapshot values - the set of facts we need
    //                      to know in order to recreate the state of the 
    //                      website is only a subset of the set of values that
    //                      can be stored in Session. We are requiring that 
    //                      all values that are needed to recreate the state
    //                      of the website be included in this file, and
    //                      setting the isSnapshotStInd property to true. We
    //                      should only set this property to true when 
    //                      necessary. It can have an impact on the memory
    //                      demands of the client's computer.
    //                      The second parameter of the SesnStValDef is the
    //                      isSnapshotStInd. By default it gets set to false.
    //-------------------------------------------------------------------------
    McMaster.SesnMgr.StValDefs = new function() {

        // Declarations
        var me = this
           , sesnMgr = McMaster.SesnMgr;

        // End Declarations

        // Public Properties
        // Define web part names
        // This is first because it is used by other definitions
        me.WebPartNms = new sesnMgr.SesnStValDef("webpartnms", false);
        me.WebPartNms.Vals.LEGACY_2D_CAD = "Legacy2DCAD";
        me.WebPartNms.Vals.LEGACY_3D_CAD = "Legacy3DCAD";
        me.WebPartNms.Vals.CAD_WEB_PART = "CadWebPart";
        me.WebPartNms.Vals.LEGACY_ADDTNL_CONTENT = "LegacyAddtnlContent";
        me.WebPartNms.Vals.LEGACY_CAREERS = "LegacyCareers";
        me.WebPartNms.Vals.LEGACY_CTLG_PG = "LegacyCtlgPg";
        me.WebPartNms.Vals.LEGACY_CNTCT_EMAIL = "LegacyCntctEmail";
        me.WebPartNms.Vals.LEGACY_CNTCT_US = "LegacyCntctUs";
        me.WebPartNms.Vals.LEGACY_HOME = "LegacyHomepage";
        me.WebPartNms.Vals.LEGACY_ORD_PAD = "LegacyOrdPad";
        me.WebPartNms.Vals.LEGACY_ORD_CONFIRMATION = "LegacyOrdConfirmation";
        me.WebPartNms.Vals.LEGACY_PDF_CTLG_PG = "LegacyPdfCtlgPg";
        me.WebPartNms.Vals.LEGACY_PSRCH = "LegacyPSrch";
        me.WebPartNms.Vals.LEGACY_PSRCH_ITM_DTL = "LegacyPSrchItmDtl";
        me.WebPartNms.Vals.LEGACY_SECR_SETTINGS = "LegacySecrPref";
        me.WebPartNms.Vals.DYNAMIC_CTLG_PG = "DynamicCtlgPage";
        me.WebPartNms.Vals.HOMEPAGE = "HomePageWebPart";
        me.WebPartNms.Vals.INTERMEDIATE_PAGE = "IntermediatePage";
        me.WebPartNms.Vals.ITM_LOOKUP = "ItmLookup";
        me.WebPartNms.Vals.MASTHEAD = "MastheadWebPart";
        me.WebPartNms.Vals.ORD_DTL = "OrdDtlWebPart";
        me.WebPartNms.Vals.ORD_HIST = "OrdHistWebPart";
        me.WebPartNms.Vals.ORD_PAD = "OrdPadWebPart";
        me.WebPartNms.Vals.SRCH_RSLT = "SrchRsltWebPart";

        me.CntnrNms = new sesnMgr.SesnStValDef("containernms", false);
        me.CntnrNms.Vals.MAIN_CONTENT = "MainContent";

        // additional content
        me.AddtnlContentIdTxt = new sesnMgr.SesnStValDef("addtnlcontentidtxt", true);
		
        // Build order pad
        me.BldOrdExpandInd = new sesnMgr.SesnStValDef("bldordexpandind", true);

        // Bookmarks context text
        me.BookmarksCntxtTxt = new sesnMgr.SesnStValDef("bookmarkscntxttxt", false);
        me.BookmarksCntxtTxt.Vals.BOOKMARKS = "bookmarks";

        // cad values
        me.CADDatTxt = new sesnMgr.SesnStValDef("caddattxt", true);
        me.CADWebPartLoadFrmSesnInd = new sesnMgr.SesnStValDef("cadwebpartloadfrmsesnind", false);
        me.CadInLnOrdBxLoadedSesnStat = new sesnMgr.SesnStValDef("cadinlnordbxloadedsesnst", true);


        // Careers context text
        me.CareersCntxtTxt = new sesnMgr.SesnStValDef("careerscntxttxt", false);
        me.CareersQSKyTxt = new sesnMgr.SesnStValDef("careersqskytxt", false);


        // Choose Specs state
        me.ChooseSpecsStat = new sesnMgr.SesnStValDef("choosespecsstat", true);
        me.ChooseSpecsLoadFrmSesnInd = new sesnMgr.SesnStValDef("choosespecsloadfrmsesnind", false);
        me.ChooseSpecsRsltnOvrdInd = new sesnMgr.SesnStValDef("choosespecsrsltnovrdind", true);
        me.SpecsSrchSuppressInd = new sesnMgr.SesnStValDef("specssrchsuppressind", true);
        me.SysSlctdSpecFiltersInd = new sesnMgr.SesnStValDef("sysslctdspecfiltersind", false);

        //Spec Search scrollable containers state.
        me.ScrollableCntnrs = new sesnMgr.SesnStValDef("scrollablecontainers", true);

        //Dynamic Page state
        me.DynamicPagePrsnttnStats = new sesnMgr.SesnStValDef("dynamicpageprsnttnstats", true);
        me.DynamicPageSrchRsltId = new sesnMgr.SesnStValDef("dynamicpagesrchrsltid", true);
        me.DynamicPageActvPrsnttnId = new sesnMgr.SesnStValDef("dynamicpageactvprsnttnid", true);
        me.DynamicPageLoadFrmSesnInd = new sesnMgr.SesnStValDef("dynamicpageloadfrmsesnind", false);
        me.ContentCntnrWdth = new sesnMgr.SesnStValDef("contentcntnrwdth", true);
		
		//Page has specs. Set indicator let us know this is true.
		me.HasSpecSrchInd = new sesnMgr.SesnStValDef("hasspecsrchind",true);
		me.SrchRsltIdForSpecSrch = new sesnMgr.SesnStValDef("srchrsltidforspecsrch",true);

		// The dynamic content web parts that initiated this snapshot (if applicable)
        me.DynamicContentSnapshotInitiators = new sesnMgr.SesnStValDef("dynamiccontentsnapshotinitiators", true);		
		//Item presentation related session values
		me.SrchdPartNbrTxt = new sesnMgr.SesnStValDef("srchdpartnbrtxt", true);
		me.OldStylAttrNms = new sesnMgr.SesnStValDef("oldstylattrnms", true);
		me.OldStylValTxts = new sesnMgr.SesnStValDef("oldstylvaltxts", true);
		me.ItmPrsnttnFeedbackFormOpened = new sesnMgr.SesnStValDef("itmprsnttnfeedbackformopened", true);
		
        //HACK: we'll just update the number in this object to act as a dummy "take a snapshot" method
        me.DynamicContentSesnSt = new sesnMgr.SesnStValDef("dynamiccontentsesnst", true);
		me.DynamicContentSiteTitleText = new sesnMgr.SesnStValDef("dynamiccontentsitetitletext", true);
		
        // Product Page State
        me.ProdPageLoadFrmSesnInd = new sesnMgr.SesnStValDef("prodpageloadfrmsesnind", false);
        // me.ProdPgInitLoadInd = new sesnMgr.SesnStValDef("prodpginitload", true);

		//Content state
		me.ContentLoadFrmSesnInd = new sesnMgr.SesnStValDef("contentloadfrmsesnind", false);
     
        // Cookie refusal
        me.CookieRefusalInd = new sesnMgr.SesnStValDef("cookierefusalind", false);

        //Current message sequence number
        me.CurrMsgSqNbr = new sesnMgr.SesnStValDef("currmsgseqnbr", false);

        // Catalog information
        me.CtlgPgLoaded = new sesnMgr.SesnStValDef("ctlgpgloaded", false);
        me.CtlgPgLoadFrmSesn = new sesnMgr.SesnStValDef("ctlgpgloadfrmsesn", false);
        me.CurrCtlgEdtnNbr = new sesnMgr.SesnStValDef("currctlgedtnnbr", false);
        me.CurrCtlgMaxPageNbr = new sesnMgr.SesnStValDef("currctlgmaxpagenbr", false);
        me.CurrCtlgPgNbr = new sesnMgr.SesnStValDef("currctlgpgnbr", true);
        me.CurrRelatedCtlgPgsTxt = new sesnMgr.SesnStValDef("currrelatedctlgpgstxt", true);
        me.ReqCtlgEdtnNbr = new sesnMgr.SesnStValDef("reqctlgedtnnbr", true);
		me.CtlgPartNbrSlctd = new sesnMgr.SesnStValDef("ctlgpartnbrslctd", false);
		
        //Find Again information
		// Please note: Ensure the flag remains "false" for these. We do not want to repeat all of the 
		// historical data for someone into each snapshot. That would be bad. :-) or should I say :-(
        me.FndAgainInd = new sesnMgr.SesnStValDef("fndagainind", false);
		me.FndAgainPrsnttnIdsToHighlight = new sesnMgr.SesnStValDef("fndagainprsnttnidstohighlight", false); // This must remain false !!!
		me.FndAgainPrtNbrsToHighlight = new sesnMgr.SesnStValDef("fndagainprtnbrstohighlight", false);       // This must remain false !!!
		//Part numbers by location:
		me.FndAgainLocPrtNbrsToHighlight = new sesnMgr.SesnStValDef("fndagainlocprtnbrstohighlight", false); // This must remain false !!!
		me.FndAgainSpecIdValsToParts = new sesnMgr.SesnStValDef("fndagainspecidvalstoparts", false);		 // This must remain false !!!
		me.FndAgainSearchIdsToParts = new sesnMgr.SesnStValDef("fndagainsrchidstoparts", false);		     // This must remain false !!!
		me.FndAgainSearchTermsToHighlight = new sesnMgr.SesnStValDef("fndagainsrchtermstohighlight", false); // This must remain false !!!
		me.FndAgainSlsWrkStObj = new sesnMgr.SesnStValDef("fndagainslswrkstobj", false);                     // This must remain false !!!
		
        //Help context text
        me.HelpCntxtTxt = new sesnMgr.SesnStValDef("helpcntxttxt", false);
        me.HelpCntxtTxt.Vals.BOOKMARKS = "bookmarks";
        me.HelpCntxtTxt.Vals.ABOUTUS = "aboutus";
        me.HelpCntxtTxt.Vals.ORD = "order";

        //Homepage Navigation
        me.HomePageSlctdCatgID = new sesnMgr.SesnStValDef("homepageslctdcatgid", true);
        me.HomePageSlctdCatgTxt = new sesnMgr.SesnStValDef("homepageslctdcatgtxt", true);
        me.HomePageSlctdEntryScrollTop = new sesnMgr.SesnStValDef("homepageslctdentryscrolltop");

        //The Initial Load indicator for the website
        me.WebsiteInitLoadInd = new sesnMgr.SesnStValDef("websiteinitLoadind", false);

        //The inline ordering boxes state
        me.InLnOrdBxsSesnStat = new sesnMgr.SesnStValDef("inlnordbxssesnst", true);		
		me.InLnOrdBxsCrtd = new sesnMgr.SesnStValDef("inlnordbxscrtd", true);
		me.ActvInLnOrdBx = new sesnMgr.SesnStValDef("actvinlnordbx", true); 

        //Item fast track
        me.ItmFastTrackInd = new sesnMgr.SesnStValDef("itmfasttrackind", false);

        //Intermediate pages
        me.IntermediatePageNms = new sesnMgr.SesnStValDef("intermediatepagenms", false); // (a comma-delimited list of the intermediate pages; set by the homepage)
        me.IntermediatePageSrchTxt = new sesnMgr.SesnStValDef("intermediatepagesrchtxt", true);
        me.IntermediatePagePrevSrchTxt = new sesnMgr.SesnStValDef("intermediatepageprevsrchtxt", false);
        me.IntermediatePageLoadFrmSesnInd = new sesnMgr.SesnStValDef("intermediatepageloadfrmsesnind", false);
        me.LandingPageDesignID = new sesnMgr.SesnStValDef("landingpagedesignid", false);

        //Login
        //me.NewLoginInd = new sesnMgr.SesnStValDef("newloginind", false);

        // The main iframe web part name
        me.MainIFrameWebPartNm = new sesnMgr.SesnStValDef("mainiframewebpartnm", true);
        me.MainIFrameWebPartNm.Vals.LEGACY_2D_CAD = me.WebPartNms.Vals.LEGACY_2D_CAD;
        me.MainIFrameWebPartNm.Vals.LEGACY_3D_CAD = me.WebPartNms.Vals.LEGACY_3D_CAD;
        me.MainIFrameWebPartNm.Vals.CAD_WEB_PART = me.WebPartNms.Vals.CAD_WEB_PART;
        me.MainIFrameWebPartNm.Vals.LEGACY_ADDTNL_CONTENT = me.WebPartNms.Vals.LEGACY_ADDTNL_CONTENT;
        me.MainIFrameWebPartNm.Vals.LEGACY_CAREERS = me.WebPartNms.Vals.LEGACY_CAREERS;
        me.MainIFrameWebPartNm.Vals.LEGACY_CNTCT_EMAIL = me.WebPartNms.Vals.LEGACY_CNTCT_EMAIL;
        me.MainIFrameWebPartNm.Vals.LEGACY_CNTCT_US = me.WebPartNms.Vals.LEGACY_CNTCT_US;
        me.MainIFrameWebPartNm.Vals.LEGACY_CTLG_PG = me.WebPartNms.Vals.LEGACY_CTLG_PG;
        me.MainIFrameWebPartNm.Vals.LEGACY_HOME = me.WebPartNms.Vals.LEGACY_HOME;
        me.MainIFrameWebPartNm.Vals.LEGACY_ORD_PAD = me.WebPartNms.Vals.LEGACY_ORD_PAD;
        me.MainIFrameWebPartNm.Vals.LEGACY_ORD_CONFIRMATION = me.WebPartNms.Vals.LEGACY_ORD_CONFIRMATION;
        me.MainIFrameWebPartNm.Vals.LEGACY_PDF_CTLG_PG = me.WebPartNms.Vals.LEGACY_PDF_CTLG_PG;
        me.MainIFrameWebPartNm.Vals.LEGACY_PSRCH = me.WebPartNms.Vals.LEGACY_PSRCH;
        me.MainIFrameWebPartNm.Vals.LEGACY_PSRCH_ITM_DTL = me.WebPartNms.Vals.LEGACY_PSRCH_ITM_DTL;
        me.MainIFrameWebPartNm.Vals.LEGACY_SECR_SETTINGS = me.WebPartNms.Vals.LEGACY_SECR_SETTINGS;
        me.MainIFrameWebPartNm.Vals.INTERMEDIATE_PAGE = me.WebPartNms.Vals.INTERMEDIATE_PAGE;
        me.MainIFrameWebPartNm.Vals.ORD_DTL = me.WebPartNms.Vals.ORD_DTL;
        me.MainIFrameWebPartNm.Vals.ORD_HIST = me.WebPartNms.Vals.ORD_HIST;

        //Multiple orders state key
        me.MultOrdsInd = new sesnMgr.SesnStValDef("multordsind", false);

        // Order pad state key
        me.OrdPadStKy = new sesnMgr.SesnStValDef("ordpadstky", false);
        me.OrdPadStKy.Vals.TOOLBAR = "toolbar";


        //New Order pad state values
        me.CurrOrdId = new sesnMgr.SesnStValDef("currordid", false);
        me.NewOrdPadInd = new sesnMgr.SesnStValDef("newordpadind", false);
        me.OrdPadLoadedInd = new sesnMgr.SesnStValDef("ordpadloadedind", true);
        me.OrdPadLoadFrmSesnInd = new sesnMgr.SesnStValDef("ordpadloadfrmsesnind", false);
        me.CurrVstrCntctEmailAddrTxt = new sesnMgr.SesnStValDef("currvstrcntctemailaddrtxt", false);

        // part number search text
        me.PartNbrSrchTxt = new sesnMgr.SesnStValDef("partnbrsrchtxt", false);

		//web version number for invalidating local storage cache
		me.WebVerTS = new sesnMgr.SesnStValDef("webversiontimestamp", false);
		
		// Performance tracking sequence value
		me.PerfTrackingEvntsQs = new sesnMgr.SesnStValDef("perftrackingevntqs", false); 
		me.PerfTrackingEvntCntxt = new sesnMgr.SesnStValDef("perftrackingevntcntxt", false);
		me.PerfTrackingTransSeq = new sesnMgr.SesnStValDef("perftrackingtransseq", false);
		me.PerfTrackingBypassFastTrkInd = new sesnMgr.SesnStValDef("perftrackingbypassfasttrkind", false);

        // FetchAhead
        me.FetchAheadInd = new sesnMgr.SesnStValDef("fetchaheadind", false);
		
		// Self-Service PO Change Preference Indicator
        me.SelfSvcPOChgInd = new sesnMgr.SesnStValDef("selfsvcpochgind", false);
		
        //Item presentation product detail link activation indicator
        me.ProdDetLnkActvnInd = new sesnMgr.SesnStValDef("proddetlnkactvnind", false);

		//Item presentation feedback form activation indicator
		me.itmPrsnttnFeedbackFormInd = new sesnMgr.SesnStValDef("itmprsnttnfeedbackformind", false);
		// Dynamic Landing Pages activation indicator
		me.DynLandingPgsEnabledInd = new sesnMgr.SesnStValDef("dynlandingpgind", false);

        // Product Page state values
        me.ProdPageLoadFrmSesnInd = new sesnMgr.SesnStValDef("prodpageloadfrmsesnind", false);
//        // Prod Page updating ind -- describes if there are any updates to product page processing
//        me.ProdPageUpdatingInd = new sesnMgr.SesnStValDef("prodpageupdatingind", false);

        // Prod Page unloading ind -- is set when product page is being unloaded.
     //   me.ProdPageUnloadingInd = new sesnMgr.SesnStValDef("prodpageunloadingind", false);
        me.ProdPageReloadingInd = new sesnMgr.SesnStValDef("prodpagereloadingind", false);
	
        // Parametric search keys
        me.PSrchUrl = new sesnMgr.SesnStValDef("psrchurl", false);

        // Recent orders indicator -- describes whether there are any recent orders
        me.RecentOrdsInd = new sesnMgr.SesnStValDef("recentordsind", false);

        // Secondary content iframe web part name
        me.SecondaryContentWebPartNm = new sesnMgr.SesnStValDef("secondarycontentwebpartname", true);
        me.SecondaryContentWebPartNm.Vals.ITM_LOOKUP = me.WebPartNms.Vals.ITM_LOOKUP;
        me.SecondaryContentWebPartNm.Vals.SRCH_RSLT = me.WebPartNms.Vals.SRCH_RSLT;

        // Session extension rep key
        me.SesnExtRepKy = new sesnMgr.SesnStValDef("sesnextrepky", false);

        // The selected masthead button name
        me.SlctdMastheadBtnNm = new sesnMgr.SesnStValDef("slctdmastheadbtnnm", true);
        me.SlctdMastheadBtnNm.Vals.BMS = "bms";
        me.SlctdMastheadBtnNm.Vals.CONTACT_US = "contactus";
        me.SlctdMastheadBtnNm.Vals.CURR_ORD = "currord";
        me.SlctdMastheadBtnNm.Vals.ORD_HIST = "ordhist";

        // The selected part number
        me.SlctdPartNbrTxt = new sesnMgr.SesnStValDef("sltcdpartnbrtxt", true);
        // The selected part number html element id
        me.SlctdPartNbrElemIdTxt = new sesnMgr.SesnStValDef("sltcdpartnbrelemidtxt", true);

        // The selected order history PO text
        me.SlctdOrdHistOrdId = new sesnMgr.SesnStValDef("slctdordhistordid", true);
        me.SlctdOrdHistPOTxt = new sesnMgr.SesnStValDef("slctdordhistpotxt", false);

        // selected quick index link text
        me.SlctdQuickIdxLnkTxt = new sesnMgr.SesnStValDef("slctdquickidxlnktxt", true);

        // The selected search result info
        me.LastSlctdSrchRsltTxt = new sesnMgr.SesnStValDef("lastslctdsrchrslttxt", true);
        me.SlctdSrchRsltTxt = new sesnMgr.SesnStValDef("slctdsrchrslttxt", true);
        me.SlctdSrchRsltId = new sesnMgr.SesnStValDef("slctdsrchrsltid", true);
        me.SlctdSrchRsltFilters = new sesnMgr.SesnStValDef("slctdsrchrsltfilters", true);
        me.SlctdSrchRsltPgNbrs = new sesnMgr.SesnStValDef("slctdsrchrsltpgnbrs", true);
        me.SpecUsrInps = new sesnMgr.SesnStValDef("specusrinps", true);
        me.UnionSrchRsltLoadedInd = new sesnMgr.SesnStValDef("unionsrchrsltloadedind", true);
		me.PreSlctdSpecCntxtNm = new sesnMgr.SesnStValDef("preslctdspeccntxtnm", true);
		
        // Search entry and search results
        me.SrchCompleteInd = new sesnMgr.SesnStValDef("srchcompleteind", true);
        me.SrchCurrInpTxt = new sesnMgr.SesnStValDef("srchcurrinptxt", false);
        me.SrchEntryMode = new sesnMgr.SesnStValDef("srchentrymode", false);
        me.SrchEntryMode.Vals.SRCH_ENTRY_MODE_SRCH = "SRCH";
        me.SrchEntryMode.Vals.SRCH_ENTRY_MODE_KEYBOARD = "KYBOARDNAV";
        me.SrchReqAvgDelay = new sesnMgr.SesnStValDef("srchreqavgdelay", false);
        me.SrchTxt = new sesnMgr.SesnStValDef("srchtxt", true);
        me.SrchLastReqArgs = new sesnMgr.SesnStValDef("srchlastreqargs", false);
        me.SrchSentReqTxt = new sesnMgr.SesnStValDef("srchsntreqtxt", false);
        me.SrchLoadFrmSesnInd = new sesnMgr.SesnStValDef("srchloadfrmsesnind", false);
        me.SrchSuggRecencyReorderInd = new sesnMgr.SesnStValDef("srchsuggrecencyreorderind", false);

        //Homepage Session Ext Rep Kys
        me.SesnExtRepKy = new sesnMgr.SesnStValDef("sesnextrepky", false);

        //HomepageWebPart Versioning Information
        me.HomePageWebPartVerKy = new sesnMgr.SesnStValDef("homepagewebpartver", false);

        //HomepageNavWebPart Versioning Information
        me.HomePageNavWebPartVerKy = new sesnMgr.SesnStValDef("homepagenavwebpartver", false);

        // set the maximum number of snapshots allowed in the state history snapshots collection
        McMaster.SesnMgr.StHist.MaxHistSnapshotsCnt = 15;

        //the tab preference set by the shell to determine old build order customers
        me.TabPref = new sesnMgr.SesnStValDef("tabpref", false)

        //Is true if the homepage redesign will be loaded
        me.HomePageRedesign = new sesnMgr.SesnStValDef("homepageredesign", false)

        // Keep track of the size of the main content container
        me.MainContentCntnrWidth = new sesnMgr.SesnStValDef("maincontentcntnrwidth", false);
        me.MainContentCntnrHeight = new sesnMgr.SesnStValDef("maincontentcntnrheight", false);

        // Keep track of client related environment info (browser, version, processing speed, etc.)
        me.ClntProfInd = new sesnMgr.SesnStValDef("clientprofileind", false);
        me.HomePageLoadTm = new sesnMgr.SesnStValDef("homepageloadtime", false);
        me.CtlgHtmlPageLoadTm = new sesnMgr.SesnStValDef("cataloghtmlpageloadtime", false);
        me.CtlgDynamicPageLoadTm = new sesnMgr.SesnStValDef("catalogdynamicpageloadtime", false);
        me.CtlgPDFPageLoadTm = new sesnMgr.SesnStValDef("catalogpdfpageloadtime", false);
        me.OrdPadLoadTm = new sesnMgr.SesnStValDef("orderpadloadtime", false);
        me.OperatingSys = new sesnMgr.SesnStValDef("operatingsystem", false);
        me.BrowserNm = new sesnMgr.SesnStValDef("browsername", false);
        me.BrowserVer = new sesnMgr.SesnStValDef("browserversion", false);
        me.MobileDeviceInd = new sesnMgr.SesnStValDef("mobiledeviceind", false);
        me.SlowClntInd = new sesnMgr.SesnStValDef("slowclientind", false);
        me.BrowserProcSpeed = new sesnMgr.SesnStValDef("browserprocessingspeed", false);
        me.CnxnSpeed = new sesnMgr.SesnStValDef("connectionspeed", false);
        me.GeckoBrowserInd = new sesnMgr.SesnStValDef("geckobrowserind", false);
        me.WebKitEnabledInd = new sesnMgr.SesnStValDef("webkitenabledind", false);
        me.GZipKnownIncompatibilityInd = new sesnMgr.SesnStValDef("gzipknownincompatibilityind", false);
		me.BrowsRes = new sesnMgr.SesnStValDef("browserresolution", false);

		//Keep track of the presentation user inputs
		me.PrsnttnUsrInps = new sesnMgr.SesnStValDef("prsnttnusrinps",true);
		//group user inputs
		me.GrpUsrInps = new sesnMgr.SesnStValDef("grpusrinps", true);
		//Keep track of image user inputs
		me.ImgUsrInps = new sesnMgr.SesnStValDef("imgusrinps",true);
		//Snapshot of group user inputs when spec search loads
		me.GrpUsrInpsWhenSpecSrchLoads = new sesnMgr.SesnStValDef("grpusrinpswhenspecsrchloads", true);

        me.InLnSpecUsrInps = new sesnMgr.SesnStValDef("inlnspecusrinps", true);
        me.OrdLnSpecUsrInps = new sesnMgr.SesnStValDef("ordlnspecusrinps", true);
		//snapshot to scroll position
		me.SnapShotScrollPos = new sesnMgr.SesnStValDef("snapshotscrollpos", false);		
	//the code set to use when measuring text in EnvrMgr
				me.EnvrMgrCharSetInd = new sesnMgr.SesnStValDef("envrmgrcharsetind",false);
        // End Public Properties    

        // Public Methods

        //-----------------------------------------------------------------
        // Summary: Loads the default state of the website
        // Remarks: Is called by session and load manager when a url can't
        //          be interpreted to anything else
        //-----------------------------------------------------------------
        me.LoadDefltWebsiteSt = function(hpFirstLoadInd) {

            var currHomePageSlctdCatgTxt = ""
               , msg = null
               , hdr = new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.MCM_SESN_MGR);

            //Check if the redesigned home page is set to load
            var isRedesignInd = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.HomePageRedesign.KyTxt());

            //Get the visitor's Tab preference
            var tabPref = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.TabPref.KyTxt());

            //Get the current state value that will show whether 
            //the visitor selected from the 'Choose a Category' frame.  
            if (McMaster.SesnMgr.StValDefs.HomePageSlctdCatgTxt) {
                currHomePageSlctdCatgTxt = McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.HomePageSlctdCatgTxt.KyTxt());
                if (currHomePageSlctdCatgTxt == null) {
                    currHomePageSlctdCatgTxt = ""
                }
            }

            switch (true) {
                case (isRedesignInd && HomePageWebPart.GetLoadedInd() && currHomePageSlctdCatgTxt.length > 0):
                    //The visitor had selected a category so the home page is 
                    //already loaded, but all categories except for the selected   
                    //one are hidden in the MainIFrame.  To show all categories,
                    //set up a message to reload the home page.
                    msg = new McMaster.MsgMgrMsgs.HomeSlctd(hdr);
                    break;

                case (isRedesignInd && HomePageWebPart.GetLoadedInd()):
                    //The new home page is already loaded and no category had been selected; 
                    //all categories are already showing so no action is needed.
                    break;

                case (isRedesignInd && tabPref == "BUILDORDER" &&
						McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.WebsiteInitLoadInd.KyTxt()) === false):
                    //Set the 'current selected' mast head button in session
                    McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.SlctdMastheadBtnNm.KyTxt()
                                             , McMaster.SesnMgr.StValDefs.SlctdMastheadBtnNm.Vals.CURR_ORD);

                    //Indicate that the website has already loaded.
                    McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.WebsiteInitLoadInd.KyTxt(), true);

                    //Set a 'current order selected' message
                    msg = new McMaster.MsgMgrMsgs.CurrOrdSlctd(hdr);
                    break;

                default:
                    //set the indicator showing that the website has loaded for the first time.
                    if (McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.WebsiteInitLoadInd.KyTxt()) === false) {
                        McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.WebsiteInitLoadInd.KyTxt(), true);
                    }
                    //Set a "Home Selected' message
                    msg = new McMaster.MsgMgrMsgs.HomeSlctd(hdr);
                    break;
            }

           
            if (msg == null) {
                ; //Continue
            } else {
				if (hpFirstLoadInd) {
					msg.MsgPayload().HomePageFirstLoad = true;
				}
                McMaster.MsgMgr.PubMsg(msg);
            }
        }


        //-----------------------------------------------------------------
        // Summary: Removes the session information related to search results
        //-----------------------------------------------------------------
        me.RemSrchRsltInfo = function() {
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.SlctdSrchRsltTxt.KyTxt());
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.SlctdSrchRsltId.KyTxt());
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.SlctdSrchRsltPgNbrs.KyTxt());
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.SlctdQuickIdxLnkTxt.KyTxt());
        }

        //-----------------------------------------------------------------
        // Summary: Removes the session information related to catalog pages
        //-----------------------------------------------------------------
        me.RemCtlgPgInfo = function() {
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.CurrCtlgPgNbr.KyTxt());
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.CurrRelatedCtlgPgsTxt.KyTxt());
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.CtlgPgLoaded.KyTxt());
            McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.CtlgPgLoadFrmSesn.KyTxt());
        }

        // End Public Methods
    }
}


this.McMaster.CnxnMgr||(McMaster.CnxnMgr=new function(){var f=new CmnColls.HashTable,l=2053;this.PerformAjaxCnxn=function(a,b,c){var d;if(b){b.cnxnParm=b.cnxnParm||{};b.cnxnParm.respTyp=b.cnxnParm.respTyp||"";b.timeout=b.timeout||"15000";b.maxRetry=b.maxRetry||2;var g;d=a;if(0<=d.indexOf("204.asp"))g="GET";else switch(b.httpMthd){case "POST":g=b.httpMthd;break;default:d.length>l||!0===Cmn.ChkLoadedSecure()?(g="POST",d=d.split("?",2),b.postDat=d[1]):g="GET"}var e=a;d=m(b);var r=n(b),h=p(b,c);c=q(e,
b,c);e=s(b);c={customevents:{onStart:d,onComplete:r,onSuccess:h,onFailure:c,onAbort:e},scope:b.scope,argument:b.cnxnParm,timeout:b.timeout};0===Cmn.GetCookieVal("sesnextrep").length?(d=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.SesnExtRepKy.KyTxt()),a=Cmn.AddQSNmVal(a,"sesnextrep",d)):a=Cmn.RemoveQSNmVal(a,"sesnextrep");!0===Cmn.IsTouchAware()&&!0===b.sendTouch&&(a=Cmn.AddQSNmVal(a,"touch","true"));!0===Cmn.IsAppMode()&&(a=Cmn.AddQSNmVal(a,"appmode","true"));"0"===Cmn.GetCookieVal("gzip")&&
(a=Cmn.AddQSNmVal(a,"gzip","0"));d=McMaster.SesnMgr.GetStVal(McMaster.SesnMgr.StValDefs.EnvrMgrCharSetInd.KyTxt());null!=d&&0<d&&(a=99==d?Cmn.AddQSNmVal(a,"envrmgrcharsetind",1):Cmn.AddQSNmVal(a,"envrmgrcharsetind",d));d=Cmn.GetQSVal("combine_content");""!==d&&(a=Cmn.AddQSNmVal(a,"combine_content",d));d=t(g,a,c,b.postDat);f.Add(d.tId,{retryCnt:0,httpMthd:g,url:a,yuiCallback:c,postDat:b.postDat,maxRetry:b.maxRetry})}return d};this.AbortAjaxCnxn=function(a){if(a){var b=!1,c=f.Itm(a.tId);c&&(b=YAHOO.util.Connect.abort(a,
c.yuiCallback));return b}};this.ModifyCnxn=function(a,b,c){a&&(a.startEvent.unsubscribeAll(),a.startEvent.subscribe(m(b)),a.completeEvent.unsubscribeAll(),a.completeEvent.subscribe(n(b)),a.successEvent.unsubscribeAll(),a.successEvent.subscribe(p(b,c)),a.failureEvent.unsubscribeAll(),a.failureEvent.subscribe(q(a.url,b,c)),a.abortEvent.unsubscribeAll(),a.abortEvent.subscribe(s(b)));return a};var t=function(a,b,c,d){a=YAHOO.util.Connect.asyncRequest(a,b,c,d);a.url=b;return a},u=function(a){var b=!1,
c=f.Itm(a);if(c)if(c.retryCnt>=c.maxRetry)f.Rem(a);else{if(0===c.retryCnt&&994<c.url.length){c.httpMthd="POST";a=c.url.split("?",2);c.url=a[0];c.postDat=a[1];var d=c.yuiCallback.customevents.onSuccess;c.yuiCallback.customevents.onSuccess=function(a,b){l=994;d(a,b)}}setTimeout(function(){t(c.httpMthd,c.url,c.yuiCallback,c.postDat)},200);c.retryCnt+=1;b=!0}return b},m=function(a){return function(b,c){"function"===typeof a.strt&&a.strt()}},n=function(a){return function(b,c){"function"===typeof a.cmpl&&
a.cmpl()}},p=function(a,b){return function(c,d){var g=d[0],e=a.cnxnParm,r=e.respTyp;respHdr=g.getAllResponseHeaders;var h=g.responseText,k="";if(h)switch(r.toUpperCase()){case McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT:try{if(/^\d{10}/.test(h)){var l=1*h.substring(0,10),m=h.substring(10,10+l),n=h.substring(10+l),k=YAHOO.lang.JSON.parse(m);k.MarkupTxt=n}else k=YAHOO.lang.JSON.parse(h)}catch(p){Cmn.TrkAct("0110ErrorParsingWebPartResponse&status="+p.name,"McMaster.CnxnMgr")}break;case McMaster.CnxnMgr.JSON_RESP_TYP_TXT:try{k=
YAHOO.lang.JSON.parse(h)}catch(q){Cmn.TrkAct("0120ErrorParsingJsonResponse&status="+q.name,"McMaster.CnxnMgr")}break;default:k=h}"function"===typeof a.success&&a.success(k,e,b,respHdr);f.Rem(g.tId)}},q=function(a,b,c){return function(a,c){var e=c[0],f=b.cnxnParm;switch(e.status){case 403:e.authErr=!0;"function"===typeof b.failure&&b.failure(e,f);0>e.responseText.indexOf("hroXm{+sWhit-ZI2i<Z5aOk$qnA;1hQUsfj&n)e2")?(McMaster.LoadMgr.ResetShowCntnr("MainIFrame"),MainIFrame.document.open(),0<e.responseText.length?
MainIFrame.document.write(e.responseText):MainIFrame.document.write('<div xmlns="http://www.w3.org/1999/xhtml" id="MainContent" style="display: block;"><div id="CnxnMgr_webToolSetCntnr" style="padding-bottom: 22px;"><div class="WebToolsetWebPart_Cntnr" style="top: 80px; left: 30px; width: 1219px;"><div class="WebToolsetToolWebPart_Cntnr WebToolsetToolWebPart_Aligned_LEFT WebToolsetToolWebPart_TxtTool_Cntnr">Access has been restricted</div></div></div><div id="ProdDatProtectionWebPart_MainContentCntnr"><p>We apologize for the interruption.</p><br /><p>We detected something unusual in your configuration. Please <a href="/#contact">contact us</a> to resolve the issue.</p></div></div>'),
MainIFrame.document.close()):(e=new McMaster.MsgMgr.Hdr(McMaster.MsgMgr.CntxtNms.CNXN_MGR),e=new McMaster.MsgMgrMsgs.AuthErrOccurred(e),McMaster.MsgMgr.PubMsg(e));break;default:u(e.tId)||"function"===typeof b.failure&&b.failure(e,f)}}},s=function(a){return function(b,c){var d=c[0];"function"===typeof a.abort&&a.abort();f.Rem(d.tId)}};window.ActiveXObject&&Cmn.AddEvntListener(window,"unload",function(){for(var a=f.Vals(),b=0;b<a.length;b++)McMaster.CnxnMgr.AbortAjaxCnxn(a[b])})},McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT=
"WEBPART",McMaster.CnxnMgr.JSON_RESP_TYP_TXT="JSON");


McMaster.LoadMgr||(McMaster.LoadMgr=new function(){var e=this,u=/^\/(css|include)\//,v=/\?.*$/;e.IFRAME_CNTNR_TYP="iframe";e.WEBPART_CNTNR_TYP="webpart";e.MULTI_CNTNR_TYP="multi";e.AppendContent=function(a,b,c){null==c&&(c=window);if(a=c.document.getElementById(a))a.innerHTML+=b};e.InsrtContent=function(a,b,c){null==c&&(c=window);if(a=c.document.getElementById(a))a.innerHTML=b};e.LoadAppendWebPart=function(a,b){if(a){var c=b?!0:!1;null==b&&(b=window);var d;d="undefined"===typeof a.CSSInclSrcFilePaths?
a.CSSInclFilePaths:a.CSSInclSrcFilePaths;k(a,b,c,!0);n(a.CSSInclFilePaths,d,{reloadInd:c,inclWindow:b,successFunc:function(a){}})}};e.LoadAssocWebPartFiles=function(a,b){if(a){var c=b?!0:!1;null==b&&(b=window);a.ParWebPart||e.ResetShowCntnr(a.CntnrIDTxt);var d;d="undefined"===typeof a.CSSInclSrcFilePaths?a.CSSInclFilePaths:a.CSSInclSrcFilePaths;k(a,b,c,!1,!1);n(a.CSSInclFilePaths,d,{reloadInd:c,inclWindow:b,successFunc:function(a){}})}};e.LoadFrmSesn=function(a,b){var c=McMasterCom.Nav.GetTopFrame();
new c.PerfTracker.Evnt(c.PerfTracker.EvntNms.LoadFrmSesn,c.PerfTracker.PgCntxtNms.DynCntnt);c=window;if(a){var d=a.Vals(),g;for(g in d)if(d.hasOwnProperty(g)){var f=d[g];!0===f.SesnStSnapshotInd&&(e.ShowCntnr(f.CntnrIDTxt),Cmn.CallMethodOnSingletonObjByMethodNm(c[f.ClsNm+"Loader"],"LoadFrmSesn",f))}}if(b){var d=b.Vals(),h;for(h in d)if(d.hasOwnProperty(h)&&(g=d[h],f=window[g.IDTxt]))!1===q(f,g.URLTxt)&&(e.ShowCntnr(g.CntnrIDTxt),null!=g.LoaderClsNm?(Cmn.CallMethodOnSingletonObjByMethodNm(c[g.LoaderClsNm],
"LoadFrmSesn",g.ClsNm),!1===q(f,g.URLTxt)&&f.location.replace(g.URLTxt)):f.location.replace(g.URLTxt)),null!=g.ClsNm&&Cmn.CallMethodOnSingletonObjByMethodNm(c[g.ClsNm],"LoadCmpl")}};e.LoadIFrame=function(){return function(a,b,c){try{var d=Cmn.GetQSVal("combine_content");""!==d&&(b=Cmn.AddQSNmVal(b,"combine_content",d));if(a){var g=a.name;e.ResetShowCntnr(g);!1!==c&&McMaster.SesnMgr.SetIFrameDat(g,a.name,b)}a&&b&&a.location.replace(b)}catch(f){Cmn.IsIE9?Cmn.GetObj("MainIFrame").src=b:a.location.href=
b}}}();e.LoadWebPart=function(a,b,c){if(a){var d=b?!0:!1;null==b&&(b=window);a.ParWebPart||e.ResetShowCntnr(a.CntnrIDTxt,c);c="undefined"===typeof a.CSSInclSrcFilePaths?a.CSSInclFilePaths:a.CSSInclSrcFilePaths;k(a,b,d);n(a.CSSInclFilePaths,c,{reloadInd:d,inclWindow:b,successFunc:function(a){}})}};e.LoadInsrtWebPart=function(a,b,c){var d=null;a&&b&&(b.cnxnParm=b.cnxnParm?b.cnxnParm:{},b.cnxnParm.respTyp||(b.cnxnParm.respTyp=McMaster.CnxnMgr.WEB_PART_RESP_TYP_TXT),!0==c&&(c=Cmn.GetQSVal("cntnrIDtxt",
a),e.UnloadCntnr(c),e.ShowCntnr(c),e.DisplWaitIcon(c)),c={},c.OrigOnSuccess=b.success,b.success=function(a,b,c){"function"==typeof c.OrigOnSuccess&&c.OrigOnSuccess(a,b);a&&e.LoadWebPart(a)},d=McMaster.CnxnMgr.PerformAjaxCnxn(a,b,c));return d};e.DisplWaitIcon=function(a){if(a=Cmn.GetObj(a))a.innerHTML='<div class="ShellLayout_WaitIcon"></div>'};e.ResetShowCntnr=function(a,b){e.ShowCntnr(a);var c=McMaster.SesnMgr.GetWebPartDatByCntnrId(a);c&&e.UnloadWebPart(c,null,b)};e.RemContent=function(a,b){var c;
null==b&&(b=window);if(c=b.document.getElementById(a))c.innerHTML=""};e.ShowCntnr=function(a){var b=window;if(e.CntnrDefs){var c;c=null;for(var d in e.CntnrDefs)if(e.CntnrDefs.hasOwnProperty(d)&&e.CntnrDefs[d].IDTxt==a){c=e.CntnrDefs[d];c=c.OverrideCntnrDef?c.OverrideCntnrDef:c;break}if(c){if(c){d=c.UnloadCntnrDefs;for(var g in d)if(d.hasOwnProperty(g)){var f=d[g];e.UnloadCntnr(f.OverrideIDTxt?f.OverrideIDTxt:f.IDTxt,f.Typ)}}if(g=Cmn.GetObj(c.IDTxt))!0==c.DisplManagedByWebPartInd?(a=McMaster.SesnMgr.GetWebPartDatByCntnrId(a))&&
Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],"WebPart_SetCntnrDispl",a):g.style.display="block"}}};e.UnloadCntnr=function(a,b,c){var d,g;b=b?b:e.WEBPART_CNTNR_TYP;c=c?c:!1;if(b==e.IFRAME_CNTNR_TYP||b==e.MULTI_CNTNR_TYP)if(d=McMaster.SesnMgr.GetIFrameDatByCntnrId(a)){if(d=Cmn.GetObj(a))e.UnloadIFrame(d,a),d.style.display="none"}else if((d=Cmn.GetObj(a))&&"iframe"==d.nodeName.toLowerCase())e.UnloadIFrame(d,a),d.style.display="none";if(b==e.WEBPART_CNTNR_TYP||b==e.MULTI_CNTNR_TYP){(b=McMaster.SesnMgr.GetWebPartDatByCntnrId(a))&&
McMaster.LoadMgr.UnloadWebPart(b);b=null;for(g in e.CntnrDefs)if(e.CntnrDefs.hasOwnProperty(g)&&e.CntnrDefs[g].IDTxt==a){b=e.CntnrDefs[g];break}if(g=b)for(var f in g.ChildCntnrDefs)g.ChildCntnrDefs.hasOwnProperty(f)&&(b=g.ChildCntnrDefs[f],d=b.OverrideIDTxt?b.OverrideIDTxt:b.IDTxt,e.UnloadCntnr(d,b.Typ,!0));if(!1==c&&(c=Cmn.GetObj(a)))!0==g.DisplManagedByWebPartInd?(a=McMaster.SesnMgr.GetWebPartDatByCntnrId(a))&&Cmn.CallMethodOnSingletonObjByMethodNm(currWindow[a.ClsNm],"WebPart_SetCntnrDispl",a):
c.style.display="none"}};e.UnloadIFrame=function(a,b){var c=null;try{a.location?c=a.location:a.contentWindow&&a.contentWindow.location&&(c=a.contentWindow.location)}catch(d){c=null}try{c&&"about:blank"!==c.href&&(c.replace("about:blank"),!0!==McMaster.SesnMgr.IsLoadingPrevSesnStInd()&&McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.MainIFrameWebPartNm.KyTxt()))}catch(e){c.replace("about:blank"),!0!==McMaster.SesnMgr.IsLoadingPrevSesnStInd()&&McMaster.SesnMgr.RemStVal(McMaster.SesnMgr.StValDefs.MainIFrameWebPartNm.KyTxt())}McMaster.SesnMgr.RemIFrameDatByCntnrId(b)};
e.UnloadWebPart=function(a,b,c,d,g){if(a){null==b&&(b=window);a.LoadFrmSesnInd=c?c:!1;if(!0!==d)for(var f=McMaster.SesnMgr.GetImplicitWebPartChildrenByCntnrId(a.CntnrIDTxt,b),h=0;h<f.length;h++){var l=!0;e.UnloadWebPart(f[h],b,c,l,a.IDTxt)}var f=a.ChldWebPartDats.Vals(),m;for(m in f)f.hasOwnProperty(m)&&(l=!0,e.UnloadWebPart(f[m],b,c,l,a.IDTxt));Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],"WebPart_PreUnload",a);!0!==d&&e.RemContent(a.CntnrIDTxt,b);Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],
"WebPart_Unload",a);McMaster.SesnMgr.RemWebPartDat(a.IDTxt,g)}};var q=function(a,b){var c=!1,d=null;try{d=a.location.href}catch(e){}if(d&&d!==b){var f=a.location.pathname,h=d.indexOf(f),f=b.indexOf(f);0<=h&&0<=f&&(d=d.substring(h,d.length),h=b.substring(f,b.length),d===h&&(c=!0))}return c},w=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=a[c];return b},x=function(a,b,c){var d=[],e=!0;null==c&&(c=window);if(b)for(var f=0;f<b.length;f++){var h=b[f];if(!c.mPageEmbeddedFiles[p(h)]){e=!1;break}}if(!e&&
a)for(f=0;f<a.length;f++)h=a[f],c.mPageEmbeddedFiles[p(h)]||(d[d.length]=h);return d},s=function(a,b,c,d){var e=d?d.inclWindow:null,f=d?d.data:null,h=d?d.reloadInd:!1,l=d?d.successFunc:function(){},m=d?d.failureFunc:function(){},k=!0;d.inclWindow&&(k=!1);h||(b=x(b,c,e));if(b&&0<b.length)YAHOO.util.Get[a](w(b),{autopurge:k,win:e,onSuccess:function(){for(var a=0;a<b.length;a++)r(b[a],e);for(a=0;a<c.length;a++)r(c[a],e);l(f)},onFailure:function(){m(f)}});else l(f)},n=function(a,b,c){s("css",a,b,c)},
y=function(a,b,c){s("script",a,b,c)},r=function(a,b){null==b&&(b=window);b.mPageEmbeddedFiles||(b.mPageEmbeddedFiles={});b.mPageEmbeddedFiles[p(a)]=1},p=function(a){a=a.replace(u,"");a=a.replace(v,"");return a=a.toLowerCase()},t=function(a,b,c,d){McMaster.SesnMgr.SetWebPartDat(a,a.ParWebPart?a.ParWebPart.IDTxt:null);a.EmbeddedIntoShellInd&&(null==a.MarkupTxt||""==a.MarkupTxt)?Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],"WebPart_Load",a):!1===d?Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],
"WebPart_AssocFilesLoad",a):!0===c?(e.AppendContent(a.CntnrIDTxt,a.MarkupTxt,b),Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],"WebPart_Append",a)):(a.CntnrIDTxt&&e.InsrtContent(a.CntnrIDTxt,a.MarkupTxt,b),Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],"WebPart_Load",a));if(a&&a.LoadChldWebPartsInd)for(var g=0;g<a.ChldWebParts.length;g++)a.ChldWebParts[g].ParWebPart=a,t(a.ChldWebParts[g],b,c,d);Cmn.CallMethodOnSingletonObjByMethodNm(b[a.ClsNm],"WebPart_LoadCmpl",a)},k=function(a,b,c,d,e){y(a.JSInclFilePaths,
a.JSInclSrcFilePaths,{reloadInd:c,inclWindow:b,successFunc:function(){t(a,b,d,e);window.FetchAhead&&FetchAheadLoader.HndlWebPart(a)}})};e.CntnrDef=function(a,b){this.ChildCntnrDefs=[];this.DisplManagedByWebPartInd=!1;this.IDTxt=a;this.OverrideCntnrDef=null;this.UnloadCntnrDefs=[];this.Typ=b};e.CntnrDef.prototype.addChildCntnr=function(a){this.ChildCntnrDefs.push(a)};e.CntnrDef.prototype.addUnloadCntnr=function(a){this.UnloadCntnrDefs.push(a)};e.CntnrDef.prototype.setOverrideCntnr=function(a){this.OverrideCntnrDef=
a}});


this.CrtePswdWebPartSecr||(CrtePswdWebPartSecr=new function(){var n="",h="secrUsrNmTxtBx",e="ImplicitUniqueUsrNmChkLblUsrNm",p=!1,l=!1,q=!1;this.Page_Load=function(a,b){Cmn.GetObj(a+"_secrUsrNmTxtBx");Cmn.GetObj(a+"_SecrPswdTxtBx");Cmn.Get(a+"_secrNmTxtBx");try{"True"==b&&(h="secrEmailTxtBx",e="ImplicitUniqueUsrNmChkLblEmailAddr",p=!0)}catch(c){}};this.TxtInp_Keyup=function(a,b,c,d,f){13==a.keyCode?CrtePswdWebPartSecr.CrtePswdLnk_Click(b,c,d,f):(d=Cmn.GetObj(b+"_SecrPswdTxtBx").value,Cmn.GetObj(b+
"_"+h),d!=n&&(n=d,a=0,0!=d.length&&(7>d.length?a+=1:(a+=1,c=/\d/.test(d),d=/[A-z]/.test(d),c&&d&&(a+=1))),0==a?(Cmn.GetObj(b+"_PswdStrength").textContent="Password strength",Cmn.GetObj(b+"_PswdStrength").innerText="Password strength",Cmn.SetStyle(Cmn.GetObj(b+"_PswdStrengthBxLeft"),"background-color","white"),Cmn.SetStyle(Cmn.GetObj(b+"_PswdStrengthBxRight"),"background-color","white")):2==a?(Cmn.GetObj(b+"_PswdStrength").textContent="Strong password",Cmn.GetObj(b+"_PswdStrength").innerText="Strong password",
Cmn.SetStyle(Cmn.GetObj(b+"_PswdStrengthBxLeft"),"background-color","#336633"),Cmn.SetStyle(Cmn.GetObj(b+"_PswdStrengthBxRight"),"background-color","#336633"),l=!0):(Cmn.GetObj(b+"_PswdStrength").textContent="Acceptable password",Cmn.GetObj(b+"_PswdStrength").innerText="Acceptable password",Cmn.SetStyle(Cmn.GetObj(b+"_PswdStrengthBxLeft"),"background-color","#336633"),Cmn.SetStyle(Cmn.GetObj(b+"_PswdStrengthBxRight"),"background-color","white"),l=!1)))};this.PswdLnk_Focus=function(a,b,c){var d=Cmn.GetObj(a+
"_"+h);0!=d.value.length&&r(a,"","","",d.value,"",!1,"chkusrnm",b,c)};this.CrtePswdLnk_Click=function(a,b,c,d){var f=Cmn.GetObj(a+"_"+h),e=Cmn.GetObj(a+"_SecrPswdTxtBx");Cmn.GetObj(a+"_CrtePswdSecrCntnr");var u=Cmn.GetObj(a+"_secrNmTxtBx"),l=Cmn.GetObj(a+"_secrCompanyNmTxtBx"),s=Cmn.GetObj(a+"_secrEmailTxtBx");Cmn.GetObj(a+"_UsrNmSameAsEMailChkBx");if(0==f.value.length&&0==e.value.length)k(a),g(a,"EMPTY_SGN_IN*|*",b);else if(0==e.value.length)c=Cmn.GetObj(a+"_EmptyPswdAlertCntnr"),t(a,c),k(a),Cmn.SetStyle(c,
"visibility","visible"),g(a,"EMPTY_PSWD_FIELD*|*",b);else if(0==f.value.length)c=Cmn.GetObj(a+"_EmptyUsrNmAlertCntnr"),t(a,c),k(a),Cmn.SetStyle(c,"visibility","visible"),g(a,"EMPTY_USR_NM_FIELD*|*",b);else if(p&&!1==Cmn.VldtEmailAddr(s.value))k(a),g(a,"INVLD_EMAIL_ADDR*|*",b);else{k(a);Cmn.HideByID(a+"_CrtePswdSecrCntnr");Cmn.ShowByID(a+"_CrtePswdSecrWaitCntnr");McMaster.LoadMgr.DisplWaitIcon(a+"_CrtePswdSecrWaitCntnr");var m=Cmn.GetObj(a+"_RememberUsrNmChkBx").checked;q=m?!0:!1;r(a,u.value,l.value,
s.value,f.value,e.value,m,"crtepswd",b,c,d)}};this.NotNowBtn_Click=function(a,b){g(a,"CNCL_CRTE_PSWD*|*",b)};this.showOrHideUsrNmFld=function(a,b){Cmn.GetObj(a+"_"+e).textContent="";Cmn.GetObj(a+"_"+e).innerText="";!0==b.checked?(Cmn.HideByID(a+"_UsrNmInpCntnr"),h="secrEmailTxtBx",e="ImplicitUniqueUsrNmChkLblEmailAddr"):(Cmn.ShowByID(a+"_UsrNmInpCntnr"),h="secrUsrNmTxtBx",e="ImplicitUniqueUsrNmChkLblUsrNm")};var r=function(a,b,c,d,f,e,h,g,l,m,k){a={httpMthd:"POST",postDat:"func="+g+"&cntctnm="+encodeURIComponent(b)+
"&cmpnynm="+encodeURIComponent(c)+"&emailaddr="+encodeURIComponent(d)+"&usrnm="+encodeURIComponent(f)+"&pswd="+encodeURIComponent(e)+"&rememberusrnm="+h+"&vstridupdtts="+k,success:v,failure:w,cnxnParm:{WebPartIDTxt:a,MsgPageURL:l,SesnExtRepTxt:m,respTyp:McMaster.CnxnMgr.JSON_RESP_TYP_TXT}};McMaster.SesnMgr.SetStVal(McMaster.SesnMgr.StValDefs.SesnExtRepKy.KyTxt(),m);m=Cmn.BldSecureURL("/WebParts/CrtePswdWebPart/CrtePswdHTTPHandler.aspx","",location.hostname);McMaster.CnxnMgr.PerformAjaxCnxn(m,a)},
v=function(a,b){var c=b.WebPartIDTxt,d=b.MsgPageURL,f=!1;"SUCCESSFUL"==a.RespTxt?f=!0:"PASSED_USR_NM_CHK"==a.RespTxt?(Cmn.GetObj(c+"_"+e).textContent="",Cmn.GetObj(c+"_"+e).innerText="",f=!0):"FAILED_USR_NM_CHK"==a.RespTxt?(Cmn.GetObj(c+"_"+e).textContent="User name taken",Cmn.GetObj(c+"_"+e).innerText="User name taken"):(Cmn.HideByID(c+"_CrtePswdSecrWaitCntnr"),Cmn.ShowByID(c+"_CrtePswdSecrCntnr"),f=!0);f&&g(c,a.RespTxt+"*|*",d)},w=function(a){a=a.WebPartIDTxt;Cmn.HideByID(a+"_CrtePswdSecrWaitCntnr");
Cmn.ShowByID(a+"_CrtePswdSecrCntnr");g(a,"ERR*|*",msgPageUrl)},g=function(a,b,c){var d=Cmn.GetObj(a+"_MsgIFrame"),e=Cmn.GetObj(a+"_"+h);a=b+"*|*"+a+"*|*"+e.value+"*|*"+l+"*|*"+q;b="";try{b="https:"==window.parent.parent.location.protocol?Cmn.BldSecureURL():Cmn.BldNonSecureURL()}catch(g){b=Cmn.BldNonSecureURL()}try{parent.postMessage?parent.postMessage(a,b):d.src=c+"#"+a}catch(k){d.src=c+"#"+a}},k=function(a){a=Cmn.GetElementsByClsNm("CrtePswdWebPartLayout_AlertCntnr","div");for(var b=0;b<a.length;b++)"hidden"==
Cmn.GetStyle(a[b],"visibility")&&Cmn.SetStyle(a[b],"background-color","#FFFFFF"),Cmn.SetStyle(a[b],"visibility","hidden")},t=function(a,b){"visible"==Cmn.GetStyle(b,"visibility")&&Cmn.SetStyle(b,"background-color","#EEEEEE")}});


(function(){window.mPageEmbeddedFiles=window.mPageEmbeddedFiles||{};var f=window.mPageEmbeddedFiles;f['cmn.js']=1;f['cmncolls.js']=1;f['mcmaster.sesnmgr.js']=1;f['mcmaster.sesnmgr.sthist.js']=1;f['mcmaster.sesnmgr.stvaldefs.js']=1;f['mcmaster.cnxnmgr.js']=1;f['mcmaster.loadmgr.js']=1;f['crtepswdwebpartsecr.js']=1;})();