/**
 * Created by griga on 11/24/15.
 */

import Reflux from 'reflux'
import AjaxActions from '../../actions/AjaxActions.js'

let UserActions = Reflux.createActions({
    init: {asyncResult: true}
});

UserActions.init.listen( function() {
    $.getJSON('api/sdesk/main_user.json').then( function(resObj){
        resObj.username = resObj.data.userNm;
        resObj.picture = resObj.data.userThumbnailPath;
        resObj.activity = resObj.data.userLvl;

        this.completed(resObj);
    }.bind(this), this.failed );
});

export default UserActions

