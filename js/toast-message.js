
// toastMessage
// ver. 1.0
// LuPa Bytes
// 07/2018

// usage
//
// at main page html body:
// <script type="text/javascript" src="js/jquery.js"></script>
// <script type="text/javascript" src="js/toast-message.js"></script>
//
// copy image files to image folder
// toast-close.png
// toast-paperclip.png
//
// at main page javascript:
// var myToast = new toastMessage();
// myToast.start(params);
//
// everywere:
// myToast.showInfo("Hello world !");

// params
//  {
//      msg: (string) default = ''
//      type: (error, warning, success, info) default = 'info'
//      time: (int miliseconds) default = 10000 milsec
//      autoclose: (boolean) default = true
//      imagePath: (string) default = '/img',
//      errorColor: (string) default = '#ff0000',
//      warningColor: (string) default = '#ff6600',
//      successColor: (string) default = '#009933',
//      infoColor: (string) default = '#0066ff',
//      percentSize: (int window percent) default = 30
//      parentJQuerySelector: (string) default = '.container'
//      fontFamily: (string any valid font name) default = 'verdana',
//      fontWeight: (normal, bold, bolder, lighter, number, initial, inherit) default = 'bold',
//      fontSize: (string any valid pixel value) default = '12px',
//      fontColor: (string) default = '#cccccc'
//      messagePosition: (string topright, topleft, bottomright, bottomleft) default = 'topright'
//      borderColor: (string) default = #1a1a1a
//      opacity: (int percent) default = 85
//      fadeSpeed: (int miliseconds) - default = 500
//  }

// toastObj
//  {
//      key: (string) default = null
//      startTime: (datetime) default = now
//      time: (int miliseconds) default = defaults.time
//      autoclose: (boolean) default = defaults.autoclose
//      jqObj: (jquery obj) default = null
//      params: (params obj) default = this.defaults
//  }

'use strict';

var toastMessage = function (params) {  
    // vars
    this.$toastContainer = null;
    this.toastObjs = [];
    this.timer = null;
    this.defaults = {
        msg: '',
        type: 'info',
        time: 10000,
        autoclose: true,
        imagePath: '/img',
        errorColor: '#ff0000',
        warningColor: '#ff6600',
        successColor: '#009933',
        infoColor: '#0066ff',
        percentSize: 30,
        parentJQuerySelector: '.container',
        fontFamily: 'verdana',
        fontWeight: 'bold',
        fontSize: '12px',
        fontColor: '#cccccc',
        messagePosition: 'topright' ,
        borderColor: '#1a1a1a',
        opacity: 85,
        fadeSpeed: 500
    };

    //----------------- config

    // configure parameters using defaults for not passed properties
    // params - params obj
    // return a parameters obj fully loaded
    this.paramsManager = function (params) {
        var result = {};
        result.msg = params && params.msg ? params.msg : this.defaults.msg;
        result.type = params && params.type && (params.type === 'error' || params.type === 'warning' || params.type === 'success' || params.type === 'info') ? params.type : this.defaults.type;
        result.time = params && params.time && typeof(params.time) === 'number' ? params.time : this.defaults.time;
        result.autoclose = params && params.autoclose !== 'undefined' && typeof(params.autoclose) === 'boolean' ? params.autoclose : this.defaults.autoclose;
        result.imagePath = params && params.imagePath ? params.imagePath : this.defaults.imagePath;
        result.errorColor = params && params.errorColor ? params.errorColor : this.defaults.errorColor;
        result.warningColor = params && params.warningColor ? params.warningColor : this.defaults.warningColor;
        result.successColor = params && params.successColor ? params.successColor : this.defaults.successColor;
        result.infoColor = params && params.infoColor ? params.infoColor : this.defaults.infoColor;
        result.percentSize = params && params.percentSize && typeof(params.percentSize) === 'number' && params.percentSize < 101 ? params.percentSize : this.defaults.percentSize;
        result.parentJQuerySelector = params && params.parentJQuerySelector ? params.parentJQuerySelector : this.defaults.parentJQuerySelector;
        result.fontFamily = params && params.fontFamily ? params.fontFamily : this.defaults.fontFamily;
        result.fontWeight = params && params.fontWeight ? params.fontWeight : this.defaults.fontWeight;
        result.fontSize = params && params.fontSize ? params.fontSize : this.defaults.fontSize;
        result.fontColor = params && params.fontColor ? params.fontColor : this.defaults.fontColor;
        result.messagePosition = params && params.messagePosition && (params.messagePosition === 'topright' || params.messagePosition === 'bottomright' || params.messagePosition === 'topleft' || params.messagePosition === 'bottomleft') ? params.messagePosition : this.defaults.messagePosition; 
        result.borderColor = params && params.borderColor ? params.borderColor : this.defaults.borderColor;
        result.opacity = params && params.opacity && typeof(params.opacity) === 'number' && params.opacity < 101 ? params.opacity : this.defaults.opacity;
        result.fadeSpeed = params && params.fadeSpeed && typeof(params.fadeSpeed) === 'number' ? params.fadeSpeed : this.defaults.fadeSpeed;
        return result;
    };

    // configure defaults
    // params - params obj
    this.configDefaults = function (params) {
        if (params) {
            this.defaults = this.paramsManager(params);
        }
    };

    // reconfigure defaults
    // params - params obj
    this.config = function (params) {
        this.removeToastContainer();
        this.configDefaults(params);
        this.toastContainerFactory();
    };

    // remove toast container
    this.removeToastContainer = function () {  
        this.$toastContainer.remove();
        this.$toastContainer = null;
    };

    //----------------- toast objs

    // build an toastObj
    this.ToastObj = function (key = null, startTime = new Date(), time = this.defaults.time, autoclose = this.defaults.autoclose, jqObj = null, params = this.defaults) {  
        return {
            key: key,
            startTime : startTime,
            time: time,
            autoclose: autoclose,
            jqObj: jqObj,
            params: params
        };
    };    

    // get an toast obj from this.toastObjs
    // toastKey - unique id 
    // self - context
    this.getToastObj = function (toastKey, self) {  
        var result = null;
        self.toastObjs.forEach(function (obj) {
            if (obj.key === toastKey) {
                result = obj;
            }
        });
        return result;
    };

    // remove an element from this.toastObjs array
    // toastKey - unique id
    // self - context
    this.removeToastObj = function (toastKey, self) { 
        var result = []; 
        self.toastObjs.forEach(function (obj) {
            if (obj.key !== toastKey) {
                result.push(obj);
            }
        });
        self.toastObjs = result;
    };

    // toogle autoclose of an element from this.toastObjs array
    // toastKey - unique id
    // self - context
    this.toggleAutoclose = function (toastKey, self) {
        self.toastObjs.forEach(function (obj) {
            if (obj.key === toastKey) {
                obj.autoclose = obj.autoclose ? false : true;
            }
        });
    };

    // remove timer
    // self - context
    this.removeTimer = function (self) {  
        clearInterval(self.timer);
        self.timer = null;
    };

    // check for toasts to close
    // self - context
    this.checkToasts = function (self) {
        if (self.toastObjs.length > 0) {
            self.toastObjs.forEach(function (obj) {
                if (obj.autoclose && (Math.abs(new Date() - obj.startTime) >= obj.time)) {
                    self.toastCloseBtnClick(obj.key, self);
                }
            });
        } else {
            self.removeTimer(self);
        }
    };

    //----------------- css

    // add css to toast container
    this.toastContainerCss = function () {  
        var messagePosition = this.defaults.messagePosition;
        var size = (window.innerWidth / 100) * this.defaults.percentSize;
        var positionProp = messagePosition === 'topright' || messagePosition === 'topleft' ? 'top' : 'bottom';
        var sideProp = messagePosition === 'topright' || messagePosition === 'bottomright' ? 'left' : 'right';
        var sideDistance = 100 - this.defaults.percentSize;
        this.$toastContainer
            .css('position', 'fixed')    
            .css(positionProp, '0')
            .css(sideProp, sideDistance + '%')
            .css('width', String(size))
            .css('height', 'auto')
            .css('z-index', '999999')
            .css('padding', '10px');
    };

    // apply toast msg css
    // $elem - jquery toast msg reference
    this.toastMsgCss = function ($elem) {  
        $elem.css('margin', '10px');
    };

    // apply toast pin btn css if autoclose is true
    // $elem - jquery toast pin btn reference
    this.toastPinAutoCloseBtnCss = function ($elem) {  
        $elem
            .removeAttr('style')
            .css('position', 'relative')    
            .css('width', '16px')
            .css('height', 'auto')
            .css('margin-top', '5px')
            .css('margin-left', '10px')
            .css('left', '0');
    };

    // apply toast pin btn css if autoclose is true
    // $elem - jquery toast pin btn reference
    this.toastPinFixedBtnCss = function ($elem) {  
        $elem
            .removeAttr('style')
            .css('position', 'relative')    
            .css('width', '22px')
            .css('height', 'auto')
            .css('top', '-8px')
            .css('left', '0')
            .css('transform', 'rotate(135deg)')
            .css('-ms-transform', 'rotate(135deg)')
            .css('-moz-transform', 'rotate(135deg)')
            .css('-webkit-transform', 'rotate(135deg)')
            .css('-o-transform', 'rotate(135deg)');
    };

    // apply toast pin btn css based on autoclose value
    // $elem - jquery toast pin btn reference
    // autoclose - autoclose value (true, false)
    this.toastPinBtnStateCss = function ($elem, autoclose) {  
        if (autoclose) {
            this.toastPinAutoCloseBtnCss($elem);
        } else {
            this.toastPinFixedBtnCss($elem);
        }
    };

    // apply toast close btn css
    // $elem - jquery toast close btn reference
    this.toastCloseBtnCss = function ($elem) {  
        $elem
            .css('position', 'absolute')
            .css('width', '12px')
            .css('height', 'auto')
            .css('margin-top', '5px')
            .css('margin-right', '10px')
            .css('right', '0');
    };

    // apply toast css
    // $elem - jquery toast reference
    // params - params obj
    this.toastCss = function ($elem, params) {  
        $elem
            .css('display', 'none')
            .css('opacity', String(params.opacity / 100))
            .css('filter', 'alpha(opacity=' + String(params.opacity) +')')
            .css('padding', '5px')
            .css('margin', '10px')
            .css('position', 'relative')
            .css('height', 'auto')
            .css('width', '96%')
            .css('border', '1px solid ' + params.borderColor)
            .css('border-radius', '5px')
            .css('-moz-border-radius', '5px')
            .css('-webkit-border-radius', '5px')
            .css('-webkit-box-shadow', '0px 0px 4px 2px #595959')
            .css('-moz-box-shadow', '0px 0px 4px 2px #595959')
            .css('box-shadow', '0px 0px 4px 2px #595959')
            .css('font-family', params.fontFamily)
            .css('font-size', params.fontSize)
            .css('font-weight', params.fontWeight)
            .css('color', params.fontColor)
            .css('background', params.type === 'success' ? params.successColor : (params.type === 'error' ? params.errorColor : ( params.type === 'warning' ? params.warningColor : params.infoColor)));
    };

    // apply css to all toast elements
    // params - params obj
    // toastKey - unique id 
    this.toastCssManager = function (params, toastKey) {  
        this.toastCss($('#toast' + toastKey), params);
        this.toastPinBtnStateCss($('#toastPinBtn' + toastKey), params.autoclose);
        this.toastCloseBtnCss($('#toastCloseBtn' + toastKey));
        this.toastMsgCss($('#toastMsg' + toastKey));
    };

    //----------------- html factory's

    // load container for toast's
    this.toastContainerFactory = function () {
        $(this.defaults.parentJQuerySelector).append('<div id="toastContainer"></div>');
        this.$toastContainer = $('#toastContainer');
        this.toastContainerCss();
    };

    // build html for toast close and pin buttons
    // params - params obj
    // toastKey - unique id 
    this.toastBtnHtmlFactory = function (params, toastKey) {  
        var html = '';
        html += '<div>';
        html += '   <img id="toastPinBtn' + toastKey + '" key="' + toastKey + '" src="' + params.imagePath + '/toast-paperclip.png" />';
        html += '   <img id="toastCloseBtn' + toastKey + '" key="' + toastKey + '" src="' + params.imagePath + '/toast-close.png" />';
        html += '</div>';
        return html;
    };

    // build html for toast
    // params - params obj
    // toastKey - unique id 
    this.toastHtmlFactory = function (params, toastKey) {
        var html = '';
        html += '<div id="toast' + toastKey + '" key="' + toastKey + '">';
        html +=     this.toastBtnHtmlFactory(params, toastKey);
        html += '   <div id="toastMsg' + toastKey + '" key="' + toastKey + '"></div>';
        html += '</div>';
        return html;
    };

    //----------------- events

    // handles close toast btn click
    // toastKey - unique id 
    // self - context 
    this.toastCloseBtnClick = function (toastKey, self) {  
        var toast = self.getToastObj(toastKey, self);
        self.removeToastObj(toastKey, self);
        if (toast && toast !== null) {
            toast.jqObj.fadeOut(toast.params.fadeSpeed, function () {  
                $(this).remove();
            });
        }
    };

    // handles pin toast btn click
    // $toastPinBtn - jquery toast pin btn reference 
    // self - context 
    this.toastPinBtnClick = function ($toastPinBtn, self) {
        var toastKey = $toastPinBtn.attr('key');  
        self.toggleAutoclose(toastKey, self);
        var toastObj = self.getToastObj(toastKey, self);
        if (toastObj && toastObj !== null) {
            self.toastPinBtnStateCss($toastPinBtn, toastObj.autoclose);
        }
    };

    // bind btn events
    // toastKey - unique id 
    this.bindToastEvents = function (toastKey) {  
        var self = this;
        $('#toastPinBtn' + toastKey).on('mouseover', function (ev) { 
            $('#' + this.id).css('cursor', 'pointer');
        });
        $('#toastPinBtn' + toastKey).on('click', function (ev) { 
            self.toastPinBtnClick($('#' + this.id), self);
        });
        $('#toastCloseBtn' + toastKey).on('mouseover', function (ev) { 
            $('#' + this.id).css('cursor', 'pointer');
        });
        $('#toastCloseBtn' + toastKey).on('click', function (ev) { 
            self.toastCloseBtnClick($('#' + this.id).attr('key'), self);
        });
    };

    // when window resize, remove and rebuild messages
    // self - context
    this.windowResize = function (self) {
        self.removeTimer(self);
        var oldToastObjs = JSON.parse(JSON.stringify(self.toastObjs));
        self.toastObjs = [];
        self.removeToastContainer();
        self.toastContainerFactory();
        self.rebuildToasts(oldToastObjs, self);
    };

    // bind window events
    this.bindWindowEvents = function () {  
        var self = this;
        $(window).resize(function () { 
            self.windowResize(self);
        });
    };

    //----------------- wrappers

    // show an autoclose error msg
    // msg - massage to show
    this.showError = function (msg) {  
        this.show({
            msg: msg, 
            type: 'error', 
            autoclose: true
        });
    };

    // show an fixed error msg
    // msg - massage to show
    this.showFixedError = function (msg) {  
        this.show({
            msg: msg, 
            type: 'error', 
            autoclose: false
        });
    };

    // show an autoclose warning msg
    // msg - massage to show
    this.showWarning = function (msg) {  
        this.show({
            msg: msg,
            type: 'warning', 
            autoclose: true
        });
    };

    // show an fixed warning msg
    // msg - massage to show
    this.showFixedWarning = function (msg) {  
        this.show({
            msg: msg,
            type: 'warning', 
            autoclose: false
        });
    };

    // show an autoclose success msg
    // msg - massage to show
    this.showSuccess = function (msg) {  
        this.show({
            msg: msg,
            type: 'success', 
            autoclose: true
        });
    };

    // show an fixed success msg
    // msg - massage to show
    this.showFixedSuccess = function (msg) {  
        this.show({
            msg: msg,
            type: 'success', 
            autoclose: false
        });
    };

    // show an autoclose info msg
    // msg - massage to show
    this.showInfo = function (msg) {  
        this.show({
            msg: msg,
            type: 'info', 
            autoclose: true
        });
    };

    // show an fixed info msg
    // msg - massage to show
    this.showFixedInfo = function (msg) {  
        this.show({
            msg: msg,
            type: 'info', 
            autoclose: false
        });
    };

    //----------------- core

    // initialize checking for toasts to close
    this.startCheckToasts = function () {
        var self = this;  
        this.timer = setInterval(function () {  
            self.checkToasts(self);
        }, 1000);
    };

    // create a new toast and append to container
    // self - contex
    // params - params obj
    // obj - if != null is a rebuild
    this.toastManager = function (self, params, obj = null) {  
        var toastKey = String(Math.random()).substring(2);
        if (obj !== null) {
            obj.params.autoclose = obj.autoclose;
        }
        self.$toastContainer.append(self.toastHtmlFactory((obj === null ? params : obj.params), toastKey));
        var $toast = $('#toast' + toastKey);
        self.toastCssManager((obj === null ? params : obj.params), toastKey);
        self.bindToastEvents(toastKey);
        $('#toastMsg' + toastKey).text(params.msg);
        self.toastObjs.push(new self.ToastObj(
            toastKey, 
            (obj === null ? new Date() : new Date(obj.startTime)), 
            params.time, 
            (obj === null ? params.autoclose : obj.autoclose), 
            $toast, 
            (obj === null ? params : obj.params)));
        $toast.fadeIn(params.fadeSpeed);
        if (self.timer === null) {
            self.startCheckToasts();
        }
    };

    // rebuild active toasts (after window resize)
    // oldToastObjs - toast objs array
    this.rebuildToasts = function (oldToastObjs, self) {  
        if (oldToastObjs.length > 0) {
            oldToastObjs.forEach(function (obj) { 
                self.toastManager(self, obj.params, obj);
            });
        }
    };

    // show a toast
    // params - params for toast
    this.show = function (params) {
        params = this.paramsManager(params);
        this.toastManager(this, params);
    };

    // start coftoast 
    // params - params to configure coftoast
    this.start = function (params) {
        this.configDefaults(params);
        this.bindWindowEvents();
        this.toastContainerFactory();
    };

};