from flask import request;
from com.accountbook.repository.AccountBookRepository import AccountBookRepository;
from com.accountbook.query.AccountBookQuery import AccountBookQuery;
import json;
import re;
from com.accountbook.log import logger;
from com.accountbook.config.MessagePatterns import position_info , position_key;
from com.accountbook.config.AccountBookConfig import configuration;
from datetime import datetime;
from functools import reduce;
'''
클라이언트 요청에 대한 실질적인 처리를 담당
'''

class AccountBookService:
    instance = None;

    def __init__(self):
        self.repo = AccountBookRepository.getInstance();
        self.query = AccountBookQuery;



    @classmethod
    def getInstance(cls):
        if(cls.instance is None):
            cls.instance = AccountBookService();
        return cls.instance;

    def parseMessage(self):
        if request.method == "POST":
            results = self.repo.selectQuery(self.query.find_all_message_pattern , ());
            #results = self.repo.findOne(message_pattern());
            #print('results : ', results , len(results));
            #logger.debug(request.data);
            json_str = (request.data).decode("utf-8")
            logger.debug('decoded message : ' + json_str)
            json_obj = json.loads(json_str.replace('\n', '\\n'));
            message = json_obj['message']
            logger.debug('json obj message : ' + message )
            for pattern_row in results:
                p = re.compile(pattern_row['message_pattern'], re.VERBOSE);
                mo = p.search(message);
                if mo:
                    logger.debug('message_pattern : ' + pattern_row['message_pattern'])
                    logger.debug(mo.groups())
                    #logger.debug('response: ' + json.dumps(dict(zip(position_key , [mo.groups()[i] for i in position_info[pattern_row['card_company_number']]]))))
                    result_obj = dict(zip(position_key , [mo.groups()[i] for i in position_info[pattern_row['card_company_number']]]));
                    print('comehere ' + result_obj.__str__());
                    result_obj.setdefault('result' , 'success');
                    return json.dumps(result_obj)
                # 패턴을 못찾는경우라면 unknown_message_pattern테이블에 insert

        # post method가 아니거나 패턴을 찾지못했을경우
        result = {};
        result.setdefault('result' , 'fail')
        return json.dumps(result);

    def signUp(self , app):
        json_obj = self.json_load(request.data);
        _name = json_obj['adminId'];
        _password = json_obj['adminPassword'];

        # 아디 및 비번 길이체크
        if (len(_name) < app.custom_id_min_length or len(_password) < app.custom_password_min_length):
            logger.debug('_name or _password length is not enough');
            raise Exception('id or password length is not enough!');

        results = self.repo.selectQuery(self.query.find_a_user , (_name,));
        print(results);
        if( len(results) > 0 ):
            logger.debug('already exists admin_id')
            raise Exception('exists admin_id');
        print('update');
        self.repo.executeQuery(self.query.add_a_user , (_name, _password));
        return json.dumps({}.setdefault('result' , 'success'));

    def login(self, app):
        json_obj = self.json_load(request.data);
        _name = json_obj['adminId'];
        _password = json_obj['adminPassword'];
        print(_name, _password, app.custom_id_min_length, app.custom_password_min_length);

        # 아디 및 비번 길이체크
        if (len(_name) < app.custom_id_min_length or len(_password) < app.custom_password_min_length):
            logger.debug('_name or _password length is not enough');
            raise Exception('id or password length is not enough!');

        results = self.repo.selectQuery(self.query.find_a_user, (_name,));
        if( len(results) == 0 ):
            logger.debug('already exists admin_id')
            raise Exception('not exists admin_id');
        return json.dumps({}.setdefault('result', 'success'));

    def json_load(self, data):
        json_str = (data).decode("utf-8")
        return json.loads(json_str.replace('\n', '\\n'));

    def getPatternList(self):
        results = self.repo.selectQuery(self.query.find_all_message_pattern, ());
        print(results);
        for pattern in results:
            pattern['modified_date'] = pattern['modified_date'].strftime("%Y/%m/%d %H:%M:%S");
        return json.dumps(results);

    def getAllCardCompanies(self):
        results = self.repo.selectQuery(self.query.get_all_card_companies_info , ());
        for pattern in results:
            pattern['modified_date'] = pattern['modified_date'].strftime("%Y/%m/%d %H:%M:%S");
        for i in range(100000000):
            i += 1;
        return json.dumps(results);

    def createCardCompanies(self):
        print(request.data);
        requestData = self.json_load(request.data);
        cardcompanyName = requestData['cardCompanyName'];
        cardCompanyNumber = requestData['cardCompanyNumber'];
        results = self.repo.selectQuery(self.query.find_a_card_company_info , (cardcompanyName, cardCompanyNumber));
        if len(results) > 0:
            self.repo.executeQuery(self.query.update_card_companies_use_yn, (cardcompanyName, cardCompanyNumber));
        else:
            self.repo.executeQuery(self.query.create_card_companies_info , ( cardcompanyName, cardCompanyNumber ));
        results ={};
        results.setdefault('errorCode','0');
        results.setdefault('message','success');

        return json.dumps(results);

    def make_response(self , errorCode = "0", message = "success"):
        res ={};
        res.setdefault('errorCode' , errorCode);
        res.setdefault('message' , message);
        return res;

    def deleteCardCompanies(self):
        requestData = self.json_load(request.data);
        data = requestData['_id'];
        print(requestData);
        if( len(data) > 0 ):
            self.repo.executeQuery(self.query.delete_card_companies_info(self , len(data)) , tuple(data));
        return json.dumps(self.make_response());
    def updateCardCompanies(self):
        requestData = self.json_load(request.data);
        #requestData is not empty
        if(bool(requestData)):
            self.repo.executeQuery(self.query.update_card_companies_info , (requestData['cardCompanyName'],
                                                                            requestData['cardCompanyNumber'],
                                                                            requestData['_id'],))
        return json.dumps(self.make_response());

    def getMenus(self):
        results = self.repo.selectQuery(self.query.get_all_menus, ());
        if( len(results)):
            return json.dumps(results)

    def getTableContents(self):
        # requestData = self.json_load(request.data);
        tableName = request.args['tableName'];
        query = self.query.get_table_contents;
        if( tableName in configuration['useYnTable']):
            query += " where use_yn = 'Y' ";

        results = self.repo.selectQuery(query % tableName,() , header=None);
        for result in results:
            for k , v in result.items():
                if(type(v) is datetime):
                    result[k] = v.strftime("%Y/%m/%d %H:%M:%S");
        return json.dumps(results);

    def createTableContents(self):
        requestData = self.json_load(request.data);
        copyRequestData = requestData.copy();
        print(requestData);
        tableName = requestData.pop('tableName');
        _id = '_id' in requestData and requestData.pop('_id');
        'modified_date' in requestData and requestData.pop('modified_date');
#        'use_yn' in requestData and requestData.pop('use_yn');
        'modalButton' in requestData and requestData.pop('modalButton');
        print(tableName , _id)

        if _id :
            qs = self.query.update_table_contents(self,len(requestData) , {'modified_date' : 'modified_date' in copyRequestData});
            self.repo.executeQuery(qs % ((tableName,)+reduce(lambda x,y:x+y ,[(k,v) for k,v in requestData.items()]) +(_id, )),())
            print(qs % ((tableName,)+reduce(lambda x,y:x+y ,[(k,v) for k,v in requestData.items()]) +(_id, )))
        else:
            qs = self.query.create_table_contents(self,len(requestData));
            self.repo.executeQuery(qs % ((tableName,) + tuple(requestData.keys()) + tuple(requestData.values())), ())
            print(qs % ((tableName,)+ tuple(requestData.keys()) + tuple(requestData.values())))
        return json.dumps(self.make_response());
    def deleteTableContents(self):
        requestData = self.json_load(request.data);
        tableName = requestData.pop('tableName');
        qs = self.query.delete_table_contents(self, len(requestData['_id']));
        print(qs);


        self.repo.executeQuery(qs % ((tableName,) + tuple(requestData.pop('_id'))), ())
        return json.dumps(self.make_response());










