from com.accountbook import app;
from com.accountbook.service.AccountBookService import AccountBookService;
from com.accountbook.log import logger;
import json;
from flask import render_template ,make_response ,redirect
from com.accountbook.repository.AccountBookRepository import AccountBookRepository;
from com.accountbook.config.routes import routes;
'''
어플리케이션의 route 경로를 담당
'''

@app.route(routes['get_routes'] , methods=['GET'])
def getRoutes():
    return json.dumps(routes);
@app.route(routes['parse_message'] , methods=["POST"])
def parseMessage():
    try :
        return AccountBookService.getInstance().parseMessage();
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        result = {};
        result.setdefault('result' , 'fail');
        result = json.dumps(result);
        return result;

@app.route(routes['index'] , methods=['GET'] )
def index():
    return render_template('index.html')

@app.route(routes['home'] ,methods=['GET'])
def home():
    return index();

@app.route(routes['get_home_menus'] ,methods=['GET'])
def menus():
    try:
        return AccountBookService.getInstance().getMenus();
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/", 302)
@app.route(routes['message_pattern'],methods=['GET'])
def patterns():
    return index();

@app.route(routes['company_info'] , methods =["GET"])
def cardcompany():
    return index();

@app.route(routes['get_message_patterns'],methods=['GET'])
def getAllPatternList():
    try:
        return AccountBookService.getInstance().getPatternList();
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/", 302)

@app.route(routes['index_login'], methods=['POST'])
def login():
    try :
        AccountBookService.getInstance().login(app);
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/",404)
    return "success";

@app.route(routes['index_signup'] , methods=['POST'])
def signUp():
    try :
        AccountBookService.getInstance().signUp(app);
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/",404)
    return index();

@app.route(routes['get_company_infos'] , methods=['GET'])
def allCardCompanies():
    try:
        return AccountBookService.getInstance().getAllCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)

@app.route(routes['create_company_info'] , methods=['POST'])
def createCardCompanies():
    try:
        return AccountBookService.getInstance().createCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)

@app.route(routes['delete_company_infos'] , methods=['DELETE'])
def deleteCardCompanies():
    try:
        return AccountBookService.getInstance().deleteCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)

@app.route(routes['update_company_info'] , methods=['PUT'])
def updateCardCompanies():
    try:
        return AccountBookService.getInstance().updateCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)


