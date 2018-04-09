from com.accountbook.repository.Repository import Repository;
'''from com.accountbook.repository.domain import message_pattern;
obj = message_pattern();
obj.company_info_id=1;
obj.company='우리카드';
print(obj.__class__.__dict__)
print(obj.__class__.filter(obj))
print(type(obj).__dict__)
print(obj.filter())

str = QueryBuilder()\
                         .select(obj.select())\
                         .table(type(obj).__name__).where(obj.filter()).build()\

print(str)'''
class AccountBookRepository(Repository):
    instance = None;











