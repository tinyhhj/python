from com.accountbook import app;
from com.accountbook.service.AccountBookService import AccountBookService;
from com.accountbook.log import logger;
import json;
from flask import render_template ,make_response ,redirect
from com.accountbook.repository.AccountBookRepository import AccountBookRepository;
'''
어플리케이션의 route 경로를 담당
'''
@app.route("/parse/message" , methods=["POST"])
def parseMessage():
    try :
        return AccountBookService.getInstance().parseMessage();
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        result = {};
        result.setdefault('result' , 'fail');
        result = json.dumps(result);
        return result;

@app.route("/" , methods=['GET'] )
def index():
    return render_template('index.html')

@app.route("/home" ,methods=['GET'])
def home():
    return index();

@app.route("/patterns",methods=['GET'])
def patterns():
    return index();

@app.route("/cardcompany" , methods =["GET"])
def cardcompany():
    return index();

@app.route("/patterns/search",methods=['GET'])
def getAllPatternList():
    try:
        return AccountBookService.getInstance().getPatternList();
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/", 302)

@app.route("/login", methods=['POST'])
def login():
    try :
        AccountBookService.getInstance().login(app);
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/",404)
    return "success";

@app.route('/signUp' , methods=['POST'])
def signUp():
    try :
        AccountBookService.getInstance().signUp(app);
    except Exception as e :
        logger.debug('exception occured!' + str(e))
        return redirect("/",404)
    return index();

@app.route('/cardcompany/search' , methods=['GET'])
def allCardCompanies():
    try:
        return AccountBookService.getInstance().getAllCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)

@app.route('/cardcompany/create' , methods=['POST'])
def createCardCompanies():
    try:
        return AccountBookService.getInstance().createCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)

@app.route('/cardcompany/delete' , methods=['DELETE'])
def deleteCardCompanies():
    try:
        return AccountBookService.getInstance().deleteCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)

@app.route('/cardcompany/update' , methods=['PUT'])
def updateCardCompanies():
    try:
        return AccountBookService.getInstance().updateCardCompanies();
    except Exception as e:
        logger.debug('exception occured!' + str(e))
        return redirect("/home", 302)


