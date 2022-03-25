import * as fs from 'fs'
import * as path from 'path'
import * as client from 'https'
import filetype from 'magic-bytes.js'

import { getCurrentDateTime } from './DateTime'
import { IS_PRODUCTION, PNG_FILE_EXTENSION } from '../shared/Constants'

// If image is from a Google CDN, use their built in resizer
// to bump the image size to its original.
export const upsizeGoogleImageTransformer = (url: URL): URL => {
  if (url.host.endsWith('googleusercontent.com')) {
    const splitPath = url.pathname.split('=')
    url.pathname = `${splitPath[0]}=s1200`
  }

  return url
}

// Downloads an upsized image with the right file extension
export async function downloadImage(
  url: string,
  name: string
): Promise<string> {
  // Get the filename
  const fileName = `${name}-${getCurrentDateTime('YYYY-MM-DD_HH:mm:ss')}`

  // Default to the png file extension
  const fileExtension = PNG_FILE_EXTENSION

  // Get the parent directory path & the collection images folder
  // If it's running in production (lambda) then use the /tmp folder
  const parentDirectoryPath = IS_PRODUCTION
    ? '/tmp'
    : path.resolve(__dirname, '..')
  const collectionImagesFolder = 'images/collections'

  // Get the final collection images directory path
  const collectionImagesDirectory = `${parentDirectoryPath}/${collectionImagesFolder}`

  // Creates folders recursively regardless of whether it exists or not
  await fs.mkdir(collectionImagesDirectory, { recursive: true }, (err) => {
    if (err) throw err

    console.log('Folder created:', collectionImagesDirectory)
  })

  // Get file path based on folder + name + extension
  const filePath = `${collectionImagesDirectory}/${fileName}.${fileExtension}`

  // Upsize the image for the tweet
  const upsizedImageUrl = upsizeGoogleImageTransformer(new URL(url))

  let downloadedFilePath: string = await new Promise((resolve, reject) => {
    client.get(upsizedImageUrl, (res: any) => {
      if (res.statusCode === 200) {
        // Write file to the file system
        res
          .pipe(fs.createWriteStream(filePath))
          .on('error', reject)
          .once('close', () => {
            resolve(filePath)
          })
      } else {
        // Consume response data to free up memory
        res.resume()
        reject(new Error(`failed to download image: status ${res.statusCode}`))
      }
    })
  })

  // const mimeType = await mimetype(downloadedFilePath)
  // const extension = mimeType.split('/')[1]

  const guessedFiles = filetype(fs.readFileSync(downloadedFilePath))

  // There are no files at the downloadedFilePath
  if (guessedFiles.length < 1) {
    throw new Error('unable to get files at downloadedFilePath')
  }

  // Get the first file & it's extension
  const file = guessedFiles[0]
  const extension = file.extension

  if (extension && extension != fileExtension) {
    const splitFilePath = downloadedFilePath.split('.')
    const newFilePath = `${splitFilePath[0]}.${extension}`

    await fs.rename(downloadedFilePath, newFilePath, () => {
      console.log('File renamed with extension:', extension)
    })

    // Update the filePath to have the new filePath
    downloadedFilePath = newFilePath
  }

  return downloadedFilePath
}

export async function cleanupDownloadedImages(filePaths: string[]) {
  // Go through each file and delete it
  for (const file of filePaths) {
    fs.unlink(file, (err) => {
      if (err) throw err
      console.log(`Deleted image at`, file)
    })
  }
}
