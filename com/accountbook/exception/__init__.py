class NotFoundPattern(Exception):
    def __init__(self , msg = '알수없는 패턴입니다.'):
        self.msg = msg;
    def __str__(self):
        return self.msg;