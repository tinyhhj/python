from com.accountbook.repository.domain import message_pattern;
class QueryBuilder:
    def __init__(self):
        self.sql = "";

    def select(self , select_list ):
        self.sql += " select " + ", ".join(select_list)+" ";
        return self;
    def table(self , table):
        self.sql += " from " + table + " ";
        return self;
    def where(self, where_lists):
        for i in range(len(where_lists)//3):
            self.sql += " where " if i == 0 else " and "
            self.sql += " ".join(where_lists[3*i:3*i+3])+ " ";
        return self;
    def order(self , order_lists , direct = " asc "):
        self.sql += " order by "
        self.sql += " , ".join(order_lists)+ direct;
        return self;
    def build(self):
        return self.sql;





