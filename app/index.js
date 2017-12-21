import _ from 'lodash';
import moment from 'moment';
import './app.css'
function component () {
    var element = document.createElement('div');
    /* 需要引入 lodash，下一行才能正常工作 */
    element.innerHTML = _.join(['Hello','webpack'], ' ');
    return element;
}
if(true){
    try{throw Error('Message:Message')}catch(err){console.error(err)}
}
document.body.appendChild(component());