from setuptools import setup

setup(
    name='accountbook',
    packages=['config' , 'controller' , 'query' , 'repository' , 'service'],
    include_package_data=True,
    install_requires=[
        'flask',
    ],
)