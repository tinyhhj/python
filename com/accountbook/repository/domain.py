class table:
    @classmethod
    def select(cls):
        return list(filter(lambda x: not x.startswith('__') and isinstance(cls.__dict__.get(x), str), cls.__dict__.keys()))
    @classmethod
    def key(cls):
        dict = cls.__dict__;
        return [k for k in dict.keys() if dict.get(k) == 'key']
    def filter(self):
        where_list = [];
        dict = self.__dict__;
        for i in dict:
            where_list += [i, '=', str(dict.get(i)) if not isinstance(dict.get(i) , str) else "'"+dict.get(i)+"'"];
        return where_list;


class message_pattern(table):
    _id = '';
    company_info_id = 'key';
    message_pattern = '';
    modified_date = '';
    use_yn = '';

    def __init__(self , obj = {}):
        for k in obj.keys():
            self.__dict__[k] = obj[k];




