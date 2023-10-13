call npm run build:release-prod 
call git restore ./config.xml 
call git checkout develop-free
call npm run build:release-free
call git restore ./config.xml