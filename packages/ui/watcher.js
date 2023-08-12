import { watch } from 'chokidar'
import { minify } from 'terser'
import { readFile, writeFile } from 'fs/promises'
import { compileAsync } from 'sass'
import { build } from 'esbuild'

const pathToWatch = 'src/app'
console.log(`Watching ${pathToWatch} for changes`)
const watcher = watch(pathToWatch, {
    usePolling: true,
    interval: 1000
})

watcher.on('change', async (path) => {
    const file = await readFile(path, 'utf-8')
    const name = path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
    try {
        if (path.endsWith('.js')) {
            console.log(`Browserifying ${path}`)
            await build({
                entryPoints: [path],
                bundle: true,
                minify: true,
                outfile: `src/web/app/${name}.bundle.min.js`
            })
        } else if (path.endsWith('bundle.js')) {
            console.log(`Minifying ${path}`)
            const terserMinified = await minify(file, { sourceMap: false })
            console.log(`Writing ${name}.min.js from ${path}`)
            await writeFile(`src/web/app/${name}.min.js`, terserMinified.code, { encoding: 'utf-8' })
        } else if (path.endsWith('.scss')) {
            console.log(`Minifying ${path}`)
            const result = await compileAsync(path, { style: 'compressed', sourceMap: false })
            console.log(`Writing ${name}.min.css from ${path}`)
            await writeFile(`src/web/app/${name}.min.css`, result.css, { encoding: 'utf-8' })
        }
    } catch (err) {
        console.log('Failed parsing', path)
        console.log(err)
    }
})

// watcher.on('add', async (path) => {
//     const file = await readFile(path, 'utf-8')
//     const name = path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
//     try {
//         if (path.endsWith('.js')) {
//             console.log(`Minifying ${path}`)
//             const terserMinified = await minify(file, { sourceMap: false })
//             console.log(`Writing ${name}.min.js from ${path}`)
//             await writeFile(`src/web/app/${name}.min.js`, terserMinified.code, { encoding: 'utf-8' })
//         }
//     } catch (err) {
//         console.log('Failed parsing', path)
//         console.log(err)
//     }
// })