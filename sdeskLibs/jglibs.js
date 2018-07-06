var sdesklib = (function(){
    var DEBUG_FLAG = true;
    var LOG_PREFIX_STR = '[SDESK]';
    var LOG_APPEND_A_PREFIX_STR = '[APPEND]';
    
    /*[START] PROTOTYPE SET*/
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
            ;
            });
        };
    }
    /*[END] PROTOTYPE SET*/
    
    return {
        log: function(title, body, ...params){
            var now = new Date();
            
            if(DEBUG_FLAG){
                var nowStr = '['+now.toISOString()+']';
                var titleStr = '<'+title+'>';
                var paramArr = [...params];
                console.log(LOG_PREFIX_STR+nowStr+titleStr,body);
                if(paramArr.length > 0){
                    console.log(LOG_PREFIX_STR+LOG_APPEND_A_PREFIX_STR, ...params);    
                }
            }
        },
        hasValues: function(keyArray, obj){
            this.log('key-value Checker',keyArray,obj)
            let Flag = true;
            keyArray.map((key)=>{
                if(!obj[key]){
                    Flag = false;
                }
            })
            return Flag;
        },
        get: function(key){
            return sessionStorage.getItem(key);
        },
        set: function (key, value) {
            sessionStorage.setItem(key, value);
        },
        issue:{
            query:function(){
                $.toaster('<br>검색어는 2자 이상이어야 합니다.','조회 조건 이슈','warning');
            }
        },
        formatter: function(formData){
            if(typeof formData == 'number'){
                if(formData==0) return 0;
                var reg = /(^[+-]?\d+)(\d{3})/;
                var n = (formData + '');
                while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
                
                return n;
            }else{
                return formData;
            }
        },
        is_ie: function(){
            if(navigator.userAgent.toLowerCase().indexOf("chrome") != -1) return false;
            if(navigator.userAgent.toLowerCase().indexOf("msie") != -1) return true;
            if(navigator.userAgent.toLowerCase().indexOf("windows nt") != -1) return true;
            return false;
        },
        copy_to_clipboard: function(str) {
            if( this.is_ie() ) {
                window.clipboardData.setData("Text", str);
                alert("복사되었습니다.");
                return;
            }
            prompt("Ctrl+C를 눌러 복사하세요.", str);
        }
    }
})();

module.exports = sdesklib;