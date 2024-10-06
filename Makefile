-include .env

deploy:
	@forge script contracts/ArkhamToken.sol:ArkhamToken --rpc-url http://localhost:8545 --private-key $(PRIVATE_KEY)