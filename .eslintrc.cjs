module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    // https://stackoverflow.com/questions/36001552/eslint-parsing-error-unexpected-token
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
