// * Use environment variables to perform read/write to result files
// * process.env.TEST_FILE_NAME is the name of THIS file (the unit tests you're writing - use it as compile command)
// * process.env.USER_CODE_DIR is the directory path of user's code. Use it to import/run user specific code
// * process.env.PUBLIC_PORT is the publicly accessible port on localhost for user's server. Use it to perform HTTP requests to user server
// * process.env.IO_TEST_OUTPUT_FILE is the name of the file where results of IO tests should be put
// * process.env.UNIT_TEST_OUTPUT_FILE is the name of the file where results of UNIT tests should be put
// * The results file should have a JSON array with ONLY "true" or "false" values (booleans) as elements having one-to-one correspondance to challenges you design

const { exec } = require('child_process')
const fs = require('fs')

const stdin = `
3
5
10
15
`.trim()

const expectedOutput = `
15
30
45
`
	.trim()
	.split('\n')

const java = exec(`cd ${process.env.USER_CODE_DIR} && javac HelloWorld.java && java HelloWorld`)
java.stdin.write(stdin + '\n')

let _realOutput = ''

java.stdout.on('data', (data) => {
	_realOutput += data.toString()
})

java.stdout.on('close', () => {
	const results = []
	const realOutput = _realOutput.trim().split('\n')

	for (let i = 0; i < expectedOutput.length; i++) {
		const expectedRow = expectedOutput[i]
		const actualRow = realOutput[i]
		results.push(expectedRow === actualRow)
	}

	fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
	process.exit(0)
})
