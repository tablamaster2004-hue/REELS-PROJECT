const ImageKit = require("imagekit")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT

})


async function uploadFile(file, fileName) {
    const result = await imagekit.upload({
        file: file,  //required
        fileName: fileName  //required
    })

    return result   //RETURN THE URL OF THE UPLOADED FILE
}

module.exports = {
    uploadFile
}