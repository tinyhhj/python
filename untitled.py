from flask import Flask , request
from flask.ext.mysql import MySQL;
from flask_cors import CORS , cross_origin;
import json;
import re;

app = Flask(__name__)

mysql = MySQL();

app.config['MYSQL_DATABASE_USER'] = 'root';
app.config['MYSQL_DATABASE_PASSWORD'] = 'Samsung*99';
app.config['MYSQL_DATABASE_DB'] = 'accountbook';
p_woori = re.compile(r'''(                             # 0 : 전체 1 : 전체      
            (\[Web발신\]\s*)?                           # 2 : Web발신 or empty string
            우리\((\d{4})\)(승인|승인취소|취소)\s*          # 3 : 승인카드 뒷번호 4 : 승인 or 승인취소
            .*\s*                                     # 이름( 이름이 정확하게 나오지 않으므로 디비에서 가져옴
            (-?[0-9,.]+원)\s(\w+)\s*                  # 5 : 승인금액( , 제외 추가적 파싱필요?) 6 : 일시불 or 다른 결제방법
            (\d{1,2}/\d{1,2})\s+(\d\d:\d\d)\s*        # 7 : 날짜 (02/01) 8 : 시간 14:23
            (.*)\s*                                   # 9 : 사용처 
            누적([0-9,.]+원)(\s*)?                     # 10 : 누적사용금액 ( , 제외 추가적 파싱필요?)
            )''' , re.VERBOSE)
p_samsung = re.compile(r'''                                         # 0 : 전체 
                (\[Web발신\]\s*)?                                    # 1 : Web발신 or empty string
                삼성(\d{4})(승인|취소).*\s+                             # 2 : 승인카드 4자리 뒷번호 3 : 승인 or 취소
                (-?[0-9,.]+원)\s+(\w+)\s+                            # 4 : [-]승인금액 5 : 일시불 or 할부
                (\d{1,2}/\d{1,2})\s+(\d{1,2}:\d{1,2})\s+(.*)\s+     # 6 : 날짜 (02/01) 7 : 시간 (21:22) 8 : 장소 
                누적(-?[0-9,.]+원)(\s*)?                              # 9 : 누적 사용금액
            ''', re.VERBOSE)
p_samsung_os = re.compile(r'''
                (\[Web발신\]\s*)?                             # 1 : Web발신 or empty string
                \[삼성카드\](해외(취소)?)\s*(\d{4})\s+           # 2 : 해외 or 해외취소 3 : 취소 or None 4: 승인카드 4 뒷자리
                (\d{1,2}/\d{1,2})\s*(\d{1,2}:\d{1,2})\s+     # 5 : 날짜 6 : 시간
                (.*)\s+                                      # 7 : 사용처
                (\w*)\s+(-?[0-9,.]+)(\s*)?                   # 8 : 원화종류 9 : 승인금액
            ''', re.VERBOSE)

patterns= [p_woori , p_samsung, p_samsung_os];
mysql.init_app(app);
CORS(app);

UPLOAD_FILE_DIR = '/Users/tinyhhj/PycharmProjects/untitled/files/'
print(UPLOAD_FILE_DIR )

@app.route('/' , methods=["GET", "POST"])
def hello_world():
    print(request.form)
    print(request.data)
    return 'Hello World!'

@app.route("/loadData" , methods=["GET" , "POST"])
def loadData():
    cursor = mysql.connect().cursor();
    cursor.execute("select * from next_android_nextagram");

    result = [];
    columns = tuple( d[0] for d in cursor.description)
    print(columns);

    for row in cursor:
        result.append(dict(zip(columns , row)));

    print(result);
    return json.dumps(result);

@app.route("/upload" , methods=["POST"])
def upload():
    if request.method == 'POST':
        title = request.data['title'];
        files = request.files[0]
        path = UPLOAD_FILE_DIR + "uploadtest.png";
        print(title);
        print(path , files);
        files.save(path);
    return "upload Test";

@app.route("/parse" , methods=["POST"])
def parse():
    if request.method == "POST":
        conn = mysql.connect();
        cursor = conn.cursor();
        cursor.execute("select card_company_name, card_classfication , message_pattern from message_pattern where use_yn = 'Y'")
        results = [];
        columns = [d[0] for d in cursor.description ];
        print('description : ' , cursor.description , type(cursor.description));
        print('columns : ' , columns)
        for row in cursor:
            results.append(dict(zip(columns, row)));
        print('result : ' , results);
        print('form',request.form)
        print('data',request.data , type(request.data))
        json_str = (request.data).decode("utf-8")
        print('decoded message : ' , json_str , type(json_str))
        json_obj = json.loads(json_str.replace('\n','\\n'));
        print('json obj : ' ,json_obj);
        message = json_obj['message']
        print('json obj message : ' ,message ,type(message))
        for pattern_row in results:
            print('pattern_row : ' , pattern_row['message_pattern'] )
            print('pattern_row2 : ', list(pattern_row['message_pattern']))
            p = re.compile( pattern_row['message_pattern'] , re.VERBOSE);
            mo = p.search(message);
            if mo:
                print(' '.join(filter(None,mo.groups())))
                return ' '.join(filter(None,mo.groups()))
        return "can`t understand";
    return "accepted only post and get";




if __name__ == '__main__':
    app.run(debug=True , host ='0.0.0.0' ,port= 5009);
