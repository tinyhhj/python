from flask import Flask
from com.accountbook.config.AccountBookConfig import AppConfig;

# 서버 어플리케이션 생성 후 config 적용
app = Flask(__name__)
AppConfig.setConfig(app);

# url 매핑설정
from com.accountbook.controller import AccounBookController;

