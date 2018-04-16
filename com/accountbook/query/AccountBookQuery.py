
'''
어플리케이션의 쿼리를 담당
'''
class AccountBookQuery:
    find_all_message_pattern = """select * 
                                    from message_pattern A
                              inner join company_info B 
                                   where A.use_yn = 'Y'
                                     and B.use_yn = 'Y'
                                     and a.company_info_id = b._id""";

    get_all_menus = """show tables
                        """
    find_a_user = """ select *
                        from admin
                        where admin_id = %s
                    """;
    add_a_user = """ insert into admin (admin_id, admin_password)
                      values( %s , %s )
                """;
    get_all_card_companies_info = """ select * 
                                from company_info
                                where use_yn = 'Y'"""
    create_card_companies_info = """ insert into company_info (card_company_name , card_company_number)
                                     values(%s,%s)
                                 """
    update_card_companies_use_yn = """update company_info
                                      set use_yn ='Y'
                                      where card_company_name = %s
                                      and   card_company_number = %s
                                   """
    find_a_card_company_info = """ select * 
                                   from company_info
                                   where card_company_name = %s
                                   and   card_company_number = %s"""
    update_card_companies_info = """update company_info
                                    set card_company_name = %s,
                                        card_company_number= %s
                                    where _id = %s
                                """
    get_table_contents = """ select *
                             from %s"""
    def delete_card_companies_info(self , id_num ):
        prefix =  """ update company_info
                   set use_yn ='N'
                   where _id in (""";
        suffix = ")";
        for i in range(id_num):
            prefix += "%s,";
        return prefix[:-1] +suffix;
