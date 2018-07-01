


$(function () {  
   
    var myToast = null;

    // get input params
    var getParams = function () {
        var params = {
            msg: $('#msgInput').val(),
            type: $('#typeInput').val(),
            time: Number($('#timeInput').val()),
            autoclose: $('#autocloseInput').val() === "" ? null : ($('#autocloseInput').val() === true ? true : false), 
            imagePath: $('#imagePathInput').val(),
            errorColor: $('#errorColorInput').val(),
            warningColor: $('#warningColorInput').val(),
            successColor: $('#successColorInput').val(),
            infoColor: $('#infoColorInput').val(),
            percentSize: Number($('#percentSizeInput').val()),
            parentJQuerySelector: $('#parentJQuerySelectorInput').val(),
            fontFamily: $('#fontFamilyInput').val(),
            fontWeight: $('#fontWeightInput').val(),
            fontSize: $('#fontSizeInput').val(),
            fontColor: $('#fontColorInput').val(),
            messagePosition: $('#messagePositionInput').val(),
            borderColor: $('#borderColorInput').val(),
            opacity: Number($('#opacityInput').val()),
            fadeSpeed: Number($('#fadeSpeedInput').val())
        };
        return params;
    };

    // set default values in the view
    var setDefaultParams = function () {
        $('#msgDefault').text(myToast.defaults.msg);
        $('#typeDefault').text(myToast.defaults.type);
        $('#timeDefault').text(myToast.defaults.time);
        $('#autocloseDefault').text(myToast.defaults.autoclose);
        $('#imagePathDefault').text(myToast.defaults.imagePath);
        $('#errorColorDefault').text(myToast.defaults.errorColor);
        $('#warningColorDefault').text(myToast.defaults.warningColor);
        $('#successColorDefault').text(myToast.defaults.successColor);
        $('#infoColorDefault').text(myToast.defaults.infoColor);
        $('#percentSizeDefault').text(myToast.defaults.percentSize);
        $('#parentJQuerySelectorDefault').text(myToast.defaults.parentJQuerySelector);
        $('#fontFamilyDefault').text(myToast.defaults.fontFamily);
        $('#fontWeightDefault').text(myToast.defaults.fontWeight);
        $('#fontSizeDefault').text(myToast.defaults.fontSize);
        $('#fontColorDefault').text(myToast.defaults.fontColor);
        $('#messagePositionDefault').text(myToast.defaults.messagePosition);
        $('#borderColorDefault').text(myToast.defaults.borderColor);
        $('#opacityDefault').text(myToast.defaults.opacity);
        $('#fadeSpeedDefault').text(myToast.defaults.fadeSpeed);
    };

    // clear imput params in the view
    var clearViewInputParamsClick = function (param) {  
        $('#msgInput').val("");
        $('#typeInput').val("");
        $('#timeInput').val("");
        $('#autocloseInput').val("");
        $('#imagePathInput').val("");
        $('#errorColorInput').val("");
        $('#warningColorInput').val("");
        $('#successColorInput').val("");
        $('#infoColorInput').val("");
        $('#percentSizeInput').val("");
        $('#parentJQuerySelectorInput').val("");
        $('#fontFamilyInput').val("");
        $('#fontWeightInput').val("");
        $('#fontSizeInput').val("");
        $('#fontColorInput').val("");
        $('#messagePositionInput').val("");
        $('#borderColorInput').val("");
        $('#opacityInput').val("");
        $('#fadeSpeedInput').val("");
    };

    // handle showMessageBtn Click
    var showMessageBtnClick = function () {  
        myToast.show(getParams());
    };

    // handle configMessageBtn Click 
    var configMessageBtnClick = function () {  
        myToast.config(getParams());
        setDefaultParams();
        myToast.showSuccess('Toast Message foi configurado com sucesso.');
    };

    // bind events
    var bindEvents = function () {  
        $('#msgErroBtn').on('click', function () {  
            myToast.showError('Esta é uma mensagem de erro que se fecha sem a intervenção do utilizador.');
        });
        $('#msgAvisoBtn').on('click', function () {  
            myToast.showWarning('Esta é uma mensagem de aviso que se fecha sem a intervenção do utilizador.');
        });
        $('#msgSucessoBtn').on('click', function () {  
            myToast.showSuccess('Esta é uma mensagem de sucesso que se fecha sem a intervenção do utilizador.');
        });
        $('#msgInfoBtn').on('click', function () {  
            myToast.showInfo('Esta é uma mensagem de informação que se fecha sem a intervenção do utilizador.');
        });
        $('#showErrorMsgBtn').on('click', function () {  
            myToast.showError($('#showErrorMsg').val());
        });
        $('#showWarningMsgBtn').on('click', function () {  
            myToast.showWarning($('#showWarningMsg').val());
        });
        $('#showSuccessMsgBtn').on('click', function () {  
            myToast.showSuccess($('#showSuccessMsg').val());
        });
        $('#showInfoMsgBtn').on('click', function () {  
            myToast.showInfo($('#showInfoMsg').val());
        });
        $('#showFixedErrorMsgBtn').on('click', function () {  
            myToast.showFixedError($('#showFixedErrorMsg').val());
        });
        $('#showFixedWarningMsgBtn').on('click', function () {  
            myToast.showFixedWarning($('#showFixedWarningMsg').val());
        });
        $('#showFixedSuccessMsgBtn').on('click', function () {  
            myToast.showFixedSuccess($('#showFixedSuccessMsg').val());
        });
        $('#showFixedInfoMsgBtn').on('click', function () {  
            myToast.showFixedInfo($('#showFixedInfoMsg').val());
        });
        $('#configMsgBtn').on('click', function () {  
            configMessageBtnClick();
        });
        $('#showMsgBtn').on('click', function () {  
            showMessageBtnClick();
        });
        $('#clearViewInputParams').on('click', function () {  
            clearViewInputParamsClick();
        });
    };

    // start controlller
    var start = function () {  
        myToast = new toastMessage();
        myToast.start();
        myToast.showInfo('Bem vindo ao Toast Message.');
        bindEvents();
    };
   
    start();

});

