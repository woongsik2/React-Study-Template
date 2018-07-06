import Reflux from 'reflux'

import LanguageActions from './LanguageActions'

let data = {
    language: {
        "key": "kr",
        "alt": "Korea",
        "title": "한국어"
    },
    languages: [],
    phrases: {}
};

let  LanguageStore = Reflux.createStore({
    listenables: LanguageActions,
    getData: function(){
        return data
    },
    onInitCompleted: function (_data) {
        data.languages = _data;
        //console.log('[JG][LanguageStore.js] Setting Language...',data);
        //LanguageActions.select(data.language);
        this.trigger(data)
    },
    onSelectCompleted: function (_data) {
        data.phrases = _data;
        //console.log('[JG][LanguageStore.js] Select Complete...',_data);
        this.trigger(data)
    },
    setLanguage: function(_lang){
        data.language = _lang
    }
});

export default LanguageStore;

