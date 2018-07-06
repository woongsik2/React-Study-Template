import Reflux from 'reflux'


let AjaxActions = Reflux.createActions({
    contentLoaded: {}
});

AjaxActions.sdeskComm = function(url,reqObj, next, failfunc){
    console.log('[JG]AjaxActions sdeskComm ',url, reqObj);
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(reqObj),
        contentType:'application/json',
        beforeSend: function(xhr) {
            
        },
        success: function(data, textStatus, jqXHR) {
            //websqure에서는 1이 에러를 의미함.
            if(data.result.code == '1'){
                sd.log('조회실패', data.result.message,data.data);
                $.toaster("<br>서버 조회 간 에러 발생",'ERROR','danger');
                if(typeof failfunc == 'function'){
                    failfunc(data, textStatus, jqXHR);
                }
                return;
            }else{
                sd.log('AjaxActions.sdeskComm','서버 통신을 완료하였습니다.');
                //$.toaster('<br>'+reqObj.data.action+'<br>서버 통신을 완료하였습니다.','성공');
            }
            
            data.reqObj = reqObj;
            
            if(data.data){
                if(Array.isArray(data.data)){
                    data.dataCount = data.data.length;
                }else{
                    //배열이 아닐 경우 Object가 하나로 인식
                    data.dataCount = 1;
                }
            }
            
            if(typeof next == 'function'){
                next(data);
            }
        },
        error: function(xhr, status, error){
            sd.log('AJAX ERROR','ERROR 001 xhr'+xhr+'\nERROR 002 status'+status+'\nERROR 003 error'+error);
            $.toaster("<br>서버 조회 간 에러 발생",'ERROR','danger');
            if(typeof failfunc == 'function'){
                failfunc(xhr, status, error);
            }
        },
        dataType: 'json'
    });
}

export default AjaxActions