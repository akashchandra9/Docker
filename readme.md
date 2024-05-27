first we need to create mysql container

#create a network and connect mysql to it
docker network create mynet
docker run --name my-sql --network mynet -e MYSQL_ROOT_PASSWORD=123 -d mysql:latest

#now 
docker build -t myapp .
docker run --network mynet -p 5000:5000 -p 3000:3000 myapp


