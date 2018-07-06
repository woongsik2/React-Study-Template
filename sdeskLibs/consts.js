var sdenv = (function(){
    return {
        
        RETRIEVEGRPS:{
            ALL:['GRP_01_001','GRP_01_002','GRP_01_003','GRP_02_001','GRP_02_002'],
            GRPS:['GRP_01','GRP_02'],
            GRP_01 : ['GRP_01_001','GRP_01_002','GRP_01_003'],
            GRP_02 : ['GRP_02_001','GRP_02_002'],
        },
        
        WORKGRP:{
            ALL:['WKC_HOM', 'WKC_MOB', 'WKC_COM']
        },
        
        PAGE:{
          REDIRECT:'8fjm59gjfjkjdf8gfk',
          CATG_DETAIL:'udi87FdffGH3573454Ferdsw',
          CATG_STAFF:'jdf834jhrejhdf767sdh3fxc7',
          SYS_DETAIL:'84jfd83j29dejdfhbdf63j',
          CATGGRP_DETAIL:'jhf7u4hfd83hdf8TG',
          CODE_DETAIL:'9cvfjnh4kdf8eDF3',
          ACL_DETAIL:'edGr34wsaddfTGH3',
          ADMIN_DETAIL:'ad3tcxgvrf21DFs3XFGVC3',
          IP_DETAIL:'id7P8dE2xcvDF234DF'
        },
        
        STATUS:{
            NONE:0,
            PREPARE:1,
            RETRIEVE:2,
            INSERT:3,
            MODIFY:4
        },
        
        TEMPLATE:{
            SCREEN:{
                anwserUseManagerYn: "Y",
                anwserUseYn: "Y",
                attachFileUseYn: "Y",
                attachImageUseYn: "Y",
                defaultAtclDetl: "",
                deleteUseYn: "Y",
                mailNotiUseYn: "Y",
                manualUseYn: "Y",
                mmsNotiUseYn: "Y",
                modifyUseYn: "Y",
                noticeUseYn: "Y",
                ratingUseYn: "Y",
                replyUseYn: "Y",
                retrieveAuths: "",
                screenDetl: "",
                screenId: "",
                screenNm: "",
                secretChkDisableYn: "N",
                secretSelectYn: "N",
                selectUseYn: "Y",
                wkcIds: ""
            }
            
        },
        
        VALIDATE:{
            SCREEN:['screenId','screenNm'],
            SYSTEM:['sysId','sysNm'],
            SCREENGRP:['scrGrpId','scrGrpNm'],
            CODE:['cdId','cdNm'],
            ACL:['authId','authNm']
        },
        
        STRS:{
            NO_NEED_PARAM:'필수 파라미터 값을 입력하세요.'
        },
        
        URL:{
            TEMPLATE:{
                SCREEN:'http://{0}/websquare/websquare.jsp?w2xPath=/xml/SDesk/social_index.xml&mainScreenId={1}&screenId={1}',
                GRP:'http://{0}/websquare/websquare.jsp?w2xPath=/xml/SDesk/social_index.xml&screenGrpId={1}'
            },
            LOCAL:'localhost:14602',
            DEV:'devsdesk.lguplus.co.kr',
            PRD:'sdesk.lguplus.co.kr'
        }
    }
})();

module.exports = sdenv;