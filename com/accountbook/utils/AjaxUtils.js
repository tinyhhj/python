import axios from 'axios';
import {spinner as Spinner} from 'Components';

export default class AjaxUtils {
    static _get(url, query , props={}) {
        return axios({
            method: 'get',
            url : url+(Object.keys(query).length ? AjaxUtils.qs(query) : "")
        });
    }

    static get(url , data={} , props ={}) {
        const defaultProps = {
            errorHandling : true,
        };
        const property = {...defaultProps ,...props};

        const id = Spinner.forEach(e=>e.show())

        if(property.errorHandling) {
            return AjaxUtils._get(url,data,property).catch(err => {
            Spinner.forEach(e=>e.hide(id));
            AjaxUtils.errorHandler(err)}).then(res=>{Spinner.forEach(e=>e.hide(id)); return res;});
        } else {
            return AjaxUtils._get(url,data,property).then(res=>{Spinner.forEach(e=>e.hide(id)); return res;});
        }
    }

    static post(url , data={} , props={}) {
        const id = Spinner.forEach(e=>e.show())
        return axios({
            method: 'post',
            url: url,
            data: data
        }).catch(err => {
            Spinner.forEach(e=>e.hide(id));
            AjaxUtils.errorHandler(err)})
            .then(res=>{Spinner.forEach(e=>e.hide(id)); return res;});
    }

    static delete(url , data={} , props={}) {
        const id = Spinner.forEach(e=>e.show())
        return axios({
            method: 'delete',
            url : url,
            data : data,
        }).catch(err => {
            Spinner.forEach(e=>e.hide(id));
            AjaxUtils.errorHandler(err)})
            .then(res=>{Spinner.forEach(e=>e.hide(id)); return res;});
    }
    static put(url , data={} , props ={}) {
        const id = Spinner.forEach(e=>e.show())
        return axios({
            method: 'put',
            url : url,
            data : data,
        }).catch(err => {
            Spinner.forEach(e=>e.hide(id));
            AjaxUtils.errorHandler(err)})
            .then(res=>{Spinner.forEach(e=>e.hide(id)); return res;});
    }
    static errorHandler(err) {
        console.log('Error occuered! : ' + err);
        throw {result : "fail" , message:"request failed!"};
    }

    static qs(query) {
        return "?" + Object.keys(query).map(key=>"&"+key+"="+query[key]).join("").replace(/&/,"")
    }

    static all(...requests) {
        return axios.all(requests).catch(err => {
            Spinner.forEach(e=>e.hide(id));
            AjaxUtils.errorHandler(err)});
    }
}