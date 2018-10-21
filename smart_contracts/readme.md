#
npm install -g ganache-cli 
ganache-cli 

    or

testrpc --account="" --gasPrice 0

#
truffle migrate --reset --all

#
truffle test ./test/Crowdsale_test.js

truffle test ./test/Crowdsale_basis_not-init.js

Тестирование функции. Что нужно проверить?
1) доступы к функции (модификаторы и прочее);
2) входящие параметры функции (каждый require отдельно);
3) флаги, которые определены в других функциях (каждый require отдельно);
4) результат выполнения функции.