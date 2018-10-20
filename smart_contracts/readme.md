
# 1. запуск сети, должно висеть в отдельном терминале
npm install -g ganache-cli 
ganache-cli 

    or

testrpc --account="" --gasPrice 0

# 2. миграция | rebuild артефактов, нужно выполнять каждый раз когда были сделаны изменения в исходниках контрактов
truffle migrate --reset --all

# 3. запуск теста одного файла
truffle test ./test/Crowdsale_test.js

