pub contract BasicNFT {

	pub resource NFT{
		pub let id: UInt64
		pub let name: String

		init(id: UInt64, name: String){
			self.id = id
			self.name = name
		}
	}

	pub struct casualNFT{
		pub let id: UInt64

		init(id: UInt64, name: String){
			self.id = id
		}
	}



	pub resource interface Receiver{
		pub fun deposit(token: @NFT)
		pub fun getIDs(): [UInt64]
		pub fun idExists(id: UInt64): Bool
	}

	pub resource Collection: Receiver{
		pub var tokens: @{UInt64: NFT}

		init(){
			var test:String = "test"
			self.tokens <- {}
		}

		pub fun testMethod():String{
			post {
				result != "hello":
					"something went wrong"
			}

			var b:Int? =  5
			if let a = b {
				return "OK"
			} else {
				return "BAD"
			}
		}

		pub fun withdraw(id: UInt64): @NFT{
			let token <- self.tokens.remove(key: id)!
			return <- token
		}

		pub fun deposit(token: @NFT){
			let oldToken <- self.tokens[token.id] <- token
			destroy oldToken
		}

		pub fun idExists(id: UInt64): Bool{
			return self.tokens[id] != nil
		}

		pub fun getIDs(): [UInt64]{
			return self.tokens.keys
		}

		pub fun getTokenList(): [{ String : AnyStruct}]{
			let list:[{String: AnyStruct}] = []
			for id in self.tokens.keys{
				let tokenStruct = {
					"name": self.tokens[id]?.name as AnyStruct,
					"id": id as AnyStruct
				}
			}
			return list
		}

		destroy(){
			destroy self.tokens
		}
	}

	pub fun createEmptyCollection(): @Collection{
		return <- create Collection()
	}

	pub resource Minter{
		pub var counter: UInt64

		init(){
			self.counter = 1
		}

		pub fun mintToken(recipient: &AnyResource{Receiver}, tokenName: String){
			var newToken <- create NFT(id: self.counter, name: tokenName)

			recipient.deposit(token: <- newToken);
			self.counter = self.counter + UInt64(1);
		}
	}

	init(){
		self.account.save<@Collection>(<-self.createEmptyCollection(), to: /storage/BaseCollection)
		self.account.link<&{Receiver}>(/public/Receiver, target: /storage/BaseCollection)

		self.account.save(<-create Minter(), to: /storage/TokenMinter)
	}
}