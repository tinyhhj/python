web = '/web';
was = '/api';
routes = {
    'web' : '/web',
    'was' : '/api',

    'index' : web,
    'home': web+'/home',
    'message_pattern': web+'/message/pattern',
    'company_info' : web+'/company/info',
    'admin' : web+'/admin',
    'category' : web+'/category',
    'deduct_category': web+'/deduct/category',
    'income_category': web+'/income/category',
    'outcome_category': web+'/outcome/category',
    'unknown_message_pattern': web+'/unknown/message/pattern',
    'recruit_link' : web+'/recruit/link',


    'get_table_contents' : was+'/table/contents',
    'delete_table_contents': was+'/table/contents',
    'create_table_contents': was+'/table/contents',
    'update_table_contents': was+'/table/contents',
    'index_login' : was+'/login',
    'index_signup' : was+'/signup',
    'parse_message' : was+'/parse/message',
    'get_home_menus': was+'/home/menus',
    'get_message_patterns': was+'/message/pattern/patterns',
    'get_company_infos' : was+'/company/info/infos',
    'create_company_info' : was+'/company/info/create',
    'update_company_info' : was+'/company/info/update',
    'delete_company_infos' : was+'/company/info/deletes',
    'get_routes' : was+'/accountbook/routes',


    'naver_recruit_link' : 'http://recruit.navercorp.com/naver/job/listJson',
}

