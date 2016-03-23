!function(){"use strict";var a=angular.module("ngNotify",[]),b=!1;try{angular.module("ngSanitize")&&(angular.module("ngNotify").requires.push("ngSanitize"),b=!0)}catch(c){}var d='<div class="ngn" ng-class="ngNotify.notifyClass" ng-style="ngNotify.notifyStyle"><span ng-show="ngNotify.notifyButton" class="ngn-dismiss" ng-click="dismiss()">&times;</span><span ng-if="ngNotify.notifyHtml" ng-bind-html="ngNotify.notifyMessage"></span><span ng-if="!ngNotify.notifyHtml" ng-bind="ngNotify.notifyMessage"></span></div>';a.run(["$templateCache",function(a){a.put("templates/ng-notify/ng-notify.html",d)}]),a.provider("ngNotify",function(){this.$get=["$document","$compile","$log","$rootScope","$timeout","$interval","$templateCache",function(a,c,d,e,f,g,h){var i,j,k="",l=" ",m=3e3,n="ngn-sticky",o=1,p=-1,q=200,r=500,s=25,t=0,u=1,v={theme:"pure",position:"bottom",duration:m,type:"info",sticky:!1,button:!0,html:!1},w={notifyClass:"",notifyMessage:"",notifyStyle:{display:"none",opacity:t}},x={pure:k,prime:"ngn-prime",pastel:"ngn-pastel",pitchy:"ngn-pitchy"},y={info:"ngn-info",error:"ngn-error",success:"ngn-success",warn:"ngn-warn",grimace:"ngn-grimace"},z={bottom:"ngn-bottom",top:"ngn-top"},A=e.$new(),B=c(h.get("templates/ng-notify/ng-notify.html"))(A);A.ngNotify=angular.extend({},w),f(function(){a.find("body").append(B)});var C=function(a){var b=a.type||v.type;return(y[b]||y.info)+l},D=function(a){var b=a.theme||v.theme;return(x[b]||x.pure)+l},E=function(a){var b=a.position||v.position;return(z[b]||z.bottom)+l},F=function(a){var b=a.duration||v.duration;return angular.isNumber(b)?b:m},G=function(a){var b=void 0!==a.sticky?a.sticky:v.sticky;return b?!0:!1},H=function(a,b){var c=void 0!==a.button?a.button:v.button;return c&&b},I=function(a){if((a.html||v.html)&&!b)return d.debug("ngNotify warning: \ngSanitize couldn't be located.  In order to use the 'html' option, be sure the ngSanitize source is included in your project."),!1;var c=void 0!==a.html?a.html:v.html;return c?!0:!1},J=function(a,b){var c=C(a)+D(a)+E(a);return c+=b?n:k},K=function(){A.ngNotify=angular.extend({},w)},L=function(a,b,c,d){var e=s/c;A.ngNotify.notifyStyle={display:"block",opacity:b};var f=function(){b+=a*e,A.ngNotify.notifyStyle.opacity=b,(t>=b||b>=u)&&(g.cancel(j),j=!1,d())};j||(j=g(f,s))},M=function(a,b){L(p,u,a,b)},N=function(a,b){L(o,t,a,b)};return A.dismiss=function(){M(r,function(){K()})},{config:function(a){a=a||{},angular.extend(v,a)},set:function(a,b){if(a){g.cancel(j),j=!1,f.cancel(i);var c={};"object"==typeof b?c=b:c.type=b;var d=G(c),e=F(c);angular.extend(A.ngNotify,{notifyHtml:I(c),notifyClass:J(c,d),notifyButton:H(c,d),notifyMessage:a}),N(q,function(){d||(i=f(function(){A.dismiss()},e))})}},dismiss:function(){A.dismiss()},addTheme:function(a,b){a&&b&&(x[a]=b)},addType:function(a,b){a&&b&&(y[a]=b)}}}]})}();
//# sourceMappingURL=ng-notify.min.js.map
/*! 
 * angular-loading-bar v0.8.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2015 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","$log","cfpLoadingBar",function(b,c,d,e,f,g){function h(){d.cancel(j),g.complete(),l=0,k=0}function i(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var j,k=0,l=0,m=g.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||i(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===k&&(j=d(function(){g.start()},m)),k++,g.set(l/k)),a},response:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),a):(f.error("Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),a)},responseError:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),b.reject(a)):(f.error("Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),b.reject(a))}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.autoIncrement=!0,this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){k||(k=a.get("$animate"));var e=b.find(n).eq(0);c.cancel(m),r||(d.$broadcast("cfpLoadingBar:started"),r=!0,v&&k.enter(o,e,angular.element(e[0].lastChild)),u&&k.enter(q,e,angular.element(e[0].lastChild)),f(w))}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,t&&(c.cancel(l),l=c(function(){g()},250))}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.autoIncrement,u=this.includeSpinner,v=this.includeBar,w=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,autoIncrement:this.autoIncrement,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();
/*
 AngularJS v1.5.0
 (c) 2010-2016 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(A,e,B){'use strict';function C(a){var c=[];v(c,e.noop).chars(a);return c.join("")}function h(a,c){var b={},d=a.split(","),l;for(l=0;l<d.length;l++)b[c?e.lowercase(d[l]):d[l]]=!0;return b}function D(a,c){null===a||a===B?a="":"string"!==typeof a&&(a=""+a);g.innerHTML=a;var b=5;do{if(0===b)throw w("uinput");b--;11>=document.documentMode&&n(g);a=g.innerHTML;g.innerHTML=a}while(a!==g.innerHTML);for(b=g.firstChild;b;){switch(b.nodeType){case 1:c.start(b.nodeName.toLowerCase(),E(b.attributes));
break;case 3:c.chars(b.textContent)}var d;if(!(d=b.firstChild)&&(1==b.nodeType&&c.end(b.nodeName.toLowerCase()),d=b.nextSibling,!d))for(;null==d;){b=b.parentNode;if(b===g)break;d=b.nextSibling;1==b.nodeType&&c.end(b.nodeName.toLowerCase())}b=d}for(;b=g.firstChild;)g.removeChild(b)}function E(a){for(var c={},b=0,d=a.length;b<d;b++){var l=a[b];c[l.name]=l.value}return c}function x(a){return a.replace(/&/g,"&amp;").replace(F,function(a){var b=a.charCodeAt(0);a=a.charCodeAt(1);return"&#"+(1024*(b-55296)+
(a-56320)+65536)+";"}).replace(G,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function v(a,c){var b=!1,d=e.bind(a,a.push);return{start:function(a,f){a=e.lowercase(a);!b&&H[a]&&(b=a);b||!0!==t[a]||(d("<"),d(a),e.forEach(f,function(b,f){var g=e.lowercase(f),h="img"===a&&"src"===g||"background"===g;!0!==I[g]||!0===y[g]&&!c(b,h)||(d(" "),d(f),d('="'),d(x(b)),d('"'))}),d(">"))},end:function(a){a=e.lowercase(a);b||!0!==t[a]||!0===z[a]||(d("</"),d(a),d(">"));a==
b&&(b=!1)},chars:function(a){b||d(x(a))}}}function n(a){if(a.nodeType===Node.ELEMENT_NODE)for(var c=a.attributes,b=0,d=c.length;b<d;b++){var e=c[b],f=e.name.toLowerCase();if("xmlns:ns1"===f||0===f.indexOf("ns1:"))a.removeAttributeNode(e),b--,d--}(c=a.firstChild)&&n(c);(c=a.nextSibling)&&n(c)}var w=e.$$minErr("$sanitize"),F=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,G=/([^\#-~ |!])/g,z=h("area,br,col,hr,img,wbr"),q=h("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),k=h("rp,rt"),u=e.extend({},k,q),q=e.extend({},
q,h("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")),k=e.extend({},k,h("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),J=h("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),
H=h("script,style"),t=e.extend({},z,q,k,u),y=h("background,cite,href,longdesc,src,xlink:href"),u=h("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"),k=h("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",
!0),I=e.extend({},y,k,u),g;(function(a){if(a.document&&a.document.implementation)a=a.document.implementation.createHTMLDocument("inert");else throw w("noinert");var c=(a.documentElement||a.getDocumentElement()).getElementsByTagName("body");1===c.length?g=c[0]:(c=a.createElement("html"),g=a.createElement("body"),c.appendChild(g),a.appendChild(c))})(A);e.module("ngSanitize",[]).provider("$sanitize",function(){var a=!1;this.$get=["$$sanitizeUri",function(c){a&&e.extend(t,J);return function(a){var d=
[];D(a,v(d,function(a,b){return!/^unsafe:/.test(c(a,b))}));return d.join("")}}];this.enableSvg=function(c){return e.isDefined(c)?(a=c,this):a}});e.module("ngSanitize").filter("linky",["$sanitize",function(a){var c=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,b=/^mailto:/i,d=e.$$minErr("linky"),g=e.isString;return function(f,h,m){function k(a){a&&p.push(C(a))}function q(a,b){var c;p.push("<a ");e.isFunction(m)&&(m=m(a));if(e.isObject(m))for(c in m)p.push(c+
'="'+m[c]+'" ');else m={};!e.isDefined(h)||"target"in m||p.push('target="',h,'" ');p.push('href="',a.replace(/"/g,"&quot;"),'">');k(b);p.push("</a>")}if(null==f||""===f)return f;if(!g(f))throw d("notstring",f);for(var r=f,p=[],s,n;f=r.match(c);)s=f[0],f[2]||f[4]||(s=(f[3]?"http://":"mailto:")+s),n=f.index,k(r.substr(0,n)),q(s,f[0].replace(b,"")),r=r.substring(n+f[0].length);k(r);return a(p.join(""))}}])})(window,window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map

/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.14.8 - 2016-02-18T22:01:43.792Z
 * License: MIT
 */


(function () { 
"use strict";
var KEY = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91,

    MAP: { 91 : "COMMAND", 8 : "BACKSPACE" , 9 : "TAB" , 13 : "ENTER" , 16 : "SHIFT" , 17 : "CTRL" , 18 : "ALT" , 19 : "PAUSEBREAK" , 20 : "CAPSLOCK" , 27 : "ESC" , 32 : "SPACE" , 33 : "PAGE_UP", 34 : "PAGE_DOWN" , 35 : "END" , 36 : "HOME" , 37 : "LEFT" , 38 : "UP" , 39 : "RIGHT" , 40 : "DOWN" , 43 : "+" , 44 : "PRINTSCREEN" , 45 : "INSERT" , 46 : "DELETE", 48 : "0" , 49 : "1" , 50 : "2" , 51 : "3" , 52 : "4" , 53 : "5" , 54 : "6" , 55 : "7" , 56 : "8" , 57 : "9" , 59 : ";", 61 : "=" , 65 : "A" , 66 : "B" , 67 : "C" , 68 : "D" , 69 : "E" , 70 : "F" , 71 : "G" , 72 : "H" , 73 : "I" , 74 : "J" , 75 : "K" , 76 : "L", 77 : "M" , 78 : "N" , 79 : "O" , 80 : "P" , 81 : "Q" , 82 : "R" , 83 : "S" , 84 : "T" , 85 : "U" , 86 : "V" , 87 : "W" , 88 : "X" , 89 : "Y" , 90 : "Z", 96 : "0" , 97 : "1" , 98 : "2" , 99 : "3" , 100 : "4" , 101 : "5" , 102 : "6" , 103 : "7" , 104 : "8" , 105 : "9", 106 : "*" , 107 : "+" , 109 : "-" , 110 : "." , 111 : "/", 112 : "F1" , 113 : "F2" , 114 : "F3" , 115 : "F4" , 116 : "F5" , 117 : "F6" , 118 : "F7" , 119 : "F8" , 120 : "F9" , 121 : "F10" , 122 : "F11" , 123 : "F12", 144 : "NUMLOCK" , 145 : "SCROLLLOCK" , 186 : ";" , 187 : "=" , 188 : "," , 189 : "-" , 190 : "." , 191 : "/" , 192 : "`" , 219 : "[" , 220 : "\\" , 221 : "]" , 222 : "'"
    },

    isControl: function (e) {
        var k = e.which;
        switch (k) {
        case KEY.COMMAND:
        case KEY.SHIFT:
        case KEY.CTRL:
        case KEY.ALT:
            return true;
        }

        if (e.metaKey) return true;

        return false;
    },
    isFunctionKey: function (k) {
        k = k.which ? k.which : k;
        return k >= 112 && k <= 123;
    },
    isVerticalMovement: function (k){
      return ~[KEY.UP, KEY.DOWN].indexOf(k);
    },
    isHorizontalMovement: function (k){
      return ~[KEY.LEFT,KEY.RIGHT,KEY.BACKSPACE,KEY.DELETE].indexOf(k);
    },
    toSeparator: function (k) {
      var sep = {ENTER:"\n",TAB:"\t",SPACE:" "}[k];
      if (sep) return sep;
      // return undefined for special keys other than enter, tab or space.
      // no way to use them to cut strings.
      return KEY[k] ? undefined : k;
    }
  };

/**
 * Add querySelectorAll() to jqLite.
 *
 * jqLite find() is limited to lookups by tag name.
 * TODO This will change with future versions of AngularJS, to be removed when this happens
 *
 * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
 * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
 */
if (angular.element.prototype.querySelectorAll === undefined) {
  angular.element.prototype.querySelectorAll = function(selector) {
    return angular.element(this[0].querySelectorAll(selector));
  };
}

/**
 * Add closest() to jqLite.
 */
if (angular.element.prototype.closest === undefined) {
  angular.element.prototype.closest = function( selector) {
    var elem = this[0];
    var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

    while (elem) {
      if (matchesSelector.bind(elem)(selector)) {
        return elem;
      } else {
        elem = elem.parentElement;
      }
    }
    return false;
  };
}

var latestId = 0;

var uis = angular.module('ui.select', [])

.constant('uiSelectConfig', {
  theme: 'bootstrap',
  searchEnabled: true,
  sortable: false,
  placeholder: '', // Empty by default, like HTML tag <select>
  refreshDelay: 1000, // In milliseconds
  closeOnSelect: true,
  dropdownPosition: 'auto',
  generateId: function() {
    return latestId++;
  },
  appendToBody: false
})

// See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
.service('uiSelectMinErr', function() {
  var minErr = angular.$$minErr('ui.select');
  return function() {
    var error = minErr.apply(this, arguments);
    var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
    return new Error(message);
  };
})

// Recreates old behavior of ng-transclude. Used internally.
.directive('uisTranscludeAppend', function () {
  return {
    link: function (scope, element, attrs, ctrl, transclude) {
        transclude(scope, function (clone) {
          element.append(clone);
        });
      }
    };
})

/**
 * Highlights text that matches $select.search.
 *
 * Taken from AngularUI Bootstrap Typeahead
 * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
 */
.filter('highlight', function() {
  function escapeRegexp(queryToEscape) {
    return ('' + queryToEscape).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return function(matchItem, query) {
    return query && matchItem ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
  };
})

/**
 * A read-only equivalent of jQuery's offset function: http://api.jquery.com/offset/
 *
 * Taken from AngularUI Bootstrap Position:
 * See https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js#L70
 */
.factory('uisOffset',
  ['$document', '$window',
  function ($document, $window) {

  return function(element) {
    var boundingClientRect = element[0].getBoundingClientRect();
    return {
      width: boundingClientRect.width || element.prop('offsetWidth'),
      height: boundingClientRect.height || element.prop('offsetHeight'),
      top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
      left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
    };
  };
}]);

uis.directive('uiSelectChoices',
  ['uiSelectConfig', 'uisRepeatParser', 'uiSelectMinErr', '$compile', '$window',
  function(uiSelectConfig, RepeatParser, uiSelectMinErr, $compile, $window) {

  return {
    restrict: 'EA',
    require: '^uiSelect',
    replace: true,
    transclude: true,
    templateUrl: function(tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-choices');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      return theme + '/choices.tpl.html';
    },

    compile: function(tElement, tAttrs) {

      if (!tAttrs.repeat) throw uiSelectMinErr('repeat', "Expected 'repeat' expression.");

      return function link(scope, element, attrs, $select, transcludeFn) {

        // var repeat = RepeatParser.parse(attrs.repeat);
        var groupByExp = attrs.groupBy;
        var groupFilterExp = attrs.groupFilter;

        $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

        $select.disableChoiceExpression = attrs.uiDisableChoice;
        $select.onHighlightCallback = attrs.onHighlight;

        $select.dropdownPosition = attrs.position ? attrs.position.toLowerCase() : uiSelectConfig.dropdownPosition;

        if(groupByExp) {
          var groups = element.querySelectorAll('.ui-select-choices-group');
          if (groups.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-group but got '{0}'.", groups.length);
          groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
        }

        var choices = element.querySelectorAll('.ui-select-choices-row');
        if (choices.length !== 1) {
          throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row but got '{0}'.", choices.length);
        }

        choices.attr('ng-repeat', $select.parserResult.repeatExpression(groupByExp))
            .attr('ng-if', '$select.open'); //Prevent unnecessary watches when dropdown is closed
        if ($window.document.addEventListener) {  //crude way to exclude IE8, specifically, which also cannot capture events
          choices.attr('ng-mouseenter', '$select.setActiveItem('+$select.parserResult.itemName +')')
              .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');
        }

        var rowsInner = element.querySelectorAll('.ui-select-choices-row-inner');
        if (rowsInner.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row-inner but got '{0}'.", rowsInner.length);
        rowsInner.attr('uis-transclude-append', ''); //Adding uisTranscludeAppend directive to row element after choices element has ngRepeat
        if (!$window.document.addEventListener) {  //crude way to target IE8, specifically, which also cannot capture events - so event bindings must be here
          rowsInner.attr('ng-mouseenter', '$select.setActiveItem('+$select.parserResult.itemName +')')
              .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');
        }

        $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uisTranscludeAppend

        scope.$watch('$select.search', function(newValue) {
          if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
          $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
          if (!attrs.minimumInputLength || $select.search.length >= attrs.minimumInputLength) {
            $select.refresh(attrs.refresh);
          } else {
            $select.items = [];
          }
        });

        attrs.$observe('refreshDelay', function() {
          // $eval() is needed otherwise we get a string instead of a number
          var refreshDelay = scope.$eval(attrs.refreshDelay);
          $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
        });
      };
    }
  };
}]);

/**
 * Contains ui-select "intelligence".
 *
 * The goal is to limit dependency on the DOM whenever possible and
 * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
 */
uis.controller('uiSelectCtrl',
  ['$scope', '$element', '$timeout', '$filter', 'uisRepeatParser', 'uiSelectMinErr', 'uiSelectConfig', '$parse', '$injector',
  function($scope, $element, $timeout, $filter, RepeatParser, uiSelectMinErr, uiSelectConfig, $parse, $injector) {

  var ctrl = this;

  var EMPTY_SEARCH = '';

  ctrl.placeholder = uiSelectConfig.placeholder;
  ctrl.searchEnabled = uiSelectConfig.searchEnabled;
  ctrl.sortable = uiSelectConfig.sortable;
  ctrl.refreshDelay = uiSelectConfig.refreshDelay;
  ctrl.paste = uiSelectConfig.paste;

  ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list
  ctrl.closeOnSelect = true; //Initialized inside uiSelect directive link function
  ctrl.search = EMPTY_SEARCH;

  ctrl.activeIndex = 0; //Dropdown of choices
  ctrl.items = []; //All available choices

  ctrl.open = false;
  ctrl.focus = false;
  ctrl.disabled = false;
  ctrl.selected = undefined;

  ctrl.dropdownPosition = 'auto';

  ctrl.focusser = undefined; //Reference to input element used to handle focus events
  ctrl.resetSearchInput = true;
  ctrl.multiple = undefined; // Initialized inside uiSelect directive link function
  ctrl.disableChoiceExpression = undefined; // Initialized inside uiSelectChoices directive link function
  ctrl.tagging = {isActivated: false, fct: undefined};
  ctrl.taggingTokens = {isActivated: false, tokens: undefined};
  ctrl.lockChoiceExpression = undefined; // Initialized inside uiSelectMatch directive link function
  ctrl.clickTriggeredSelect = false;
  ctrl.$filter = $filter;

  // Use $injector to check for $animate and store a reference to it
  ctrl.$animate = (function () {
    try {
      return $injector.get('$animate');
    } catch (err) {
      // $animate does not exist
      return null;
    }
  })();

  ctrl.searchInput = $element.querySelectorAll('input.ui-select-search');
  if (ctrl.searchInput.length !== 1) {
    throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", ctrl.searchInput.length);
  }

  ctrl.isEmpty = function() {
    return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '' || (ctrl.multiple && ctrl.selected.length === 0);
  };

  function _findIndex(collection, predicate, thisArg){
    if (collection.findIndex){
      return collection.findIndex(predicate, thisArg);
    } else {
      var list = Object(collection);
      var length = list.length >>> 0;
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    }
  }

  // Most of the time the user does not want to empty the search input when in typeahead mode
  function _resetSearchInput() {
    if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && uiSelectConfig.resetSearchInput)) {
      ctrl.search = EMPTY_SEARCH;
      //reset activeIndex
      if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
        ctrl.activeIndex = _findIndex(ctrl.items, function(item){
          return angular.equals(this, item);
        }, ctrl.selected);
      }
    }
  }

    function _groupsFilter(groups, groupNames) {
      var i, j, result = [];
      for(i = 0; i < groupNames.length ;i++){
        for(j = 0; j < groups.length ;j++){
          if(groups[j].name == [groupNames[i]]){
            result.push(groups[j]);
          }
        }
      }
      return result;
    }

  // When the user clicks on ui-select, displays the dropdown list
  ctrl.activate = function(initSearchValue, avoidReset) {
    if (!ctrl.disabled  && !ctrl.open) {
      if(!avoidReset) _resetSearchInput();

      $scope.$broadcast('uis:activate');

      ctrl.open = true;

      ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

      // ensure that the index is set to zero for tagging variants
      // that where first option is auto-selected
      if ( ctrl.activeIndex === -1 && ctrl.taggingLabel !== false ) {
        ctrl.activeIndex = 0;
      }

      var container = $element.querySelectorAll('.ui-select-choices-content');
      if (ctrl.$animate && ctrl.$animate.enabled(container[0])) {
        ctrl.$animate.on('enter', container[0], function (elem, phase) {
          if (phase === 'close') {
            // Only focus input after the animation has finished
            $timeout(function () {
              ctrl.focusSearchInput(initSearchValue);
            });
          }
        });
      } else {
        $timeout(function () {
          ctrl.focusSearchInput(initSearchValue);
        });
      }
    }
  };

  ctrl.focusSearchInput = function (initSearchValue) {
    ctrl.search = initSearchValue || ctrl.search;
    ctrl.searchInput[0].focus();
    if(!ctrl.tagging.isActivated && ctrl.items.length > 1) {
     _ensureHighlightVisible();
    }
  };

  ctrl.findGroupByName = function(name) {
    return ctrl.groups && ctrl.groups.filter(function(group) {
      return group.name === name;
    })[0];
  };

  ctrl.parseRepeatAttr = function(repeatAttr, groupByExp, groupFilterExp) {
    function updateGroups(items) {
      var groupFn = $scope.$eval(groupByExp);
      ctrl.groups = [];
      angular.forEach(items, function(item) {
        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
        var group = ctrl.findGroupByName(groupName);
        if(group) {
          group.items.push(item);
        }
        else {
          ctrl.groups.push({name: groupName, items: [item]});
        }
      });
      if(groupFilterExp){
        var groupFilterFn = $scope.$eval(groupFilterExp);
        if( angular.isFunction(groupFilterFn)){
          ctrl.groups = groupFilterFn(ctrl.groups);
        } else if(angular.isArray(groupFilterFn)){
          ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
        }
      }
      ctrl.items = [];
      ctrl.groups.forEach(function(group) {
        ctrl.items = ctrl.items.concat(group.items);
      });
    }

    function setPlainItems(items) {
      ctrl.items = items;
    }

    ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

    ctrl.parserResult = RepeatParser.parse(repeatAttr);

    ctrl.isGrouped = !!groupByExp;
    ctrl.itemProperty = ctrl.parserResult.itemName;

    //If collection is an Object, convert it to Array

    var originalSource = ctrl.parserResult.source;

    //When an object is used as source, we better create an array and use it as 'source'
    var createArrayFromObject = function(){
      var origSrc = originalSource($scope);
      $scope.$uisSource = Object.keys(origSrc).map(function(v){
        var result = {};
        result[ctrl.parserResult.keyName] = v;
        result.value = origSrc[v];
        return result;
      });
    };

    if (ctrl.parserResult.keyName){ // Check for (key,value) syntax
      createArrayFromObject();
      ctrl.parserResult.source = $parse('$uisSource' + ctrl.parserResult.filters);
      $scope.$watch(originalSource, function(newVal, oldVal){
        if (newVal !== oldVal) createArrayFromObject();
      }, true);
    }

    ctrl.refreshItems = function (data){
      data = data || ctrl.parserResult.source($scope);
      var selectedItems = ctrl.selected;
      //TODO should implement for single mode removeSelected
      if (ctrl.isEmpty() || (angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
        ctrl.setItemsFn(data);
      }else{
        if ( data !== undefined ) {
          var filteredItems = data.filter(function(i) {return selectedItems && selectedItems.indexOf(i) < 0;});
          ctrl.setItemsFn(filteredItems);
        }
      }
      if (ctrl.dropdownPosition === 'auto' || ctrl.dropdownPosition === 'up'){
        $scope.calculateDropdownPos();
      }
    };

    // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
    $scope.$watchCollection(ctrl.parserResult.source, function(items) {
      if (items === undefined || items === null) {
        // If the user specifies undefined or null => reset the collection
        // Special case: items can be undefined if the user did not initialized the collection on the scope
        // i.e $scope.addresses = [] is missing
        ctrl.items = [];
      } else {
        if (!angular.isArray(items)) {
          throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
        } else {
          //Remove already selected items (ex: while searching)
          //TODO Should add a test
          ctrl.refreshItems(items);
          ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
        }
      }
    });

  };

  var _refreshDelayPromise;

  /**
   * Typeahead mode: lets the user refresh the collection using his own function.
   *
   * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
   */
  ctrl.refresh = function(refreshAttr) {
    if (refreshAttr !== undefined) {

      // Debounce
      // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
      // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
      if (_refreshDelayPromise) {
        $timeout.cancel(_refreshDelayPromise);
      }
      _refreshDelayPromise = $timeout(function() {
        $scope.$eval(refreshAttr);
      }, ctrl.refreshDelay);
    }
  };

  ctrl.isActive = function(itemScope) {
    if ( !ctrl.open ) {
      return false;
    }
    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isActive =  itemIndex == ctrl.activeIndex;

    if ( !isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) ||( itemIndex < 0 && ctrl.taggingLabel === false) ) {
      return false;
    }

    if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
      itemScope.$eval(ctrl.onHighlightCallback);
    }

    return isActive;
  };

  ctrl.isDisabled = function(itemScope) {

    if (!ctrl.open) return;

    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isDisabled = false;
    var item;

    if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
      item = ctrl.items[itemIndex];
      isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
      item._uiSelectChoiceDisabled = isDisabled; // store this for later reference
    }

    return isDisabled;
  };


  // When the user selects an item with ENTER or clicks the dropdown
  ctrl.select = function(item, skipFocusser, $event) {
    if (item === undefined || !item._uiSelectChoiceDisabled) {

      if ( ! ctrl.items && ! ctrl.search && ! ctrl.tagging.isActivated) return;

      if (!item || !item._uiSelectChoiceDisabled) {
        if(ctrl.tagging.isActivated) {
          // if taggingLabel is disabled, we pull from ctrl.search val
          if ( ctrl.taggingLabel === false ) {
            if ( ctrl.activeIndex < 0 ) {
              item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
              if (!item || angular.equals( ctrl.items[0], item ) ) {
                return;
              }
            } else {
              // keyboard nav happened first, user selected from dropdown
              item = ctrl.items[ctrl.activeIndex];
            }
          } else {
            // tagging always operates at index zero, taggingLabel === false pushes
            // the ctrl.search value without having it injected
            if ( ctrl.activeIndex === 0 ) {
              // ctrl.tagging pushes items to ctrl.items, so we only have empty val
              // for `item` if it is a detected duplicate
              if ( item === undefined ) return;

              // create new item on the fly if we don't already have one;
              // use tagging function if we have one
              if ( ctrl.tagging.fct !== undefined && typeof item === 'string' ) {
                item = ctrl.tagging.fct(item);
                if (!item) return;
              // if item type is 'string', apply the tagging label
              } else if ( typeof item === 'string' ) {
                // trim the trailing space
                item = item.replace(ctrl.taggingLabel,'').trim();
              }
            }
          }
          // search ctrl.selected for dupes potentially caused by tagging and return early if found
          if ( ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter( function (selection) { return angular.equals(selection, item); }).length > 0 ) {
            ctrl.close(skipFocusser);
            return;
          }
        }

        $scope.$broadcast('uis:select', item);

        var locals = {};
        locals[ctrl.parserResult.itemName] = item;

        $timeout(function(){
          ctrl.onSelectCallback($scope, {
            $item: item,
            $model: ctrl.parserResult.modelMapper($scope, locals)
          });
        });

        if (ctrl.closeOnSelect) {
          ctrl.close(skipFocusser);
        }
        if ($event && $event.type === 'click') {
          ctrl.clickTriggeredSelect = true;
        }
      }
    }
  };

  // Closes the dropdown
  ctrl.close = function(skipFocusser) {
    if (!ctrl.open) return;
    if (ctrl.ngModel && ctrl.ngModel.$setTouched) ctrl.ngModel.$setTouched();
    _resetSearchInput();
    ctrl.open = false;

    $scope.$broadcast('uis:close', skipFocusser);

  };

  ctrl.setFocus = function(){
    if (!ctrl.focus) ctrl.focusInput[0].focus();
  };

  ctrl.clear = function($event) {
    ctrl.select(undefined);
    $event.stopPropagation();
    $timeout(function() {
      ctrl.focusser[0].focus();
    }, 0, false);
  };

  // Toggle dropdown
  ctrl.toggle = function(e) {
    if (ctrl.open) {
      ctrl.close();
      e.preventDefault();
      e.stopPropagation();
    } else {
      ctrl.activate();
    }
  };

  ctrl.isLocked = function(itemScope, itemIndex) {
      var isLocked, item = ctrl.selected[itemIndex];

      if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
          isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
          item._uiSelectChoiceLocked = isLocked; // store this for later reference
      }

      return isLocked;
  };

  var sizeWatch = null;
  ctrl.sizeSearchInput = function() {

    var input = ctrl.searchInput[0],
        container = ctrl.searchInput.parent().parent()[0],
        calculateContainerWidth = function() {
          // Return the container width only if the search input is visible
          return container.clientWidth * !!input.offsetParent;
        },
        updateIfVisible = function(containerWidth) {
          if (containerWidth === 0) {
            return false;
          }
          var inputWidth = containerWidth - input.offsetLeft - 10;
          if (inputWidth < 50) inputWidth = containerWidth;
          ctrl.searchInput.css('width', inputWidth+'px');
          return true;
        };

    ctrl.searchInput.css('width', '10px');
    $timeout(function() { //Give tags time to render correctly
      if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
        sizeWatch = $scope.$watch(calculateContainerWidth, function(containerWidth) {
          if (updateIfVisible(containerWidth)) {
            sizeWatch();
            sizeWatch = null;
          }
        });
      }
    });
  };

  function _handleDropDownSelection(key) {
    var processed = true;
    switch (key) {
      case KEY.DOWN:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
        break;
      case KEY.UP:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) { ctrl.activeIndex--; }
        break;
      case KEY.TAB:
        if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
        break;
      case KEY.ENTER:
        if(ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)){
          ctrl.select(ctrl.items[ctrl.activeIndex]); // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
        } else {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        }
        break;
      case KEY.ESC:
        ctrl.close();
        break;
      default:
        processed = false;
    }
    return processed;
  }

  // Bind to keyboard shortcuts
  ctrl.searchInput.on('keydown', function(e) {

    var key = e.which;

    if (~[KEY.ENTER,KEY.ESC].indexOf(key)){
      e.preventDefault();
      e.stopPropagation();
    }

    // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
    //   //TODO: SEGURO?
    //   ctrl.close();
    // }

    $scope.$apply(function() {

      var tagged = false;

      if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
        _handleDropDownSelection(key);
        if ( ctrl.taggingTokens.isActivated ) {
          for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
            if ( ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode] ) {
              // make sure there is a new value to push via tagging
              if ( ctrl.search.length > 0 ) {
                tagged = true;
              }
            }
          }
          if ( tagged ) {
            $timeout(function() {
              ctrl.searchInput.triggerHandler('tagged');
              var newItem = ctrl.search.replace(KEY.MAP[e.keyCode],'').trim();
              if ( ctrl.tagging.fct ) {
                newItem = ctrl.tagging.fct( newItem );
              }
              if (newItem) ctrl.select(newItem, true);
            });
          }
        }
      }

    });

    if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
      _ensureHighlightVisible();
    }

    if (key === KEY.ENTER || key === KEY.ESC) {
      e.preventDefault();
      e.stopPropagation();
    }

  });

  ctrl.searchInput.on('paste', function (e) {
    var data;

    if (window.clipboardData && window.clipboardData.getData) { // IE
      data = window.clipboardData.getData('Text');
    } else {
      data = (e.originalEvent || e).clipboardData.getData('text/plain');
    }

    // Prepend the current input field text to the paste buffer.
    data = ctrl.search + data;

    if (data && data.length > 0) {
      // If tagging try to split by tokens and add items
      if (ctrl.taggingTokens.isActivated) {
        var separator = KEY.toSeparator(ctrl.taggingTokens.tokens[0]);
        var items = data.split(separator || ctrl.taggingTokens.tokens[0]); // split by first token only
        if (items && items.length > 0) {
        var oldsearch = ctrl.search;
          angular.forEach(items, function (item) {
            var newItem = ctrl.tagging.fct ? ctrl.tagging.fct(item) : item;
            if (newItem) {
              ctrl.select(newItem, true);
            }
          });
          ctrl.search = oldsearch || EMPTY_SEARCH;
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (ctrl.paste) {
        ctrl.paste(data);
        ctrl.search = EMPTY_SEARCH;
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  ctrl.searchInput.on('tagged', function() {
    $timeout(function() {
      _resetSearchInput();
    });
  });

  // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
  function _ensureHighlightVisible() {
    var container = $element.querySelectorAll('.ui-select-choices-content');
    var choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
    }

    if (ctrl.activeIndex < 0) {
      return;
    }

    var highlighted = choices[ctrl.activeIndex];
    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
    var height = container[0].offsetHeight;

    if (posY > height) {
      container[0].scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      if (ctrl.isGrouped && ctrl.activeIndex === 0)
        container[0].scrollTop = 0; //To make group header visible when going all the way up
      else
        container[0].scrollTop -= highlighted.clientHeight - posY;
    }
  }

  $scope.$on('$destroy', function() {
    ctrl.searchInput.off('keyup keydown tagged blur paste');
  });

}]);

uis.directive('uiSelect',
  ['$document', 'uiSelectConfig', 'uiSelectMinErr', 'uisOffset', '$compile', '$parse', '$timeout',
  function($document, uiSelectConfig, uiSelectMinErr, uisOffset, $compile, $parse, $timeout) {

  return {
    restrict: 'EA',
    templateUrl: function(tElement, tAttrs) {
      var theme = tAttrs.theme || uiSelectConfig.theme;
      return theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
    },
    replace: true,
    transclude: true,
    require: ['uiSelect', '^ngModel'],
    scope: true,

    controller: 'uiSelectCtrl',
    controllerAs: '$select',
    compile: function(tElement, tAttrs) {

      // Allow setting ngClass on uiSelect
      var match = /{(.*)}\s*{(.*)}/.exec(tAttrs.ngClass);
      if(match) {
        var combined = '{'+ match[1] +', '+ match[2] +'}';
        tAttrs.ngClass = combined;
        tElement.attr('ng-class', combined);
      }

      //Multiple or Single depending if multiple attribute presence
      if (angular.isDefined(tAttrs.multiple))
        tElement.append('<ui-select-multiple/>').removeAttr('multiple');
      else
        tElement.append('<ui-select-single/>');

      if (tAttrs.inputId)
        tElement.querySelectorAll('input.ui-select-search')[0].id = tAttrs.inputId;

      return function(scope, element, attrs, ctrls, transcludeFn) {

        var $select = ctrls[0];
        var ngModel = ctrls[1];

        $select.generatedId = uiSelectConfig.generateId();
        $select.baseTitle = attrs.title || 'Select box';
        $select.focusserTitle = $select.baseTitle + ' focus';
        $select.focusserId = 'focusser-' + $select.generatedId;

        $select.closeOnSelect = function() {
          if (angular.isDefined(attrs.closeOnSelect)) {
            return $parse(attrs.closeOnSelect)();
          } else {
            return uiSelectConfig.closeOnSelect;
          }
        }();

        $select.onSelectCallback = $parse(attrs.onSelect);
        $select.onRemoveCallback = $parse(attrs.onRemove);

        //Limit the number of selections allowed
        $select.limit = (angular.isDefined(attrs.limit)) ? parseInt(attrs.limit, 10) : undefined;

        //Set reference to ngModel from uiSelectCtrl
        $select.ngModel = ngModel;

        $select.choiceGrouped = function(group){
          return $select.isGrouped && group && group.name;
        };

        if(attrs.tabindex){
          attrs.$observe('tabindex', function(value) {
            $select.focusInput.attr('tabindex', value);
            element.removeAttr('tabindex');
          });
        }

        scope.$watch('searchEnabled', function() {
            var searchEnabled = scope.$eval(attrs.searchEnabled);
            $select.searchEnabled = searchEnabled !== undefined ? searchEnabled : uiSelectConfig.searchEnabled;
        });

        scope.$watch('sortable', function() {
            var sortable = scope.$eval(attrs.sortable);
            $select.sortable = sortable !== undefined ? sortable : uiSelectConfig.sortable;
        });

        attrs.$observe('disabled', function() {
          // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
          $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
        });

        attrs.$observe('resetSearchInput', function() {
          // $eval() is needed otherwise we get a string instead of a boolean
          var resetSearchInput = scope.$eval(attrs.resetSearchInput);
          $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
        });

        attrs.$observe('paste', function() {
          $select.paste = scope.$eval(attrs.paste);
        });

        attrs.$observe('tagging', function() {
          if(attrs.tagging !== undefined)
          {
            // $eval() is needed otherwise we get a string instead of a boolean
            var taggingEval = scope.$eval(attrs.tagging);
            $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : undefined};
          }
          else
          {
            $select.tagging = {isActivated: false, fct: undefined};
          }
        });

        attrs.$observe('taggingLabel', function() {
          if(attrs.tagging !== undefined )
          {
            // check eval for FALSE, in this case, we disable the labels
            // associated with tagging
            if ( attrs.taggingLabel === 'false' ) {
              $select.taggingLabel = false;
            }
            else
            {
              $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
            }
          }
        });

        attrs.$observe('taggingTokens', function() {
          if (attrs.tagging !== undefined) {
            var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',','ENTER'];
            $select.taggingTokens = {isActivated: true, tokens: tokens };
          }
        });

        //Automatically gets focus when loaded
        if (angular.isDefined(attrs.autofocus)){
          $timeout(function(){
            $select.setFocus();
          });
        }

        //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
        if (angular.isDefined(attrs.focusOn)){
          scope.$on(attrs.focusOn, function() {
              $timeout(function(){
                $select.setFocus();
              });
          });
        }

        function onDocumentClick(e) {
          if (!$select.open) return; //Skip it if dropdown is close

          var contains = false;

          if (window.jQuery) {
            // Firefox 3.6 does not support element.contains()
            // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
            contains = window.jQuery.contains(element[0], e.target);
          } else {
            contains = element[0].contains(e.target);
          }

          if (!contains && !$select.clickTriggeredSelect) {
            //Will lose focus only with certain targets
            var focusableControls = ['input','button','textarea','select'];
            var targetController = angular.element(e.target).controller('uiSelect'); //To check if target is other ui-select
            var skipFocusser = targetController && targetController !== $select; //To check if target is other ui-select
            if (!skipFocusser) skipFocusser =  ~focusableControls.indexOf(e.target.tagName.toLowerCase()); //Check if target is input, button or textarea
            $select.close(skipFocusser);
            scope.$digest();
          }
          $select.clickTriggeredSelect = false;
        }

        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
        $document.on('click', onDocumentClick);

        scope.$on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });

        // Move transcluded elements to their correct position in main template
        transcludeFn(scope, function(clone) {
          // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          var transcluded = angular.element('<div>').append(clone);

          var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
          transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
          transcludedMatch.removeAttr('data-ui-select-match'); // Properly handle HTML5 data-attributes
          if (transcludedMatch.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
          }
          element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

          var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
          transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
          transcludedChoices.removeAttr('data-ui-select-choices'); // Properly handle HTML5 data-attributes
          if (transcludedChoices.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
          }
          element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
        });

        // Support for appending the select field to the body when its open
        var appendToBody = scope.$eval(attrs.appendToBody);
        if (appendToBody !== undefined ? appendToBody : uiSelectConfig.appendToBody) {
          scope.$watch('$select.open', function(isOpen) {
            if (isOpen) {
              positionDropdown();
            } else {
              resetDropdown();
            }
          });

          // Move the dropdown back to its original location when the scope is destroyed. Otherwise
          // it might stick around when the user routes away or the select field is otherwise removed
          scope.$on('$destroy', function() {
            resetDropdown();
          });
        }

        // Hold on to a reference to the .ui-select-container element for appendToBody support
        var placeholder = null,
            originalWidth = '';

        function positionDropdown() {
          // Remember the absolute position of the element
          var offset = uisOffset(element);

          // Clone the element into a placeholder element to take its original place in the DOM
          placeholder = angular.element('<div class="ui-select-placeholder"></div>');
          placeholder[0].style.width = offset.width + 'px';
          placeholder[0].style.height = offset.height + 'px';
          element.after(placeholder);

          // Remember the original value of the element width inline style, so it can be restored
          // when the dropdown is closed
          originalWidth = element[0].style.width;

          // Now move the actual dropdown element to the end of the body
          $document.find('body').append(element);

          element[0].style.position = 'absolute';
          element[0].style.left = offset.left + 'px';
          element[0].style.top = offset.top + 'px';
          element[0].style.width = offset.width + 'px';
        }

        function resetDropdown() {
          if (placeholder === null) {
            // The dropdown has not actually been display yet, so there's nothing to reset
            return;
          }

          // Move the dropdown element back to its original location in the DOM
          placeholder.replaceWith(element);
          placeholder = null;

          element[0].style.position = '';
          element[0].style.left = '';
          element[0].style.top = '';
          element[0].style.width = originalWidth;

          // Set focus back on to the moved element
          $select.setFocus();
        }

        // Hold on to a reference to the .ui-select-dropdown element for direction support.
        var dropdown = null,
            directionUpClassName = 'direction-up';

        // Support changing the direction of the dropdown if there isn't enough space to render it.
        scope.$watch('$select.open', function() {

          if ($select.dropdownPosition === 'auto' || $select.dropdownPosition === 'up'){
            scope.calculateDropdownPos();
          }

        });

        var setDropdownPosUp = function(offset, offsetDropdown){

          offset = offset || uisOffset(element);
          offsetDropdown = offsetDropdown || uisOffset(dropdown);

          dropdown[0].style.position = 'absolute';
          dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
          element.addClass(directionUpClassName);

        };

        var setDropdownPosDown = function(offset, offsetDropdown){

          element.removeClass(directionUpClassName);

          offset = offset || uisOffset(element);
          offsetDropdown = offsetDropdown || uisOffset(dropdown);

          dropdown[0].style.position = '';
          dropdown[0].style.top = '';

        };

        scope.calculateDropdownPos = function(){

          if ($select.open) {
            dropdown = angular.element(element).querySelectorAll('.ui-select-dropdown');
            if (dropdown.length === 0) {
              return;
            }

            // Hide the dropdown so there is no flicker until $timeout is done executing.
            dropdown[0].style.opacity = 0;

            // Delay positioning the dropdown until all choices have been added so its height is correct.
            $timeout(function(){

              if ($select.dropdownPosition === 'up'){
                  //Go UP
                  setDropdownPosUp();

              }else{ //AUTO

                element.removeClass(directionUpClassName);

                var offset = uisOffset(element);
                var offsetDropdown = uisOffset(dropdown);

                //https://code.google.com/p/chromium/issues/detail?id=342307#c4
                var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop; //To make it cross browser (blink, webkit, IE, Firefox).

                // Determine if the direction of the dropdown needs to be changed.
                if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                  //Go UP
                  setDropdownPosUp(offset, offsetDropdown);
                }else{
                  //Go DOWN
                  setDropdownPosDown(offset, offsetDropdown);
                }

              }

              // Display the dropdown once it has been positioned.
              dropdown[0].style.opacity = 1;
            });
          } else {
              if (dropdown === null || dropdown.length === 0) {
                return;
              }

              // Reset the position of the dropdown.
              dropdown[0].style.position = '';
              dropdown[0].style.top = '';
              element.removeClass(directionUpClassName);
          }
        };
      };
    }
  };
}]);

uis.directive('uiSelectMatch', ['uiSelectConfig', function(uiSelectConfig) {
  return {
    restrict: 'EA',
    require: '^uiSelect',
    replace: true,
    transclude: true,
    templateUrl: function(tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-match');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      var multi = tElement.parent().attr('multiple');
      return theme + (multi ? '/match-multiple.tpl.html' : '/match.tpl.html');
    },
    link: function(scope, element, attrs, $select) {
      $select.lockChoiceExpression = attrs.uiLockChoice;
      attrs.$observe('placeholder', function(placeholder) {
        $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
      });

      function setAllowClear(allow) {
        $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
      }

      attrs.$observe('allowClear', setAllowClear);
      setAllowClear(attrs.allowClear);

      if($select.multiple){
        $select.sizeSearchInput();
      }

    }
  };
}]);

uis.directive('uiSelectMultiple', ['uiSelectMinErr','$timeout', function(uiSelectMinErr, $timeout) {
  return {
    restrict: 'EA',
    require: ['^uiSelect', '^ngModel'],

    controller: ['$scope','$timeout', function($scope, $timeout){

      var ctrl = this,
          $select = $scope.$select,
          ngModel;

      if (angular.isUndefined($select.selected))
        $select.selected = [];

      //Wait for link fn to inject it
      $scope.$evalAsync(function(){ ngModel = $scope.ngModel; });

      ctrl.activeMatchIndex = -1;

      ctrl.updateModel = function(){
        ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
        ctrl.refreshComponent();
      };

      ctrl.refreshComponent = function(){
        //Remove already selected items
        //e.g. When user clicks on a selection, the selected array changes and
        //the dropdown should remove that item
        $select.refreshItems();
        $select.sizeSearchInput();
      };

      // Remove item from multiple select
      ctrl.removeChoice = function(index){

        var removedChoice = $select.selected[index];

        // if the choice is locked, can't remove it
        if(removedChoice._uiSelectChoiceLocked) return;

        var locals = {};
        locals[$select.parserResult.itemName] = removedChoice;

        $select.selected.splice(index, 1);
        ctrl.activeMatchIndex = -1;
        $select.sizeSearchInput();

        // Give some time for scope propagation.
        $timeout(function(){
          $select.onRemoveCallback($scope, {
            $item: removedChoice,
            $model: $select.parserResult.modelMapper($scope, locals)
          });
        });

        ctrl.updateModel();

      };

      ctrl.getPlaceholder = function(){
        //Refactor single?
        if($select.selected && $select.selected.length) return;
        return $select.placeholder;
      };


    }],
    controllerAs: '$selectMultiple',

    link: function(scope, element, attrs, ctrls) {

      var $select = ctrls[0];
      var ngModel = scope.ngModel = ctrls[1];
      var $selectMultiple = scope.$selectMultiple;

      //$select.selected = raw selected objects (ignoring any property binding)

      $select.multiple = true;
      $select.removeSelected = true;

      //Input that will handle focus
      $select.focusInput = $select.searchInput;

      //From view --> model
      ngModel.$parsers.unshift(function () {
        var locals = {},
            result,
            resultMultiple = [];
        for (var j = $select.selected.length - 1; j >= 0; j--) {
          locals = {};
          locals[$select.parserResult.itemName] = $select.selected[j];
          result = $select.parserResult.modelMapper(scope, locals);
          resultMultiple.unshift(result);
        }
        return resultMultiple;
      });

      // From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (!data) return inputValue;
        var resultMultiple = [];
        var checkFnMultiple = function(list, value){
          if (!list || !list.length) return;
          for (var p = list.length - 1; p >= 0; p--) {
            locals[$select.parserResult.itemName] = list[p];
            result = $select.parserResult.modelMapper(scope, locals);
            if($select.parserResult.trackByExp){
                var propsItemNameMatches = /(\w*)\./.exec($select.parserResult.trackByExp);
                var matches = /\.([^\s]+)/.exec($select.parserResult.trackByExp);
                if(propsItemNameMatches && propsItemNameMatches.length > 0 && propsItemNameMatches[1] == $select.parserResult.itemName){
                  if(matches && matches.length>0 && result[matches[1]] == value[matches[1]]){
                      resultMultiple.unshift(list[p]);
                      return true;
                  }
                }
            }
            if (angular.equals(result,value)){
              resultMultiple.unshift(list[p]);
              return true;
            }
          }
          return false;
        };
        if (!inputValue) return resultMultiple; //If ngModel was undefined
        for (var k = inputValue.length - 1; k >= 0; k--) {
          //Check model array of currently selected items
          if (!checkFnMultiple($select.selected, inputValue[k])){
            //Check model array of all items available
            if (!checkFnMultiple(data, inputValue[k])){
              //If not found on previous lists, just add it directly to resultMultiple
              resultMultiple.unshift(inputValue[k]);
            }
          }
        }
        return resultMultiple;
      });

      //Watch for external model changes
      scope.$watchCollection(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
        if (oldValue != newValue){
          ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
          $selectMultiple.refreshComponent();
        }
      });

      ngModel.$render = function() {
        // Make sure that model value is array
        if(!angular.isArray(ngModel.$viewValue)){
          // Have tolerance for null or undefined values
          if(angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null){
            $select.selected = [];
          } else {
            throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
          }
        }
        $select.selected = ngModel.$viewValue;
        scope.$evalAsync(); //To force $digest
      };

      scope.$on('uis:select', function (event, item) {
        if($select.selected.length >= $select.limit) {
          return;
        }
        $select.selected.push(item);
        $selectMultiple.updateModel();
      });

      scope.$on('uis:activate', function () {
        $selectMultiple.activeMatchIndex = -1;
      });

      scope.$watch('$select.disabled', function(newValue, oldValue) {
        // As the search input field may now become visible, it may be necessary to recompute its size
        if (oldValue && !newValue) $select.sizeSearchInput();
      });

      $select.searchInput.on('keydown', function(e) {
        var key = e.which;
        scope.$apply(function() {
          var processed = false;
          // var tagged = false; //Checkme
          if(KEY.isHorizontalMovement(key)){
            processed = _handleMatchSelection(key);
          }
          if (processed  && key != KEY.TAB) {
            //TODO Check si el tab selecciona aun correctamente
            //Crear test
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
      function _getCaretPosition(el) {
        if(angular.isNumber(el.selectionStart)) return el.selectionStart;
        // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
        else return el.value.length;
      }
      // Handles selected options in "multiple" mode
      function _handleMatchSelection(key){
        var caretPosition = _getCaretPosition($select.searchInput[0]),
            length = $select.selected.length,
            // none  = -1,
            first = 0,
            last  = length-1,
            curr  = $selectMultiple.activeMatchIndex,
            next  = $selectMultiple.activeMatchIndex+1,
            prev  = $selectMultiple.activeMatchIndex-1,
            newIndex = curr;

        if(caretPosition > 0 || ($select.search.length && key == KEY.RIGHT)) return false;

        $select.close();

        function getNewActiveMatchIndex(){
          switch(key){
            case KEY.LEFT:
              // Select previous/first item
              if(~$selectMultiple.activeMatchIndex) return prev;
              // Select last item
              else return last;
              break;
            case KEY.RIGHT:
              // Open drop-down
              if(!~$selectMultiple.activeMatchIndex || curr === last){
                $select.activate();
                return false;
              }
              // Select next/last item
              else return next;
              break;
            case KEY.BACKSPACE:
              // Remove selected item and select previous/first
              if(~$selectMultiple.activeMatchIndex){
                $selectMultiple.removeChoice(curr);
                return prev;
              }
              // Select last item
              else return last;
              break;
            case KEY.DELETE:
              // Remove selected item and select next item
              if(~$selectMultiple.activeMatchIndex){
                $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                return curr;
              }
              else return false;
          }
        }

        newIndex = getNewActiveMatchIndex();

        if(!$select.selected.length || newIndex === false) $selectMultiple.activeMatchIndex = -1;
        else $selectMultiple.activeMatchIndex = Math.min(last,Math.max(first,newIndex));

        return true;
      }

      $select.searchInput.on('keyup', function(e) {

        if ( ! KEY.isVerticalMovement(e.which) ) {
          scope.$evalAsync( function () {
            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          });
        }
        // Push a "create new" item into array if there is a search string
        if ( $select.tagging.isActivated && $select.search.length > 0 ) {

          // return early with these keys
          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which) ) {
            return;
          }
          // always reset the activeIndex to the first item when tagging
          $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          // taggingLabel === false bypasses all of this
          if ($select.taggingLabel === false) return;

          var items = angular.copy( $select.items );
          var stashArr = angular.copy( $select.items );
          var newItem;
          var item;
          var hasTag = false;
          var dupeIndex = -1;
          var tagItems;
          var tagItem;

          // case for object tagging via transform `$select.tagging.fct` function
          if ( $select.tagging.fct !== undefined) {
            tagItems = $select.$filter('filter')(items,{'isTag': true});
            if ( tagItems.length > 0 ) {
              tagItem = tagItems[0];
            }
            // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
            if ( items.length > 0 && tagItem ) {
              hasTag = true;
              items = items.slice(1,items.length);
              stashArr = stashArr.slice(1,stashArr.length);
            }
            newItem = $select.tagging.fct($select.search);
            newItem.isTag = true;
            // verify the the tag doesn't match the value of an existing item
            if ( stashArr.filter( function (origItem) { return angular.equals( origItem, $select.tagging.fct($select.search) ); } ).length > 0 ) {
              return;
            }
            newItem.isTag = true;
          // handle newItem string and stripping dupes in tagging string context
          } else {
            // find any tagging items already in the $select.items array and store them
            tagItems = $select.$filter('filter')(items,function (item) {
              return item.match($select.taggingLabel);
            });
            if ( tagItems.length > 0 ) {
              tagItem = tagItems[0];
            }
            item = items[0];
            // remove existing tag item if found (should only ever be one tag item)
            if ( item !== undefined && items.length > 0 && tagItem ) {
              hasTag = true;
              items = items.slice(1,items.length);
              stashArr = stashArr.slice(1,stashArr.length);
            }
            newItem = $select.search+' '+$select.taggingLabel;
            if ( _findApproxDupe($select.selected, $select.search) > -1 ) {
              return;
            }
            // verify the the tag doesn't match the value of an existing item from
            // the searched data set or the items already selected
            if ( _findCaseInsensitiveDupe(stashArr.concat($select.selected)) ) {
              // if there is a tag from prev iteration, strip it / queue the change
              // and return early
              if ( hasTag ) {
                items = stashArr;
                scope.$evalAsync( function () {
                  $select.activeIndex = 0;
                  $select.items = items;
                });
              }
              return;
            }
            if ( _findCaseInsensitiveDupe(stashArr) ) {
              // if there is a tag from prev iteration, strip it
              if ( hasTag ) {
                $select.items = stashArr.slice(1,stashArr.length);
              }
              return;
            }
          }
          if ( hasTag ) dupeIndex = _findApproxDupe($select.selected, newItem);
          // dupe found, shave the first item
          if ( dupeIndex > -1 ) {
            items = items.slice(dupeIndex+1,items.length-1);
          } else {
            items = [];
            items.push(newItem);
            items = items.concat(stashArr);
          }
          scope.$evalAsync( function () {
            $select.activeIndex = 0;
            $select.items = items;
          });
        }
      });
      function _findCaseInsensitiveDupe(arr) {
        if ( arr === undefined || $select.search === undefined ) {
          return false;
        }
        var hasDupe = arr.filter( function (origItem) {
          if ( $select.search.toUpperCase() === undefined || origItem === undefined ) {
            return false;
          }
          return origItem.toUpperCase() === $select.search.toUpperCase();
        }).length > 0;

        return hasDupe;
      }
      function _findApproxDupe(haystack, needle) {
        var dupeIndex = -1;
        if(angular.isArray(haystack)) {
          var tempArr = angular.copy(haystack);
          for (var i = 0; i <tempArr.length; i++) {
            // handle the simple string version of tagging
            if ( $select.tagging.fct === undefined ) {
              // search the array for the match
              if ( tempArr[i]+' '+$select.taggingLabel === needle ) {
              dupeIndex = i;
              }
            // handle the object tagging implementation
            } else {
              var mockObj = tempArr[i];
              if (angular.isObject(mockObj)) {
                mockObj.isTag = true;
              }
              if ( angular.equals(mockObj, needle) ) {
                dupeIndex = i;
              }
            }
          }
        }
        return dupeIndex;
      }

      $select.searchInput.on('blur', function() {
        $timeout(function() {
          $selectMultiple.activeMatchIndex = -1;
        });
      });

    }
  };
}]);

uis.directive('uiSelectSingle', ['$timeout','$compile', function($timeout, $compile) {
  return {
    restrict: 'EA',
    require: ['^uiSelect', '^ngModel'],
    link: function(scope, element, attrs, ctrls) {

      var $select = ctrls[0];
      var ngModel = ctrls[1];

      //From view --> model
      ngModel.$parsers.unshift(function (inputValue) {
        var locals = {},
            result;
        locals[$select.parserResult.itemName] = inputValue;
        result = $select.parserResult.modelMapper(scope, locals);
        return result;
      });

      //From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (data){
          var checkFnSingle = function(d){
            locals[$select.parserResult.itemName] = d;
            result = $select.parserResult.modelMapper(scope, locals);
            return result == inputValue;
          };
          //If possible pass same object stored in $select.selected
          if ($select.selected && checkFnSingle($select.selected)) {
            return $select.selected;
          }
          for (var i = data.length - 1; i >= 0; i--) {
            if (checkFnSingle(data[i])) return data[i];
          }
        }
        return inputValue;
      });

      //Update viewValue if model change
      scope.$watch('$select.selected', function(newValue) {
        if (ngModel.$viewValue !== newValue) {
          ngModel.$setViewValue(newValue);
        }
      });

      ngModel.$render = function() {
        $select.selected = ngModel.$viewValue;
      };

      scope.$on('uis:select', function (event, item) {
        $select.selected = item;
      });

      scope.$on('uis:close', function (event, skipFocusser) {
        $timeout(function(){
          $select.focusser.prop('disabled', false);
          if (!skipFocusser) $select.focusser[0].focus();
        },0,false);
      });

      scope.$on('uis:activate', function () {
        focusser.prop('disabled', true); //Will reactivate it on .close()
      });

      //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
      var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
      $compile(focusser)(scope);
      $select.focusser = focusser;

      //Input that will handle focus
      $select.focusInput = focusser;

      element.parent().append(focusser);
      focusser.bind("focus", function(){
        scope.$evalAsync(function(){
          $select.focus = true;
        });
      });
      focusser.bind("blur", function(){
        scope.$evalAsync(function(){
          $select.focus = false;
        });
      });
      focusser.bind("keydown", function(e){

        if (e.which === KEY.BACKSPACE) {
          e.preventDefault();
          e.stopPropagation();
          $select.select(undefined);
          scope.$apply();
          return;
        }

        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
          return;
        }

        if (e.which == KEY.DOWN  || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE){
          e.preventDefault();
          e.stopPropagation();
          $select.activate();
        }

        scope.$digest();
      });

      focusser.bind("keyup input", function(e){

        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
          return;
        }

        $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
        focusser.val('');
        scope.$digest();

      });


    }
  };
}]);
// Make multiple matches sortable
uis.directive('uiSelectSort', ['$timeout', 'uiSelectConfig', 'uiSelectMinErr', function($timeout, uiSelectConfig, uiSelectMinErr) {
  return {
    require: '^^uiSelect',
    link: function(scope, element, attrs, $select) {
      if (scope[attrs.uiSelectSort] === null) {
        throw uiSelectMinErr('sort', 'Expected a list to sort');
      }

      var options = angular.extend({
          axis: 'horizontal'
        },
        scope.$eval(attrs.uiSelectSortOptions));

      var axis = options.axis;
      var draggingClassName = 'dragging';
      var droppingClassName = 'dropping';
      var droppingBeforeClassName = 'dropping-before';
      var droppingAfterClassName = 'dropping-after';

      scope.$watch(function(){
        return $select.sortable;
      }, function(newValue){
        if (newValue) {
          element.attr('draggable', true);
        } else {
          element.removeAttr('draggable');
        }
      });

      element.on('dragstart', function(event) {
        element.addClass(draggingClassName);

        (event.dataTransfer || event.originalEvent.dataTransfer).setData('text/plain', scope.$index);
      });

      element.on('dragend', function() {
        element.removeClass(draggingClassName);
      });

      var move = function(from, to) {
        /*jshint validthis: true */
        this.splice(to, 0, this.splice(from, 1)[0]);
      };

      var dragOverHandler = function(event) {
        event.preventDefault();

        var offset = axis === 'vertical' ? event.offsetY || event.layerY || (event.originalEvent ? event.originalEvent.offsetY : 0) : event.offsetX || event.layerX || (event.originalEvent ? event.originalEvent.offsetX : 0);

        if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
          element.removeClass(droppingAfterClassName);
          element.addClass(droppingBeforeClassName);

        } else {
          element.removeClass(droppingBeforeClassName);
          element.addClass(droppingAfterClassName);
        }
      };

      var dropTimeout;

      var dropHandler = function(event) {
        event.preventDefault();

        var droppedItemIndex = parseInt((event.dataTransfer || event.originalEvent.dataTransfer).getData('text/plain'), 10);

        // prevent event firing multiple times in firefox
        $timeout.cancel(dropTimeout);
        dropTimeout = $timeout(function() {
          _dropHandler(droppedItemIndex);
        }, 20);
      };

      var _dropHandler = function(droppedItemIndex) {
        var theList = scope.$eval(attrs.uiSelectSort);
        var itemToMove = theList[droppedItemIndex];
        var newIndex = null;

        if (element.hasClass(droppingBeforeClassName)) {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index - 1;
          } else {
            newIndex = scope.$index;
          }
        } else {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index;
          } else {
            newIndex = scope.$index + 1;
          }
        }

        move.apply(theList, [droppedItemIndex, newIndex]);

        scope.$apply(function() {
          scope.$emit('uiSelectSort:change', {
            array: theList,
            item: itemToMove,
            from: droppedItemIndex,
            to: newIndex
          });
        });

        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);

        element.off('drop', dropHandler);
      };

      element.on('dragenter', function() {
        if (element.hasClass(draggingClassName)) {
          return;
        }

        element.addClass(droppingClassName);

        element.on('dragover', dragOverHandler);
        element.on('drop', dropHandler);
      });

      element.on('dragleave', function(event) {
        if (event.target != element) {
          return;
        }
        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);

        element.off('dragover', dragOverHandler);
        element.off('drop', dropHandler);
      });
    }
  };
}]);

/**
 * Parses "repeat" attribute.
 *
 * Taken from AngularJS ngRepeat source code
 * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
 *
 * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
 * https://github.com/angular-ui/ui-select/commit/5dd63ad#commitcomment-5504697
 */

uis.service('uisRepeatParser', ['uiSelectMinErr','$parse', function(uiSelectMinErr, $parse) {
  var self = this;

  /**
   * Example:
   * expression = "address in addresses | filter: {street: $select.search} track by $index"
   * itemName = "address",
   * source = "addresses | filter: {street: $select.search}",
   * trackByExp = "$index",
   */
  self.parse = function(expression) {


    var match;
    var isObjectCollection = /\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)/.test(expression);
    // If an array is used as collection

    // if (isObjectCollection){
      //00000000000000000000000000000111111111000000000000000222222222222220033333333333333333333330000444444444444444444000000000000000556666660000077777777777755000000000000000000000088888880000000
    match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(([\w\.]+)?\s*(|\s*[\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);      

    // 1 Alias
    // 2 Item
    // 3 Key on (key,value)
    // 4 Value on (key,value)
    // 5 Collection expresion (only used when using an array collection)
    // 6 Object that will be converted to Array when using (key,value) syntax
    // 7 Filters that will be applied to #6 when using (key,value) syntax
    // 8 Track by

    if (!match) {
      throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
              expression);
    }
    if (!match[6] && isObjectCollection) {
      throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ as (_key_, _item_) in _ObjCollection_ [ track by _id_]' but got '{0}'.",
              expression);
    }

    return {
      itemName: match[4] || match[2], // (lhs) Left-hand side,
      keyName: match[3], //for (key, value) syntax
      source: $parse(!match[3] ? match[5] : match[6]),
      sourceName: match[6],
      filters: match[7],
      trackByExp: match[8],
      modelMapper: $parse(match[1] || match[4] || match[2]),
      repeatExpression: function (grouped) {
        var expression = this.itemName + ' in ' + (grouped ? '$group.items' : '$select.items');
        if (this.trackByExp) {
          expression += ' track by ' + this.trackByExp;
        }
        return expression;
      } 
    };

  };

  self.getGroupNgRepeatExpression = function() {
    return '$group in $select.groups';
  };

}]);

}());
angular.module("ui.select").run(["$templateCache", function($templateCache) {$templateCache.put("bootstrap/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\" role=\"listbox\" ng-show=\"$select.items.length > 0\"><li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div><div id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\"><a href=\"\" class=\"ui-select-choices-row-inner\"></a></div></li></ul>");
$templateCache.put("bootstrap/match-multiple.tpl.html","<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected\"><span class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
$templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link pull-right\"><i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i></a></span></div>");
$templateCache.put("bootstrap/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\"><div><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\" role=\"combobox\" aria-label=\"{{ $select.baseTitle }}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("bootstrap/select.tpl.html","<div class=\"ui-select-container ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" tabindex=\"-1\" aria-expanded=\"true\" aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"form-control ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("select2/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content select2-results\"><li class=\"ui-select-choices-group\" ng-class=\"{\'select2-result-with-children\': $select.choiceGrouped($group) }\"><div ng-show=\"$select.choiceGrouped($group)\" class=\"ui-select-choices-group-label select2-result-label\" ng-bind=\"$group.name\"></div><ul role=\"listbox\" id=\"ui-select-choices-{{ $select.generatedId }}\" ng-class=\"{\'select2-result-sub\': $select.choiceGrouped($group), \'select2-result-single\': !$select.choiceGrouped($group) }\"><li role=\"option\" id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}\"><div class=\"select2-result-label ui-select-choices-row-inner\"></div></li></ul></li></ul>");
$templateCache.put("select2/match-multiple.tpl.html","<span class=\"ui-select-match\"><li class=\"ui-select-match-item select2-search-choice\" ng-repeat=\"$item in $select.selected\" ng-class=\"{\'select2-search-choice-focus\':$selectMultiple.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span uis-transclude-append=\"\"></span> <a href=\"javascript:;\" class=\"ui-select-match-close select2-search-choice-close\" ng-click=\"$selectMultiple.removeChoice($index)\" tabindex=\"-1\"></a></li></span>");
$templateCache.put("select2/match.tpl.html","<a class=\"select2-choice ui-select-match\" ng-class=\"{\'select2-default\': $select.isEmpty()}\" ng-click=\"$select.toggle($event)\" aria-label=\"{{ $select.baseTitle }} select\"><span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude=\"\"></span> <abbr ng-if=\"$select.allowClear && !$select.isEmpty()\" class=\"select2-search-choice-close\" ng-click=\"$select.clear($event)\"></abbr> <span class=\"select2-arrow ui-select-toggle\"><b></b></span></a>");
$templateCache.put("select2/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple select2 select2-container select2-container-multi\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled}\"><ul class=\"select2-choices\"><span class=\"ui-select-match\"></span><li class=\"select2-search-field\"><input type=\"text\" autocomplete=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"select2-input ui-select-search\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-model=\"$select.search\" ng-click=\"$select.activate()\" style=\"width: 34px;\" ondrop=\"return false;\"></li></ul><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("select2/select.tpl.html","<div class=\"ui-select-container select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled, \'select2-container-active\': $select.focus, \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}\"><div class=\"ui-select-match\"></div><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"select2-search\" ng-show=\"$select.searchEnabled\"><input type=\"text\" autocomplete=\"false\" autocorrect=\"false\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("selectize/choices.tpl.html","<div ng-show=\"$select.open\" class=\"ui-select-choices ui-select-dropdown selectize-dropdown single\"><div class=\"ui-select-choices-content selectize-dropdown-content\"><div class=\"ui-select-choices-group optgroup\" role=\"listbox\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label optgroup-header\" ng-bind=\"$group.name\"></div><div role=\"option\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\"><div class=\"option ui-select-choices-row-inner\" data-selectable=\"\"></div></div></div></div></div>");
$templateCache.put("selectize/match.tpl.html","<div ng-hide=\"($select.open || $select.isEmpty())\" class=\"ui-select-match\" ng-transclude=\"\"></div>");
$templateCache.put("selectize/select.tpl.html","<div class=\"ui-select-container selectize-control single\" ng-class=\"{\'open\': $select.open}\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.open && !$select.searchEnabled ? $select.toggle($event) : $select.activate()\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" tabindex=\"-1\" class=\"ui-select-search ui-select-toggle\" ng-click=\"$select.toggle($event)\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-hide=\"!$select.searchEnabled || ($select.selected && !$select.open)\" ng-disabled=\"$select.disabled\" aria-label=\"{{ $select.baseTitle }}\"></div><div class=\"ui-select-choices\"></div></div>");}]);
/*! w5cValidator v2.4.10 2016-02-25 */
angular.module("w5c.validator",["ng"]).provider("w5cValidator",[function(){var a={required:"该选项不能为空",maxlength:"该选项输入值长度不能大于{maxlength}",minlength:"该选项输入值长度不能小于{minlength}",email:"输入邮件的格式不正确",repeat:"两次输入不一致",pattern:"该选项输入格式不正确",number:"必须输入数字",w5cuniquecheck:"该输入值已经存在，请重新输入",url:"输入URL格式不正确",max:"该选项输入值不能大于{max}",min:"该选项输入值不能小于{min}",customizer:"自定义验证不通过"},b=["text","password","email","number","url","tel","hidden",["textarea"],["select"],["select-multiple"],["select-one"],"radio","checkbox"],c=function(a){return"FORM"===a[0].tagName||11==a[0].nodeType?null:a&&a.hasClass("form-group")?a:c(a.parent())},d=function(){this.elemTypes=b,this.rules={},this.isEmpty=function(a){return a?a instanceof Array&&0===a.length?!0:!1:!0},this.defaultShowError=function(a,b){var d=angular.element(a),e=c(d);this.isEmpty(e)||e.hasClass("has-error")||e.addClass("has-error");var f=d.next();f&&f.hasClass("w5c-error")||d.after('<span class="w5c-error">'+b[0]+"</span>")},this.defaultRemoveError=function(a){var b=angular.element(a),d=c(b);!this.isEmpty(d)&&d.hasClass("has-error")&&d.removeClass("has-error");var e=b.next();e.hasClass&&e.hasClass("w5c-error")&&e.remove()},this.options={blurTrig:!1,showError:!0,removeError:!0}};d.prototype={constructor:d,config:function(a){this.options=angular.extend(this.options,a)},setRules:function(a){this.rules=angular.extend(this.rules,a)},getErrorMessage:function(b,c){var d=null;switch(this.isEmpty(this.rules[c.name])||this.isEmpty(this.rules[c.name][b])||(d=this.rules[c.name][b]),b){case"maxlength":return null!==d?d.replace("{maxlength}",c.getAttribute("ng-maxlength")):a.maxlength.replace("{maxlength}",c.getAttribute("ng-maxlength"));case"minlength":return null!==d?d.replace("{minlength}",c.getAttribute("ng-minlength")):a.minlength.replace("{minlength}",c.getAttribute("ng-minlength"));case"max":return null!==d?d.replace("{max}",c.getAttribute("max")):a.max.replace("{max}",c.getAttribute("max"));case"min":return null!==d?d.replace("{min}",c.getAttribute("min")):a.min.replace("{min}",c.getAttribute("min"));default:if(null!==d)return d;if(null===a[b])throw new Error("该验证规则("+b+")默认错误信息没有设置！");return a[b]}},getErrorMessages:function(a,b){var c=[];for(var d in b)if(b[d]){var e=this.getErrorMessage(d,a);c.push(e)}return c},showError:function(a,b,c){var d=angular.extend({},this.options,c);return angular.element(a).removeClass("valid").addClass("error"),d.showError!==!1?angular.isFunction(d.showError)?d.showError(a,b):d.showError===!0?this.defaultShowError(a,b):void 0:void 0},removeError:function(a,b){var c=angular.extend({},this.options,b);return angular.element(a).removeClass("error").addClass("valid"),c.removeError!==!1?angular.isFunction(c.removeError)?c.removeError(a):c.removeError===!0?this.defaultRemoveError(a):void 0:void 0}};var e=new d;this.config=function(a){e.config(a)},this.setRules=function(a){e.setRules(a)},this.setDefaultRules=function(b){a=angular.extend(a,b)},this.$get=function(){return e}}]),function(){angular.module("w5c.validator").directive("w5cFormValidate",["$parse","w5cValidator","$timeout",function(a,b,c){return{require:["w5cFormValidate","^?form"],controller:["$scope",function(a){this.needBindKeydown=!1,this.form=null,this.formElement=null,this.submitSuccessFn=null,this.validElements=[],this.init=function(a,b){this.form=a,this.formElement=b,this.formName=b.attr("name")},this.doValidate=function(b,c){angular.isFunction(this.form.doValidate)&&this.form.doValidate(),this.form.$valid&&angular.isFunction(b)&&a.$apply(function(){b(a,{$event:c})})},this.removeElementValidation=function(a){var c=this.validElements.indexOf(a);c>=0&&(this.validElements.splice(c,1),b.isEmpty(this.form.$errors)||this.doValidate(angular.noop))},this.removeError=function(a){this.form.$errors=[],b.removeError(a,this.options)},this.initElement=function(d){var e=angular.element(d),f=this;if(b.elemTypes.toString().indexOf(d.type)>-1&&!b.isEmpty(d.name)&&!/^\d/.test(d.name)){var g=e.attr("disabled");if(g&&("true"===g||"disabled"===g))return;if(!(this.validElements.indexOf(d.name)<0))return;this.validElements.push(d.name);var h=this.formName+"."+d.name+".$viewValue";a.$watch(h,function(){f.removeError(e)},!0),f.options.blurTrig&&e.bind("blur",function(){if(f.options.blurTrig){var a=this,d=angular.element(this);c(function(){if(f.form[a.name].$valid)b.removeError(d,f.options);else{var c=b.getErrorMessages(a,f.form[a.name].$error);b.showError(d,c,f.options)}},50)}})}}}],link:function(d,e,f,g){var h=g[0],i=g[1],j=e[0],k=a(f.w5cSubmit),l=d.$eval(f.w5cFormValidate);if(!f.name)throw Error("form must has name when use w5cFormValidate");h.init(i,e,f),f.w5cFormValidate&&d.$watch(f.w5cFormValidate,function(a){a&&(h.options=l=angular.extend({},b.options,a))},!0),h.options=l=angular.extend({},b.options,l);for(var m=0;m<j.length;m++){var n=j[m];h.initElement(n)}var o=function(){for(var a=[],c=0;c<j.length;c++){var e=j[c].name;if(e&&h.validElements.indexOf(e)>=0){var f=j[e];if(i[e]&&f&&b.elemTypes.toString().indexOf(f.type)>-1&&!b.isEmpty(f.name)){if(i[e].$valid){angular.element(f).removeClass("error").addClass("valid");continue}var g=b.getErrorMessages(f,i[f.name].$error);a.push(g[0]),b.removeError(f,l),b.showError(f,g,l)}}}i.$errors=!b.isEmpty(a)&&a.length>0?a:[],d.$$phase||d.$apply(i.$errors)};i&&(i.doValidate=o,i.reset=function(){c(function(){i.$setPristine();for(var a=0;a<j.length;a++){var c=j[a],d=angular.element(c);b.removeError(d,l)}})}),f.w5cSubmit&&angular.isFunction(k)&&(e.bind("submit",function(a){o(),i.$valid&&angular.isFunction(k)&&d.$apply(function(){k(d,{$event:a})})}),h.needBindKeydown=!0),h.needBindKeydown&&e.bind("keydown keypress",function(a){if(13===a.which){var b=document.activeElement;if(b.type&&"textarea"!==b.type){var c=e.find("button");c&&c[0]&&c[0].focus(),b.focus(),o(),a.preventDefault(),i.$valid&&angular.isFunction(h.submitSuccessFn)&&d.$apply(function(){h.submitSuccessFn(d,{$event:a})})}}})}}}]).directive("w5cFormSubmit",["$parse",function(a){return{require:"^w5cFormValidate",link:function(b,c,d,e){var f=a(d.w5cFormSubmit);c.bind("click",function(a){e.doValidate(f,a)}),e.needBindKeydown=!0,e.submitSuccessFn=f}}}]).directive("w5cRepeat",[function(){"use strict";return{require:["ngModel","^w5cFormValidate"],link:function(a,b,c,d){var e=b.inheritedData("$formController")[c.w5cRepeat],f=d[0],g=d[1];f.$parsers.push(function(a){return a===e.$viewValue?f.$setValidity("repeat",!0):f.$setValidity("repeat",!1),a}),e.$parsers.push(function(a){return f.$setValidity("repeat",a===f.$viewValue),a===f.$viewValue&&g.removeError(b),a})}}}]).directive("w5cCustomizer",["$timeout",function(){"use strict";return{require:["^form","ngModel"],link:function(a,b,c,d){var e=d[1],f=function(){var b=a.$eval(c.w5cCustomizer);b===!0?e.$setValidity("customizer",!0):e.$setValidity("customizer",!1)},g=d[0][c.associate];g&&g.$viewChangeListeners.push(f),e.$viewChangeListeners.push(f)}}}]).directive("w5cUniqueCheck",["$timeout","$http","w5cValidator",function(a,b,c){return{require:["ngModel","?^w5cFormValidate","?^form"],link:function(a,d,e,f){var g=f[0],h=f[1],i=f[2],j=function(){var f=a.$eval(e.w5cUniqueCheck),j=f.url,k=f.isExists;b.get(j).success(function(a){var b=k===!1?"true"==a||1==a:!("true"==a||1==a);if(g.$setValidity("w5cuniquecheck",b),!b){var e=c.getErrorMessage("w5cuniquecheck",d[0]);c.showError(d[0],[e],h.options),i.$errors?i.$errors.unshift(e):i.$errors=[e]}})};g.$viewChangeListeners.push(function(){i.$errors=[],g.$setValidity("w5cuniquecheck",!0),(!g.$invalid||g.$error.w5cuniquecheck)&&g.$dirty&&j()});var k=a.$eval(e.ngModel);if(k){if(g.$invalid&&!g.$error.w5cuniquecheck)return;j()}}}}]).directive("w5cDynamicName",[function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){d.$name=a.$eval(c.w5cDynamicName),b.attr("name",a.$eval(c.w5cDynamicName));var e=b.controller("form")||{$addControl:angular.noop};e.$addControl(d)}}}]).directive("w5cDynamicElement",["$timeout",function(a){return{restrict:"A",require:["ngModel","?^w5cFormValidate","?^form"],link:function(b,c,d,e){var f=c[0].name,g=e[2];if(f){c.on("$destroy",function(){e[1].removeElementValidation(f)}),g[f]||g.$addControl(e[0]);var h=!1;e[2].$errors&&e[2].$errors.length>0&&(h=!0),e[1].initElement(c[0]),h&&a(function(){e[1].doValidate(angular.noop)})}}}}])}();
/*! 12.0.4 */
!function(){function a(a,b){window.XMLHttpRequest.prototype[a]=b(window.XMLHttpRequest.prototype[a])}function b(a,b,c){try{Object.defineProperty(a,b,{get:c})}catch(d){}}if(window.FileAPI||(window.FileAPI={}),!window.XMLHttpRequest)throw"AJAX is not supported. XMLHttpRequest is not defined.";if(FileAPI.shouldLoad=!window.FormData||FileAPI.forceLoad,FileAPI.shouldLoad){var c=function(a){if(!a.__listeners){a.upload||(a.upload={}),a.__listeners=[];var b=a.upload.addEventListener;a.upload.addEventListener=function(c,d){a.__listeners[c]=d,b&&b.apply(this,arguments)}}};a("open",function(a){return function(b,d,e){c(this),this.__url=d;try{a.apply(this,[b,d,e])}catch(f){f.message.indexOf("Access is denied")>-1&&(this.__origError=f,a.apply(this,[b,"_fix_for_ie_crossdomain__",e]))}}}),a("getResponseHeader",function(a){return function(b){return this.__fileApiXHR&&this.__fileApiXHR.getResponseHeader?this.__fileApiXHR.getResponseHeader(b):null==a?null:a.apply(this,[b])}}),a("getAllResponseHeaders",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.getAllResponseHeaders?this.__fileApiXHR.getAllResponseHeaders():null==a?null:a.apply(this)}}),a("abort",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.abort?this.__fileApiXHR.abort():null==a?null:a.apply(this)}}),a("setRequestHeader",function(a){return function(b,d){if("__setXHR_"===b){c(this);var e=d(this);e instanceof Function&&e(this)}else this.__requestHeaders=this.__requestHeaders||{},this.__requestHeaders[b]=d,a.apply(this,arguments)}}),a("send",function(a){return function(){var c=this;if(arguments[0]&&arguments[0].__isFileAPIShim){var d=arguments[0],e={url:c.__url,jsonp:!1,cache:!0,complete:function(a,d){a&&angular.isString(a)&&-1!==a.indexOf("#2174")&&(a=null),c.__completed=!0,!a&&c.__listeners.load&&c.__listeners.load({type:"load",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),!a&&c.__listeners.loadend&&c.__listeners.loadend({type:"loadend",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),"abort"===a&&c.__listeners.abort&&c.__listeners.abort({type:"abort",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),void 0!==d.status&&b(c,"status",function(){return 0===d.status&&a&&"abort"!==a?500:d.status}),void 0!==d.statusText&&b(c,"statusText",function(){return d.statusText}),b(c,"readyState",function(){return 4}),void 0!==d.response&&b(c,"response",function(){return d.response});var e=d.responseText||(a&&0===d.status&&"abort"!==a?a:void 0);b(c,"responseText",function(){return e}),b(c,"response",function(){return e}),a&&b(c,"err",function(){return a}),c.__fileApiXHR=d,c.onreadystatechange&&c.onreadystatechange(),c.onload&&c.onload()},progress:function(a){if(a.target=c,c.__listeners.progress&&c.__listeners.progress(a),c.__total=a.total,c.__loaded=a.loaded,a.total===a.loaded){var b=this;setTimeout(function(){c.__completed||(c.getAllResponseHeaders=function(){},b.complete(null,{status:204,statusText:"No Content"}))},FileAPI.noContentTimeout||1e4)}},headers:c.__requestHeaders};e.data={},e.files={};for(var f=0;f<d.data.length;f++){var g=d.data[f];null!=g.val&&null!=g.val.name&&null!=g.val.size&&null!=g.val.type?e.files[g.key]=g.val:e.data[g.key]=g.val}setTimeout(function(){if(!FileAPI.hasFlash)throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';c.__fileApiXHR=FileAPI.upload(e)},1)}else{if(this.__origError)throw this.__origError;a.apply(c,arguments)}}}),window.XMLHttpRequest.__isFileAPIShim=!0,window.FormData=FormData=function(){return{append:function(a,b,c){b.__isFileAPIBlobShim&&(b=b.data[0]),this.data.push({key:a,val:b,name:c})},data:[],__isFileAPIShim:!0}},window.Blob=Blob=function(a){return{data:a,__isFileAPIBlobShim:!0}}}}(),function(){function a(a){return"input"===a[0].tagName.toLowerCase()&&a.attr("type")&&"file"===a.attr("type").toLowerCase()}function b(){try{var a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(a)return!0}catch(b){if(void 0!==navigator.mimeTypes["application/x-shockwave-flash"])return!0}return!1}function c(a){var b=0,c=0;if(window.jQuery)return jQuery(a).offset();if(a.offsetParent)do b+=a.offsetLeft-a.scrollLeft,c+=a.offsetTop-a.scrollTop,a=a.offsetParent;while(a);return{left:b,top:c}}if(FileAPI.shouldLoad){if(FileAPI.hasFlash=b(),FileAPI.forceLoad&&(FileAPI.html5=!1),!FileAPI.upload){var d,e,f,g,h,i=document.createElement("script"),j=document.getElementsByTagName("script");if(window.FileAPI.jsUrl)d=window.FileAPI.jsUrl;else if(window.FileAPI.jsPath)e=window.FileAPI.jsPath;else for(f=0;f<j.length;f++)if(h=j[f].src,g=h.search(/\/ng\-file\-upload[\-a-zA-z0-9\.]*\.js/),g>-1){e=h.substring(0,g+1);break}null==FileAPI.staticPath&&(FileAPI.staticPath=e),i.setAttribute("src",d||e+"FileAPI.min.js"),document.getElementsByTagName("head")[0].appendChild(i)}FileAPI.ngfFixIE=function(d,e,f){if(!b())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';var g=function(){var b=e.parent();d.attr("disabled")?b&&b.removeClass("js-fileapi-wrapper"):(e.attr("__ngf_flash_")||(e.unbind("change"),e.unbind("click"),e.bind("change",function(a){h.apply(this,[a]),f.apply(this,[a])}),e.attr("__ngf_flash_","true")),b.addClass("js-fileapi-wrapper"),a(d)||(b.css("position","absolute").css("top",c(d[0]).top+"px").css("left",c(d[0]).left+"px").css("width",d[0].offsetWidth+"px").css("height",d[0].offsetHeight+"px").css("filter","alpha(opacity=0)").css("display",d.css("display")).css("overflow","hidden").css("z-index","900000").css("visibility","visible"),e.css("width",d[0].offsetWidth+"px").css("height",d[0].offsetHeight+"px").css("position","absolute").css("top","0px").css("left","0px")))};d.bind("mouseenter",g);var h=function(a){for(var b=FileAPI.getFiles(a),c=0;c<b.length;c++)void 0===b[c].size&&(b[c].size=0),void 0===b[c].name&&(b[c].name="file"),void 0===b[c].type&&(b[c].type="undefined");a.target||(a.target={}),a.target.files=b,a.target.files!==b&&(a.__files_=b),(a.__files_||a.target.files).item=function(b){return(a.__files_||a.target.files)[b]||null}}},FileAPI.disableFileInput=function(a,b){b?a.removeClass("js-fileapi-wrapper"):a.addClass("js-fileapi-wrapper")}}}(),window.FileReader||(window.FileReader=function(){var a=this,b=!1;this.listeners={},this.addEventListener=function(b,c){a.listeners[b]=a.listeners[b]||[],a.listeners[b].push(c)},this.removeEventListener=function(b,c){a.listeners[b]&&a.listeners[b].splice(a.listeners[b].indexOf(c),1)},this.dispatchEvent=function(b){var c=a.listeners[b.type];if(c)for(var d=0;d<c.length;d++)c[d].call(a,b)},this.onabort=this.onerror=this.onload=this.onloadstart=this.onloadend=this.onprogress=null;var c=function(b,c){var d={type:b,target:a,loaded:c.loaded,total:c.total,error:c.error};return null!=c.result&&(d.target.result=c.result),d},d=function(d){b||(b=!0,a.onloadstart&&a.onloadstart(c("loadstart",d)));var e;"load"===d.type?(a.onloadend&&a.onloadend(c("loadend",d)),e=c("load",d),a.onload&&a.onload(e),a.dispatchEvent(e)):"progress"===d.type?(e=c("progress",d),a.onprogress&&a.onprogress(e),a.dispatchEvent(e)):(e=c("error",d),a.onerror&&a.onerror(e),a.dispatchEvent(e))};this.readAsDataURL=function(a){FileAPI.readAsDataURL(a,d)},this.readAsText=function(a){FileAPI.readAsText(a,d)}});
/*! 12.0.4 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="12.0.4",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function e(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&g?{loaded:a.loaded+d._start,total:d._file&&d._file.size||a.total,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){g&&d._chunkSize&&!d._finished&&d._file?(e({loaded:d._end,total:d._file&&d._file.size,config:d,type:"progress"}),f.upload(d,!0)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.disableProgress||(d.headers.__setXHR_=function(){return function(a){a&&a.upload&&a.upload.addEventListener&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,e(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,e(h(a)))},!1))}}),g?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):(d._chunkSize&&(d._start=0,d._end=d._start+d._chunkSize),i()):i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},f.promisesCount++,k["finally"](function(){f.promisesCount--}),k}function e(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}var f=this;f.promisesCount=0,this.isResumeSupported=function(){return window.Blob&&window.Blob.prototype.slice};var g=this.isResumeSupported();this.isUploadInProgress=function(){return f.promisesCount>0},this.rename=function(a,b){return a.ngfName=b,a},this.jsonBlob=function(a){null==a||angular.isString(a)||(a=JSON.stringify(a));var b=new window.Blob([a],{type:"application/json"});return b._ngfBlob=!0,b},this.json=function(a){return angular.toJson(a)},this.isFile=function(a){return null!=a&&(a instanceof window.Blob||a.flashId&&a.name&&a.size)},this.upload=function(a,b){function c(b,c){if(b._ngfBlob)return b;if(a._file=a._file||b,null!=a._start&&g){a._end&&a._end>=b.size&&(a._finished=!0,a._end=b.size);var d=b.slice(a._start,a._end||b.size);return d.name=b.name,d.ngfName=b.ngfName,a._chunkSize&&(c.append("_chunkSize",a._chunkSize),c.append("_currentChunkSize",a._end-a._start),c.append("_chunkNumber",Math.floor(a._start/a._chunkSize)),c.append("_totalSize",a._file.size)),d}return b}function h(b,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))b.append(e,d);else if(f.isFile(d)){var g=c(d,b),i=e.split(",");i[1]&&(g.ngfName=i[1].replace(/^\s+|\s+$/g,""),e=i[0]),a._fileKey=a._fileKey||e,b.append(e,g,g.ngfName||g.name)}else if(angular.isObject(d)){if(d.$$ngfCircularDetection)throw"ngFileUpload: Circular reference in config.data. Make sure specified data for Upload.upload() has no circular reference: "+e;d.$$ngfCircularDetection=!0;try{for(var j in d)if(d.hasOwnProperty(j)&&"$$ngfCircularDetection"!==j){var k=null==a.objectKey?"[i]":a.objectKey;d.length&&parseInt(j)>-1&&(k=null==a.arrayKey?k:a.arrayKey),h(b,d[j],e+k.replace(/[ik]/g,j))}}finally{delete d.$$ngfCircularDetection}}else b.append(e,d)}function i(){a._chunkSize=f.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(b){var c,d=new window.FormData;b=b||a.fields||{},a.file&&(b.file=a.file);for(c in b)if(b.hasOwnProperty(c)){var e=b[c];a.formDataAppender?a.formDataAppender(d,c,e):h(d,e,c)}return d})}return b||(a=e(a)),a._isDigested||(a._isDigested=!0,i()),d(a)},this.http=function(b){return b=e(b),b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof window.Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=f.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1024*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1048576*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1073741824*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.urlToBlob=function(c){var d=b.defer();return a({url:c,method:"get",responseType:"arraybuffer"}).then(function(a){var b=new Uint8Array(a.data),c=a.headers("content-type")||"image/WebP",e=new window.Blob([b],{type:c});d.resolve(e)},function(a){d.reject(a)}),d.promise},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","$q","UploadExif",function(a,b,c,d,e){function f(a,b,c){var e=[i.emptyPromise()];return angular.forEach(a,function(d,f){0===d.type.indexOf("image/jpeg")&&i.attrGetter("ngfFixOrientation",b,c,{$file:d})&&e.push(i.happyPromise(i.applyExifRotation(d),d).then(function(b){a.splice(f,1,b)}))}),d.all(e)}function g(a,b,c){var e=i.attrGetter("ngfResize",b,c);if(!e||!i.isResizeSupported()||!a.length)return i.emptyPromise();if(!(e instanceof Function))return h(e,a,b,c);var f=d.defer();e(a).then(function(d){h(d,a,b,c).then(function(a){f.resolve(a)},function(a){f.reject(a)})},function(a){f.reject(a)})}function h(a,b,c,e){function f(d,f){if(0===d.type.indexOf("image")){if(a.pattern&&!i.validatePattern(d,a.pattern))return;var h=i.resize(d,a.width,a.height,a.quality,a.type,a.ratio,a.centerCrop,function(a,b){return i.attrGetter("ngfResizeIf",c,e,{$width:a,$height:b,$file:d})},a.restoreExif!==!1);g.push(h),h.then(function(a){b.splice(f,1,a)},function(a){d.$error="resize",d.$errorParam=(a?(a.message?a.message:a)+": ":"")+(d&&d.name)})}}for(var g=[i.emptyPromise()],h=0;h<b.length;h++)f(b[h],h);return d.all(g)}var i=e;return i.getAttrWithDefaults=function(a,b){if(null!=a[b])return a[b];var c=i.defaults[b];return null==c?c:angular.isString(c)?c:JSON.stringify(c)},i.attrGetter=function(b,c,d,e){var f=this.getAttrWithDefaults(c,b);if(!d)return f;try{return e?a(f)(d,e):a(f)(d)}catch(g){if(b.search(/min|max|pattern/i))return f;throw g}},i.shouldUpdateOn=function(a,b,c){var d=i.attrGetter("ngModelOptions",b,c);return d&&d.updateOn?d.updateOn.split(" ").indexOf(a)>-1:!0},i.emptyPromise=function(){var a=d.defer(),c=arguments;return b(function(){a.resolve.apply(a,c)}),a.promise},i.rejectPromise=function(){var a=d.defer(),c=arguments;return b(function(){a.reject.apply(a,c)}),a.promise},i.happyPromise=function(a,c){var e=d.defer();return a.then(function(a){e.resolve(a)},function(a){b(function(){throw a}),e.resolve(c)}),e.promise},i.updateModel=function(c,d,e,h,j,k,l){function m(f,g,j,l,m){d.$$ngfPrevValidFiles=f,d.$$ngfPrevInvalidFiles=g;var n=f&&f.length?f[0]:null,o=g&&g.length?g[0]:null;c&&(i.applyModelValidation(c,f),c.$setViewValue(m?n:f)),h&&a(h)(e,{$files:f,$file:n,$newFiles:j,$duplicateFiles:l,$invalidFiles:g,$invalidFile:o,$event:k});var p=i.attrGetter("ngfModelInvalid",d);p&&b(function(){a(p).assign(e,m?o:g)}),b(function(){})}function n(){function a(a,b){return a.name===b.name&&(a.$ngfOrigSize||a.size)===(b.$ngfOrigSize||b.size)&&a.type===b.type}function b(b){var c;for(c=0;c<s.length;c++)if(a(b,s[c]))return!0;for(c=0;c<t.length;c++)if(a(b,t[c]))return!0;return!1}if(j){r=[],u=[];for(var c=0;c<j.length;c++)b(j[c])?u.push(j[c]):r.push(j[c])}}function o(a){return angular.isArray(a)?a:[a]}function p(){w=[],v=[],angular.forEach(r,function(a){a.$error?v.push(a):w.push(a)})}function q(){function a(){b(function(){m(x?s.concat(w):w,x?t.concat(v):v,j,u,y)},A&&A.debounce?A.debounce.change||A.debounce:0)}g(z?r:w,d,e).then(function(){z?i.validate(r,s.length,c,d,e).then(function(){p(),a()}):a()},function(a){throw"Could not resize files "+a})}var r,s,t,u=[],v=[],w=[];s=d.$$ngfPrevValidFiles||[],t=d.$$ngfPrevInvalidFiles||[],c&&c.$modelValue&&(s=o(c.$modelValue));var x=i.attrGetter("ngfKeep",d,e);r=(j||[]).slice(0),("distinct"===x||i.attrGetter("ngfKeepDistinct",d,e)===!0)&&n(d,e);var y=!x&&!i.attrGetter("ngfMultiple",d,e)&&!i.attrGetter("multiple",d);if(!x||r.length){i.attrGetter("ngfBeforeModelChange",d,e,{$files:j,$file:j&&j.length?j[0]:null,$newFiles:r,$duplicateFiles:u,$event:k});var z=i.attrGetter("ngfValidateAfterResize",d,e),A=i.attrGetter("ngModelOptions",d,e);i.validate(r,s.length,c,d,e).then(function(){l?m(r,[],j,u,y):(A&&A.allowInvalid||z?w=r:p(),i.attrGetter("ngfFixOrientation",d,e)&&i.isExifSupported()?f(w,d,e).then(function(){q()}):q())})}},i}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){if(j.shouldUpdateOn("change",c,a)){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,"id"===d.name?"ngf-"+d.value:d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');n(a);var c=angular.element("<label>upload</label>");return c.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:c}),document.body.appendChild(c.append(a)[0]),a}function p(c){if(b.attr("disabled"))return!1;if(!t("ngfSelectDisabled",a)){var d=q(c);if(null!=d)return d;r(c);try{k()||document.body.contains(w[0])||(g.push({el:b,ref:w.parent()}),document.body.appendChild(w.parent()[0]),w.bind("change",m))}catch(f){}return e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1}}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){j.shouldUpdateOn("click",c,a)&&w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)};j.registerModelChangeValidator(d,c,a);var u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),u.push(a.$watch(t("ngfAccept"),function(){w.attr("accept",t("ngfAccept",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),d&&d.$formatters.push(function(a){return(null==a||0===a.length)&&w.val()&&w.val(null),a}),a.$on("$destroy",function(){k()||w.parent().remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.$ngfDataUrl:a.$ngfBlobUrl)||a.$ngfDataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ng-hide"):e.addClass("ng-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;if("ngfThumbnail"===g&&(d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),0===d.width&&window.getComputedStyle)){var f=getComputedStyle(e[0]);d={width:parseInt(f.width.slice(0,-2)),height:parseInt(f.height.slice(0,-2))}}return angular.isString(c)?(e.removeClass("ng-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ng-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.base64DataUrl=function(a){if(angular.isArray(a)){var b=c.defer(),e=0;return angular.forEach(a,function(c){d.dataUrl(c,!0)["finally"](function(){if(e++,e===a.length){var c=[];angular.forEach(a,function(a){c.push(a.$ngfDataUrl)}),b.resolve(c,a)}})}),b.promise}return d.dataUrl(a,!0)},d.dataUrl=function(a,e){if(!a)return d.emptyPromise(a,a);if(e&&null!=a.$ngfDataUrl||!e&&null!=a.$ngfBlobUrl)return d.emptyPromise(e?a.$ngfDataUrl:a.$ngfBlobUrl,a);var f=e?a.$$ngfDataUrlPromise:a.$$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!e){var f;try{f=c.createObjectURL(a)}catch(h){return void b(function(){a.$ngfBlobUrl="",g.reject()})}b(function(){if(a.$ngfBlobUrl=f,f){g.resolve(f,a),d.blobUrls=d.blobUrls||[],d.blobUrlsTotalSize=d.blobUrlsTotalSize||0,d.blobUrls.push({url:f,size:a.size}),d.blobUrlsTotalSize+=a.size||0;for(var b=d.defaults.blobUrlsMaxMemory||268435456,e=d.defaults.blobUrlsMaxQueueSize||200;(d.blobUrlsTotalSize>b||d.blobUrls.length>e)&&d.blobUrls.length>1;){var h=d.blobUrls.splice(0,1)[0];c.revokeObjectURL(h.url),d.blobUrlsTotalSize-=h.size}}})}else{var i=new FileReader;i.onload=function(c){b(function(){a.$ngfDataUrl=c.target.result,g.resolve(c.target.result,a),b(function(){delete a.$ngfDataUrl},1e3)})},i.onerror=function(){b(function(){a.$ngfDataUrl="",g.reject()})},i.readAsDataURL(a)}}else b(function(){a[e?"$ngfDataUrl":"$ngfBlobUrl"]="",g.reject()})}),f=e?a.$$ngfDataUrlPromise=g.promise:a.$$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[e?"$$ngfDataUrlPromise":"$$ngfBlobUrlPromise"]}),f},d}]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}]),ngFileUpload.config(["$compileProvider",function(a){a.imgSrcSanitizationWhitelist&&a.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/),a.aHrefSanitizationWhitelist&&a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/)}]),ngFileUpload.filter("ngfDataUrl",["UploadDataUrl","$sce",function(a,b){return function(c,d,e){if(angular.isString(c))return b.trustAsResourceUrl(c);var f=c&&((d?c.$ngfDataUrl:c.$ngfBlobUrl)||c.$ngfDataUrl);return c&&!f?(!c.$ngfDataUrlFilterInProgress&&angular.isObject(c)&&(c.$ngfDataUrlFilterInProgress=!0,a.dataUrl(c,d)),""):(c&&delete c.$ngfDataUrlFilterInProgress,(c&&f?e?b.trustAsResourceUrl(f):f:c)||"")}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){var b="",c=[];if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])b=a.substring(1,a.length-1);else{var e=a.split(",");if(e.length>1)for(var f=0;f<e.length;f++){var g=d(e[f]);g.regexp?(b+="("+g.regexp+")",f<e.length-1&&(b+="|")):c=c.concat(g.excludes)}else 0===a.indexOf("!")?c.push("^((?!"+d(a.substring(1)).regexp+").)*$"):(0===a.indexOf(".")&&(a="*"+a),b="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",b=b.replace(/\\\*/g,".*").replace(/\\\?/g,"."))}return{regexp:b,excludes:c}}function e(a,b){null==b||a.$dirty||(a.$setDirty?a.$setDirty():a.$dirty=!0)}var f=a;return f.validatePattern=function(a,b){if(!b)return!0;var c=d(b),e=!0;if(c.regexp&&c.regexp.length){var f=new RegExp(c.regexp,"i");e=null!=a.type&&f.test(a.type)||null!=a.name&&f.test(a.name)}for(var g=c.excludes.length;g--;){var h=new RegExp(c.excludes[g],"i");e=e&&(null==a.type||h.test(a.type))&&(null==a.name||h.test(a.name))}return e},f.ratioToFloat=function(a){var b=a.toString(),c=b.search(/[x:]/i);return b=c>-1?parseFloat(b.substring(0,c))/parseFloat(b.substring(c+1)):parseFloat(b)},f.registerModelChangeValidator=function(a,b,c){a&&a.$formatters.push(function(d){a.$dirty&&(d&&!angular.isArray(d)&&(d=[d]),f.validate(d,0,a,b,c).then(function(){f.applyModelValidation(a,d)}))})},f.applyModelValidation=function(a,b){e(a,b),angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})},f.getValidationAttr=function(a,b,c,d,e){var g="ngf"+c[0].toUpperCase()+c.substr(1),h=f.attrGetter(g,a,b,{$file:e});if(null==h&&(h=f.attrGetter("ngfValidate",a,b,{$file:e}))){var i=(d||c).split(".");h=h[i[0]],i.length>1&&(h=h&&h[i[1]])}return h},f.validate=function(a,c,d,e,g){function h(b,c,h){if(a){for(var i=a.length,j=null;i--;){var k=a[i];if(k){var l=f.getValidationAttr(e,g,b,c,k);null!=l&&(h(k,l,i)||(k.$error=b,(k.$errorMessages=k.$errorMessages||{})[b]=!0,k.$errorParam=l,a.splice(i,1),j=!1))}}null!==j&&d.$ngfValidations.push({name:b,valid:j})}}function i(c,h,i,k,l){function m(a,b,d){null!=d?k(b,d).then(function(e){l(e,d)?a.resolve():(b.$error=c,(b.$errorMessages=b.$errorMessages||{})[c]=!0,b.$errorParam=d,a.reject())},function(){j("ngfValidateForce",{$file:b})?(b.$error=c,(b.$errorMessages=b.$errorMessages||{})[c]=!0,b.$errorParam=d,a.reject()):a.resolve()}):a.resolve()}var n=[f.emptyPromise()];return a?(a=void 0===a.length?[a]:a,angular.forEach(a,function(a){var d=b.defer();return n.push(d.promise),!i||null!=a.type&&0===a.type.search(i)?void("dimensions"===c&&null!=f.attrGetter("ngfDimensions",e)?f.imageDimensions(a).then(function(b){m(d,a,j("ngfDimensions",{$file:a,$width:b.width,$height:b.height}))},function(){d.reject()}):"duration"===c&&null!=f.attrGetter("ngfDuration",e)?f.mediaDuration(a).then(function(b){m(d,a,j("ngfDuration",{$file:a,$duration:b}))},function(){d.reject()}):m(d,a,f.getValidationAttr(e,g,c,h,a))):void d.resolve()}),b.all(n).then(function(){d.$ngfValidations.push({name:c,valid:!0})},function(){d.$ngfValidations.push({name:c,valid:!1})})):void 0}d=d||{},d.$ngfValidations=d.$ngfValidations||[],angular.forEach(d.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return f.attrGetter(a,e,g,b)};if(null==a||0===a.length)return f.emptyPromise(d);a=void 0===a.length?[a]:a.slice(0),h("maxFiles",null,function(a,b,d){return b>c+d}),h("pattern",null,f.validatePattern),h("minSize","size.min",function(a,b){return a.size+.1>=f.translateScalars(b)}),h("maxSize","size.max",function(a,b){return a.size-.1<=f.translateScalars(b)});var k=0;if(h("maxTotalSize",null,function(b,c){return k+=b.size,k>f.translateScalars(c)?(a.splice(0,a.length),!1):!0}),h("validateFn",null,function(a,b){return b===!0||null===b||""===b}),!a.length)return f.emptyPromise(d,d.$ngfValidations);var l=b.defer(),m=[];return m.push(f.happyPromise(i("maxHeight","height.max",/image/,this.imageDimensions,function(a,b){return a.height<=b}))),m.push(f.happyPromise(i("minHeight","height.min",/image/,this.imageDimensions,function(a,b){return a.height>=b}))),m.push(f.happyPromise(i("maxWidth","width.max",/image/,this.imageDimensions,function(a,b){return a.width<=b}))),m.push(f.happyPromise(i("minWidth","width.min",/image/,this.imageDimensions,function(a,b){return a.width>=b}))),m.push(f.happyPromise(i("dimensions",null,/image/,function(a,b){return f.emptyPromise(b)},function(a){return a}))),m.push(f.happyPromise(i("ratio",null,/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++)Math.abs(a.width/a.height-f.ratioToFloat(c[e]))<1e-4&&(d=!0);return d}))),m.push(f.happyPromise(i("maxRatio","ratio.max",/image/,this.imageDimensions,function(a,b){return a.width/a.height-f.ratioToFloat(b)<1e-4}))),m.push(f.happyPromise(i("minRatio","ratio.min",/image/,this.imageDimensions,function(a,b){return a.width/a.height-f.ratioToFloat(b)>-1e-4}))),m.push(f.happyPromise(i("maxDuration","duration.max",/audio|video/,this.mediaDuration,function(a,b){return a<=f.translateScalars(b)}))),m.push(f.happyPromise(i("minDuration","duration.min",/audio|video/,this.mediaDuration,function(a,b){return a>=f.translateScalars(b)}))),m.push(f.happyPromise(i("duration",null,/audio|video/,function(a,b){return f.emptyPromise(b)},function(a){return a}))),m.push(f.happyPromise(i("validateAsyncFn",null,null,function(a,b){return b},function(a){return a===!0||null===a||""===a}))),b.all(m).then(function(){l.resolve(d,d.$ngfValidations)})},f.imageDimensions=function(a){if(a.$ngfWidth&&a.$ngfHeight){var d=b.defer();return c(function(){d.resolve({width:a.$ngfWidth,height:a.$ngfHeight})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var e=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void e.reject("not image"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.$ngfWidth=b,a.$ngfHeight=c,e.resolve({width:b,height:c})}function f(){h.remove(),e.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?f():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed").css("max-width","none !important").css("max-height","none !important");h.on("load",d),h.on("error",f);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){e.reject("load error")})}),a.$ngfDimensionPromise=e.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},f.mediaDuration=function(a){if(a.$ngfDuration){var d=b.defer();return c(function(){d.resolve(a.$ngfDuration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var e=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void e.reject("not media"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.$ngfDuration=b,h.remove(),e.resolve(b)}function f(){h.remove(),e.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?f():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",f);var i=0;g(),angular.element(document.body).append(h)},function(){e.reject("load error")})}),a.$ngfDurationPromise=e.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},f}]),ngFileUpload.service("UploadResize",["UploadValidate","$q",function(a,b){var c=a,d=function(a,b,c,d,e){var f=e?Math.max(c/a,d/b):Math.min(c/a,d/b);return{width:a*f,height:b*f,marginX:a*f-c,marginY:b*f-d}},e=function(a,e,f,g,h,i,j,k){var l=b.defer(),m=document.createElement("canvas"),n=document.createElement("img");return n.onload=function(){if(null!=k&&k(n.width,n.height)===!1)return void l.reject("resizeIf");try{if(i){var a=c.ratioToFloat(i),b=n.width/n.height;a>b?(e=n.width,f=e/a):(f=n.height,e=f*a)}e||(e=n.width),f||(f=n.height);var o=d(n.width,n.height,e,f,j);m.width=Math.min(o.width,e),m.height=Math.min(o.height,f);var p=m.getContext("2d");p.drawImage(n,Math.min(0,-o.marginX/2),Math.min(0,-o.marginY/2),o.width,o.height),l.resolve(m.toDataURL(h||"image/WebP",g||.934))}catch(q){l.reject(q)}},n.onerror=function(){l.reject()},n.src=a,l.promise};return c.dataUrltoBlob=function(a,b,c){for(var d=a.split(","),e=d[0].match(/:(.*?);/)[1],f=atob(d[1]),g=f.length,h=new Uint8Array(g);g--;)h[g]=f.charCodeAt(g);var i=new window.Blob([h],{type:e});return i.name=b,i.$ngfOrigSize=c,i},c.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")&&window.Blob},c.isResizeSupported()&&Object.defineProperty(window.Blob.prototype,"name",{get:function(){return this.$ngfName},set:function(a){this.$ngfName=a},configurable:!0}),c.resize=function(a,d,f,g,h,i,j,k,l){if(0!==a.type.indexOf("image"))return c.emptyPromise(a);var m=b.defer();return c.dataUrl(a,!0).then(function(b){e(b,d,f,g,h||a.type,i,j,k).then(function(d){if("image/jpeg"===a.type&&l)try{d=c.restoreExif(b,d)}catch(e){setTimeout(function(){throw e},1)}try{var f=c.dataUrltoBlob(d,a.name,a.size);m.resolve(f)}catch(e){m.reject(e)}},function(b){"resizeIf"===b&&m.resolve(a),m.reject(b)})},function(a){m.reject(a)}),m.promise},c}]),function(){function a(a,c,d,e,f,g,h,i,j,k){function l(){return c.attr("disabled")||r("ngfDropDisabled",a)}function m(b,c){i.updateModel(e,d,a,r("ngfChange")||r("ngfDrop"),b,c)}function n(b,c){if(!i.shouldUpdateOn(b,d,a)||!c)return i.rejectPromise([]);var e=[];c.replace(/<(img src|img [^>]* src) *=\"([^\"]*)\"/gi,function(a,b,c){e.push(c)});var f=[],g=[];if(e.length){angular.forEach(e,function(a){f.push(i.urlToBlob(a).then(function(a){g.push(a)}))});var h=k.defer();return k.all(f).then(function(){h.resolve(g)},function(a){h.reject(a)}),h.promise}return i.emptyPromise()}function o(a,b,c,d){var e=r("ngfDragOverClass",a,{$event:c}),f="dragover";if(angular.isString(e))f=e;else if(e&&(e.delay&&(v=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g&&g.length)for(var h=e.pattern||r("ngfPattern",a,{$event:c}),j=g.length;j--;){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}else f=e.accept}d(f)}function p(b,c,e,f){function g(a,b){var c=k.defer();if(null!=a)if(a.isDirectory){var d=[i.emptyPromise()];if(m){var e={type:"directory"};e.name=e.path=(b||"")+a.name+a.name,n.push(e)}var f=a.createReader(),h=[],p=function(){f.readEntries(function(e){try{e.length?(h=h.concat(Array.prototype.slice.call(e||[],0)),p()):(angular.forEach(h.slice(0),function(c){n.length<=j&&l>=o&&d.push(g(c,(b?b:"")+a.name+"/"))}),k.all(d).then(function(){c.resolve()},function(a){c.reject(a)}))}catch(f){c.reject(f)}},function(a){c.reject(a)})};p()}else a.file(function(a){try{a.path=(b?b:"")+a.name,m&&(a=i.rename(a,a.path)),n.push(a),o+=a.size,c.resolve()}catch(d){c.reject(d)}},function(a){c.reject(a)});return c.promise}var j=i.getValidationAttr(d,a,"maxFiles")||Number.MAX_VALUE,l=i.getValidationAttr(d,a,"maxTotalSize")||Number.MAX_VALUE,m=r("ngfIncludeDir",a),n=[],o=0,p=[i.emptyPromise()];if(b&&b.length>0&&"file"!==h.protocol())for(var q=0;q<b.length;q++){if(b[q].webkitGetAsEntry&&b[q].webkitGetAsEntry()&&b[q].webkitGetAsEntry().isDirectory){var s=b[q].webkitGetAsEntry();if(s.isDirectory&&!e)continue;null!=s&&p.push(g(s))}else{var t=b[q].getAsFile();null!=t&&(n.push(t),o+=t.size)}if(n.length>j||o>l||!f&&n.length>0)break}else if(null!=c)for(var u=0;u<c.length;u++){var v=c.item(u);if((v.type||v.size>0)&&(n.push(v),o+=v.size),n.length>j||o>l||!f&&n.length>0)break}var w=k.defer();return k.all(p).then(function(){if(f||m||!n.length)w.resolve(n);else{for(var a=0;n[a]&&"directory"===n[a].type;)a++;w.resolve([n[a]])}},function(a){w.reject(a)}),w.promise}var q=b(),r=function(a,b,c){return i.attrGetter(a,d,b,c)};if(r("dropAvailable")&&g(function(){a[r("dropAvailable")]?a[r("dropAvailable")].value=q:a[r("dropAvailable")]=q}),!q)return void(r("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));null==r("ngfSelect")&&i.registerModelChangeValidator(e,d,a);var s,t=null,u=f(r("ngfStopPropagation")),v=1;c[0].addEventListener("dragover",function(b){if(!l()&&i.shouldUpdateOn("drop",d,a)){if(b.preventDefault(),u(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(t),s||(s="C",o(a,d,b,function(d){s=d,c.addClass(s),r("ngfDrag",a,{$isDragging:!0,$class:s,$event:b})}))}},!1),c[0].addEventListener("dragenter",function(b){!l()&&i.shouldUpdateOn("drop",d,a)&&(b.preventDefault(),u(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(b){!l()&&i.shouldUpdateOn("drop",d,a)&&(b.preventDefault(),u(a)&&b.stopPropagation(),t=g(function(){s&&c.removeClass(s),s=null,r("ngfDrag",a,{$isDragging:!1,$event:b})},v||100))},!1),c[0].addEventListener("drop",function(b){if(!l()&&i.shouldUpdateOn("drop",d,a)){b.preventDefault(),u(a)&&b.stopPropagation(),s&&c.removeClass(s),s=null;var e,f=b.dataTransfer.items;try{e=b.dataTransfer&&b.dataTransfer.getData&&b.dataTransfer.getData("text/html")}catch(g){}p(f,b.dataTransfer.files,r("ngfAllowDir",a)!==!1,r("multiple")||r("ngfMultiple",a)).then(function(a){a.length?m(a,b):n("dropUrl",e).then(function(a){m(a,b)})})}},!1),c[0].addEventListener("paste",function(b){if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&r("ngfEnableFirefoxPaste",a)&&b.preventDefault(),!l()&&i.shouldUpdateOn("paste",d,a)){var c=[],e=b.clipboardData||b.originalEvent.clipboardData;if(e&&e.items)for(var f=0;f<e.items.length;f++)-1!==e.items[f].type.indexOf("image")&&c.push(e.items[f].getAsFile());c.length?m(c,b):n("pasteUrl",e).then(function(a){m(a,b)})}},!1),navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&r("ngfEnableFirefoxPaste",a)&&(c.attr("contenteditable",!0),c.on("keypress",function(a){a.metaKey||a.ctrlKey||a.preventDefault()}))}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload","$http","$q",function(b,c,d,e,f,g){
return{restrict:"AEC",require:"?ngModel",link:function(h,i,j,k){a(h,i,j,k,b,c,d,e,f,g)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}(),ngFileUpload.service("UploadExif",["UploadResize","$q",function(a,b){function c(a,b,c,d){switch(b){case 2:return a.transform(-1,0,0,1,c,0);case 3:return a.transform(-1,0,0,-1,c,d);case 4:return a.transform(1,0,0,-1,0,d);case 5:return a.transform(0,1,1,0,0,0);case 6:return a.transform(0,1,-1,0,d,0);case 7:return a.transform(0,-1,-1,0,d,c);case 8:return a.transform(0,-1,1,0,0,c)}}function d(a){for(var b="",c=new Uint8Array(a),d=c.byteLength,e=0;d>e;e++)b+=String.fromCharCode(c[e]);return window.btoa(b)}var e=a;return e.isExifSupported=function(){return window.FileReader&&(new FileReader).readAsArrayBuffer&&e.isResizeSupported()},e.readOrientation=function(a){var c=b.defer(),d=new FileReader,e=a.slice?a.slice(0,65536):a;return d.readAsArrayBuffer(e),d.onerror=function(a){return c.reject(a)},d.onload=function(a){var b={orientation:1},d=new DataView(this.result);if(65496!==d.getUint16(0,!1))return c.resolve(b);for(var e=d.byteLength,f=2;e>f;){var g=d.getUint16(f,!1);if(f+=2,65505===g){if(1165519206!==d.getUint32(f+=2,!1))return c.resolve(b);var h=18761===d.getUint16(f+=6,!1);f+=d.getUint32(f+4,h);var i=d.getUint16(f,h);f+=2;for(var j=0;i>j;j++)if(274===d.getUint16(f+12*j,h)){var k=d.getUint16(f+12*j+8,h);return k>=2&&8>=k&&(d.setUint16(f+12*j+8,1,h),b.fixedArrayBuffer=a.target.result),b.orientation=k,c.resolve(b)}}else{if(65280!==(65280&g))break;f+=d.getUint16(f,!1)}}return c.resolve(b)},c.promise},e.applyExifRotation=function(a){if(0!==a.type.indexOf("image/jpeg"))return e.emptyPromise(a);var f=b.defer();return e.readOrientation(a).then(function(b){return b.orientation<2||b.orientation>8?f.resolve(a):void e.dataUrl(a,!0).then(function(g){var h=document.createElement("canvas"),i=document.createElement("img");i.onload=function(){try{h.width=b.orientation>4?i.height:i.width,h.height=b.orientation>4?i.width:i.height;var g=h.getContext("2d");c(g,b.orientation,i.width,i.height),g.drawImage(i,0,0);var j=h.toDataURL(a.type||"image/WebP",.934);j=e.restoreExif(d(b.fixedArrayBuffer),j);var k=e.dataUrltoBlob(j,a.name);f.resolve(k)}catch(l){return f.reject(l)}},i.onerror=function(){f.reject()},i.src=g},function(a){f.reject(a)})},function(a){f.reject(a)}),f.promise},e.restoreExif=function(a,b){var c={};return c.KEY_STR="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c.encode64=function(a){var b,c,d,e,f,g="",h="",i="",j=0;do b=a[j++],c=a[j++],h=a[j++],d=b>>2,e=(3&b)<<4|c>>4,f=(15&c)<<2|h>>6,i=63&h,isNaN(c)?f=i=64:isNaN(h)&&(i=64),g=g+this.KEY_STR.charAt(d)+this.KEY_STR.charAt(e)+this.KEY_STR.charAt(f)+this.KEY_STR.charAt(i),b=c=h="",d=e=f=i="";while(j<a.length);return g},c.restore=function(a,b){a.match("data:image/jpeg;base64,")&&(a=a.replace("data:image/jpeg;base64,",""));var c=this.decode64(a),d=this.slice2Segments(c),e=this.exifManipulation(b,d);return"data:image/jpeg;base64,"+this.encode64(e)},c.exifManipulation=function(a,b){var c=this.getExifArray(b),d=this.insertExif(a,c);return new Uint8Array(d)},c.getExifArray=function(a){for(var b,c=0;c<a.length;c++)if(b=a[c],255===b[0]&225===b[1])return b;return[]},c.insertExif=function(a,b){var c=a.replace("data:image/jpeg;base64,",""),d=this.decode64(c),e=d.indexOf(255,3),f=d.slice(0,e),g=d.slice(e),h=f;return h=h.concat(b),h=h.concat(g)},c.slice2Segments=function(a){for(var b=0,c=[];;){if(255===a[b]&218===a[b+1])break;if(255===a[b]&216===a[b+1])b+=2;else{var d=256*a[b+2]+a[b+3],e=b+d+2,f=a.slice(b,e);c.push(f),b=e}if(b>a.length)break}return c},c.decode64=function(a){var b,c,d,e,f,g="",h="",i=0,j=[],k=/[^A-Za-z0-9\+\/\=]/g;k.exec(a)&&console.log("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, NaNExpect errors in decoding."),a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do d=this.KEY_STR.indexOf(a.charAt(i++)),e=this.KEY_STR.indexOf(a.charAt(i++)),f=this.KEY_STR.indexOf(a.charAt(i++)),h=this.KEY_STR.indexOf(a.charAt(i++)),b=d<<2|e>>4,c=(15&e)<<4|f>>2,g=(3&f)<<6|h,j.push(b),64!==f&&j.push(c),64!==h&&j.push(g),b=c=g="",d=e=f=h="";while(i<a.length);return j},c.restore(a,b)},e}]);
/**
 * object-table - angular smart table directive
 * @version v
 * @author Yauheni Kokatau
 * @license MIT
 */
"use strict";angular.module("objectTable",[]).directive("contenteditable",function(){return{restrict:"A",require:["ngModel","^objectTable"],link:function(e,t,r,n){var a=n[0],o=n[1];a.$render=function(){t.html(a.$viewValue||"")},t.bind("change blur",function(){var r=a.$viewValue.toString(),n=t.text();r!==n&&(e.$apply(function(){a.$setViewValue(n)}),o.onEdit&&"function"==typeof o.onEdit&&o.onEdit({$oldValue:r,$newValue:n}))})}}}),angular.module("objectTable").directive("objectTable",["$compile","$interpolate",function(e,t){return{restrict:"A",replace:!0,templateUrl:"/src/templates/common.html",controller:"objectTableCtrl",controllerAs:"ctrl",transclude:!0,scope:{data:"=",display:"=?",resize:"=?",paging:"=?",fromUrl:"@",sortingType:"@?sorting",editable:"&?",onEdit:"&?",select:"@?",selectedModel:"=?",dragColumns:"=?",addBtn:"="},compile:function(e,t){var r="",n="";return t.addFilter&&(r+=t.addFilter),"false"!==t.sorting&&(r+="| orderBy:sortingArray"),t.dragColumns&&e.find("th").attr("allow-drag",""),"separate"===t.search?t.fields.split(",").forEach(function(e,t){r+="| filter:{'"+e.trim()+"':columnSearch['"+e+"']}"}):"undefined"!=typeof t.search&&"true"!==t.search||(r+="| filter:globalSearch"),n+=" | offset: currentPage:display |limitTo: display",e[0].querySelector("#rowTr").setAttribute("ng-repeat","item in $parent.$filtered = (data"+r+")"+n),e.find("paging").attr("count","$filtered.length"),function(e,t,a,o,i){e.addBtn?(e.addBtnShow=!0,e.addClick=function(){e.addBtn()}):e.addBtnShow=!1,o._init(),i(e,function(t,a){e.$owner=a.$parent;for(var i in t)if(t.hasOwnProperty(i))switch(t[i].tagName){case"THEAD":o._addHeaderPattern(t[i]);break;case"TBODY":e.findBody=!0,o._addRowPattern(t[i],r,n);break;case"TFOOT":o._addFooterPattern(t[i])}})}}}}]),angular.module("objectTable").directive("allowDrag",function(){return{restrict:"A",controller:function(){},compile:function(e,t){function r(e,t){var r=e[0].parentNode.querySelector("."+t);r&&r.classList.remove(t)}return function(e,t,n,a){t.attr("draggable",!0),t.bind("dragstart",function(e){a.target=this,this.classList.add("dragged");var t=e.originalEvent||e;t.dataTransfer.setData("text",a.target.cellIndex)}),t.bind("dragover",function(e){e.preventDefault()}),t.bind("dragenter",function(e){a.toTarget=this,this.classList.contains("draggedOver")||this.classList.contains("dragged")||this.classList.add("draggedOver"),e.preventDefault(),e.stopPropagation()}),t.bind("dragend",function(e){this.classList.contains("dragged")&&this.classList.remove("dragged"),e.preventDefault()}),t.bind("dragleave",function(e){this.classList.remove("draggedOver")}),t.bind("drop",function(e){var n=a.toTarget.cellIndex,o=e.originalEvent||e,i=parseInt(o.dataTransfer.getData("text"),10);r(t,"dragged"),r(t,"draggedOver"),t.parent().controller("objectTable").changeColumnsOrder(n,i),e.preventDefault()})}}}}),angular.module("objectTable").controller("objectTableCtrl",["$scope","$timeout","$element","$attrs","$http","$compile","$controller","objectTableUtilService",function(e,t,r,n,a,o,i,l){i("objectTableSortingCtrl",{$scope:e});var s=this;this._init=function(){e.headers=[],e.fields=[],e.display=e.display||5,e.paging=angular.isDefined(e.paging)?e.paging:!0,e.sortingType=e.sortingType||"simple",e.currentPage=0,e.customHeader=!1,"separate"==n.search?(e.search="separate",e.columnSearch=[]):e.search="undefined"==typeof n.search||"true"===n.search,e.headers=l.getArrayFromParams(n.headers,"headers"),e.fields=l.getArrayFromParams(n.fields,"fields"),n.fromUrl&&this._loadExternalData(n.fromUrl),e.onEdit&&(this.onEdit=e.onEdit),e.selectedModel="multiply"===e.select?[]:{}},this.onEdit=e.onEdit,this._loadExternalData=function(t){e.dataIsLoading=!0,a.get(t).then(function(t){e.data=t.data,e.dataIsLoading=!1})},this._addHeaderPattern=function(t){e.customHeader=!0,Array.prototype.forEach.call(t.querySelectorAll("[allow-drag]"),function(e,t){e.setAttribute("index",t)}),t.removeAttribute("ng-non-bindable"),r.find("table").prepend(t)},this._addFooterPattern=function(e){r.find("table").prepend(e)},this._addRowPattern=function(t,n,a){this._checkEditableContent(t),this._addRepeatToRow(t,n,a),t.removeAttribute("ng-non-bindable"),r.find("table").append(t.outerHTML),this.bodyTemplate=t.innerHTML,o(r.find("tbody"))(e)},this._addRepeatToRow=function(e,t,r){var n=angular.element(e).find("tr");n.attr("ng-repeat","item in $filtered = (data"+t+")"+r),n.attr("ng-click")||n.attr("ng-click","setSelected(item)"),n.attr("ng-class","{'selected-row':ifSelected(item)}")},this._checkEditableContent=function(e){var t,r=/\{\{:*:*(.*?)\}\}/g;Array.prototype.forEach.call(e.querySelectorAll("[editable]"),function(e){t=e.innerHTML.replace(r,"$1"),e.innerHTML="<div contentEditable ng-model='"+t+"'>{{"+t+"}}</div>"})},this.setCurrentPage=function(t){e.currentPage=t},e.setSelected=function(t){"multiply"===e.select?s._containsInSelectArray(t)?e.selectedModel.splice(e.selectedModel.indexOf(t),1):e.selectedModel.push(t):e.selectedModel=t},this._containsInSelectArray=function(t){return e.selectedModel.length?e.selectedModel.filter(function(e){return angular.equals(e,t)}).length>0:void 0},e.ifSelected=function(t){return e.selectedModel&&"multiply"===e.select?s._containsInSelectArray(t):t.$$hashKey==e.selectedModel.$$hashKey},this.changeColumnsOrder=function(t,n){e.$apply(function(){if(e.fields.swap(t,n),e.headers.swap(t,n),e.columnSearch&&e.columnSearch.swap(t,n),s.bodyTemplate){var a=angular.element(s.bodyTemplate).children(),i=document.createElement("tr"),l=document.createElement("tbody"),d=r.find("tbody").find("tr")[0].attributes;Array.prototype.swap.apply(a,[t,n]),[].forEach.call(d,function(e,t){i.setAttribute(e.name,e.value)});for(var c=0,u=a.length;u>c;c++)i.appendChild(a[c]);l.appendChild(i),r.find("tbody").replaceWith(l),s.bodyTemplate=l.innerHTML,o(r.find("tbody"))(e)}if(e.customHeader){var g=r.find("th"),i=document.createElement("tr"),p=document.createElement("thead");Array.prototype.swap.apply(g,[t,n]);for(var c=0,u=g.length;u>c;c++)i.appendChild(g[c]);p.appendChild(i),r.find("thead").replaceWith(p)}s.pageCtrl&&s.pageCtrl.setPage(0)})},e.setCurrentPageForPageCtrl=function(e){s.pageCtrl&&s.pageCtrl.setPage(e)}}]),angular.module("objectTable").filter("offset",function(){return function(e,t,r){if(e){t=parseInt(t,10),r=parseInt(r,10);var n=t*r;return e.slice(n,n+r)}}}),angular.module("objectTable").controller("pagingTableCtrl",["$scope","$element","$attrs",function(e,t,r){e.currentPage=0,e.prevPage=function(){e.currentPage>0&&e.currentPage--,e.setCurrentPageToTable()},e.nextPage=function(){e.currentPage<e.pageCount()&&e.currentPage++,e.setCurrentPageToTable()},e.setCurrentPageToTable=function(){e.objectTableCtrl.setCurrentPage(e.currentPage)},e.prevPageDisabled=function(){return 0===e.currentPage?"disabled":""},e.pageCount=function(){return e.count>0?Math.ceil(e.count/e.display)-1:0},e.nextPageDisabled=function(){return e.currentPage===e.pageCount()?"disabled":""},e.setPage=function(t){e.currentPage=t,e.setCurrentPageToTable()},e.range=function(){var t=e.pageCount()+1<5?e.pageCount()+1:5,r=[],n=e.currentPage;n>e.pageCount()-t&&(n=e.pageCount()-t+1);for(var a=n;n+t>a;a++)r.push(a);return r}}]),angular.module("objectTable").controller("objectTableSortingCtrl",["$scope",function(e){function t(e){o&&(r.width=a+(e.pageX-n))}e.sort={fields:[],reverse:[]},e.sortingArray=[],e.sortBy=function(t){if(i)return void(i=!1);if(e.data.length){var r=e.headers[e.fields.indexOf(t)];"compound"==e.sortingType?-1==e.sort.fields.indexOf(r)?(e.sort.fields.push(r),e.sortingArray.push(t),e.sort.reverse.push(!1)):e.changeReversing(t,e.sort.fields.indexOf(r)):"simple"==e.sortingType&&(e.sort.fields=[r],e.changeReversing(t))}},e.changeReversing=function(t,r){"compound"==e.sortingType?(e.sort.reverse[r]=!e.sort.reverse[r],e.sortingArray[r]=e.sort.reverse[r]?"-"+t:t):"simple"==e.sortingType&&(e.sort.reverse[0]=!e.sort.reverse[0],e.sortingArray=e.sort.reverse[0]?[t]:["-"+t])},e.headerIsSortedClass=function(t){if(e.sortingArray.length)if("simple"==e.sortingType){if(t==e.sort.fields[0]||"-"+t==e.sort.fields[0])return e.sort.reverse[0]?"table-sort-down":"table-sort-up"}else if("compound"==e.sortingType){var r=e.sort.fields.indexOf(t);if(-1!=r)return e.sort.reverse[r]?"table-sort-down":"table-sort-up"}},e.removeSorting=function(){var t=e.sort.fields.indexOf(this.sortField);t>-1&&(e.sort.fields.splice(t,1),e.sort.reverse.splice(t,1),e.sortingArray.splice(t,1)),t=null};var r,n,a,o=!1,i=!1;e.resizeStart=function(e){var i=e.target?e.target:e.srcElement;i.classList.contains("resize")&&(r=i.parentNode,o=!0,n=e.pageX,a=i.parentNode.offsetWidth,document.addEventListener("mousemove",t),e.stopPropagation(),e.preventDefault())},e.resizeEnd=function(e){o&&(document.removeEventListener("mousemove",t),e.stopPropagation(),e.preventDefault(),o=!1,i=!0)}}]),angular.module("objectTable").service("objectTableUtilService",[function(){return Array.prototype.swap=function(e,t){if(e>=this.length)for(var r=e-this.length;r--+1;)this.push(void 0);return this.splice(e,0,this.splice(t,1)[0]),this},{getArrayFromParams:function(e,t){if(!e)throw"Required '"+t+"' attribute is not found!";for(var r=[],n=e.split(","),a=0,o=n.length;o>a;a++)r.push(n[a].trim());return r}}}]),angular.module("objectTable").directive("paging",["$compile","$interpolate",function(e,t){return{restrict:"E",replace:!0,templateUrl:"/src/templates/paging.html",controller:"pagingTableCtrl",require:"^objectTable",scope:{count:"=",display:"="},link:function(e,t,r,n){e.objectTableCtrl=n,e.objectTableCtrl.pageCtrl=e}}}]);
angular.module("objectTable").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/common.html","<div class=\"object-table-module\"><!--搜索框--><div class=\"form-group col-xs-12 col-sm-6 col-md-4\" ng-if=\"search && \'separate\'!=search\"><input type=\"text\" placeholder=\"搜索内容\" ng-model=\"$parent.globalSearch\" class=\"row form-control search\" ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-change=\"setCurrentPageForPageCtrl(0)\"></div><div class=\"col-xs-12 col-sm-6 col-md-8\" ng-if=\"addBtnShow\"><button ng-click=\"addClick()\" class=\"row btn btn-primary pull-right\"><i class=\"glyphicon glyphicon-plus\"></i>&nbsp;新建</button></div><div class=\"col-xs-12 col-sm-6 col-md-8 sorting-container\"><div ng-if=\"sortingType && sort.fields.length\">Sorting:<div ng-repeat=\"sortField in sort.fields\" class=\"sorting-badge\"><span class=\"glyphicon\" ng-class=\"{\'glyphicon-chevron-down\':sort.reverse[$index], \'glyphicon-chevron-up\':!sort.reverse[$index]}\"></span> {{::sortField}} <span class=\"glyphicon glyphicon-remove close\" ng-click=\"removeSorting()\"></span></div></div></div><div class=\"back-cover\"><table class=\"table table-responsive table-bordered object-table\" ng-mousedown=\"resizeStart($event)\" ng-mouseup=\"resizeEnd($event)\"><thead ng-if=\"!customHeader\"><tr><th ng-repeat=\"head in headers track by $index\" ng-click=\"sortBy(fields[$index])\" ng-class=\"headerIsSortedClass(head)\" class=\"sortable\">{{head}}<div ng-if=\"resize\" class=\"resize\"></div></th></tr></thead><thead ng-if=\"!customHeader&& \'separate\'===search\"><tr><th ng-repeat=\"head in headers track by $index\" class=\"separate\"><i class=\"glyphicon glyphicon-search search_icon separate\"></i> <input type=\"text\" ng-model=\"columnSearch[fields[$index]]\" placeholder=\"{{head}}...\" class=\"form-control search separate\" ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-change=\"setCurrentPageForPageCtrl(0)\"></th></tr></thead><tbody ng-if=\"!findBody\"><tr id=\"rowTr\" ng-click=\"setSelected(item)\" ng-class=\"{\'selected-row\':ifSelected(item)}\"><!-- <= will inject ng-repeat --><!-- params: headers and fields --><td ng-if=\"!editable\" ng-repeat=\"field in fields\">{{item[field]}}</td><td ng-if=\"editable\" editable ng-repeat=\"field in fields\"><div contenteditable ng-model=\"item[field]\">{{item[field]}}</div></td></tr></tbody></table></div><div class=\"loading\" ng-show=\"dataIsLoading\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading Data...</div><paging ng-if=\"paging\" data-display=\"display\" count=\"$filtered.length\" class=\"row\" ng-hide=\"dataIsLoading\"></paging><div class=\"clearfix\"></div></div>");
$templateCache.put("/src/templates/paging.html","<div><div class=\"col-xs-12 text-center\"><nav ng-hide=\"pageCount()==0\"><ul class=\"pagination\"><li ng-class=\"prevPageDisabled()\"><a href ng-click=\"prevPage()\">上一页</a></li><li ng-repeat=\"n in range()\" ng-class=\"{active: n == currentPage}\" ng-click=\"setPage(n)\"><a href=\"javascript:void(0)\">{{::n+1}}</a></li><li ng-class=\"nextPageDisabled()\"><a href ng-click=\"nextPage()\">下一页</a></li></ul></nav></div><!--<div class=\"col-xs-3\">--><!--<span class=\"label count\">{{count}} <span>条</span></span>--><!--</div>--></div>");}]);
(function () {
    angular
        .module('template/treeGrid/treeGrid.html', [])
        .run([
            '$templateCache',
            function ($templateCache) {
                $templateCache.put('template/treeGrid/treeGrid.html',
                    "<div class=\"table-responsive\">\n" +
                    " <table class=\"table tree-grid\">\n" +
                    "   <thead>\n" +
                    "     <tr>\n" +
                    "       <th><a abc='dddd' ng-if=\"expandingProperty.sortable\" ng-click=\"sortBy(expandingProperty)\">{{expandingProperty.displayName || expandingProperty.field || expandingProperty}}</a><span ng-if=\"!expandingProperty.sortable\">{{expandingProperty.displayName || expandingProperty.field || expandingProperty}}</span><i ng-if=\"expandingProperty.sorted\" class=\"{{expandingProperty.sortingIcon}} pull-right\"></i></th>\n" +
                    "       <th ng-repeat=\"col in colDefinitions\"><a ng-if=\"col.sortable\" ng-click=\"sortBy(col)\">{{col.displayName || col.field}}</a><span ng-if=\"!col.sortable\">{{col.displayName || col.field}}</span><i ng-if=\"col.sorted\" class=\"{{col.sortingIcon}} pull-right\"></i></th>\n" +
                    "     </tr>\n" +
                    "   </thead>\n" +
                    "   <tbody>\n" +
                    "     <tr ng-repeat=\"row in tree_rows | searchFor:$parent.filterString:expandingProperty:colDefinitions track by row.branch.uid\"\n" +
                    "       ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\">\n" +
                    "       <td><a ng-click=\"user_clicks_branch(row.branch)\">" +

                    "           <i ng-class=\"row.tree_icon\"\n" +
                    "              ng-click=\"row.branch.expanded = !row.branch.expanded\"\n" +
                    "              class=\"indented tree-icon\"></i>"+

                    "           </a><span class=\"indented tree-label\" ng-click=\"on_user_click(row.branch)\">\n" +
                    "             {{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}</span>\n" +
                    "       </td>\n" +
                    "       <td ng-repeat=\"col in colDefinitions\">\n" +
                    "         <div ng-if=\"col.cellTemplate\" compile=\"col.cellTemplate\" cell-template-scope=\"col.cellTemplateScope\"></div>\n" +
                    "         <div ng-if=\"!col.cellTemplate\">{{row.branch[col.field]}}</div>\n" +
                    "       </td>\n" +
                    "     </tr>\n" +
                    "   </tbody>\n" +
                    " </table>\n" +
                    "</div>\n" +
                    "");
            }]);



    angular
        .module('treeGrid', [
            'template/treeGrid/treeGrid.html'
        ])

        .directive('compile', [
            '$compile',
            function ($compile) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);

                        // Watch for changes to expression.
                        scope.$watch(attrs.compile, function (new_val) {
                            /*
                             * Compile creates a linking function
                             * that can be used with any scope.
                             */
                            var link = $compile(new_val);

                            /*
                             * Executing the linking function
                             * creates a new element.
                             */
                            var new_elem = link(scope);

                            // Which we can then append to our DOM element.
                            element.append(new_elem);
                        });
                    }
                };
            }])

        .directive('treeGrid', [
            '$timeout',
            'treegridTemplate',
            function ($timeout,
                      treegridTemplate) {

                return {
                    restrict: 'E',
                    templateUrl: function (tElement, tAttrs) {
                        return tAttrs.templateUrl || treegridTemplate.getPath();
                    },
                    replace: true,
                    scope: {
                        treeData: '=',
                        colDefs: '=',
                        expandOn: '=',
                        onSelect: '&',
                        onClick: '&',
                        initialSelection: '@',
                        treeControl: '='
                    },
                    link: function (scope, element, attrs) {
                        var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

                        error = function (s) {
                            console.log('ERROR:' + s);
                            debugger;
                            return void 0;
                        };

                        attrs.iconExpand = attrs.iconExpand ? attrs.iconExpand : 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
                        attrs.iconCollapse = attrs.iconCollapse ? attrs.iconCollapse : 'icon-minus glyphicon glyphicon-minus fa fa-minus';
                        attrs.iconLeaf = attrs.iconLeaf ? attrs.iconLeaf : 'icon-file  glyphicon glyphicon-file  fa fa-file';
                        attrs.sortedAsc = attrs.sortedAsc ? attrs.sortedAsc : 'icon-file  glyphicon glyphicon-chevron-up  fa angle-up';
                        attrs.sortedDesc = attrs.sortedDesc ? attrs.sortedDesc : 'icon-file  glyphicon glyphicon-chevron-down  fa angle-down';
                        attrs.expandLevel = attrs.expandLevel ? attrs.expandLevel : '3';
                        expand_level = parseInt(attrs.expandLevel, 10);


                        if (!scope.treeData) {
                            alert('No data was defined for the tree, please define treeData!');
                            return;
                        }

                        var getExpandingProperty = function getExpandingProperty() {
                            if (attrs.expandOn) {
                                expandingProperty = scope.expandOn;
                                scope.expandingProperty = scope.expandOn;
                            } else {
                                if (scope.treeData.length) {
                                    var _firstRow = scope.treeData[0],
                                        _keys = Object.keys(_firstRow);
                                    for (var i = 0, len = _keys.length; i < len; i++) {
                                        if (typeof (_firstRow[_keys[i]]) === 'string') {
                                            expandingProperty = _keys[i];
                                            break;
                                        }
                                    }
                                    if (!expandingProperty) expandingProperty = _keys[0];
                                    scope.expandingProperty = expandingProperty;
                                }
                            }
                        };

                        getExpandingProperty();

                        if (!attrs.colDefs) {
                            if (scope.treeData.length) {
                                var _col_defs = [],
                                    _firstRow = scope.treeData[0],
                                    _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];

                                for (var idx in _firstRow) {
                                    if (_unwantedColumn.indexOf(idx) === -1) {
                                        _col_defs.push({
                                            field: idx
                                        });
                                    }
                                }
                                scope.colDefinitions = _col_defs;
                            }
                        } else {
                            scope.colDefinitions = scope.colDefs;
                        }

                        for_each_branch = function (f) {
                            var do_f, root_branch, _i, _len, _ref, _results;
                            do_f = function (branch, level) {
                                var child, _i, _len, _ref, _results;
                                f(branch, level);
                                if (branch.children != null) {
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(do_f(root_branch, 1));
                            }
                            return _results;
                        };
                        selected_branch = null;
                        select_branch = function (branch) {

                            if (!branch) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                selected_branch = null;
                                return;
                            }
                            if (branch !== selected_branch) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                branch.selected = true;
                                selected_branch = branch;
                                expand_all_parents(branch);
                                if (branch.onSelect != null) {
                                    return $timeout(function () {
                                        return branch.onSelect(branch);
                                    });
                                } else {
                                    if (scope.onSelect != null) {
                                        return $timeout(function () {
                                            return scope.onSelect({
                                                branch: branch
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        scope.on_user_click = function (branch) {
                            if (scope.onClick) {
                                scope.onClick({
                                    branch: branch
                                });
                            }
                        };
                        scope.user_clicks_branch = function (branch) {
                            if (branch !== selected_branch) {
                                return select_branch(branch);
                            }
                        };

                        /* sorting methods */
                        scope.sortBy = function (col) {
                            if (col.sortDirection === "asc") {
                                sort_recursive(scope.treeData, col, true);
                                col.sortDirection = "desc";
                                col.sortingIcon = attrs.sortedDesc;
                            } else {
                                sort_recursive(scope.treeData, col, false);
                                col.sortDirection = "asc";
                                col.sortingIcon = attrs.sortedAsc;
                            }
                            col.sorted = true;
                            resetSorting(col);
                        };

                        var sort_recursive = function (elements, col, descending) {
                            elements.sort(sort_by(col, descending));
                            for (var i = 0; i < elements.length; i++) {
                                sort_recursive(elements[i].children, col, descending);
                            }
                        };

                        var sort_by = function (col, descending) {

                            var direction = !descending ? 1 : -1;

                            if (col.sortingType === "custom" && typeof col.sortingFunc === "function") {
                                return function (a, b) {
                                    return col.sortingFunc(a, b) * direction;
                                };
                            }

                            var key = function (x) {
                                return (x[col.field] === null ? "" : x[col.field].toLowerCase());
                            };

                            switch (col.sortingType) {
                                case "number":
                                    key = function (x) {
                                        return parseFloat(x[col.field]);
                                    };
                                    break;
                                case "date":
                                    key = function (x) {
                                        return new Date(x[col.field]);
                                    };
                                    break;
                            }

                            return function (a, b) {
                                return a = key(a), b = key(b), direction * ((a > b) - (b > a));
                            };
                        }

                        var resetSorting = function (sortedCol) {
                            var arraySize = scope.colDefinitions.length;
                            for (var i = 0; i < arraySize; i++) {
                                var col = scope.colDefinitions[i];
                                if (col.field != sortedCol.field) {
                                    col.sorted = false;
                                    col.sortDirection = "none";
                                }
                            }
                        }

                        /* end of sorting methods */

                        get_parent = function (child) {
                            var parent;
                            parent = void 0;
                            if (child.parent_uid) {
                                for_each_branch(function (b) {
                                    if (b.uid === child.parent_uid) {
                                        return parent = b;
                                    }
                                });
                            }
                            return parent;
                        };
                        for_all_ancestors = function (child, fn) {
                            var parent;
                            parent = get_parent(child);
                            if (parent != null) {
                                fn(parent);
                                return for_all_ancestors(parent, fn);
                            }
                        };
                        expand_all_parents = function (child) {
                            return for_all_ancestors(child, function (b) {
                                return b.expanded = true;
                            });
                        };

                        scope.tree_rows = [];

                        on_treeData_change = function () {
                            getExpandingProperty();

                            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                            for_each_branch(function (b, level) {
                                if (!b.uid) {
                                    return b.uid = "" + Math.random();
                                }
                            });
                            for_each_branch(function (b) {
                                var child, _i, _len, _ref, _results;
                                if (angular.isArray(b.children)) {
                                    _ref = b.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(child.parent_uid = b.uid);
                                    }
                                    return _results;
                                }
                            });
                            scope.tree_rows = [];
                            for_each_branch(function (branch) {
                                var child, f;
                                if (branch.children) {
                                    if (branch.children.length > 0) {
                                        f = function (e) {
                                            if (typeof e === 'string') {
                                                return {
                                                    label: e,
                                                    children: []
                                                };
                                            } else {
                                                return e;
                                            }
                                        };
                                        return branch.children = (function () {
                                            var _i, _len, _ref, _results;
                                            _ref = branch.children;
                                            _results = [];
                                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                                child = _ref[_i];
                                                _results.push(f(child));
                                            }
                                            return _results;
                                        })();
                                    }
                                } else {
                                    return branch.children = [];
                                }
                            });
                            add_branch_to_list = function (level, branch, visible) {
                                var child, child_visible, tree_icon, _i, _len, _ref, _results;


                                //if(branch.type=="bumen"){
                                //    tree_icon ="glyphicon glyphicon-tasks"
                                //    console.log("bumen")
                                //}
                                //


                             

                                if (branch.expanded == null) {
                                    branch.expanded = false;
                                }


                                //获取数据类型
                                var type=branch.type


                                //如果是人显示头像
                                if(type=='person'){

                                    if (!branch.children || branch.children.length===0) {
                                        tree_icon="glyphicon glyphicon-user"
                                        //tree_icon = '';
                                        //console.log("person chidren 不存在")
                                    }
                                    
                                }else if(type=="department"){ //如果不是人显示默认图标

                                    if (!branch.children || branch.children.length===0) {
                                        tree_icon = attrs.iconLeaf;
                                        //console.log("department chidren 不存在")
                                    }else{
                                            if (branch.expanded) {
                                                tree_icon = attrs.iconCollapse;
                                            } else {
                                                tree_icon = attrs.iconExpand;

                                            }
                                    }
                                }




                                //if (!branch.children || branch.children.length===0) {
                                //    tree_icon = attrs.iconLeaf;
                                //
                                //}else{
                                //    if (branch.expanded) {
                                //        tree_icon = attrs.iconCollapse;
                                //    } else {
                                //        tree_icon = attrs.iconExpand;
                                //
                                //    }
                                //}



                                branch.level = level;
                                scope.tree_rows.push({
                                    level: level,
                                    branch: branch,
                                    label: branch[expandingProperty],
                                    tree_icon: tree_icon,
                                    visible: visible
                                });
                                if (branch.children != null) {
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        child_visible = visible && branch.expanded;
                                        _results.push(add_branch_to_list(level + 1, child, child_visible));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(add_branch_to_list(1, root_branch, true));
                            }
                            return _results;
                        };

                        scope.$watch('treeData', on_treeData_change, true);

                        if (attrs.initialSelection != null) {
                            for_each_branch(function (b) {
                                if (b.label === attrs.initialSelection) {
                                    return $timeout(function () {
                                        return select_branch(b);
                                    });
                                }
                            });
                        }
                        n = scope.treeData.length;
                        for_each_branch(function (b, level) {
                            b.level = level;
                            return b.expanded = b.level < expand_level;
                        });
                        if (scope.treeControl != null) {
                            if (angular.isObject(scope.treeControl)) {
                                tree = scope.treeControl;
                                tree.expand_all = function () {
                                    return for_each_branch(function (b, level) {
                                        return b.expanded = true;
                                    });
                                };
                                tree.collapse_all = function () {
                                    return for_each_branch(function (b, level) {
                                        return b.expanded = false;
                                    });
                                };
                                tree.get_first_branch = function () {
                                    n = scope.treeData.length;
                                    if (n > 0) {
                                        return scope.treeData[0];
                                    }
                                };
                                tree.select_first_branch = function () {
                                    var b;
                                    b = tree.get_first_branch();
                                    return tree.select_branch(b);
                                };
                                tree.get_selected_branch = function () {
                                    return selected_branch;
                                };
                                tree.get_parent_branch = function (b) {
                                    return get_parent(b);
                                };
                                tree.select_branch = function (b) {
                                    select_branch(b);
                                    return b;
                                };
                                tree.get_children = function (b) {
                                    return b.children;
                                };
                                tree.select_parent_branch = function (b) {
                                    var p;
                                    if (b == null) {
                                        b = tree.get_selected_branch();
                                    }
                                    if (b != null) {
                                        p = tree.get_parent_branch(b);
                                        if (p != null) {
                                            tree.select_branch(p);
                                            return p;
                                        }
                                    }
                                };
                                tree.add_branch = function (parent, new_branch) {
                                    if (parent != null) {
                                        parent.children.push(new_branch);
                                        parent.expanded = true;
                                    } else {
                                        scope.treeData.push(new_branch);
                                    }
                                    return new_branch;
                                };
                                tree.add_root_branch = function (new_branch) {
                                    tree.add_branch(null, new_branch);
                                    return new_branch;
                                };
                                tree.expand_branch = function (b) {
                                    if (b == null) {
                                        b = tree.get_selected_branch();
                                    }
                                    if (b != null) {
                                        b.expanded = true;
                                        return b;
                                    }
                                };
                                tree.collapse_branch = function (b) {
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        b.expanded = false;
                                        return b;
                                    }
                                };
                                tree.get_siblings = function (b) {
                                    var p, siblings;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        p = tree.get_parent_branch(b);
                                        if (p) {
                                            siblings = p.children;
                                        } else {
                                            siblings = scope.treeData;
                                        }
                                        return siblings;
                                    }
                                };
                                tree.get_next_sibling = function (b) {
                                    var i, siblings;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        siblings = tree.get_siblings(b);
                                        n = siblings.length;
                                        i = siblings.indexOf(b);
                                        if (i < n) {
                                            return siblings[i + 1];
                                        }
                                    }
                                };
                                tree.get_prev_sibling = function (b) {
                                    var i, siblings;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    siblings = tree.get_siblings(b);
                                    n = siblings.length;
                                    i = siblings.indexOf(b);
                                    if (i > 0) {
                                        return siblings[i - 1];
                                    }
                                };
                                tree.select_next_sibling = function (b) {
                                    var next;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        next = tree.get_next_sibling(b);
                                        if (next != null) {
                                            return tree.select_branch(next);
                                        }
                                    }
                                };
                                tree.select_prev_sibling = function (b) {
                                    var prev;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        prev = tree.get_prev_sibling(b);
                                        if (prev != null) {
                                            return tree.select_branch(prev);
                                        }
                                    }
                                };
                                tree.get_first_child = function (b) {
                                    var _ref;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                                            return b.children[0];
                                        }
                                    }
                                };
                                tree.get_closest_ancestor_next_sibling = function (b) {
                                    var next, parent;
                                    next = tree.get_next_sibling(b);
                                    if (next != null) {
                                        return next;
                                    } else {
                                        parent = tree.get_parent_branch(b);
                                        return tree.get_closest_ancestor_next_sibling(parent);
                                    }
                                };
                                tree.get_next_branch = function (b) {
                                    var next;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        next = tree.get_first_child(b);
                                        if (next != null) {
                                            return next;
                                        } else {
                                            next = tree.get_closest_ancestor_next_sibling(b);
                                            return next;
                                        }
                                    }
                                };
                                tree.select_next_branch = function (b) {
                                    var next;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        next = tree.get_next_branch(b);
                                        if (next != null) {
                                            tree.select_branch(next);
                                            return next;
                                        }
                                    }
                                };
                                tree.last_descendant = function (b) {
                                    var last_child;
                                    if (b == null) {
                                        debugger;
                                    }
                                    n = b.children.length;
                                    if (n === 0) {
                                        return b;
                                    } else {
                                        last_child = b.children[n - 1];
                                        return tree.last_descendant(last_child);
                                    }
                                };
                                tree.get_prev_branch = function (b) {
                                    var parent, prev_sibling;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        prev_sibling = tree.get_prev_sibling(b);
                                        if (prev_sibling != null) {
                                            return tree.last_descendant(prev_sibling);
                                        } else {
                                            parent = tree.get_parent_branch(b);
                                            return parent;
                                        }
                                    }
                                };
                                return tree.select_prev_branch = function (b) {
                                    var prev;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        prev = tree.get_prev_branch(b);
                                        if (prev != null) {
                                            tree.select_branch(prev);
                                            return prev;
                                        }
                                    }
                                };
                            }
                        }
                    }
                };
            }
        ])

        .provider('treegridTemplate', function () {
            var templatePath = 'template/treeGrid/treeGrid.html';

            this.setPath = function (path) {
                templatePath = path;
            };

            this.$get = function () {
                return {
                    getPath: function () {
                        return templatePath;
                    }
                };
            };
        })

        .filter('searchFor', function () {
            return function (arr, filterString, expandingProperty, colDefinitions) {
                var filtered = [];
                //only apply filter for strings 3 characters long or more
                if (!filterString || filterString.length < 3) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.visible) {
                            filtered.push(item);
                        }
                    }
                } else {
                    var ancestorStack = [];
                    var currentLevel = 0;
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        while (currentLevel >= item.level) {
                            throwAway = ancestorStack.pop();
                            currentLevel--;
                        }
                        ancestorStack.push(item);
                        currentLevel = item.level;
                        if (include(item, filterString, expandingProperty, colDefinitions)) {
                            for (var ancestorIndex = 0; ancestorIndex < ancestorStack.length; ancestorIndex++) {
                                ancestor = ancestorStack[ancestorIndex];
                                if (ancestor.visible) {
                                    filtered.push(ancestor);
                                }
                            }
                            ancestorStack = [];
                        }
                    }
                }
                return filtered;
            };

            function include(item, filterString, expandingProperty, colDefinitions) {
                var includeItem = false;
                var filterApplied = false;
                //first check the expandingProperty
                if (expandingProperty.filterable) {
                    filterApplied = true;
                    if (checkItem(item, filterString, expandingProperty)) {
                        includeItem = true;
                    }
                }
                //then check each of the other columns
                var arraySize = colDefinitions.length;
                for (var i = 0; i < arraySize; i++) {
                    var col = colDefinitions[i];
                    if (col.filterable) {
                        filterApplied = true;
                        if (checkItem(item, filterString, col)) {
                            includeItem = true;
                        }
                    }
                }
                if (filterApplied) {
                    return includeItem;
                } else {
                    return true;
                }
            }

            function checkItem(item, filterString, col) {
                if (col.sortingType === "number") {
                    if (item.branch[col.field] != null
                        && parseFloat(item.branch[col.field]) === parseFloat(filterString)) {
                        return true;
                    }
                } else {
                    if (item.branch[col.field] != null
                        && item.branch[col.field].toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                        return true;
                    }
                }
            }
        });
}).call(window);

angular.module("uiSwitch",[]).directive("switch",function(){return{restrict:"AE",replace:!0,transclude:!0,template:function(n,e){var s="";return s+="<span",s+=' class="switch'+(e.class?" "+e.class:"")+'"',s+=e.ngModel?' ng-click="'+e.disabled+" ? "+e.ngModel+" : "+e.ngModel+"=!"+e.ngModel+(e.ngChange?"; "+e.ngChange+'()"':'"'):"",s+=' ng-class="{ checked:'+e.ngModel+", disabled:"+e.disabled+' }"',s+=">",s+="<small></small>",s+='<input type="checkbox"',s+=e.id?' id="'+e.id+'"':"",s+=e.name?' name="'+e.name+'"':"",s+=e.ngModel?' ng-model="'+e.ngModel+'"':"",s+=' style="display:none" />',s+='<span class="switch-text">',s+=e.on?'<span class="on">'+e.on+"</span>":"",s+=e.off?'<span class="off">'+e.off+"</span>":" ",s+="</span>"}}});
/**
 * Created by liaohui1080 on 16/2/26.  service.js
 */

/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 服务创建页面
 */

var lhFactory = (function () {


    /*
     * http 服务
     * 参数
     * o ={url:"服务器url地址" ,
     * params:{"参数key":"参数val"}这个会追加到 url后面,
     * success:function(){} 成功消息,
     * error:function(){} 失败消息
     * }
     * */
    var http = ["$http", function ($http) {

        var ajax = {

            "get": function (o) {
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {

                    o.success(data, status, headers, config);

                }).error(o.error);

            },
            "post": function (o) {

                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {

                    o.success(data, status, headers, config);

                }).error(o.error);

            }

        };

        return ajax;
    }];



    /*
    * {url:url地址,infoSuccess:成功消息内容,infoError:失败消息内容 ,infoShow:true false 控制是否显示 ,success:成功方法}
    *
    *
    * */
    var ajax = ["$http", 'cfpLoadingBar', 'ngNotify', function ($http, cfpLoadingBar, ngNotify) {

        var ajax = {


            "get": function (o) {
                cfpLoadingBar.start();
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {
                    cfpLoadingBar.complete();

                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            ngNotify.set(infoSuccess, {
                                position: 'top',
                                duration: 1500,
                                type: "success"
                            });
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            ngNotify.set(infoError, {
                                position: 'top',
                                duration: 1500,
                                type: "warn"
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器错误");
                    //console.log(e);
                });
            },
            "post": function (o) {
                cfpLoadingBar.start();
                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {
                    cfpLoadingBar.complete();

                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            ngNotify.set(infoSuccess, {
                                position: 'top',
                                duration: 1500,
                                type: "success"
                            });
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            ngNotify.set(infoError, {
                                position: 'top',
                                duration: 1500,
                                type: "warn"
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器错误");
                    //console.log(e);
                });
            }
        };

        return ajax;
    }];

    return {
        http: http,
        ajax: ajax

    };

})();



/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 过滤器创建页面
 */

var lhFilter=(function(){



    //分页过滤器
    var pageStart=[function () {
        return function(input, start) {
            start = +start;

            if (input){
                return input.slice(start);
            }

        }

    }];


    // Y , N 转汉字
    var YNtoHanzi=[function () {
        return function(input, str) {

            if(input=='Y'){
                str="启用"
            }
            if(input=='N'){
                str="禁用"
            }

            return str

        }

    }];


    // Y , N 在线离线
    var YNtoZaixian=[function () {
        return function(input, str) {

            if(input=='Y'){
                str="在线"
            }
            if(input=='N'){
                str="离线"
            }

            return str

        }

    }];

    //ui-select菜单必须用到的
    var uiSelectPropsFilter=[function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }];


    return {
        uiSelectPropsFilter:uiSelectPropsFilter,
        YNtoHanzi:YNtoHanzi,
        YNtoZaixian:YNtoZaixian,
        pageStart:pageStart
    };

})();







