const cloudinary = require("cloudinary").v2

exports.uploadMediaToCloudinary = async (file,folder,height=1000,quality=1000) =>  {
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto"

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}