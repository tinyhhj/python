web = '/web';
was = '/api';
routes = {
    'web' : '/web',
    'was' : '/api',

    'index' : web,
    'home': web+'/home',
    'message_pattern': web+'/message/pattern',
    'company_info' : web+'/company/info',

    'get_table_contents' : was+'/table/contents',
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
}

