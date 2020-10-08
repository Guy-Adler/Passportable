const askForFile = async () => {
    x =  await eel.ask_file_save_location()();
    console.log(x);
    return x;
};

const askForFolder = async () => {
    x = await eel.ask_folder()();
    console.log(x);
    return x;
};

const askForFiles = async (p) => {
    x = await eel.get_files(p)();
    console.log(x);
    return x;
};

const save_passport = async (image, xlsx) => {
    x =  await eel.save_passport(image, xlsx)()
    console.log(x);
    return x;
};

const getImagesFolderPath = async (event) => {
    const imagesFolderPath = document.getElementById('ifp');
    const path = await askForFolder();
    if (path !== null) {
        imagesFolderPath.value = path;
    }
    const images = await askForFiles(path);
    window.images = images;
};

const getOutputFilePath = async (event) => {
    const outputFilePath = document.getElementById('ofp');
    const path = await askForFile();
    if (path !== null) {
        outputFilePath.value = path;
    }
};

const getMRZs = async (event) => {
    document.getElementById('output').hidden = false;
    const images = document.getElementById('ifp').value;
    const xlsx = document.getElementById('ofp').value;
    const prog = document.getElementById('prog');
    const output = document.getElementById('output_text');
    prog.max = images.length;
    for (let i = 0; i < images.length; i++) {
        valid = await save_passport(images[i], xlsx);
        prog.value++;
        if (valid['name'] != '') {
            console.log(`Saved ${valid["name"]}\'s passport. (File: ${valid["file"]})`);
        }
        else {
            console.log(`Skipped ${valid["file"]} because no MRZ was found.`);
        }
    }
};