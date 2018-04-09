from flask.ext.mysql import MySQL;
from com.accountbook.query.QueryBuilder import QueryBuilder;


'''
어플리케이션의 db접근을 담당
'''
class Repository:
    instance = None;

    @classmethod
    def getInstance(cls, db_user = 'root' , db_password = 'Samsung*99' , db_database = 'accountbook'):
        if cls.instance is None:
            cls.instance = cls(db_user , db_password , db_database);
        return cls.instance;

    def __init__(self , db_user , db_password , db_database  ):
        self.db_user = db_user;
        self.db_password = db_password;
        self.db_database = db_database;
        self.db_source = MySQL();

    def selectQuery(self , query , args):
        conn = self.db_source.connect();
        cursor = conn.cursor();
        cursor.execute( query , args);
        results =[];
        #columns 컬럼명을 리스트로 생성
        columns = [d[0] for d in cursor.description ]
        # 결과 키 값 쌍을 results에 추가
        for row in cursor:
            results.append(dict(zip(columns , row)))
        cursor.close();
        conn.close();
        return results;

    def executeQuery(self , query , args):
        conn = self.db_source.connect();
        cursor = conn.cursor();
        cursor.execute(query , args);
        conn.commit();
        cursor.close();
        conn.close();
        return 'success';

    def findOne(self, obj):
        return self.selectQuery(QueryBuilder()
                                .select(obj.select())
                                .table(type(obj).__name__)
                                .where(obj.filter()).build(), ()
                                );

