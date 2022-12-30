import fs from "fs";

const IMAGE_NAME_SEPARATOR = "image:";

/* - - - - - - - - Messages - - - - - - - - */
const NO_RENAMES_FILE = "rename.json file does not exist.";
const NO_IMAGE_DIRECTORY = "The images directory does not exist.";

/* - - - - - - - - Paths - - - - - - - - */
const MASTER_PATH = "screenshot/builds/master.json";
const RENAMES_PATH = "screenshot/builds/renames.json";
const SCREENSHOTS_PATH = "./screenshot/images";
const IMAGE_PATH = imageName => `screenshot/images/${imageName}`;

function renameImagesAfterTests() {
  const imagesToRename = [];

  const data = fs.readFileSync(MASTER_PATH, "utf-8");
  // There are no imaging tests
  if (data.length == 0) {
    return;
  }

  const masterJSON = JSON.parse(data);

  // Store images to rename
  for (const screenshot of masterJSON.screenshots) {
    const imageFileName = screenshot.image;

    // Parse test description
    const splittedDesc = screenshot.desc.split(IMAGE_NAME_SEPARATOR);
    const customName = `${splittedDesc[1]}.png`;

    imagesToRename.push({
      originalName: imageFileName,
      customName: customName
    });
  }

  // There are no images to rename
  if (imagesToRename.length == 0) {
    return;
  }

  const renamesData = JSON.stringify(imagesToRename);

  // Update renames.json file
  fs.writeFile(RENAMES_PATH, renamesData, err => {
    if (err != undefined) {
      throw err;
    }
  });

  /*  Rename all existing images to their custom name. In this case, we do not
      check if the images exist, because we assume that this function is
      executed right after the screenshots have been created 
  */
  imagesToRename.forEach(image => {
    fs.rename(
      IMAGE_PATH(image.originalName), // oldPath
      IMAGE_PATH(image.customName), // newPath
      err => {
        if (err != undefined) {
          throw err;
        }
      }
    );
  });
}

function renameImagesBeforeTests() {
  // No renames.json file
  if (!fs.existsSync(RENAMES_PATH)) {
    console.log(NO_RENAMES_FILE);
    return;
  }

  const data = fs.readFileSync(RENAMES_PATH, "utf-8");
  // There is no renaming of images
  if (data.length == 0) {
    return;
  }

  // No images directory
  if (!fs.existsSync(SCREENSHOTS_PATH)) {
    console.log(NO_IMAGE_DIRECTORY);
    return;
  }

  const imagesNames = fs.readdirSync(SCREENSHOTS_PATH);
  // There are no images to rename
  if (imagesNames.length == 0) {
    return;
  }

  const renamesJSON = JSON.parse(data);

  /*  Dictionary to search in O(1) average time if image exists. We use this
      dictionary to efficiency check if an image exist, before renaming it.
  */
  const imageNamesDictionary = {};
  imagesNames.forEach(name => {
    imageNamesDictionary[name] = "";
  });

  // Rename all existing images to their original name
  renamesJSON.forEach(rename => {
    if (imageNamesDictionary[rename.customName] !== undefined) {
      fs.rename(
        IMAGE_PATH(rename.customName), // oldPath
        IMAGE_PATH(rename.originalName), // newPath
        err => {
          if (err != undefined) {
            throw err;
          }
        }
      );
    }
  });
}

switch (process.argv[2]) {
  case "before":
    renameImagesBeforeTests();
    break;

  case "after":
    renameImagesAfterTests();
    break;
}
