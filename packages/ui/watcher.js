const chokidar = require('chokidar')
const terser = require('terser')
const fs = require('fs/promises')
const sass = require('sass')

const pathToWatch = 'src/app'
console.log(`Watching ${pathToWatch} for changes`)
const watcher = chokidar.watch(pathToWatch, {
    usePolling: true,
    interval: 1000
})

watcher.on('change', async (path) => {
    const file = await fs.readFile(path, 'utf-8')
    const name = path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
    try {
        if (path.endsWith('js')) {
            console.log(`Minifying ${path}`)
            const terserMinified = await terser.minify(file, { sourceMap: false })
            console.log(`Writing ${name}.min.js from ${path}`)
            await fs.writeFile(`src/web/app/${name}.min.js`, terserMinified.code, { encoding: 'utf-8' })
        } else if (path.endsWith('.scss')) {
            console.log(`Minifying ${path}`)
            const result = await sass.compileAsync(path, { style: 'compressed', sourceMap: false })
            console.log(`Writing ${name}.min.css from ${path}`)
            await fs.writeFile(`src/web/app/${name}.min.css`, result.css, { encoding: 'utf-8' })
        }
    } catch (err) {
        console.log('Failed parsing', path)
        console.log(err)
    }
})