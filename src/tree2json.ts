//ref:https://gist.github.com/shimizu/7bd8c02c3d49492d1350

import fs from "fs";
import path from "path";
const dir = process.argv[2] || '.';

const walk = (dir_path: string, callback: (err: NodeJS.ErrnoException | null, res: {}[]) => void) => {
	const results: {}[] = [];
	fs.readdir(dir_path, (err, files) => {
		if (err) {
			throw err;
		}
		let pending = files.length;
		if (!pending) {
			return callback(null, results);
		}
		files.map(file => path.join(dir_path, file)).filter(file => {
			if(fs.statSync(file).isDirectory()) {
				walk(file, (err, res) => {
					results.push({name:path.basename(file), children:res});
					if (!--pending) {
						callback(null, results);
					}
				});
			}
			return fs.statSync(file).isFile();
		}).forEach(file => {
			results.push({file:path.basename(file)});
			if (!--pending) {
				callback(null, results);
			}
		});
	});
}

walk(dir, (err, results) => {
	if (err) {
		throw err;
	}
	const data = {name:'root', children:results};
	console.log(JSON.stringify(data));
});