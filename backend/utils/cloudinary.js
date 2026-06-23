const cloudinary = require("cloudinary");

const uploadBufferToCloudinary = (file, folder) => {
  const fileString = file.buffer.toString("base64");
  const dataURI = `data:${file.mimetype};base64,${fileString}`;

  return cloudinary.v2.uploader.upload(dataURI, {
    folder,
    resource_type: "auto",
  });
};

const getCloudinaryPublicId = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === "object") {
    return image.public_id || getCloudinaryPublicId(image.url);
  }

  if (!image.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const parts = new URL(image).pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    const publicIdParts = parts.slice(uploadIndex + 1);

    if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts.shift();
    }

    if (!publicIdParts.length) {
      return null;
    }

    const lastPart = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = lastPart.replace(/\.[^/.]+$/, "");

    return decodeURIComponent(publicIdParts.join("/"));
  } catch (error) {
    return null;
  }
};

const deleteCloudinaryImage = async (image) => {
  const publicId = getCloudinaryPublicId(image);

  if (!publicId) {
    return;
  }

  await cloudinary.v2.uploader.destroy(publicId);
};

module.exports = {
  uploadBufferToCloudinary,
  deleteCloudinaryImage,
};
