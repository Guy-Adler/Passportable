const askForFile = async () => {
    return await eel.ask_file_save_location()();
};

const askForFolder = async () => {
    return await eel.ask_folder()();
};

const askForFiles = async (p) => {
    return await eel.get_files(p)();
};

const save_passport = async (image, xlsx) => {
    return await eel.save_passport(image, xlsx)()
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
    const images = window.images;
    const xlsx = document.getElementById('ofp').value;
    const prog = document.getElementById('prog');
    const output = document.getElementById('output_text');
    prog.max = images.length;
    for (let i = 0; i < images.length; i++) {
        valid = await save_passport(images[i], xlsx);
        prog.value++;
        if (valid['name'] != '') {
            output.innerHTML += `Saved <b>${valid["name"]}\'s</b> passport. (File: <b>${valid["file"]})</b><br>`;
        } else {
            output.innerHTML += `Skipped <b>${valid["file"]}</b> because no MRZ was found.<br>`;
        }
    }
};