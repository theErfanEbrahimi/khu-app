var dbUser     = ''
var dbPassword = ''
var config     = {}
if (dbUser && dbPassword) {
	config = {
		dbUrl: 'mongodb://' + dbUser + ':' + dbPassword + '@localhost:27017/khu'
	}
}
else {
	config = {
		dbUrl: 'mongodb://localhost:27017/khu'
	}
}

config.jwtSecretKey = {
	secretKeyAdmin: 'bb98b1d0b523d5e783f931550d7702b2bb98b1d0b523d5e783f931550d7702b2',
}

module.exports = config
