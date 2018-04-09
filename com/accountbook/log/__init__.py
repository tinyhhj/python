import logging;
import logging.handlers;

#logger 인스턴스를 생성 및 로그 레벨설정

logger = logging.getLogger();
logger.setLevel(logging.DEBUG);

# formatter 생성
formatter = logging.Formatter('[%(asctime)s:%(filename)s]: %(message)s');

# fileHandler와 StreamHandler생성
#fileHandler = logging.FileHandler('./log/my.log')
max_bytes_per_file = 10 * 1024 * 1024 ; # 10Mb
backup_count = 5;
fileHandler = logging.handlers.RotatingFileHandler(filename='./log/logging' , maxBytes= max_bytes_per_file , backupCount= backup_count);
streamHandler = logging.StreamHandler();

# Handler에 formatter 세팅
fileHandler.setFormatter(formatter);
streamHandler.setFormatter(formatter);

# logger에 Handler 세팅
logger.addHandler(fileHandler);
logger.addHandler(streamHandler);

