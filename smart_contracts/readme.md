
# 1. запуск сети, должно висеть в отдельном терминале
npm install -g ganache-cli 
ganache-cli 

    or

testrpc --account="" --gasPrice 0

# 2. миграция | rebuild артефактов, нужно выполнять каждый раз когда были сделаны изменения в исходниках контрактов
truffle migrate --reset --all

# 3. запуск теста одного файла
truffle test ./test/Crowdsale_calcTokenAmount.js

truffle test ./test/Crowdsale_basis_not-init.js

Тестирование функции. Что нужно проверить?
1) доступы к функции (модификаторы и прочее);
2) входящие параметры функции (каждый require отдельно);
3) флаги, которые определены в других функциях (каждый require отдельно);
4) результат выполнения функции.