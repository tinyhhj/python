from flask.ext.mysql import MySQL;
from com.accountbook.repository.AccountBookRepository import AccountBookRepository;

'''
어플리케이션의 설정 담당
'''
class AppConfig:
    @classmethod
    def setConfig(cls , app):
        mysql = MySQL();

        app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

        app.config['MYSQL_DATABASE_USER'] = AccountBookRepository.getInstance().db_user;
        app.config['MYSQL_DATABASE_PASSWORD'] = AccountBookRepository.getInstance().db_password;
        app.config['MYSQL_DATABASE_DB'] = AccountBookRepository.getInstance().db_database;

        mysql.init_app(app);
        AccountBookRepository.getInstance().db_source = mysql;

        #custom rule
        app.custom_id_min_length = 6;
        app.custom_password_min_length = 6;

        return app;





