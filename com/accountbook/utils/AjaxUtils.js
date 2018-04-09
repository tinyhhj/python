import axios from 'axios';

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

        if(property.errorHandling) {
            return AjaxUtils._get(url,data,property).catch(AjaxUtils.errorHandler);
        } else {
            return AjaxUtils._get(url,data,property);
        }
    }

    static post(url , data={} , props={}) {
        return axios({
            method: 'post',
            url: url,
            data: data
        });
    }

    static delete(url , data={} , props={}) {
        return axios({
            method: 'delete',
            url : url,
            data : data,
        });
    }
    static errorHandler(err) {
        console.log('Error occuered! : ' + err);
        throw {result : "fail" , message:"request failed!"};
    }

    static qs(query) {
        return "?" + Object.keys(query).map(key=>"&"+key+"="+query[key]).join("").replace(/&/,"")
    }
}